"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * Gets the currently authenticated user's data from the database
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      console.warn(
        `User with email ${session.user.email} not found in database`
      );
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
