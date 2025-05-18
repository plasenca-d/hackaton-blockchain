"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SaleIntentsSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 bg-green-100 rounded-full">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ¡Reseña Enviada!
          </h2>
          <p className="mt-4 text-md text-gray-600">
            Tu reseña ha sido guardada exitosamente y está siendo procesada.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Gracias por compartir tu experiencia con este producto. Tu opinión
            es valiosa para la comunidad de Caserito y ayudará a otros
            compradores a tomar decisiones informadas.
          </p>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">
              Verificación Blockchain
            </h3>
            <p className="text-sm text-blue-600">
              Tu reseña está siendo registrada en la blockchain para garantizar
              su autenticidad y transparencia.
            </p>
            <div className="mt-2 flex items-center justify-center">
              <div className="animate-pulse h-2 w-24 bg-blue-300 rounded"></div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
