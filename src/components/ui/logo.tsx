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
        {/* Simple elegant design matching Peptok logo */}
        <g fill="white">
          <circle cx="16" cy="13" r="4" fillOpacity="0.9" />
          <ellipse cx="16" cy="20" rx="5" ry="2" fillOpacity="0.8" />
          <rect x="14" y="16" width="4" height="2" rx="1" fillOpacity="0.7" />
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
