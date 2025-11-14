import React from 'react';

interface DesignThinkingIllustrationProps {
  className?: string;
}

export function DesignThinkingIllustration({
  className = '',
}: DesignThinkingIllustrationProps) {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 582 524"
      fill="#FFCC00"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <path
        d="M281.987 268.492C278.863 265.368 278.863 260.302 281.987 257.178L376.156 163.01C379.28 159.886 384.345 159.886 387.469 163.01L481.638 257.178C484.762 260.302 484.762 265.368 481.638 268.492L387.469 362.66C384.345 365.784 379.28 365.784 376.156 362.66L281.987 268.492Z"
        fill="var(--olive-500, currentColor)"
        fillOpacity="1.0"
      />
      <path
        d="M70.6569 268.674C67.5327 265.55 67.5327 260.485 70.6569 257.361L164.825 163.192C167.949 160.068 173.015 160.068 176.139 163.192L270.307 257.361C273.432 260.485 273.432 265.55 270.307 268.674L176.139 362.843C173.015 365.967 167.949 365.967 164.825 362.843L70.6569 268.674Z"
        fill="var(--olive-500, currentColor)"
        fillOpacity=".5"
      />
      <line
        x1="432.963"
        y1="263.195"
        x2="420.703"
        y2="275.455"
        stroke="var(--background, currentColor)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="1.0"
      />
      <line
        x1="432.792"
        y1="263.018"
        x2="419.289"
        y2="249.515"
        stroke="var(--background, currentColor)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="1.0"
      />
      <path
        d="M433.294 263C433.294 263.828 432.623 264.5 431.794 264.5L235.794 264.5C234.966 264.5 234.294 263.828 234.294 263C234.294 262.172 234.966 261.5 235.794 261.5L431.794 261.5C432.623 261.5 433.294 262.172 433.294 263Z"
        fill="var(--background, currentColor)"
        fillOpacity="1.0"
      />
    </svg>
  );
}

