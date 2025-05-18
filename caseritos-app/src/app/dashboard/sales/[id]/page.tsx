"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Calendar,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSaleIntent } from "@/features/sales/actions/get-sale-intent.action";

interface SaleIntent {
  id: string;
  productName: string;
  productDescription: string;
  photoUrl: string | null;
  createdAt: string;
  status: string;
  saleId: string;
  reviewId: string | null;
}

export default function DetalleVentaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [sale, setSale] = useState<SaleIntent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    async function fetchSaleIntent() {
      try {
        const saleData = await getSaleIntent(params.id);
        if (saleData) {
          setSale(saleData);
        } else {
          setError("No se encontró la venta solicitada");
        }
      } catch (err) {
        setError(
          `Error al cargar los detalles de la venta: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSaleIntent();
  }, [params.id]);
  +useEffect(() => {
    if (typeof window !== "undefined" && sale) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/sales-intents/${sale.id}`);
    }
  }, [sale]);

  const copyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caserito-green"></div>
        <p className="mt-4 text-muted-foreground">
          Cargando detalles de la venta...
        </p>
      </div>
    );
  }

  console.log(sale);

  if (error || !sale) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/sales")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
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
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4">
          <Card className="p-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p className="text-muted-foreground mb-6">
                {error || "No se encontró la venta solicitada"}
              </p>
              <Button onClick={() => router.push("/dashboard/sales")}>
                Volver a ventas
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/sales")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 pb-20 md:pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Detalle de venta</h1>
              <p className="text-muted-foreground">ID: {sale.id}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/sales")}
              >
                Volver a ventas
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Producto */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-caserito-green" />
                  Producto
                </h2>

                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="p-4">
                      <h3 className="font-medium">{sale.productName}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {sale.productDescription}
                      </p>

                      {sale.photoUrl && (
                        <div className="mt-4">
                          <img
                            src={sale.photoUrl}
                            alt={sale.productName}
                            className="w-full h-48 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Fecha y Estado */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-caserito-green" />
                  Información
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">
                      Fecha de creación
                    </p>
                    <p className="font-medium">
                      {new Date(sale.createdAt).toLocaleDateString("es", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          sale.status === "COMPLETED"
                            ? "bg-green-500"
                            : sale.status === "CANCELLED"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      ></span>
                      <p className="font-medium">
                        {sale.status === "COMPLETED"
                          ? "Completado"
                          : sale.status === "CANCELLED"
                          ? "Cancelado"
                          : "Pendiente"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Enlace para compartir */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">
                  Enlace para el cliente
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                    <span className="flex-1 text-sm overflow-hidden text-ellipsis">
                      {shareUrl || `Cargando enlace...`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyLink}
                      className="shrink-0"
                    >
                      {linkCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Comparte este enlace con tu cliente para que pueda realizar
                    el pago.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
