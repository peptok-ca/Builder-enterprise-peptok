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
        {/* Peptok logo symbol - flowing organic design */}
        <path
          d="M8 12 Q12 8, 16 12 Q20 16, 24 12 Q20 18, 16 14 Q12 10, 8 12"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M10 16 Q14 14, 18 16 Q22 18, 18 20 Q14 18, 10 16"
          fill="white"
          fillOpacity="0.8"
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
        className={cn(
          "font-normal text-primary tracking-wide",
          textSizeClasses[size],
        )}
      >
        peptok
      </span>
    </div>
  );
};

export default Logo;
