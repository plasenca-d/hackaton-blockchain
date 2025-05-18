import React from "react";
import { BuyerIcon, SellerIcon, StarIcon } from "./Icons";

const Step = ({
	number,
	title,
	description,
}: {
	number: number;
	title: string;
	description: string;
}) => (
	<div className="flex">
		<div className="mr-4">
			<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
				{number}
			</div>
		</div>
		<div>
			<h3 className="font-bold text-xl mb-2">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	</div>
);

export const HowItWorks = () => {
	return (
		<section id="how-it-works" className="py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
						¿Cómo construir tu reputación con Caserito?
					</h2>
					<p className="max-w-3xl mx-auto text-lg text-gray-600">
						Proceso simple para crear un perfil de vendedor confiable que
						atraiga más clientes.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
					{/* Sellers */}
					<div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
						<div className="flex items-center mb-8">
							<SellerIcon className="w-10 h-10 text-blue-600 mr-4" />
							<h3 className="text-2xl font-bold">Crea tu Perfil de Vendedor</h3>
						</div>

						<div className="space-y-8">
							<Step
								number={1}
								title="Regístrate en Caserito"
								description="Crea tu perfil de vendedor y obtén tu Identidad Digital única en blockchain."
							/>
							<Step
								number={2}
								title="Personaliza tu perfil"
								description="Agrega fotos de tus productos, descripción de tu negocio y enlaces a tus redes sociales."
							/>
							<Step
								number={3}
								title="Construye tu perfil público"
								description="Acumula ventas y reseñas que se muestran automáticamente en tu página de perfil público para generar confianza."
							/>
							<Step
								number={4}
								title="Acumula reseñas positivas"
								description="Con cada venta exitosa, tus clientes dejan calificaciones que construyen tu reputación."
							/>
							<Step
								number={5}
								title="Comparte tu perfil"
								description="Comparte tu código QR y enlace de perfil en redes sociales para ampliar tu alcance."
							/>
						</div>
					</div>

					{/* Profile Benefits */}
					<div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
						<div className="flex items-center mb-8">
							<StarIcon className="w-10 h-10 text-blue-600 mr-4" />
							<h3 className="text-2xl font-bold">Beneficios de tu Perfil</h3>
						</div>

						<div className="space-y-8">
							<Step
								number={1}
								title="Genera confianza instantánea"
								description="Tus clientes pueden ver tu historial de ventas y calificaciones verificadas antes de comprar."
							/>
							<Step
								number={2}
								title="Diferénciate de la competencia"
								description="Un perfil con buenas reseñas te hace destacar entre vendedores sin historial verificable."
							/>
							<Step
								number={3}
								title="Portabilidad total"
								description="Tu reputación no está atada a ninguna plataforma específica, es completamente portable."
							/>
							<Step
								number={4}
								title="Aumenta tus ventas"
								description="Los compradores prefieren adquirir productos de vendedores con historiales verificables."
							/>
							<Step
								number={5}
								title="Crece tu negocio"
								description="Con una reputación sólida, podrás expandir tu catálogo y aumentar tus precios con respaldo."
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
