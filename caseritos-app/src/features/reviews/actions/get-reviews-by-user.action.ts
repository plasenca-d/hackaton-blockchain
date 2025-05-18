"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Review } from "@/generated/prisma";

export const getAllReviewsByUser = async (): Promise<Review[]> => {
  const session = await auth();
  if (!session) return [];

  const email = session?.user?.email;
  if (!email) return [];

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const reviews = await prisma.review.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      buyer: true,

      user: true,
    },
  });

  return reviews;
};
