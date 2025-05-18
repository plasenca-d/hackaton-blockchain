import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ReviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(500),
  photoUrl: z.string().url(),
});

export const useReviewForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      rating: 1,
      comment: "",
      photoUrl: "",
    },
  });

  return {
    form,
    isLoading,
    setIsLoading,
  };
};
