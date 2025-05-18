import React from "react";

export default function SaleIntentsSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-500">
            <svg
              className="h-full w-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ¡Revisión Enviada!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tu revisión ha sido guardada exitosamente. Te enviaremos un correo
            electrónico cuando hayamos validado tu información.
          </p>
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Por favor, revisa tu bandeja de entrada en los próximos días.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
