"use client";

import { Textarea } from "@/components/ui/textarea";

import { StarRating } from "@/components/ui/star-rating";
import {
  ReviewFormSchema,
  useReviewForm,
} from "@/features/reviews/hooks/useReviewForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SaleIntentPage() {
  const { form } = useReviewForm();

  const onUploadSuccess = (url: string) => {
    form.setValue("photoUrl", url);
  };

  const photoUrl = form.watch("photoUrl");

  const handleSubmit = (data: z.infer<typeof ReviewFormSchema>) => {
    toast.success("Venta registrada con éxito");

    // TODO: call an action to send the review and send to the model
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 flex items-center justify-center">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Sección de Detalles del Producto */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <img
                src="/placeholder-product.jpg"
                alt="Product"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Product Name
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Product description goes here...
              </p>
            </div>
          </div>

          {/* Sección del Formulario de Reseña */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Califica tu Experiencia
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Tu opinión nos ayuda a mejorar nuestros productos y servicios
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calificación</FormLabel>
                          <FormControl>
                            <StarRating
                              rating={field.value}
                              onChange={(rating) => field.onChange(rating)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tu Reseña</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full min-h-[100px] sm:min-h-[120px] rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="Cuéntanos tu experiencia con el producto..."
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
                                  onClick={() => form.setValue("photoUrl", "")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <Button
                              type="button"
                              onClick={() => open()}
                              className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

                  <Button
                    type="submit"
                    className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Enviar Reseña
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
