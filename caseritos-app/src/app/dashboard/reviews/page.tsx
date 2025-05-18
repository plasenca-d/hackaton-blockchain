"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@//components/ui/input";
import { Button } from "@//components/ui/button";
import {
  BarChart3,
  ShoppingBag,
  User,
  Star,
  Search,
  Filter,
  Calendar,
  Download,
  Badge,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@//components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@//components/ui/avatar";
import { Card } from "@//components/ui/card";
import { StarRating } from "@//components/ui/star-rating";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@//components/ui/alert-dialog";
import { getUserReviews } from "@/features/reviews/actions/get-user-reviews.action";
import { isValidHash } from "@/features/reviews/utils/hash-utils";

// Interface for review data structure returned by getUserReviews
interface ReviewData {
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

export default function ReseñasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const data = await getUserReviews();
        setReviews(data ?? []);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);
  const filteredReviews = searchTerm
    ? reviews.filter(
        (r) =>
          (r.buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
          (r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
      )
    : reviews;

  const toggleExpandReview = (id: string) => {
    setExpandedReviews((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo_caserito_customer.png"
                alt="Caserito Logo"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <h1 className="text-xl font-bold ml-2 hidden sm:block">
                Caserito
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/profile")}
              >
                <User className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Mi Perfil</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 pb-20 md:pb-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar en pantallas medianas y grandes */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard")}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/ventas")}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Ventas
                </Button>
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => router.push("/resenas")}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Reseñas
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/profile")}
                >
                  <User className="h-5 w-5 mr-2" />
                  Mi Perfil
                </Button>
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Reseñas</h1>
                <p className="text-muted-foreground">
                  Gestiona las reseñas de tus clientes
                </p>
              </div>
            </div>

            <Card className="p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente o contenido..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Calificación
                        </DropdownMenuLabel>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <DropdownMenuItem key={rating}>
                            <div className="flex items-center">
                              <StarRating rating={rating} readOnly size={16} />
                              <span className="ml-2">({rating})</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Fecha
                        </DropdownMenuLabel>
                        <DropdownMenuItem>Más recientes</DropdownMenuItem>
                        <DropdownMenuItem>Más antiguas</DropdownMenuItem>
                        <DropdownMenuItem>Este mes</DropdownMenuItem>
                        <DropdownMenuItem>Personalizado...</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Este mes</span>
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Resumen de calificaciones</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-caserito-green">
                    {calificacionPromedio.toFixed(1)}
                  </div>
                  <div className="flex justify-center mt-2">
                    <StarRating
                      rating={Math.round(calificacionPromedio)}
                      readOnly
                      size={20}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    De {reseñas.length} reseñas
                  </p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reseñas.filter(
                      (r) => r.rating === rating
                    ).length;
                    const percentage = (count / reseñas.length) * 100;
                    return (
                      <div
                        key={rating}
                        className="flex items-center gap-2 mb-2"
                      >
                        <div className="flex items-center w-12">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm">{rating}</span>
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-caserito-green rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right text-sm text-muted-foreground">
                          {count} ({percentage.toFixed(0)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {reseñasFiltradas.map((reseña) => (
                <Card key={reseña.id} className="p-4 overflow-hidden">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={reseña.avatar || "/placeholder.svg"}
                        alt={reseña.cliente}
                      />
                      <AvatarFallback>
                        {reseña.cliente.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{reseña.cliente}</h3>
                      <div className="flex items-center">
                        <StarRating rating={reseña.rating} readOnly size={16} />
                        <span className="text-xs text-muted-foreground ml-2">
                          {format(reseña.fecha, "d MMM yyyy", { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p
                      className={
                        expandedReviews.includes(reseña.id)
                          ? ""
                          : "line-clamp-3"
                      }
                    >
                      {reseña.texto}
                    </p>
                    {reseña.texto.length > 150 && (
                      <button
                        onClick={() => toggleExpandReview(reseña.id)}
                        className="text-sm text-primary mt-1"
                      >
                        {expandedReviews.includes(reseña.id)
                          ? "Ver menos"
                          : "Ver más"}
                      </button>
                    )}
                  </div>

                  {reseña.imagen && (
                    <div
                      className="relative w-full h-48 cursor-pointer"
                      onClick={() => setSelectedImage(reseña.imagen)}
                    >
                      <Image
                        src={reseña.imagen || "/placeholder.svg"}
                        alt="Imagen de la reseña"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </Card>
              ))}

              {reseñasFiltradas.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No se encontraron reseñas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Barra de navegación móvil */}
      <div className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around p-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center p-2"
            onClick={() => router.push("/dashboard")}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center p-2"
            onClick={() => router.push("/ventas")}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs mt-1">Ventas</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center p-2"
            onClick={() => router.push("/resenas")}
          >
            <Star className="h-5 w-5" />
            <span className="text-xs mt-1">Reseñas</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center p-2"
            onClick={() => router.push("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Button>
        </div>
      </div>

      {/* Modal para ver imagen ampliada */}
      <AlertDialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Vista ampliada</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="relative w-full aspect-video">
            {selectedImage && (
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Imagen ampliada"
                fill
                className="object-contain"
              />
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedImage(null)}>
              Cerrar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
