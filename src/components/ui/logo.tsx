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
        "rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold",
        sizeClasses[size],
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5"
      >
        <path
          d="M6 8V6C6 4.89543 6.89543 4 8 4H16C17.1046 4 18 4.89543 18 6V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );

  if (variant === "icon-only") {
    return <LogoIcon />;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LogoIcon />
      <span className={cn("font-bold text-primary", textSizeClasses[size])}>
        peptok
      </span>
    </div>
  );
};

export default Logo;
