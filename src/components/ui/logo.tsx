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

  if (variant === "icon-only") {
    // For icon-only, show just a cropped version focusing on the arc
    return (
      <div className={cn("flex items-center", className)}>
        <img
          src="/peptok-logo.png"
          alt="Peptok"
          className={cn("w-auto object-contain", sizeClasses[size])}
          style={{
            objectPosition: "left center",
            aspectRatio: "2/1",
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/peptok-logo.png"
        alt="Peptok"
        className={cn("w-auto object-contain", sizeClasses[size])}
      />
    </div>
  );
};

export default Logo;
