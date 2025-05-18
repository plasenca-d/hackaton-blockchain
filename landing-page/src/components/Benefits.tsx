import React from "react";

interface BenefitProps {
	title: string;
	description: string;
	imageSrc: string;
	reverse?: boolean;
}

const Benefit = ({
	title,
	description,
	imageSrc,
	reverse = false,
}: BenefitProps) => {
	return (
		<div
			className={`flex flex-col ${
				reverse ? "md:flex-row-reverse" : "md:flex-row"
			} items-center gap-12`}
		>
			<div className="md:w-1/2">
				<div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl p-1 shadow-xl">
					<div className="bg-blue-50 rounded-lg overflow-hidden h-80 flex items-center justify-center">
						<div className="text-center p-10">
							<p className="text-blue-600 font-semibold text-lg mb-2">
								Imagen representativa
							</p>
							<p className="text-gray-500">{imageSrc}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="md:w-1/2">
				<h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
				<p className="text-gray-600 text-lg">{description}</p>
			</div>
		</div>
	);
};

export const Benefits = () => {
	return (
		<section id="benefits" className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
						Potencia tu perfil de vendedor
					</h2>
					<p className="max-w-3xl mx-auto text-lg text-gray-600">
						Construye una reputación digital sólida que aumente la confianza de
						tus clientes y te ayude a incrementar tus ventas.
					</p>
				</div>

				<div className="space-y-24">
					<Benefit
						title="Página de perfil completa y profesional"
						description="Obtén un perfil público que muestra tu historial de ventas, puntuación y reseñas detalladas que puedes compartir con un simple enlace o código QR en tus redes sociales."
						imageSrc="Ilustración de perfil con reseñas"
					/>

					<Benefit
						title="Historial de ventas verificable"
						description="Cada transacción exitosa construye tu reputación digital inmutable en blockchain. Tus clientes pueden verificar fácilmente tu historial de entregas exitosas antes de comprar."
						imageSrc="Ilustración de historial verificado"
						reverse
					/>

					<Benefit
						title="Incrementa tus ganancias"
						description="Los vendedores con perfiles verificados y buenas calificaciones pueden cobrar hasta un 20% más por sus productos, ya que los clientes están dispuestos a pagar más por la seguridad y confianza."
						imageSrc="Ilustración de crecimiento de ventas"
					/>
				</div>
			</div>
		</section>
	);
};
