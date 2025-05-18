"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { verifyBlockchainRecord } from "@/features/reviews/actions/verify-blockchain-record.action";
import { isValidHash } from "@/features/reviews/utils/hash-utils";

interface BlockchainVerificationProps {
  hash?: string | null;
  reviewId?: string;
}

export function BlockchainVerification({
  hash,
  reviewId,
}: BlockchainVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!hash) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-500">
          Esta reseña aún no ha sido registrada en la blockchain.
        </p>
      </div>
    );
  }

  const handleVerify = async () => {
    if (!hash || !isValidHash(hash)) {
      setError("Hash de verificación inválido");
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      const result = await verifyBlockchainRecord(hash);
      setVerificationResult(result);
    } catch (error) {
      setError(
        `Error de verificación: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
      <h3 className="font-medium text-blue-800 mb-2">
        Verificación Blockchain
      </h3>
      <p className="text-sm text-blue-700 mb-3">
        Esta reseña está registrada en blockchain con el siguiente hash:
      </p>
      <p className="text-xs font-mono bg-white p-2 border border-blue-100 rounded overflow-x-auto mb-4">
        {hash}
      </p>

      {!verificationResult && (
        <Button
          onClick={handleVerify}
          size="sm"
          variant="outline"
          className="text-blue-600 border-blue-200 hover:bg-blue-100"
          disabled={isVerifying}
        >
          {isVerifying ? "Verificando..." : "Verificar en Blockchain"}
        </Button>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
          {error}
        </p>
      )}

      {verificationResult && verificationResult.success && (
        <div className="mt-3 text-sm">
          {verificationResult.verified ? (
            <div className="bg-green-50 p-3 rounded border border-green-100">
              <p className="text-green-700 font-medium">
                ✓ Verificado en Blockchain
              </p>
              {verificationResult.timestamp && (
                <p className="text-xs text-green-600 mt-1">
                  Registrado:{" "}
                  {new Date(verificationResult.timestamp).toLocaleString()}
                </p>
              )}
              {verificationResult.blockNumber && (
                <p className="text-xs text-green-600 mt-1">
                  Bloque: {verificationResult.blockNumber}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 p-3 rounded border border-amber-100">
              <p className="text-amber-700 font-medium">
                ⚠️ No se pudo verificar
              </p>
              <p className="text-xs text-amber-600 mt-1">
                El registro no fue encontrado en la blockchain.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
