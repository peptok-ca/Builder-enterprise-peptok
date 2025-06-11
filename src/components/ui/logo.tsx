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

    // Show fallback text logo
    const parent = target.parentElement;
    if (parent && !parent.querySelector(".fallback-logo")) {
      target.style.display = "none";
      const fallback = document.createElement("div");
      fallback.className =
        "fallback-logo font-bold text-blue-600 flex items-center";
      fallback.innerHTML = "<span>Peptok</span>";
      parent.appendChild(fallback);
    }
  };

  // Immediate fallback if image fails to load
  const TextLogo = () => (
    <div className={cn("flex items-center font-bold text-blue-600", className)}>
      <span
        className={cn(
          size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl",
        )}
      >
        Peptok
      </span>
    </div>
  );

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
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <noscript>
          <TextLogo />
        </noscript>
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
      <noscript>
        <TextLogo />
      </noscript>
    </div>
  );
};

export default Logo;
