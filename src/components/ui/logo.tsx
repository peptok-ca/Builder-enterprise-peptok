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
        {/* Peptok logo symbol - abstract curved design */}
        <path
          d="M10 12 C10 10, 14 8, 16 10 C18 12, 22 10, 22 12 C22 14, 18 16, 16 14 C14 12, 10 14, 10 12 Z"
          fill="white"
        />
        <path
          d="M12 18 C14 16, 18 16, 20 18 C18 20, 14 20, 12 18 Z"
          fill="white"
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
