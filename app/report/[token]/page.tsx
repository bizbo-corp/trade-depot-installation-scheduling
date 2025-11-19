import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { updateVerificationStatus } from "@/lib/hubspot";
import { X, Check, Circle } from "lucide-react";
import type { Components } from "react-markdown";
import { FaIcon } from "@/components/ui/fa-icon";

interface ReportPageProps {
  params: Promise<{ token: string }>;
}

// Helper function to extract sentiment from Quick Win text
function extractSentiment(text: string): "Bad" | "Good" | "Neutral" | null {
  const sentimentMatch = text.match(/Sentiment:\s*(Bad|Good|Neutral)/i);
  return sentimentMatch ? (sentimentMatch[1] as "Bad" | "Good" | "Neutral") : null;
}

// Helper function to remove sentiment text from markdown
function removeSentimentText(text: string): string {
  // Remove lines containing "Sentiment: Bad/Good/Neutral" (case insensitive)
  // Handle both bold (**Sentiment: X**) and plain text (Sentiment: X) formats
  return text
    .replace(/^\s*\*\*Sentiment:\s*(Bad|Good|Neutral)\*\*\s*$/gim, "")
    .replace(/^\s*Sentiment:\s*(Bad|Good|Neutral)\s*$/gim, "")
    .replace(/\*\*\[Sentiment:\s*(Bad|Good|Neutral)\s*\/\s*(Bad|Good|Neutral)\s*\/\s*(Bad|Good|Neutral)\]\*\*/gim, "")
    .replace(/\n\n\n+/g, "\n\n"); // Clean up multiple blank lines
}

// Helper function to split markdown into Quick Win sections
function splitQuickWins(markdown: string): { quickWins: Array<{ content: string; sentiment: "Bad" | "Good" | "Neutral" | null }>; keyTakeaways: string } {
  // Split by Key Takeaways section
  const parts = markdown.split("## Key Takeaways");
  const quickWinsSection = parts[0] || "";
  const keyTakeaways = parts.length > 1 ? "## Key Takeaways" + parts[1] : "";

  // Remove "## Quick Wins" heading if present
  let content = quickWinsSection.replace(/^## Quick Wins\s*/m, "").trim();

  // Split by horizontal rules (---) that appear on their own line
  const sections = content.split(/^---\s*$/m).filter((section) => section.trim());

  // If we only have one section or no horizontal rules, try splitting by numbered headings
  if (sections.length <= 1) {
    const headingRegex = /^### \d+\./gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    if (matches.length > 1) {
      const parts: string[] = [];
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index!;
        const end = i < matches.length - 1 ? matches[i + 1].index! : content.length;
        const section = content.substring(start, end).trim();
        if (section) {
          parts.push(section);
        }
      }
      return { 
        quickWins: parts.map(p => ({ 
          content: removeSentimentText(p), 
          sentiment: extractSentiment(p) 
        })), 
        keyTakeaways 
      };
    }
  }

  // Filter out empty sections and return
  return { 
    quickWins: sections
      .filter((s) => s.trim() && !s.match(/^## Quick Wins\s*$/m))
      .map(s => ({ 
        content: removeSentimentText(s), 
        sentiment: extractSentiment(s) 
      })), 
    keyTakeaways 
  };
}

// Helper function to reorder markdown content so "Quick Win Opportunity:" description appears after heading and before Impact/Effort
function reorderQuickWinContent(markdown: string): string {
  // Process each quick win section (starts with ### heading)
  return markdown.replace(/(### \d+\.[^\n]*\n)([\s\S]*?)(?=### \d+\.|## |$)/g, (match, heading, content) => {
    // Find Impact/Effort list items
    const impactEffortRegex = /((?:^[-*]\s*\*\*?(?:Impact|Effort|Difficulty):[^\n]*\n)+)/gm;
    const impactEffortMatch = content.match(impactEffortRegex);
    
    // Find Quick Win Opportunity paragraph (may span multiple lines)
    const quickWinRegex = /((?:^\*\*)?Quick Win Opportunity:\s*\*\*?\s*[^\n]+(?:\n(?![-*]|###|##)[^\n]+)*)/im;
    const quickWinMatch = content.match(quickWinRegex);
    
    if (impactEffortMatch && quickWinMatch) {
      const impactEffortText = impactEffortMatch[0];
      const quickWinText = quickWinMatch[0];
      
      // Check if Quick Win comes after Impact/Effort (needs reordering)
      const impactEffortIndex = content.indexOf(impactEffortText);
      const quickWinIndex = content.indexOf(quickWinText);
      
      if (quickWinIndex > impactEffortIndex) {
        // Remove both from content
        let reordered = content;
        reordered = reordered.replace(impactEffortText, '');
        reordered = reordered.replace(quickWinText, '');
        
        // Insert in correct order: quick win first, then impact/effort
        // Find where to insert (right after heading, before any other content)
        const insertPosition = reordered.search(/\S/); // First non-whitespace
        if (insertPosition >= 0) {
          return heading + quickWinText + '\n' + impactEffortText + reordered.substring(insertPosition);
        } else {
          return heading + quickWinText + '\n' + impactEffortText + reordered;
        }
      }
    }
    
    // No reordering needed
    return match;
  });
}

// Helper function to extract text from children (recursive)
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  } else if (Array.isArray(children)) {
    return children
      .map((child) => extractText(child))
      .join("")
      .trim();
  } else if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return String(children || "").trim();
}

// Helper function to recursively remove symbols from React children
function removeSymbolsFromChildren(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") {
    return children.replace(/✓/g, "").replace(/✗/g, "");
  } else if (Array.isArray(children)) {
    return children.map((child) => removeSymbolsFromChildren(child));
  } else if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode; [key: string]: unknown };
    return React.cloneElement(children, {
      ...props,
      children: removeSymbolsFromChildren(props.children),
    } as any);
  }
  return children;
}

