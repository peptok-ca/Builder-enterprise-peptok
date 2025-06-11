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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Logo image failed to load:", e);
    // Try PNG fallback if SVG fails
    const target = e.target as HTMLImageElement;
    if (target.src.includes(".svg")) {
      target.src = "/peptok-logo.png";
      return;
    }
    // If PNG also fails, fallback to text logo
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent && !parent.querySelector(".fallback-logo")) {
      const fallback = document.createElement("span");
      fallback.className = "fallback-logo font-bold text-lg text-blue-600";
      fallback.textContent = "Peptok";
      parent.appendChild(fallback);
    }
  };

  if (variant === "icon-only") {
    // For icon-only, show just a cropped version focusing on the arc
    return (
      <div className={cn("flex items-center", className)}>
        <img
          src="/peptok-logo.svg"
          alt="Peptok"
          className={cn("w-auto object-contain", sizeClasses[size])}
          style={{
            objectPosition: "left center",
            aspectRatio: "2/1",
          }}
          onError={handleImageError}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/peptok-logo.svg"
        alt="Peptok"
        className={cn("w-auto object-contain", sizeClasses[size])}
        onError={handleImageError}
        loading="eager"
      />
    </div>
  );
};

export default Logo;
