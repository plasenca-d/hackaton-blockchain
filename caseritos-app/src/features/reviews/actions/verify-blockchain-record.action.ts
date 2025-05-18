"use server";

/**
 * Verify a record on the blockchain by its hash
 *
 * @param hash - The hash of the record to verify
 * @returns The verification result
 */
export async function verifyBlockchainRecord(hash: string) {
  try {
    // Call the blockchain verification API
    const response = await fetch(
      `https://caseritos-app-production.up.railway.app/verify-record/${hash}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        verified: false,
        error: `Blockchain API error: ${
          errorData.message || response.statusText
        }`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      verified: data.verified || false,
      timestamp: data.timestamp,
      blockNumber: data.blockNumber,
      recordData: data.record,
    };
  } catch (error) {
    console.error("Error verifying blockchain record:", error);
    return {
      success: false,
      verified: false,
      error: `Failed to verify record: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
