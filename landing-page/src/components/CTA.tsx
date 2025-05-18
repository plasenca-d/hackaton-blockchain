import React from "react";
import { Button } from "./Button";

export const CTA = () => {
	return (
		<section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-3xl font-bold sm:text-4xl mb-6">
					Construye Tu Reputación Digital
				</h2>
				<p className="max-w-2xl mx-auto text-lg text-blue-100 mb-10">
					Crea tu perfil de vendedor profesional hoy mismo y comienza a acumular
					reseñas positivas que te ayudarán a vender más.
				</p>

				<div className="flex flex-col sm:flex-row justify-center gap-4">
					<Button className="bg-white text-blue-600 hover:bg-blue-50">
						Crear mi perfil de vendedor
					</Button>
					<Button className="bg-blue-500 hover:bg-blue-400">
						Ver ejemplos de perfiles
					</Button>
				</div>
			</div>
		</section>
	);
};
