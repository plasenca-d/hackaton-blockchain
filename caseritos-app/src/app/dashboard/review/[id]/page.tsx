"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@//components/ui/avatar";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@//components/ui/card";
import { Label } from "@//components/ui/label";
import { Input } from "@//components/ui/input";
import { StarRating } from "@//components/ui/star-rating";
import { Textarea } from "@//components/ui/textarea";
import { ImageUploader } from "@//components/ui/image-uploader";
import { Button } from "@//components/ui/button";

// Datos de ejemplo para la venta (en un caso real, esto vendría de la base de datos)
const ventaEjemplo = {
  id: "v-123456",
  vendedor: {
    id: "v001",
    nombre: "María López",
    avatar: "/diverse-woman-avatar.png",
    tienda: "Frutas y Verduras Orgánicas",
  },
  productos: [
    {
      nombre: "Manzanas",
      cantidad: 2,
      unidad: "kg",
      descripcion:
        "Manzanas rojas orgánicas, frescas y jugosas. Cultivadas sin pesticidas.",
      imagenes: ["/market-products.png"],
    },
    {
      nombre: "Naranjas",
      cantidad: 1,
      unidad: "kg",
      descripcion: "Naranjas de Valencia, dulces y jugosas. Ideales para zumo.",
      imagenes: ["/vibrant-fruit-market.png"],
    },
  ],
  total: 15.5,
  fecha: new Date(),
};

export default async function DejarResena(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "invalid-link"
  >("success");
  const [ventaData, setVentaData] = useState<typeof ventaEjemplo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Simulación de verificación del enlace único
  useEffect(() => {
    const verificarEnlace = async () => {
      setLoading(true);
      try {
        // Simulación de verificación del enlace con el backend
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulamos que el enlace es válido solo si corresponde a una venta real
        // En un entorno real, esto verificaría en la base de datos si el ID corresponde a una venta existente
        const esValido =
          params.id.startsWith("v-") ||
          ["v1", "v2", "v3", "v4", "v5", "v6"].includes(params.id);

        if (esValido) {
          setVentaData(ventaEjemplo);
        } else {
          setModalType("invalid-link");
          setShowModal(true);
        }
      } catch (error) {
        setModalType("invalid-link");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    verificarEnlace();
  }, [params.id]);

  // Validación del formulario
  const isFormValid =
    rating > 0 &&
    reviewText.length >= 10 &&
    image !== null &&
    clientName.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que la imagen sea obligatoria
    if (!image) {
      setImageError("La imagen es obligatoria para dejar una reseña");
      return;
    }

    if (!isFormValid) return;

    setIsSubmitting(true);
    setIsValidating(true);

    try {
      // Simulación de validación con IA
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulamos un rechazo aleatorio para demostración
      if (Math.random() > 0.7) {
        setModalType("error");
        setShowModal(true);
      } else {
        setModalType("success");
        setShowModal(true);
      }
    } finally {
      setIsSubmitting(false);
      setIsValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-caserito-blue animate-spin mb-4" />
        <p className="text-muted-foreground">Verificando enlace...</p>
      </div>
    );
  }

  if (!ventaData && !showModal) {
    return null; // No renderizar nada si no hay datos y no se muestra el modal
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-center">
            <Image
              src="/logo_caserito_customer.png"
              alt="Caserito Logo"
              width={60}
              height={60}
              className="rounded-xl"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-3xl mx-auto p-4">
        {ventaData && (
          <>
            <div className="flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-caserito-green mr-2" />
              <h1 className="text-2xl font-bold text-center">
                Confirmar recepción y dejar reseña
              </h1>
            </div>
            <p className="text-center text-muted-foreground mb-6">
              Esta reseña está vinculada a una venta específica. Solo puedes
              dejar reseñas para productos que hayas comprado.
            </p>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage
                    src={ventaData.vendedor.avatar || "/placeholder.svg"}
                    alt={ventaData.vendedor.nombre}
                  />
                  <AvatarFallback>
                    {ventaData.vendedor.nombre.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-medium">
                    {ventaData.vendedor.nombre}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {ventaData.vendedor.tienda}
                  </p>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h3 className="font-medium mb-3">Productos recibidos:</h3>

                <div className="space-y-4">
                  {ventaData.productos.map((producto, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{producto.nombre}</h4>
                        <p className="text-sm">
                          {producto.cantidad} {producto.unidad}
                        </p>
                      </div>

                      {producto.descripcion && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {producto.descripcion}
                        </p>
                      )}

                      {producto.imagenes && producto.imagenes.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Imágenes del producto:
                          </p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {producto.imagenes.map((img, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="relative h-16 w-16 flex-shrink-0 cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`Imagen ${imgIndex + 1} de ${
                                    producto.nombre
                                  }`}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Por favor, confirma que has recibido estos productos y deja tu
                reseña a continuación.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Label>Tu nombre</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    ¿Cómo calificarías a este vendedor?
                  </label>
                  <StarRating
                    rating={rating}
                    onChange={setRating}
                    size={32}
                    className="py-2"
                  />
                  {rating === 0 && (
                    <p className="text-sm text-red-500">
                      Por favor, selecciona una calificación
                    </p>
                  )}
                </div>

                <Label>Tu experiencia con este vendedor</Label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Describe tu experiencia de compra, la calidad de los productos, la atención recibida..."
                  minLength={10}
                  rows={4}
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Imagen del producto recibido{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Sube una imagen del producto que recibiste para verificar la
                    entrega
                  </p>
                  <ImageUploader
                    onChange={(file) => {
                      setImage(file);
                      setImageError(file ? "" : "La imagen es obligatoria");
                    }}
                    maxSize={5}
                  />
                  {imageError && (
                    <p className="text-sm text-red-500">{imageError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  Confirmar recepción y publicar reseña
                </Button>
              </form>
            </div>
          </>
        )}
      </main>

      {/* Modal de validación con IA */}
      {isValidating && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
            <Loader2 className="h-12 w-12 text-caserito-blue animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Validando reseña con IA</h3>
            <p className="text-muted-foreground mb-4">
              Estamos verificando que la imagen y el texto de la reseña sean
              coherentes...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-caserito-green h-2.5 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
