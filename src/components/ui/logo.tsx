import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon-only";
}

const Logo = ({ className, size = "md", variant = "full" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  const LogoSvg = () => (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-auto", sizeClasses[size])}
    >
      {/* Curved arc above the text */}
      <path
        d="M40 20 Q120 5 200 20"
        stroke="#1d4ed8"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* peptok text */}
      <g fill="#1d4ed8" className="font-bold">
        {/* p */}
        <path
          d="M20 40 L20 85 M20 40 L35 40 C42 40 48 46 48 53 C48 60 42 66 35 66 L20 66"
          stroke="#1d4ed8"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* e with diagonal strikethrough */}
        <circle
          cx="68"
          cy="60"
          r="13"
          stroke="#1d4ed8"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M58 67 L78 53"
          stroke="#1d4ed8"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M58 60 L75 60"
          stroke="#1d4ed8"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* p */}
        <path
          d="M98 40 L98 85 M98 40 L113 40 C120 40 126 46 126 53 C126 60 120 66 113 66 L98 66"
          stroke="#1d4ed8"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* t */}
        <path
          d="M146 45 L146 70 C146 75 148 77 153 77"
          stroke="#1d4ed8"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M136 50 L156 50"
          stroke="#1d4ed8"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* o */}
        <circle
          cx="176"
          cy="60"
          r="13"
          stroke="#1d4ed8"
          strokeWidth="8"
          fill="none"
        />

        {/* k */}
        <path
          d="M200 40 L200 85"
          stroke="#1d4ed8"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M200 60 L215 45"
          stroke="#1d4ed8"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M200 60 L215 75"
          stroke="#1d4ed8"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  if (variant === "icon-only") {
    // For icon-only, show just the arc
    return (
      <div className="flex items-center justify-center">
        <svg
          viewBox="0 0 80 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-full w-auto", sizeClasses[size])}
        >
          <path
            d="M10 20 Q40 5 70 20"
            stroke="#1d4ed8"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <LogoSvg />
    </div>
  );
};

export default Logo;
