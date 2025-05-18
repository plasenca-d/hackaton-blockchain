"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Calendar,
  ShoppingBag,
  Plus,
  Trash2,
} from "lucide-react";
import { Card } from "@//components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@//components/ui/button";

// Datos de ejemplo para la venta
const ventaEjemplo = {
  id: "v1",
  cliente: {
    nombre: "Laura Martínez",
    telefono: "+1234567890",
    email: "laura@ejemplo.com",
  },
  productos: [
    {
      id: "p1",
      nombre: "Manzanas",
      precio: 2.5,
      cantidad: 2,
      unidad: "kg",
      subtotal: 5.0,
      descripcion:
        "Manzanas rojas orgánicas, frescas y jugosas. Cultivadas sin pesticidas.",
      imagenes: ["/market-products.png"],
    },
    {
      id: "p2",
      nombre: "Naranjas",
      precio: 1.8,
      cantidad: 1,
      unidad: "kg",
      subtotal: 1.8,
      descripcion: "Naranjas de Valencia, dulces y jugosas. Ideales para zumo.",
      imagenes: ["/vibrant-fruit-market.png"],
    },
  ],
  total: 6.8,
  fecha: new Date(2025, 3, 22),
  estado: "completada",
  enlace: "https://caserito.app/review/v1",
  tieneResena: true,
  resena: {
    cliente: "Laura Martínez",
    rating: 5,
    texto:
      "Excelentes productos, muy frescos y de gran calidad. La entrega fue puntual y todo llegó en perfecto estado.",
    fecha: new Date(2025, 3, 23),
    imagen: "/market-products.png",
  },
  notas: "Entrega a domicilio. Cliente habitual.",
};

export default async function DetalleVentaPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const router = useRouter();
  const [venta] = useState(ventaEjemplo);
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const copyLink = () => {
    navigator.clipboard.writeText(venta.enlace);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    setToast({
      message: "Enlace copiado al portapapeles",
      type: "success",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/sales")}
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
              <p className="text-muted-foreground">ID: {venta.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Productos - Formulario interactivo */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-caserito-green" />
                  Productos
                </h2>

                <div className="space-y-6">
                  {venta.productos.map((producto, index) => (
                    <div
                      key={index}
                      className="border rounded-md overflow-hidden relative"
                    >
                      {/* Botón para eliminar producto completo */}
                      <button
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10"
                        onClick={() => {
                          // Lógica para eliminar el producto completo
                          const nuevosProductos = [...venta.productos];
                          nuevosProductos.splice(index, 1);
                          // Aquí iría la actualización del estado
                          setToast({
                            message: "Producto eliminado",
                            type: "success",
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="p-4">
                        <div className="flex justify-between mb-2">
                          <input
                            type="text"
                            defaultValue={producto.nombre}
                            className="font-medium bg-transparent border-b border-dashed border-gray-300 focus:border-caserito-blue focus:outline-none"
                            placeholder="Nombre del producto"
                          />
                          <div className="flex items-center">
                            <input
                              type="number"
                              defaultValue={producto.subtotal.toFixed(2)}
                              className="font-bold w-20 text-right bg-transparent border-b border-dashed border-gray-300 focus:border-caserito-blue focus:outline-none"
                              step="0.01"
                            />
                            <span className="font-bold ml-1">$</span>
                          </div>
                        </div>

                        <div className="flex items-center mb-3">
                          <input
                            type="number"
                            defaultValue={producto.cantidad}
                            className="w-16 text-sm text-muted-foreground bg-transparent border-b border-dashed border-gray-300 focus:border-caserito-blue focus:outline-none"
                            min="0.1"
                            step="0.1"
                          />
                          <select
                            defaultValue={producto.unidad}
                            className="ml-2 text-sm text-muted-foreground bg-transparent border-b border-dashed border-gray-300 focus:border-caserito-blue focus:outline-none"
                          >
                            <option value="kg">kg</option>
                            <option value="unidad">unidad</option>
                            <option value="litro">litro</option>
                            <option value="docena">docena</option>
                          </select>
                          <span className="mx-2 text-sm text-muted-foreground">
                            → Subtotal:
                          </span>
                        </div>

                        <div className="mb-4">
                          <textarea
                            defaultValue={producto.descripcion || ""}
                            placeholder="Describe el estado y características del producto..."
                            className="w-full text-sm bg-transparent border border-dashed border-gray-300 rounded-md p-2 focus:border-caserito-blue focus:outline-none"
                            rows={2}
                          />
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Imágenes del producto:
                          </p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {producto.imagenes.map((img, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="relative h-20 w-20 flex-shrink-0 group"
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`Imagen ${imgIndex + 1}`}
                                  fill
                                  className="object-cover rounded-md"
                                />
                                <button
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    // Lógica para eliminar imagen
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            <div className="h-20 w-20 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-caserito-blue transition-colors">
                              <Plus className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Botón para agregar nuevo producto */}
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      // Lógica para agregar nuevo producto
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Agregar producto
                  </Button>
                </div>

                <div className="border-t mt-6 pt-4 flex justify-between items-center">
                  <p className="font-bold">Total:</p>
                  <p className="text-2xl font-bold">
                    ${venta.total.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button className="bg-caserito-green hover:bg-caserito-green/90">
                    Guardar cambios
                  </Button>
                </div>
              </Card>

              {/* Enlace para reseña */}
              {!venta.tieneResena && venta.estado !== "rechazada" && (
                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-4">Enlace para reseña</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comparte este enlace con tu cliente para que pueda confirmar
                    la recepción y dejar su reseña.
                  </p>
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-l-md p-3 flex-1 truncate text-sm">
                      {venta.enlace}
                    </div>
                    <Button
                      onClick={copyLink}
                      className="rounded-l-none"
                      variant="default"
                    >
                      {linkCopied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Notas */}
              {venta.notas && (
                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-4">Notas</h2>
                  <p>{venta.notas}</p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Información de la venta */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Detalles</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Fecha:{" "}
                      {format(venta.fecha, "d MMMM yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Acciones */}
              <Card className="p-6 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold mb-4">Acciones</h2>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-caserito-green hover:bg-caserito-green/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    onClick={() => {
                      // Generar un ID único para la nueva venta
                      const uniqueId = `v-${Date.now().toString(
                        36
                      )}-${Math.random().toString(36).substring(2, 7)}`;
                      // Redireccionar al formulario de reseña con el ID único
                      router.push(`/review/${uniqueId}?mode=new`);

                      // Mostrar toast de confirmación
                      setToast({
                        message: "Redirigiendo al formulario de reseña...",
                        type: "success",
                      });
                    }}
                  >
                    <Plus className="h-5 w-5" />
                    Generar nueva venta
                    <span className="absolute right-3 text-xs opacity-70">
                      →
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    onClick={() => router.push("/sales")}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Volver a ventas
                  </Button>

                  <div className="pt-2 border-t mt-2">
                    <Button
                      variant="ghost"
                      className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        if (
                          confirm(
                            "¿Estás seguro de que deseas eliminar esta venta?"
                          )
                        ) {
                          // Aquí iría la lógica para eliminar la venta
                          setToast({
                            message: "Venta eliminada correctamente",
                            type: "success",
                          });
                          router.push("/sales");
                        }
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                      Eliminar venta
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Al generar una nueva venta, se creará un enlace único para
                    que el cliente pueda dejar su reseña y subir imágenes.
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
