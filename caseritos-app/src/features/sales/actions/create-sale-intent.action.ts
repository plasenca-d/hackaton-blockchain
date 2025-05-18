"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions/get-user.action";

export interface CreateSaleIntentInput {
  productName: string;
  productDescription: string;
  photoUrl: string;
}

/**
 * Creates a new sale intent in the database
 *
 * @param data - Sale intent data including product name, description, and photo URL
 * @returns The created sale intent ID
 */
export async function createSaleIntent(
  data: CreateSaleIntentInput
): Promise<string> {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const sale = await prisma.sale.create({
      data: {
        productName: data.productName,
        productDescription: data.productDescription,
        photoUrl: data.photoUrl,
        sellerId: currentUser.id,
      },
    });

    const saleIntent = await prisma.saleIntent.create({
      data: {
        saleId: sale.id,
        userId: currentUser.id,
      },
    });

    revalidatePath("/dashboard/sales");

    return saleIntent.id;
  } catch (error) {
    console.error("Error creating sale intent:", error);
    throw new Error(
      `Failed to create sale intent: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
