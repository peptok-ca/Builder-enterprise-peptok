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
        "rounded-full bg-primary flex items-center justify-center relative",
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
        {/* Stylized design elements matching the Peptok logo */}
        <path d="M8 14 Q16 8, 24 14 Q16 18, 8 14" fill="white" opacity="0.9" />
        <path
          d="M10 16 Q16 12, 22 16 Q16 20, 10 16"
          fill="white"
          opacity="0.7"
        />
        <circle cx="16" cy="16" r="3" fill="white" opacity="0.8" />
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
        className={cn(
          "font-medium text-primary tracking-normal",
          textSizeClasses[size],
        )}
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        peptok
      </span>
    </div>
  );
};

export default Logo;
