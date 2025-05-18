"use client";

import type React from "react";

import { CldUploadWidget } from "next-cloudinary";
import { Card } from "@//components/ui/card";
import { Label } from "@//components/ui/label";

import { Button } from "@//components/ui/button";
import { Input } from "@//components/ui/input";
import { Textarea } from "@//components/ui/textarea";
import {
  NewSaleFormSchema,
  useNewSaleForm,
} from "@/features/sales/hooks/useNewSaleForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewSalePage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [SaleIntentInclude, setSaleIntentInclude] = useState("");
  const { form, isLoading } = useNewSaleForm();
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const photoUrl = form.watch("photoUrl");

  const onUploadSuccess = (url: string) => {
    form.setValue("photoUrl", url);
    setValidationError(null);
  };

  const handleSubmit = async (values: z.infer<typeof NewSaleFormSchema>) => {
    try {
      setValidating(true);
      setValidationError(null);

      const { validateProductDescription } = await import(
        "@/features/sales/actions/validate-product-description.action"
      );

      if (!values.photoUrl) {
        setValidationError("Se requiere una imagen del producto");
        setValidating(false);
        return;
      }

      const loadingToast = toast.loading(
        "Validando la descripción del producto..."
      );

      const validationResult = await validateProductDescription(
        values.productDescription,
        values.photoUrl
      );

      toast.dismiss(loadingToast);

      if (!validationResult.accurate) {
        setValidationError(
          `La descripción no coincide con la imagen: ${validationResult.explanation}`
        );
        toast.error("La descripción del producto no coincide con la imagen");
        setValidating(false);
        return;
      }

      toast.success("Descripción del producto validada");

      // Create sale intent after validation is successful
      const creatingToast = toast.loading("Registrando la venta...");

      const { createSaleIntent } = await import(
        "@/features/sales/actions/create-sale-intent.action"
      );

      const saleIntentId = await createSaleIntent({
        productName: values.productName,
        productDescription: values.productDescription,
        photoUrl: values.photoUrl,
      });

      toast.dismiss(creatingToast);

      setSaleIntentInclude(saleIntentId);
      setShowModal(true);
      toast.success("Venta registrada con éxito");
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      toast.error("Ha ocurrido un error al procesar la venta");
    } finally {
      setValidating(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 container mx-auto p-4 pb-20 md:pb-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Registrar nueva venta</h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-4">Productos</h2>

                  <div className="space-y-6">
                    <div className="border rounded-md p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre de Producto</FormLabel>
                                <FormControl>
                                  <Input
                                    id="productName"
                                    {...field}
                                    placeholder="Ej: Torta de Chocolate"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="productDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Descripción del producto</FormLabel>
                                <FormControl>
                                  <Textarea
                                    id="descripcion"
                                    {...field}
                                    placeholder="Describe tu producto..."
                                    rows={3}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Imagen del producto</Label>
                          <p className="text-xs text-muted-foreground mb-2">
                            Sube una imagen clara de tu producto
                          </p>

                          <CldUploadWidget
                            uploadPreset={
                              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                            }
                            onSuccess={(result) => {
                              if (
                                typeof result.info === "object" &&
                                "secure_url" in result.info
                              ) {
                                onUploadSuccess(result.info.secure_url);
                              }
                            }}
                            options={{
                              singleUploadAutoClose: true,
                            }}
                          >
                            {({ open }) => {
                              return (
                                <div>
                                  {photoUrl && (
                                    <div className="relative h-48 w-full mb-4">
                                      <img
                                        src={photoUrl}
                                        alt="Imagen del producto"
                                        className="w-full h-full object-cover rounded-md"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                        onClick={() =>
                                          form.setValue("photoUrl", "")
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                  <Button
                                    type="button"
                                    onClick={() => open()}
                                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  >
                                    Subir Imagen
                                  </Button>
                                </div>
                              );
                            }}
                          </CldUploadWidget>
                          {form.formState.errors.photoUrl && (
                            <p className="text-red-500 text-sm">
                              {form.formState.errors.photoUrl.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || validating}
                >
                  {validating
                    ? "Validando descripción..."
                    : isLoading
                    ? "Procesando venta..."
                    : "Registrar venta"}
                </Button>

                {validationError && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100 mt-2">
                    <p className="font-semibold">Error de validación:</p>
                    <p>{validationError}</p>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </main>
      </div>

      <Dialog open={showModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Venta registrada con éxito!</DialogTitle>
            <DialogDescription className="space-y-4">
              <span className="mb-4 block">
                Tu venta ha sido registrada. Comparte este enlace con tu cliente
                para que pueda realizar el pago:
              </span>
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                <code className="flex-1 text-sm break-all">
                  https://caseritos.app/sales-intents/{SaleIntentInclude}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://caseritos.app/sales-intents/${SaleIntentInclude}`
                    );
                    toast.success("¡Enlace copiado!");
                  }}
                >
                  Copiar
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                El enlace estará activo por 24 horas.
              </p>
            </DialogDescription>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  router.push("/dashboard");
                }}
              >
                Ir al dashboard
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  router.push(`/dashboard/sales/${SaleIntentInclude}`);
                }}
              >
                Ver detalles de la venta
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
