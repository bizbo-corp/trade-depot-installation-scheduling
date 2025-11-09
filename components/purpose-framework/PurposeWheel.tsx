"use client";

import { cn } from "@/lib/utils";

interface PurposeWheelProps {
  className?: string;
}

export function PurposeWheel({ className }: PurposeWheelProps) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[768px]", className)}>
      <svg
        width="838"
        height="838"
        viewBox="0 0 838 838"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Top left segment - uses --background-2 */}
        <path
          d="M475.134 132L419 264C333.752 264 264.388 333.187 264.315 418.866L132.315 363L0.31543 418.866C0.387674 187.657 187.675 -2.01748e-05 419 0L475.134 132Z"
          fill="var(--background-2)"
        />
        {/* Top right segment - uses --background-3 */}
        <path
          d="M706 475.134L574 419C574 333.752 504.813 264.388 419.134 264.315L475 132.315L419.134 0.315411C650.343 0.387666 838 187.675 838 419L706 475.134Z"
          fill="var(--background-3)"
        />
        {/* Bottom right segment - uses --background-4 */}
        <path
          d="M362.866 706L419 574C504.248 574 573.612 504.813 573.685 419.134L705.685 475L837.685 419.134C837.612 650.343 650.325 838 419 838L362.866 706Z"
          fill="var(--background-4)"
        />
        {/* Bottom left segment - uses --background-5 */}
        <path
          d="M132 362.866L264 419C264 504.248 333.187 573.612 418.866 573.685L363 705.685L418.866 837.685C187.657 837.612 -2.83646e-05 650.325 -1.83013e-05 419L132 362.866Z"
          fill="var(--background-5)"
        />
      </svg>
    </div>
  );
}

