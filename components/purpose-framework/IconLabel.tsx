import { cn } from "@/lib/utils";
import { FaIcon } from "@/components/ui/fa-icon";

interface IconLabelProps {
  icon: string;
  label: string;
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  labelSize?: "sm" | "md" | "lg";
}

/**
 * Standardized icon-label component with icon above and label below.
 * Uses responsive clamping to ensure proper spacing and prevent edge cases.
 */
export function IconLabel({ 
  icon, 
  label, 
  className,
  iconSize = "md",
  labelSize = "md"
}: IconLabelProps) {
  const iconSizeClasses = {
    sm: "size-[28px] text-[24px]",
    md: "size-[32px] sm:size-[36px] md:size-[38px] lg:size-[40px] text-[26px] sm:text-[28px] md:text-[30px] lg:text-[31px] xl:text-[32px]",
    lg: "size-[40px] text-[32px]",
  };

  const labelSizeClasses = {
    sm: "text-xs sm:text-sm leading-[18px] sm:leading-[20px]",
    md: "text-xs sm:text-sm md:text-[15px] lg:text-base leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px]",
    lg: "text-base leading-[24px]",
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center overflow-clip min-w-0",
        "px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[20px] 2xl:px-[29px]",
        "py-2 sm:py-3 md:py-4 lg:py-5 xl:py-[20px] 2xl:py-[24px]",
        className
      )}
    >
      <div 
        className={cn(
          "flex flex-col items-center w-full min-w-0",
          "max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[233px]"
        )}
        style={{ 
          width: "clamp(60px, 12vw, 233px)",
          minWidth: 0
        }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className={cn(
            "flex items-center justify-center shrink-0",
            iconSizeClasses[iconSize]
          )}>
            <FaIcon 
              icon={icon.replace(/^fa-/, "")} 
              style="light" 
              className="text-muted-foreground" 
            />
          </div>
        </div>
        
        {/* Label with max 16px gap from icon */}
        <div 
          className="flex flex-col items-center w-full"
          style={{ marginTop: "clamp(8px, 1vw, 16px)" }}
        >
          <p className={cn(
            "font-normal text-muted-foreground text-center w-full",
            labelSizeClasses[labelSize]
          )}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

