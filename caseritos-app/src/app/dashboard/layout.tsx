import Image from "next/image";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, ShoppingBag, Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/");

  const sellerData = {
    id: "v001",
    name: session?.user?.name || "Nombre de usuario",
    avatar: session?.user?.image || "/placeholder.svg",
    storeName: "Frutas y Verduras Orgánicas",
    description:
      "Vendo frutas y verduras orgánicas cultivadas en mi huerto familiar. Productos frescos y de temporada.",
    place: "Mercado Central, Puesto #42",
    memberSince: new Date(2023, 2, 15),
    averageRating: 4.7,
    totalReviews: 28,
    ventasMes: 42,
    monthEarnings: 1250,
  };

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
              <Link href="/dashboard/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                  <span className="ml-2 hidden sm:inline">Mi Perfil</span>
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={sellerData.avatar} alt={sellerData.name} />
                  <AvatarFallback>{sellerData.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar en pantallas medianas y grandes */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <div className="flex flex-col items-center mb-6 p-4">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={sellerData.avatar} alt={sellerData.name} />
                  <AvatarFallback>{sellerData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-bold text-center">
                  {sellerData.name}
                </h2>
                <p className="text-sm text-muted-foreground text-center">
                  {sellerData.storeName}
                </p>
                <div className="flex items-center mt-2">
                  <StarRating
                    rating={Math.round(sellerData.averageRating)}
                    readOnly
                    size={16}
                  />
                  <span className="ml-2 text-sm">
                    {sellerData.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                <Link href={"/dashboard"}>
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href={"/dashboard/sales"}>
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Ventas
                  </Button>
                </Link>

                <Link href={"/dashboard/reviews"}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="h-5 w-5 mr-2" />
                    Reseñas
                  </Button>
                </Link>

                <Link href={"/dashboard/profile"}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-5 w-5 mr-2" />
                    Mi Perfil
                  </Button>
                </Link>
              </nav>
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </main>

      {/* Barra de navegación móvil */}
      <div className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around p-2">
          <Link href={"/dashboard"}>
            <Button variant="ghost" className="flex flex-col items-center p-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Button>
          </Link>
          <Link href={"/dashboard/sales"}>
            <Button variant="ghost" className="flex flex-col items-center p-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs mt-1">Ventas</span>
            </Button>
          </Link>
          <Link href={"/dashboard/reviews"}>
            <Button variant="ghost" className="flex flex-col items-center p-2">
              <Star className="h-5 w-5" />
              <span className="text-xs mt-1">Reseñas</span>
            </Button>
          </Link>

          <Link href={"/dashboard/profile"}>
            <Button variant="ghost" className="flex flex-col items-center p-2">
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Perfil</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
