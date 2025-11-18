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
      return <strong {...props}>{children}</strong>;
    },
    // Replace ✓ and ✗ with Lucide icons and hide bullets
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
                <span className="inline-flex items-center justify-center rounded bg-olive-100 p-1">
                  <FaIcon style="duotone" weight="thin" icon="check" className="inline-block w-5 h-5 text-olive-700 shrink-0" />
                </span>
              </>
            )}
            {hasCross && (
              <>
                <span className="inline-flex items-center justify-center rounded bg-olive-100 p-1">
                  <FaIcon style="light" icon="times" className="inline-block w-5 h-5 text-olive-700 shrink-0" />
                </span>
              </>
            )}
            <span>{processedChildren}</span>
          </li>
        );
      }
      
      return <li {...props} className={className}>{children}</li>;
    },
    // Remove list styling for ul elements containing Key Takeaways items
    ul: ({ children, className, ...props }) => {
      // Check if any child contains ✓ or ✗
      const childrenArray = Array.isArray(children) ? children : [children];
      const hasKeyTakeaways = childrenArray.some((child) => {
        const text = extractText(child);
        return text.includes("✓") || text.includes("✗");
      });
      
      if (hasKeyTakeaways) {
        return (
          <ul {...props} className={cn("list-none pl-0 space-y-2", className)}>
            {children}
          </ul>
        );
      }
      
      return <ul {...props} className={className}>{children}</ul>;
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
      return h4Render || <h3 {...props}>{children}</h3>;
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
    "prose-lg"
  );

  return (
    <div className="flex bg-background flex-col min-h-screen">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-16">
        <Card className="mt-4 bg-background border-0 p-0 m-0">
          <CardHeader>
            <CardTitle>UX Analysis Report: {url}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 bg-background">


              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6 md:col-span-2">
              {/* Key Takeaways - displayed first in a card */}
              {keyTakeaways && (
                <Card className="w-full">
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


                  {/* Quick Wins - each wrapped in a Card with sentiment-based background */}
                  {quickWins.length > 0 ? (
                    quickWins.map((quickWin, index) => {
                      const bgColorClass = 
                        quickWin.sentiment === "Bad" ? "bg-red-200" :
                        quickWin.sentiment === "Good" ? "bg-green-200" :
                        quickWin.sentiment === "Neutral" ? "bg-gray-200" :
                        "";
                      
                      return (
                        <Card key={index} className={cn("w-full", bgColorClass)}>
                          <CardContent className="pt-6">
                            <div className={proseClasses}>
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                              >
                                {quickWin.content}
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
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

