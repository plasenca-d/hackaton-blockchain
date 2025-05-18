"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

export function StarRating({
  rating,
  onChange,
  readOnly = false,
  size = 24,
  className,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div
      className={cn("flex", className)}
      onMouseLeave={() => !readOnly && setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            "cursor-pointer transition-colors",
            (hoverRating || rating) >= star
              ? "fill-caserito-green text-caserito-green"
              : "fill-muted text-muted-foreground",
            readOnly && "cursor-default"
          )}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
        />
      ))}
    </div>
  );
}
