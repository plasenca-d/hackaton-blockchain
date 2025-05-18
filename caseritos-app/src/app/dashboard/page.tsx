import { StarRating } from "@//components/ui/star-rating";
import { Button } from "@//components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@//components/ui/tabs";
import { ShoppingBag, Star, ExternalLink, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@//components/ui/card";
import Link from "next/link";
import { getRecentReviewsAction } from "@/features/reviews/actions/get-recent-reviews.action";
import { getRecentSalesAction } from "@/features/sales/actions/get-recent-sales.action";
import { getStatisticsInformationAction } from "@/features/users/actions/get-statitistics-information.action";

export default async function DashboardPage() {
  const recentReviews = await getRecentReviewsAction();
  const sellerData = await getStatisticsInformationAction();

  return (
    <div className="flex-1">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Calificación</p>
              <h3 className="text-2xl font-bold mt-1">
                {sellerData.averageRating.toFixed(1)}
              </h3>
            </div>
            <div className="bg-caserito-green/10 p-2 rounded-full">
              <Star className="h-6 w-6 text-caserito-green" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            De {sellerData.totalReviews} reseñas
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas del mes</p>
              <h3 className="text-2xl font-bold mt-1">
                {sellerData.totalSellsCurrentMonth}
              </h3>
            </div>
            <div className="bg-caserito-blue/10 p-2 rounded-full">
              <ShoppingBag className="h-6 w-6 text-caserito-blue" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-green-500">↑ 12%</span> vs. mes anterior
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clientes nuevos</p>
              <h3 className="text-2xl font-bold mt-1">18</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-green-500">↑ 15%</span> vs. mes anterior
          </p>
        </Card>
      </div>

      {/* Botón para generar nueva venta */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Generar nueva venta</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Registra una nueva venta para que tu cliente pueda dejar una reseña
          verificada
        </p>
        <Link href={"/dashboard/sales/new"}>
          <Button className="w-full">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Generar nueva venta
          </Button>
        </Link>
      </Card>

      {/* Tabs para reseñas y ventas recientes */}
      <Tabs defaultValue="resenas" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resenas">Reseñas recientes</TabsTrigger>
          <TabsTrigger value="ventas">Ventas recientes</TabsTrigger>
        </TabsList>
        <TabsContent value="resenas" className="mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Reseñas recientes</h2>
              <Link href={"/dashboard/reviews"}>
                <Button
                  variant="link"
                  className="text-xs flex items-center p-0 h-auto"
                >
                  Ver todas
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{review.buyerId}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(review.createdAt, "d MMM yyyy", { locale: es })}
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <StarRating rating={review.rating} readOnly size={14} />
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="ventas" className="mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Ventas recientes</h2>
              <Link href={"/dashboard/sales"}>
                <Button
                  variant="link"
                  className="text-xs flex items-center p-0 h-auto"
                >
                  Ver todas
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calendario de actividad */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Actividad reciente</h2>
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar className="h-4 w-4 mr-1" />
            Este mes
          </Button>
        </div>
        <div className="h-48 flex items-center justify-center border rounded-md">
          <p className="text-muted-foreground">
            Gráfico de actividad (ventas y reseñas)
          </p>
        </div>
      </Card>
    </div>
  );
}
