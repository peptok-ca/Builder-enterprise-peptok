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

  const handleImageLoad = () => {
    console.log("Logo image loaded successfully");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Logo image failed to load:", e);
    const target = e.target as HTMLImageElement;
    console.error("Failed image src:", target.src);
  };

  if (variant === "icon-only") {
    // For icon-only, show just a cropped version focusing on the arc
    return (
      <div className={cn("flex items-center", className)}>
        <img
          src="/test-logo.svg"
          alt="Peptok"
          className={cn("w-auto object-contain", sizeClasses[size])}
          style={{
            objectPosition: "left center",
            aspectRatio: "2/1",
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
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
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default Logo;
