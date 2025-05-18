"use client";

import { Textarea } from "@/components/ui/textarea";

import { StarRating } from "@/components/ui/star-rating";

export default function SaleIntentPage() {
  // TODO: get data from server

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

              <form className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Calificación
                  </label>
                  <StarRating rating={4} onChange={(rating) => {}} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tu Reseña
                  </label>
                  <Textarea
                    className="w-full min-h-[100px] sm:min-h-[120px] rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Cuéntanos tu experiencia con el producto..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Fotos del Producto
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Comparte fotos de tu experiencia con el producto
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center px-2 py-3 sm:pt-5 sm:pb-6 text-center">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500">
                          <span className="font-semibold">
                            Haz clic para subir
                          </span>{" "}
                          o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG o GIF (MAX. 2MB)
                        </p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Enviar Reseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
