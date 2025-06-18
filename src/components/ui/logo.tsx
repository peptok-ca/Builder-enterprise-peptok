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

  // Simple text logo that always works
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

  // Use text logo as the primary solution to avoid deployment issues
  return <TextLogo />;
};

export default Logo;
