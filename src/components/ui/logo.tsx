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
        {/* Clean abstract design element */}
        <g fill="white">
          <path
            d="M9 12 C9 9, 12 7, 16 9 C20 11, 23 9, 23 12 C23 15, 20 17, 16 15 C12 13, 9 15, 9 12"
            fillOpacity="0.9"
          />
          <path
            d="M11 19 C13 17, 19 17, 21 19 C19 21, 13 21, 11 19"
            fillOpacity="0.8"
          />
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
