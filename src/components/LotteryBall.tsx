import { cn } from "@/lib/utils";

interface LotteryBallProps {
  number: number;
  variant?: "primary" | "hit" | "miss" | "neutral" | "hot" | "cold";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LotteryBall({ 
  number, 
  variant = "primary", 
  size = "md",
  className 
}: LotteryBallProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    hit: "bg-accent text-accent-foreground",
    miss: "bg-destructive text-destructive-foreground",
    neutral: "bg-muted text-muted-foreground",
    hot: "bg-lottery-hot text-primary-foreground",
    cold: "bg-lottery-cold text-primary-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shadow-md transition-all duration-200 hover:scale-110",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {number.toString().padStart(2, "0")}
    </div>
  );
}
