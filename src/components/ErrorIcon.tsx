import React from "react";

interface ErrorIconProps {
  className?: string;
  size?: number;
}

export const ErrorIcon: React.FC<ErrorIconProps> = ({ 
  className = "", 
  size = 80 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with gradient */}
      <defs>
        <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FF4757" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8F9FA" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#FF4757" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Background circle with shadow */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#errorGradient)"
        filter="url(#shadow)"
      />
      
      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="url(#innerGradient)"
        stroke="#FF4757"
        strokeWidth="2"
      />
      
      {/* X mark - first line */}
      <line
        x1="35"
        y1="35"
        x2="65"
        y2="65"
        stroke="#FF4757"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* X mark - second line */}
      <line
        x1="65"
        y1="35"
        x2="35"
        y2="65"
        stroke="#FF4757"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Optional: Add some subtle animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .error-icon {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>
    </svg>
  );
};

export default ErrorIcon;