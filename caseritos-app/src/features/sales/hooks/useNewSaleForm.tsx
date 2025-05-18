"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useState } from "react";

export const NewSaleFormSchema = z.object({
  productName: z.string().min(1, "El nombre del producto es requerido"),
  productDescription: z
    .string()
    .min(1, "La descripción del producto es requerida"),
  photoUrl: z.string().min(1, "La URL de la foto es requerida"),
});

export const useNewSaleForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(NewSaleFormSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      photoUrl: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof NewSaleFormSchema>) => {
    setIsLoading(true);
  };

  return {
    form,
    isLoading,
  };
};
