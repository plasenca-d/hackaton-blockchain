"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import { Card } from "@//components/ui/card";
import { Label } from "@//components/ui/label";

import { Button } from "@//components/ui/button";
import { Input } from "@//components/ui/input";
import { Textarea } from "@//components/ui/textarea";
import { ImageUploader } from "@//components/ui/image-uploader";

export default function NuevaVentaPage() {
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);

  const [productName, setProductName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto p-4 pb-20 md:pb-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Registrar nueva venta</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Productos</h2>

              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Nombre del Producto</Label>
                      <Input
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Ej: Torta de Chocolate"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descripcion">
                        Descripción del producto
                      </Label>
                      <Textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Describe tu producto..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Imagen del producto</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Sube una imagen clara de tu producto
                      </p>

                      {productImage && (
                        <div className="relative h-48 w-full mb-4">
                          <Image
                            src={URL.createObjectURL(productImage)}
                            alt="Imagen del producto"
                            fill
                            className="object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => setProductImage(null)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <ImageUploader onChange={(files) => {}} maxSize={5} />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!productName || !productImage}
                >
                  Publicar Producto
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Notas adicionales</h2>
              <Textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Notas o comentarios sobre la venta..."
                rows={3}
              />
            </Card>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Procesando venta..." : "Registrar venta"}
            </Button>
          </form>
        </div>
      </main>

      {/* Modal de validación con IA */}
      {validating && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
            <Loader2 className="h-12 w-12 text-caserito-blue animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Validando venta con IA</h3>
            <p className="text-muted-foreground mb-4">
              Estamos verificando que los datos e imágenes de la venta sean
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
