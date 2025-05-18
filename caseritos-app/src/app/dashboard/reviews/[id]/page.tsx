"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReviewById } from "@/features/reviews/actions/get-review-by-id.action";
import { BlockchainVerification } from "@/components/ui/blockchain-verification";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Check, Star } from "lucide-react";

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  photoUrl: string;
  hash: string | null;
  createdAt: string;
  productName: string;
  seller: {
    name: string;
    image: string;
  };
  buyer: {
    name: string;
    image: string;
  };
}

export default function ReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReview() {
      try {
        setLoading(true);
        const reviewId = params?.id as string;
        if (!reviewId) {
          setError("ID de reseña no proporcionado");
          return;
        }

        const data = await getReviewById(reviewId);
        if (data) {
          setReview(data);
        } else {
          setError("Reseña no encontrada");
        }
      } catch (err) {
        setError(
          `Error al cargar la reseña: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReview();
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">
            {error || "No se pudo cargar la reseña"}
          </p>
          <Button
            onClick={() => router.push("/dashboard/reviews")}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Volver a reseñas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {review.productName}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{review.rating}/5</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
              <Check className="mr-1 h-4 w-4" />
              Verificado
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Información de la reseña
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-4">{review.comment}</p>
              <div className="text-sm text-gray-500">
                Fecha: {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">
                Verificación Blockchain
              </h2>
              <BlockchainVerification hash={review.hash} reviewId={review.id} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Imagen del producto</h2>
            {review.photoUrl ? (
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={review.photoUrl}
                  alt="Producto reseñado"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                <p className="text-gray-500">No hay imagen disponible</p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Participantes</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={review.seller?.image || "/placeholder-avatar.jpg"}
                      alt={review.seller?.name || "Vendedor"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {review.seller?.name || "Vendedor"}
                    </p>
                    <p className="text-xs text-gray-500">Vendedor</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={review.buyer?.image || "/placeholder-avatar.jpg"}
                      alt={review.buyer?.name || "Comprador"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {review.buyer?.name || "Comprador"}
                    </p>
                    <p className="text-xs text-gray-500">Comprador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
