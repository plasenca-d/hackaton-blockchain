-- Add blockchain verification fields to Review model
ALTER TABLE "Review" ADD COLUMN "product_name" TEXT;
ALTER TABLE "Review" ADD COLUMN "blockchain_verified" BOOLEAN DEFAULT false;
ALTER TABLE "Review" ADD COLUMN "blockchain_transaction_id" TEXT;
ALTER TABLE "Review" ADD COLUMN "verified_at" TIMESTAMP;

-- Set all existing review product names if they don't have them yet
UPDATE "Review" r
SET product_name = (
  SELECT s.product_name
  FROM "sale_intents" si
  JOIN "sales" s ON si.sale_id = s.id
  WHERE si.review_id = r.id
  LIMIT 1
)
WHERE r.product_name IS NULL;
