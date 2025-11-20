import React from "react";
import { X, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaIcon } from "@/components/ui/fa-icon";
import type { Components } from "react-markdown";

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
export function createMarkdownComponents(): Components {
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
            <FaIcon icon="star" style="solid" className="w-4 h-4 text-yellow-500" />
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
                <div className="inline-flex items-center justify-center rounded bg-foreground/10 p-1">
                  <FaIcon icon="check" className="w-6 h-6 text-foreground shrink-0" />
                </div>
              </>
            )}
            {hasCross && (
              <>
                <div className="inline-flex items-center justify-center rounded bg-foreground/50 p-1">
                  <FaIcon icon="times" className="w-6 h-6 text-background shrink-0" />
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
            <FaIcon icon="star" style="solid" className="w-4 h-4 text-olive-700 dark:text-olive-300" />
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
            <FaIcon icon="bolt-lightning" style="solid" className="w-4 h-4 text-olive-700 dark:text-olive-300" />
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
      
      return <ul {...props} className={cn("list-none pl-0 gap-12 inline-flex flex-row justify-evenly bg-foreground/10 px-6 rounded-lg", className)}>{children}</ul>;
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

