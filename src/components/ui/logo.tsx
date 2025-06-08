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
      viewBox="0 0 280 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-auto", sizeClasses[size])}
    >
      {/* Curved arc above the text */}
      <path
        d="M50 30 Q140 10 230 30"
        stroke="#1e40af"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* peptok text */}
      <g fill="#1e40af">
        {/* p */}
        <path
          d="M20 50 L20 110 M20 50 L45 50 C55 50 63 58 63 68 C63 78 55 86 45 86 L20 86"
          stroke="#1e40af"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* e with diagonal strikethrough */}
        <circle
          cx="95"
          cy="75"
          r="18"
          stroke="#1e40af"
          strokeWidth="12"
          fill="none"
        />
        <path
          d="M80 88 L110 62"
          stroke="#1e40af"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* p */}
        <path
          d="M135 50 L135 110 M135 50 L160 50 C170 50 178 58 178 68 C178 78 170 86 160 86 L135 86"
          stroke="#1e40af"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* t */}
        <path
          d="M198 55 L198 95 C198 105 202 109 212 109"
          stroke="#1e40af"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M185 65 L211 65"
          stroke="#1e40af"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* o */}
        <circle
          cx="240"
          cy="75"
          r="18"
          stroke="#1e40af"
          strokeWidth="12"
          fill="none"
        />

        {/* k */}
        <path
          d="M270 50 L270 110"
          stroke="#1e40af"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M270 75 L290 55"
          stroke="#1e40af"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M270 75 L290 95"
          stroke="#1e40af"
          strokeWidth="12"
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
          viewBox="0 0 100 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-full w-auto", sizeClasses[size])}
        >
          <path
            d="M15 30 Q50 10 85 30"
            stroke="#1e40af"
            strokeWidth="6"
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
