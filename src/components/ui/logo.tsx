import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon-only";
}

const Logo = ({ className, size = "md", variant = "full" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
  };

  const LogoIcon = () => (
    <div
      className={cn(
        "rounded-full bg-primary flex items-center justify-center relative overflow-hidden",
        sizeClasses[size],
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Circular background */}
        <circle cx="16" cy="16" r="16" fill="currentColor" />
        {/* Flowing organic design matching Peptok logo */}
        <g fill="white" fillOpacity="0.95">
          <path d="M8 10 Q16 6, 24 10 Q20 14, 16 12 Q12 14, 8 10" />
          <path d="M10 18 Q16 14, 22 18 Q18 22, 14 20 Q10 22, 10 18" />
          <path d="M12 14 Q16 10, 20 14 Q16 18, 12 14" fillOpacity="0.7" />
        </g>
      </svg>
    </div>
  );

  if (variant === "icon-only") {
    return <LogoIcon />;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LogoIcon />
      <span className={cn("font-normal text-primary", textSizeClasses[size])}>
        peptok
      </span>
    </div>
  );
};

export default Logo;
