"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getUserReviews } from "@/features/reviews/actions/get-user-reviews.action";
import { isValidHash } from "@/features/reviews/utils/hash-utils";

interface ReviewStats {
  totalReviews: number;
  verifiedReviews: number;
  verificationRate: number;
  averageRating: number;
  mostCommonRatings: { [key: number]: number };
}

export default function ReviewInsightsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    verifiedReviews: 0,
    verificationRate: 0,
    averageRating: 0,
    mostCommonRatings: {},
  });

  useEffect(() => {
    async function loadReviewStats() {
      try {
        setLoading(true);
        const reviews = await getUserReviews();

        if (!reviews || reviews.length === 0) {
          return;
        }

        const totalReviews = reviews.length;
        const verifiedReviews = reviews.filter(
          (r) => r.hash && isValidHash(r.hash)
        ).length;
        const verificationRate =
          totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0;

        // Calculate average rating
        const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = sumRatings / totalReviews;

        // Count ratings by value (1-5)
        const ratingCounts: { [key: number]: number } = {};
        for (let i = 1; i <= 5; i++) {
          ratingCounts[i] = reviews.filter((r) => r.rating === i).length;
        }

        setStats({
          totalReviews,
          verifiedReviews,
          verificationRate,
          averageRating,
          mostCommonRatings: ratingCounts,
        });
      } catch (error) {
        console.error("Error loading review stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReviewStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/reviews")}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a reseñas
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Métricas de Verificación Blockchain
        </h1>
        <p className="text-gray-600">
          Análisis de la verificación blockchain de tus reseñas
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-700">
                Total de reseñas
              </h3>
              <p className="text-3xl font-bold mt-2">{stats.totalReviews}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-700">
                Reseñas verificadas
              </h3>
              <p className="text-3xl font-bold mt-2">{stats.verifiedReviews}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-700">
                Tasa de verificación
              </h3>
              <p className="text-3xl font-bold mt-2">
                {stats.verificationRate.toFixed(1)}%
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-700">
                Calificación promedio
              </h3>
              <p className="text-3xl font-bold mt-2">
                {stats.averageRating.toFixed(1)}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Distribución de calificaciones
              </h3>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.mostCommonRatings[rating] || 0;
                  const percentage =
                    stats.totalReviews > 0
                      ? (count / stats.totalReviews) * 100
                      : 0;
                  return (
                    <div key={rating} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          {rating}{" "}
                          <svg
                            className="w-4 h-4 text-yellow-400 ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                        <span>
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Métricas de Blockchain
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-600">
                    Tasa de verificación
                  </h4>
                  <div className="mt-2 h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${stats.verificationRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0%</span>
                    <span>
                      {stats.verificationRate.toFixed(1)}% verificadas
                    </span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium text-gray-600 mb-3">
                    Beneficios de la verificación
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Mayor confianza de los consumidores</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Protección contra reseñas fraudulentas</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Transparencia en la cadena de suministro</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Registro inmutable de transacciones</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Resumen de verificación blockchain
            </h3>
            <p className="text-gray-600 mb-4">
              Las reseñas verificadas en blockchain ofrecen una mayor confianza
              y transparencia para tus clientes potenciales.
            </p>

            <div className="mt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">
                  ¿Cómo mejorar tu tasa de verificación?
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <div className="rounded-full bg-blue-200 p-1 mr-2 mt-0.5">
                      <span className="text-xs text-blue-800">1</span>
                    </div>
                    <span>
                      Asegúrate de que las fotos de los productos sean claras y
                      detalladas
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-blue-200 p-1 mr-2 mt-0.5">
                      <span className="text-xs text-blue-800">2</span>
                    </div>
                    <span>
                      Promueve entre tus clientes la importancia de incluir
                      fotos del producto en sus reseñas
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-blue-200 p-1 mr-2 mt-0.5">
                      <span className="text-xs text-blue-800">3</span>
                    </div>
                    <span>
                      Anima a tus clientes a dejar reseñas detalladas sobre su
                      experiencia
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
