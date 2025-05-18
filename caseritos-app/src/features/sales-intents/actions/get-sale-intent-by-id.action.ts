"use server";

import prisma from "@/lib/prisma";

export const getSaleIntentByIdAction = async (saleIntentId: string) => {
  return await prisma.saleIntent.findUnique({
    where: {
      id: saleIntentId,
    },
    include: {
      review: true,
      sale: true,
      user: true,
    },
  });
};
