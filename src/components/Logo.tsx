interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer square frame */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="12"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
      
      {/* Inner recycling symbol made of squares */}
      <g transform="translate(50, 50)">
        {/* Top square */}
        <rect
          x="-8"
          y="-25"
          width="16"
          height="16"
          rx="2"
          fill="currentColor"
        />
        
        {/* Bottom left square */}
        <rect
          x="-24"
          y="9"
          width="16"
          height="16"
          rx="2"
          fill="currentColor"
        />
        
        {/* Bottom right square */}
        <rect
          x="8"
          y="9"
          width="16"
          height="16"
          rx="2"
          fill="currentColor"
        />
        
        {/* Connecting arrows */}
        {/* Arrow 1: top to bottom-right */}
        <path
          d="M 2 -12 Q 15 -5 12 8"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 12 8 L 10 3 M 12 8 L 16 6"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Arrow 2: bottom-right to bottom-left */}
        <path
          d="M 8 17 Q 0 22 -8 17"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M -8 17 L -4 14 M -8 17 L -6 21"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Arrow 3: bottom-left to top */}
        <path
          d="M -16 8 Q -15 -5 -2 -12"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M -2 -12 L -6 -10 M -2 -12 L -4 -16"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
