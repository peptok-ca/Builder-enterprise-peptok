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

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
  };

  const LogoIcon = () => (
    <div className={cn("flex items-center", sizeClasses[size])}>
      <svg
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Curved arc above the text */}
        <path
          d="M20 25 Q100 5 180 25"
          stroke="#2563eb"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Text "peptok" */}
        <g fill="#2563eb">
          {/* p */}
          <path
            d="M20 35 L20 70 M20 35 L35 35 Q45 35 45 45 Q45 55 35 55 L20 55"
            strokeWidth="6"
            stroke="#2563eb"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* e with strikethrough */}
          <circle
            cx="60"
            cy="50"
            r="10"
            fill="none"
            stroke="#2563eb"
            strokeWidth="6"
          />
          <path
            d="M50 50 L70 50"
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M50 45 L65 45"
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* p */}
          <path
            d="M85 35 L85 70 M85 35 L100 35 Q110 35 110 45 Q110 55 100 55 L85 55"
            strokeWidth="6"
            stroke="#2563eb"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* t */}
          <path
            d="M125 40 L125 65 Q125 70 130 70"
            strokeWidth="6"
            stroke="#2563eb"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M115 45 L135 45"
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* o */}
          <circle
            cx="150"
            cy="50"
            r="10"
            fill="none"
            stroke="#2563eb"
            strokeWidth="6"
          />

          {/* k */}
          <path
            d="M170 35 L170 70"
            strokeWidth="6"
            stroke="#2563eb"
            strokeLinecap="round"
          />
          <path
            d="M170 50 L180 40"
            strokeWidth="6"
            stroke="#2563eb"
            strokeLinecap="round"
          />
          <path
            d="M170 50 L180 60"
            strokeWidth="6"
            stroke="#2563eb"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );

  if (variant === "icon-only") {
    // For icon-only, just show the arc
    return (
      <div
        className={cn("flex items-center justify-center", sizeClasses[size])}
      >
        <svg
          viewBox="0 0 40 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <path
            d="M5 15 Q20 2 35 15"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LogoIcon />
    </div>
  );
};

export default Logo;
