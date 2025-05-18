"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Star,
  Search,
  Filter,
  Badge,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserReviews } from "@/features/reviews/actions/get-user-reviews.action";
import { isValidHash } from "@/features/reviews/utils/hash-utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  photoUrl: string | null;
  hash: string | null;
  createdAt: string;
  productName: string;
  buyer: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function ReviewsDashboardPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "rating">(
    "latest"
  );
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const data = await getUserReviews();
        setReviews(data || []);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  // Filter reviews based on search term
  const filteredReviews = reviews.filters(
    (review) =>
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.buyer.name &&
        review.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort reviews based on sort order
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  // Calculate verification statistics
  const totalReviews = reviews.length;
  const verifiedReviews = reviews.filter(
    (r) => r.hash && isValidHash(r.hash)
  ).length;
  const verificationRate =
    totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0;

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reseñas de Clientes
          </h1>
          <p className="text-gray-600">
            Gestiona y visualiza las reseñas de tus clientes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de reseñas</p>
              <p className="text-2xl font-bold">{totalReviews}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reseñas verificadas</p>
              <p className="text-2xl font-bold">{verifiedReviews}</p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <Badge className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tasa de verificación</p>
              <p className="text-2xl font-bold">
                {verificationRate.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-full bg-amber-100 p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar reseñas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Ordenar por
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortOrder("latest")}>
              Más recientes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
              Más antiguos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("rating")}>
              Mayor puntuación
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reseñas...</p>
        </div>
      ) : sortedReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {sortedReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden hover:shadow-md">
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpandReview(review.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={review.buyer?.image || ""} />
                      <AvatarFallback>
                        {review.buyer?.name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">
                          {review.buyer?.name || "Cliente"}
                        </p>
                        {review.hash && isValidHash(review.hash) && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Verificado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(review.createdAt), "PPP", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {expandedReviews.includes(review.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <h3 className="font-medium mt-2">{review.productName}</h3>
                <p
                  className={`text-gray-600 mt-2 ${
                    expandedReviews.includes(review.id) ? "" : "line-clamp-2"
                  }`}
                >
                  {review.comment}
                </p>
              </div>

              {expandedReviews.includes(review.id) && (
                <div className="px-4 pb-4">
                  {review.photoUrl && (
                    <div className="mt-3 max-h-60 overflow-hidden rounded-lg">
                      <img
                        src={review.photoUrl}
                        alt={review.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {review.hash && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Registro en Blockchain
                      </p>
                      <p className="text-xs text-blue-600 mb-2">
                        Esta reseña está verificada y registrada en la
                        blockchain:
                      </p>
                      <p className="text-xs font-mono bg-white p-2 border border-blue-100 rounded overflow-x-auto">
                        {review.hash}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/reviews/${review.id}`)
                      }
                      variant="outline"
                      size="sm"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No se encontraron reseñas</p>
          <p className="text-gray-400 text-sm mt-2">
            Las reseñas de tus clientes aparecerán aquí
          </p>
        </div>
      )}
    </div>
  );
}
