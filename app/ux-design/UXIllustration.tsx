import React from 'react';

interface DesignThinkingIllustrationProps {
  className?: string;
}

export function UXIllustration({
  className = '',
}: DesignThinkingIllustrationProps) {
  return (
<svg width="426" height="394" viewBox="0 0 426 394" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="230.5" y1="1.5" x2="424.5" y2="1.5" stroke="var(--foreground, currentColor)" opacity="0.7" strokeWidth="3" stroke-linecap="round"/>
<path d="M397.5 1.5V320C397.5 360.041 365.041 392.5 325 392.5C284.959 392.5 252.5 360.041 252.5 320V1.5H397.5Z" stroke="var(--foreground, currentColor)" opacity="0.7" strokeWidth="3"/>
<path d="M260 111C260 106.582 263.582 103 268 103H382C386.418 103 390 106.582 390 111V319C390 354.899 360.899 384 325 384V384C289.101 384 260 354.899 260 319V111Z" fill="#8B9679"/>
<line x1="1.5" y1="1.5" x2="195.5" y2="1.5" stroke="var(--foreground, currentColor)" opacity="0.7" strokeWidth="3" stroke-linecap="round"/>
<path d="M168.5 1.5V320C168.5 360.041 136.041 392.5 96 392.5C55.9594 392.5 23.5 360.041 23.5 320V1.5H168.5Z" stroke="var(--foreground, currentColor)" opacity="0.7" strokeWidth="3"/>
<path d="M31 45C31 40.5817 34.5817 37 39 37H153C157.418 37 161 40.5817 161 45V319C161 354.899 131.899 384 96 384V384C60.1015 384 31 354.899 31 319V45Z" fill="#9EA88D"/>
</svg>

  );
}

