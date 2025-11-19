import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { updateVerificationStatus } from "@/lib/hubspot";
import type { ImageCoordinates } from "@/types/ux-analysis";
import { QuickWinCard } from "@/components/ux-analysis/QuickWinCard";
import { createMarkdownComponents } from "@/lib/markdown-components";

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

// Helper function to extract image coordinates from markdown
function extractImageCoordinates(markdown: string): ImageCoordinates | null {
  // Look for JSON code blocks containing coordinate data
  // More flexible regex to handle various JSON formatting
  const jsonCodeBlockRegex = /```json\s*([\s\S]*?)\s*```/gi;
  const matches = Array.from(markdown.matchAll(jsonCodeBlockRegex));
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  // Try to find a JSON block that looks like coordinates
  for (const match of matches) {
    try {
      const jsonContent = match[1].trim();
      const coordinates = JSON.parse(jsonContent) as Partial<ImageCoordinates>;
      
      // Check relevant flag first - if false, return null (no image should be shown)
      if (coordinates.relevant === false) {
        return null;
      }
      
      // Validate required fields and ensure they are positive numbers
      if (
        typeof coordinates.x === 'number' &&
        typeof coordinates.y === 'number' &&
        typeof coordinates.width === 'number' &&
        typeof coordinates.height === 'number' &&
        coordinates.x >= 0 &&
        coordinates.y >= 0 &&
        coordinates.width > 0 &&
        coordinates.height > 0
      ) {
        // Validate zoom if present
        if (coordinates.zoom !== undefined) {
          if (typeof coordinates.zoom !== 'number' || coordinates.zoom <= 0) {
            // Invalid zoom, remove it (will use default in crop function)
            delete coordinates.zoom;
          }
        }
        
        // Default relevant to true if not specified
        const result: ImageCoordinates = {
          x: coordinates.x,
          y: coordinates.y,
          width: coordinates.width,
          height: coordinates.height,
          zoom: coordinates.zoom,
          relevant: coordinates.relevant !== undefined ? coordinates.relevant : true,
        };
        
        return result;
      }
    } catch (error) {
      // Continue to next match if this one fails
      continue;
    }
  }
  
  return null;
}

// Helper function to remove image coordinates JSON code block from markdown
function removeImageCoordinates(markdown: string): string {
  // Remove JSON code blocks that contain coordinate-like data
  // Match any JSON code block and check if it looks like coordinates
  const jsonCodeBlockRegex = /```json\s*([\s\S]*?)\s*```/gi;
  let cleaned = markdown;
  const matches = Array.from(markdown.matchAll(jsonCodeBlockRegex));
  
  for (const match of matches) {
    try {
      const jsonContent = match[1].trim();
      const parsed = JSON.parse(jsonContent);
      // Check if this looks like coordinates (has x, y, width, height)
      if (
        typeof parsed.x === 'number' &&
        typeof parsed.y === 'number' &&
        typeof parsed.width === 'number' &&
        typeof parsed.height === 'number'
      ) {
        // Remove this JSON code block
        cleaned = cleaned.replace(match[0], '');
      }
    } catch {
      // Not valid JSON or not coordinates, keep it
      continue;
    }
  }
  
  // Clean up multiple blank lines
  return cleaned.replace(/\n\n\n+/g, "\n\n");
}

// Helper function to split markdown into Quick Win sections
function splitQuickWins(markdown: string): { quickWins: Array<{ content: string; sentiment: "Bad" | "Good" | "Neutral" | null; coordinates: ImageCoordinates | null }>; keyTakeaways: string } {
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
        quickWins: parts.map(p => {
          const coordinates = extractImageCoordinates(p);
          return { 
            content: removeSentimentText(removeImageCoordinates(p)), 
            sentiment: extractSentiment(p),
            coordinates
          };
        }), 
        keyTakeaways 
      };
    }
  }

  // Filter out empty sections and return
  return { 
    quickWins: sections
      .filter((s) => s.trim() && !s.match(/^## Quick Wins\s*$/m))
      .map(s => {
        const coordinates = extractImageCoordinates(s);
        return { 
          content: removeSentimentText(removeImageCoordinates(s)), 
          sentiment: extractSentiment(s),
          coordinates
        };
      }), 
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
    "dark:prose-invert",
    "prose-lg",
    "prose-foreground"
  );

  return (
    <div className="flex bg-background flex-col min-h-screen">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-24 space-y-6">

            <CardTitle className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">UX Analysis Report:</h1> 
            <span className="inline-block rounded-full bg-foreground hover:bg-foreground/80 transition-all px-3 py-1 text-xs font-semibold text-background">
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
                <Card className="w-full bg-foreground/20 shadow-none border-0">
                  <CardHeader>
                  <div  className={cn(proseClasses,"w-full bg-foreground/0 py-0 shadow-none border-0 mx-auto text-foreground")}>
                    <CardTitle>Key takeaways</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                  <div  className={cn(proseClasses,"w-full bg-foreground/0 py-0 shadow-none border-0 mx-auto text-foreground")}>
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
                        <QuickWinCard
                          key={index}
                          content={reorderedContent}
                          coordinates={quickWin.coordinates}
                          screenshot={screenshot}
                          proseClasses={proseClasses}
                          index={index}
                        />
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