// Helper function to render heading as h4 if it's "Analysis" or "Suggestion"
function renderHeadingAsH4IfNeeded(
  children: React.ReactNode,
  props: React.HTMLAttributes<HTMLHeadingElement>
) {
  const text = extractText(children);
  if (text === "Analysis" || text === "Suggestion") {
    return (
      <h4 {...props} className="text-xl font-bold mt-4 mb-2">
        {children}
      </h4>
    );
  }
  return null;
}

// Custom ReactMarkdown components
function createMarkdownComponents(): Components {
  return {
    // Replace sentiment text with icons (handle bold text)
    strong: ({ children, ...props }) => {
      const text = extractText(children);
      
      // Check for sentiment pattern
      const sentimentMatch = text.match(/\[Sentiment:\s*(Good|Bad|Neutral)\]/);
      if (sentimentMatch) {
        const sentiment = sentimentMatch[1];
        let icon;
        let colorClass;
        if (sentiment === "Bad") {
          icon = <X className="inline-block w-5 h-5" />;
          colorClass = "text-red-500";
        } else if (sentiment === "Good") {
          icon = <Check className="inline-block w-5 h-5" />;
          colorClass = "text-green-500";
        } else {
          icon = <Circle className="inline-block w-5 h-5" />;
          colorClass = "text-yellow-500";
        }
        return (
          <span {...props} className={cn("inline-flex items-center gap-2", colorClass)}>
            {icon}
          </span>
        );
      }
      
      // Don't render category labels here - they will be handled in the ul/li components
      // Check for category labels: "Area of concern 🚩" or "Optimisation Opportunity ✅"
      const areaOfConcernMatch = text.match(/^Area of concern\s*🚩?$/);
      if (areaOfConcernMatch) {
        return null; // Hide from strong component - will be rendered in ul section
      }
      
      const optimisationMatch = text.match(/^Optimisation Opportunity\s*✅?$/);
      if (optimisationMatch) {
        return null; // Hide from strong component - will be rendered in ul section
      }
      
      // Check for Effort/Difficulty levels: "Effort: High/Moderate/Low" or "Difficulty: High/Moderate/Low"
      const effortMatch = text.match(/^(Effort|Difficulty):\s*(High|Moderate|Low|Quick|Complex|Slow)\s*[🚩⚠️⬇⚡️🪲🏋️‍♂️]?/i);
      if (effortMatch) {
        return (
          <span {...props} className="inline-flex items-center gap-2">
            <FaIcon icon="bolt-lightning" className="w-4 h-4" />
            <span>{effortMatch[1]}: {effortMatch[2]}</span>
          </span>
        );
      }
      
      // Check for Impact levels: "Impact: High/Moderate/Medium/Low"
      const impactMatch = text.match(/^Impact:\s*(High|Moderate|Medium|Low)\s*[‼️⚠️⬇]?/i);
      if (impactMatch) {
        return (
          <span {...props} className="inline-flex items-center gap-2">
            <FaIcon icon="star" className="w-4 h-4" />
            <span>Impact: {impactMatch[1]}</span>
          </span>
        );
      }
      
      // Hide "Action Needed: Yes" when it appears in bold
      const actionNeededMatch = text.match(/^Action Needed:\s*Yes\.?/i);
      if (actionNeededMatch) {
        return null; // Hide this element
      }
      
      // Hide "Quick Win Opportunity:" when it appears in bold (the description will be in the paragraph)
      const quickWinLabelMatch = text.match(/^Quick Win Opportunity:\s*$/i);
      if (quickWinLabelMatch) {
        return null; // Hide the label - description will be rendered in paragraph
      }
      
      return <strong {...props}>{children}</strong>;
    },
    // Replace ✓ and ✗ with Lucide icons and hide bullets
    // Also handle Impact/Effort/Difficulty patterns that might appear in list items
    li: ({ children, className, ...props }) => {
      const text = extractText(children);
      
      // Check if this is a Key Takeaways list item (contains ✓ or ✗)
      if (text.includes("✓") || text.includes("✗")) {
        // Remove symbols from children
        const processedChildren = removeSymbolsFromChildren(children);
        
        // Determine which icon to use
        const hasCheck = text.includes("✓");
        const hasCross = text.includes("✗");
        
        return (
          <li {...props} className={cn("list-none flex items-start gap-2", className)}>
            {hasCheck && (
              <>
                <div className="inline-flex items-center justify-center rounded bg-olive-100 p-1">
                  <FaIcon icon="check" className="w-6 h-6 text-olive-700 shrink-0" />
                </div>
              </>
            )}
            {hasCross && (
              <>
                <div className="inline-flex items-center justify-center rounded bg-olive-100 p-1">
                  <FaIcon icon="times" className="w-6 h-6 text-olive-700 shrink-0" />
                </div>
              </>
            )}
            <span>{processedChildren}</span>
          </li>
        );
      }
      
      // Check for category labels in list items: "Area of concern 🚩" or "Optimisation Opportunity ✅"
      const areaOfConcernMatch = text.match(/^Area of concern\s*🚩?$/);
      if (areaOfConcernMatch) {
        return (
          <li {...props} className={cn("flex items-center gap-2", className)}>
            <FaIcon icon="flag" className="w-4 h-4" />
            <span>Area of concern</span>
          </li>
        );
      }
      
      const optimisationMatch = text.match(/^Optimisation Opportunity\s*✅?$/);
      if (optimisationMatch) {
        return (
          <li {...props} className={cn("flex items-center gap-2", className)}>
            <FaIcon icon="flag" className="w-4 h-4" />
            <span>Optimisation Opportunity</span>
          </li>
        );
      }
      
      // Check for Impact/Effort/Difficulty patterns in list items
      // These might appear as "* **Impact:** High ‼️" where ReactMarkdown parses it
      // The text will be "Impact: High ‼️" (markdown already parsed)
      const impactListMatch = text.match(/^Impact:\s*(High|Moderate|Medium|Low)\s*[‼️⚠️⬇]?/i);
      if (impactListMatch) {
        return (
          <li {...props} className={cn("flex items-center gap-2", className)}>
            <FaIcon icon="star" className="w-4 h-4" />
            <span>
              <strong>Impact:</strong> {impactListMatch[1]}
            </span>
          </li>
        );
      }
      
      const effortListMatch = text.match(/^(Effort|Difficulty):\s*(High|Moderate|Low|Quick|Complex|Slow)\s*[🚩⚠️⬇⚡️🪲🏋️‍♂️]?/i);
      if (effortListMatch) {
        return (
          <li {...props} className={cn("flex items-center gap-2", className)}>
            <FaIcon icon="bolt-lightning" className="w-4 h-4" />
            <span>
              <strong>{effortListMatch[1]}:</strong> {effortListMatch[2]}
            </span>
          </li>
        );
      }
      
      // Hide "Action Needed: Yes" lines
      const actionNeededMatch = text.match(/^Action Needed:\s*Yes\.?/i);
      if (actionNeededMatch) {
        return null; // Hide this list item
      }
      
      return <li {...props} className={className}>{children}</li>;
    },
    // Hide paragraphs that contain only category labels (they'll be rendered in the ul section)
    // Also handle "Quick Win Opportunity:" by hiding the label and showing only the description
    p: ({ children, className, ...props }) => {
      const text = extractText(children);
      // Check if paragraph contains only a category label (without Impact/Effort/Difficulty)
      const areaOfConcernMatch = text.match(/^Area of concern\s*🚩?$/);
      const optimisationMatch = text.match(/^Optimisation Opportunity\s*✅?$/);
      if (areaOfConcernMatch || optimisationMatch) {
        return null; // Hide paragraph - will be rendered in ul section
      }
      
      // Check for "Quick Win Opportunity:" and extract just the description
      const quickWinMatch = text.match(/^Quick Win Opportunity:\s*(.+)$/i);
      if (quickWinMatch) {
        // Return only the description text (without the label)
        return <p {...props} className={className}>{quickWinMatch[1]}</p>;
      }
      
      return <p {...props} className={className}>{children}</p>;
    },
    // Remove list styling for ul elements containing Key Takeaways items
    // Also group category label with Impact and Difficulty in a single block
    ul: ({ children, className, ...props }) => {
      const childrenArray = Array.isArray(children) ? children : [children];
      
      // Check if any child contains ✓ or ✗ (Key Takeaways)
      const hasKeyTakeaways = childrenArray.some((child) => {
        const text = extractText(child);
        return text.includes("✓") || text.includes("✗");
      });
      
      if (hasKeyTakeaways) {
        return (
          <ul {...props} className={cn("list-none pl-0 space-y-2 p-4 rounded-lg", className)}>
            {children}
          </ul>
        );
      }
      
      // Check if this ul contains category label, impact, and difficulty
      // Extract information from children and group them together
      let categoryLabel: string | null = null;
      let categoryIcon: string | null = null;
      let impactText: string | null = null;
      let impactIcon: string | null = null;
      let difficultyText: string | null = null;
      let difficultyIcon: string | null = null;
      const otherItems: React.ReactNode[] = [];
      let hasCategory = false;
      let categoryItem: React.ReactNode = null;
      let impactItem: React.ReactNode = null;
      let difficultyItem: React.ReactNode = null;
      
      childrenArray.forEach((child) => {
        const text = extractText(child);
        
        // Check for category label in list items (might be in strong tag or as plain text)
        if ((text.includes("Area of concern") || text.match(/^Area of concern/i)) && !text.includes("Impact") && !text.includes("Difficulty") && !text.includes("Effort")) {
          categoryLabel = "Area of concern";
          categoryIcon = "flag";
          hasCategory = true;
          categoryItem = child;
        } else if ((text.includes("Optimisation Opportunity") || text.match(/^Optimisation Opportunity/i)) && !text.includes("Impact") && !text.includes("Difficulty") && !text.includes("Effort")) {
          categoryLabel = "Optimisation Opportunity";
          categoryIcon = "flag";
          hasCategory = true;
          categoryItem = child;
        }
        // Check for Impact (might be rendered as "Impact: High" with icon already)
        else if (text.includes("Impact:") || text.match(/Impact:\s*(High|Moderate|Medium|Low)/i)) {
          const impactMatch = text.match(/Impact:\s*(High|Moderate|Medium|Low)/i);
          if (impactMatch) {
            impactText = impactMatch[1];
            impactItem = child;
            impactIcon = "star";
          }
        }
        // Check for Difficulty/Effort
        else if (text.includes("Difficulty:") || text.includes("Effort:") || text.match(/(Difficulty|Effort):\s*(High|Moderate|Low|Quick|Complex|Slow)/i)) {
          const effortMatch = text.match(/(Difficulty|Effort):\s*(High|Moderate|Low|Quick|Complex|Slow)/i);
          if (effortMatch) {
            difficultyText = effortMatch[2];
            difficultyItem = child;
            difficultyIcon = "bolt-lightning";
          }
        }
        // Skip Action Needed: Yes items
        else if (!text.match(/Action Needed:\s*Yes/i)) {
          otherItems.push(child);
        }
      });
      
      // If we found category with impact or difficulty, render them as a grouped block inside ul
      if (hasCategory && (impactText || difficultyText)) {
        return (
          <ul {...props} className={cn("list-none pl-0 space-y-2 bg-amber-500/20 p-4 rounded-lg", className)}>
            {/* Category label - now rendered inside the ul section with Impact and Effort */}
            <li className="flex items-center gap-2">
              {categoryIcon && <FaIcon icon={categoryIcon} className="w-4 h-4" />}
              <span className="font-semibold">{categoryLabel}</span>
            </li>
            
            {/* Impact and Effort in the same block */}
            {impactText && impactIcon && (
              <li className="flex items-center gap-2">
                <FaIcon icon={impactIcon} className="w-4 h-4" />
                <span>
                  <strong>Impact:</strong> {impactText}
                </span>
              </li>
            )}
            {difficultyText && difficultyIcon && (
              <li className="flex items-center gap-2">
                <FaIcon icon={difficultyIcon} className="w-4 h-4" />
                <span>
                  <strong>Effort:</strong> {difficultyText}
                </span>
              </li>
            )}
            
            {/* Render other items normally */}
            {otherItems.length > 0 && otherItems}
          </ul>
        );
      }
      
      // If we found a category label but no Impact/Effort, render it inside the ul
      if (hasCategory && categoryLabel && categoryIcon) {
        return (
          <ul {...props} className={cn("list-none pl-0 space-y-2 bg-amber-500/20 p-4 rounded-lg", className)}>
            {/* Category label with flag icon */}
            <li className="flex items-center gap-2">
              <FaIcon icon={categoryIcon} className="w-4 h-4" />
              <span className="font-semibold">{categoryLabel}</span>
            </li>
            {/* Render other items */}
            {otherItems.length > 0 && otherItems}
            {/* Render remaining children that weren't processed as otherItems */}
            {childrenArray.filter((child) => {
              const text = extractText(child);
              return !text.match(/^(Area of concern|Optimisation Opportunity)/i) && 
                     !text.match(/Action Needed:\s*Yes/i);
            })}
          </ul>
        );
      }
      
      return <ul {...props} className={cn("list-none pl-0 gap-12 inline-flex flex-row justify-evenly bg-foreground/10 px-6 rounded-3xl", className)}>{children}</ul>;
    },
    // Make "Analysis" and "Suggestion" headings render as h4
    h1: ({ children, ...props }) => {
      const h4Render = renderHeadingAsH4IfNeeded(children, props);
      return h4Render || <h1 {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }) => {
      const h4Render = renderHeadingAsH4IfNeeded(children, props);
      return h4Render || <h2 {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => {
      const h4Render = renderHeadingAsH4IfNeeded(children, props);
      if (h4Render) return h4Render;
      
      // Check if this is a numbered Quick Win heading (e.g., "1. Structure and Information Hierarchy")
      const text = extractText(children);
      const quickWinMatch = text.match(/^(\d+)\.\s*(.+)$/);
      
      if (quickWinMatch) {
        const number = quickWinMatch[1];
        const title = quickWinMatch[2];
        
        return (
          <h3 {...props} className={cn("flex items-center gap-3", props.className)}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground text-background font-bold text-lg shrink-0 ">
              {number}
            </div>
            <span>{title}</span>
          </h3>
        );
      }
      
      return <h3 {...props}>{children}</h3>;
    },
    h4: ({ children, ...props }) => {
      return <h4 {...props}>{children}</h4>;
    },
    h5: ({ children, ...props }) => {
      const h4Render = renderHeadingAsH4IfNeeded(children, props);
      return h4Render || <h5 {...props}>{children}</h5>;
    },
    h6: ({ children, ...props }) => {
      const h4Render = renderHeadingAsH4IfNeeded(children, props);
      return h4Render || <h6 {...props}>{children}</h6>;
    },
  };
}

async function getReportData(token: string): Promise<{
  success: true;
  data: {
    report: string;
    screenshot: string;
    url: string;
  };
} | {
  success: false;
  error: string;
  details?: string;
}> {
  try {
    // Find report by token
    const report = await prisma.uXAnalysisReport.findUnique({
      where: { verificationToken: token },
    });

    if (!report) {
      return {
        success: false,
        error: "Invalid token",
        details: "The verification token is invalid or has expired",
      };
    }

    // Check if token has expired
    if (new Date() > report.tokenExpiresAt) {
      return {
        success: false,
        error: "Token expired",
        details: "The verification link has expired. Please request a new analysis.",
      };
    }

    // Update verified status if not already verified
    if (!report.emailVerified) {
      await prisma.uXAnalysisReport.update({
        where: { id: report.id },
        data: { emailVerified: true },
      });

      // Update HubSpot if contact ID exists (non-blocking)
      if (report.hubspotContactId) {
        try {
          await updateVerificationStatus({
            contactId: report.hubspotContactId,
            verified: true,
          });
        } catch (hubspotError) {
          // Log but don't fail - verification already succeeded in database
          console.error("HubSpot verification status update error (non-blocking):", hubspotError);
        }
      }
    }

    return {
      success: true,
      data: {
        report: report.report,
        screenshot: report.screenshot,
        url: report.url,
      },
    };
  } catch (error) {
    console.error("Failed to load report:", error);
    return {
      success: false,
      error: "Failed to load report",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { token } = await params;
  const result = await getReportData(token);

  if (!result.success) {
    return (
      <div className="flex bg-background flex-col min-h-screen">
        <Header />
        <div className="flex-1 container mx-auto px-4 md:px-6 py-16">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive mb-2">{result.error}</p>
              {result.details && (
                <p className="text-sm text-muted-foreground">{result.details}</p>
              )}
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const { report, screenshot, url } = result.data;
  const { quickWins, keyTakeaways } = splitQuickWins(report);
  const markdownComponents = createMarkdownComponents();

  const proseClasses = cn(
    "prose",
    "prose-dark",
    "prose-lg"
  );

  return (
    <div className="flex bg-background flex-col min-h-screen">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-24 space-y-6">

            <CardTitle className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">UX Analysis Report:</h1> 
            <span className="inline-block rounded-full bg-olive-700/90 hover:bg-olive-500/100 transition-all px-3 py-1 text-xs font-semibold text-background">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                {new URL(url).hostname}
              </a>
            </span>

            </CardTitle>

            
            <div className="space-y-6 bg-background">


              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6 md:col-span-2">
              {/* Key Takeaways - displayed first in a card */}
              {keyTakeaways && (
                <Card className="w-full bg-background-2 border-0">
                  <CardHeader>
                    <CardTitle>Key Takeaways</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={proseClasses}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {keyTakeaways.replace(/^## Key Takeaways\s*/m, "").trim()}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}


                <div className="space-y-6 shadow-none p-0">

                    <h2 className="text-2xl font-bold">Quick Wins</h2>

                  {/* Quick Wins - each wrapped in a Card with sentiment-based background */}
                  {quickWins.length > 0 ? (
                    quickWins.map((quickWin, index) => {
                      // Reorder content so Quick Win Opportunity description appears after heading and before Impact/Effort
                      const reorderedContent = reorderQuickWinContent(quickWin.content);
                      
                      return (
                        <Card key={index} className={cn("w-full bg-foreground/10 p-6 shadow-none border-0")}>
                          <CardContent className="p-0">
                            <div  className={cn(proseClasses,"w-full bg-foreground/0 p-6 shadow-none border-0 mx-auto")}>

                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                              >
                                {reorderedContent}
                              </ReactMarkdown>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    // Fallback: if no Quick Wins sections found, render the full report
                    <div className={proseClasses}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {report}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                </div>

                {screenshot && (
                  <div className="w-full md:col-span-1 rounded-lg overflow-hidden sticky top-6 h-fit shadow-2xl">
                    <img
                      src={screenshot}
                      alt="Website screenshot"
                      className="w-full h-auto object-cover object-top"
                    />
                  </div>
                )}
              </div>
            </div>

      </div>

      <Footer />
    </div>
  );
}

