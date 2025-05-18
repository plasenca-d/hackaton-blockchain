"use client";

import { z } from "zod";

const NewSaleFormSchema = z.object({
  username: z.string().min(2).max(50),
});

export const useNewSaleForm = () => {};
