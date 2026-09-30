import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  className,
  showValue = true,
}: {
  rating: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            aria-hidden
            className={cn(
              "size-3.5",
              index <= Math.round(rating) ? "fill-star text-star" : "text-border",
            )}
          />
        ))}
      </div>
      {showValue ? (
        <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
      ) : null}
    </div>
  );
}
