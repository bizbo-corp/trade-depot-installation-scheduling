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

// Helper function to extract text from children
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  } else if (Array.isArray(children)) {
    return children
      .map((child) => (typeof child === "string" ? child : String(child)))
      .join("")
      .trim();
  }
  return String(children || "").trim();
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
    "prose-lg",
    "max-w-none",
    "dark:prose-invert",
    "prose-headings:font-bold",
    "prose-headings:text-foreground",
    "prose-p:text-foreground",
    "prose-p:mb-4",
    "prose-p:mt-0",
    "prose-strong:text-foreground",
    "prose-strong:font-bold",
    "prose-ul:text-foreground",
    "prose-ul:my-4",
    "prose-ol:text-foreground",
    "prose-ol:my-4",
    "prose-li:text-foreground",
    "prose-li:my-2",
    "prose-a:text-primary",
    "prose-a:no-underline",
    "hover:prose-a:underline",
    "prose-h1:text-4xl",
    "prose-h1:font-bold",
    "prose-h1:mt-8",
    "prose-h1:mb-4",
    "prose-h2:text-3xl",
    "prose-h2:font-bold",
    "prose-h2:mt-8",
    "prose-h2:mb-4",
    "prose-h3:text-2xl",
    "prose-h3:font-bold",
    "prose-h3:mt-6",
    "prose-h3:mb-3",
    "prose-h4:text-xl",
    "prose-h4:font-bold",
    "prose-h4:mt-4",
    "prose-h4:mb-2",
    "prose-blockquote:border-l-4",
    "prose-blockquote:border-primary",
    "prose-blockquote:pl-4",
    "prose-blockquote:italic",
    "prose-blockquote:my-4",
    "prose-hr:my-8",
    "prose-hr:border-border",
    "prose-table:w-full",
    "prose-table:my-8",
    "prose-th:border",
    "prose-th:border-border",
    "prose-th:bg-muted",
    "prose-th:px-4",
    "prose-th:py-3",
    "prose-th:text-left",
    "prose-th:font-semibold",
    "prose-td:border",
    "prose-td:border-border",
    "prose-td:px-4",
    "prose-td:py-3"
  );

  return (
    <div className="flex bg-background flex-col min-h-screen">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-16">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>UX Analysis Report</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">URL Analyzed: {url}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {screenshot && (
                  <div className="w-full rounded-lg overflow-hidden border sticky top-6 h-fit">
                    <img
                      src={screenshot}
                      alt="Website screenshot"
                      className="w-full h-auto"
                    />
                  </div>
                )}
                <div className="space-y-6">
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

