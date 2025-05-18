import crypto from "crypto";

/**
 * Generate a hash string from review data
 *
 * @param reviewData - The review data to hash
 * @returns A SHA-256 hash of the review data
 */
export function generateReviewHash(reviewData: {
  comment: string;
  rating: number;
  productName: string;
  id: string;
}): string {
  const dataString = `${reviewData.comment}-${reviewData.rating}-${reviewData.productName}-${reviewData.id}`;
  return crypto.createHash("sha256").update(dataString).digest("hex");
}

/**
 * Check if a hash is valid (32 characters long)
 *
 * @param hash - The hash to validate
 * @returns boolean indicating if the hash is valid
 */
export function isValidHash(hash: string): boolean {
  return typeof hash === "string" && hash.length === 64;
}
