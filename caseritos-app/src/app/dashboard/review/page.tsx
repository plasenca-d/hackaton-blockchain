import { Star } from "lucide-react";

export default function ReviewsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="flex justify-center mb-4">
          <Star className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No hay reseñas para revisar
        </h2>
        <p className="text-gray-500">
          Cuando recibas reseñas de tus clientes, aparecerán aquí.
        </p>
      </div>
    </div>
  );
}
