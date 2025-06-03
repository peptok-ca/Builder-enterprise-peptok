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
    <div className={cn(
      "rounded-full bg-primary flex items-center justify-center relative",
      sizeClasses[size]
    )}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Circular background */}
        <circle
          cx="16"
          cy="16"
          r="16"
          fill="currentColor"
        />
        {/* Stylized "p" design - curved lines representing the logo symbol */}
        <path
          d="M10 12 C10 10, 12 8, 16 8 C20 8, 22 10, 22 12 C22 14, 20 16, 16 16 L12 16 L12 24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M10 20 L16 20"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
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
      <span
      <span className={cn(
        "font-medium text-primary tracking-normal",
        textSizeClasses[size]
      )} style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        peptok
      </span>
    </div>
  );
};

export default Logo;