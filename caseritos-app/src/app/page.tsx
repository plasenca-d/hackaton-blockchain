"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await signIn("google", {
        redirect: false,
      });

      router.push("/dashboard");
    } catch (err) {
      toast.error("Error al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo_caserito_customer.png"
              alt="Caserito Logo"
              width={150}
              height={150}
              priority
              className="rounded-2xl shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold text-caserito-blue mb-2">
            Bienvenido a Caserito
          </h1>
          <p className="text-muted-foreground text-lg">
            Crea confianza en tus ventas
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Accede a tu cuenta
          </h2>

          <Button
            onClick={handleGoogleLogin}
            className="w-full py-6 text-base flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"
            variant="outline"
            disabled={isLoading}
          >
            {!isLoading && <FaGoogle className="h-5 w-5 text-caserito-blue" />}
            Continuar con Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="text-caserito-green hover:underline">
              Términos de servicio
            </a>{" "}
            y{" "}
            <a href="#" className="text-caserito-green hover:underline">
              Política de privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
