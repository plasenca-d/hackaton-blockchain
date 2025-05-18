"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions/get-user.action";

/**
 * Retrieves a sale intent by its ID along with related sale information
 *
 * @param saleIntentId - The ID of the sale intent to retrieve
 * @returns The sale intent with related sale information or null if not found
 */
export async function getSaleIntent(saleIntentId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const saleIntent = await prisma.saleIntent.findUnique({
      where: {
        id: saleIntentId,
      },
      include: {
        sale: true,
      },
    });

    if (!saleIntent) {
      return null;
    }

    if (saleIntent.userId !== currentUser.id) {
      throw new Error("Not authorized to view this sale intent");
    }

    return {
      id: saleIntent.id,
      createdAt: saleIntent.createdAt,
      status: "PENDING",
      reviewId: saleIntent.reviewId,
      productName: saleIntent.sale.productName,
      productDescription: saleIntent.sale.productDescription,
      photoUrl: saleIntent.sale.photoUrl,
      saleId: saleIntent.sale.id,
    };
  } catch (error) {
    console.error("Error retrieving sale intent:", error);
    throw new Error(
      `Failed to retrieve sale intent: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
