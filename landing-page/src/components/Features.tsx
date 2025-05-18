import React from "react";
import { FeatureCard } from "./FeatureCard";
import {
	BlockchainIcon,
	IdentityIcon,
	ShieldIcon,
	StarIcon,
	WalletIcon,
} from "./Icons";

export const Features = () => {
	return (
		<section id="features" className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
						¿Por qué los vendedores aman Caserito?
					</h2>
					<p className="max-w-3xl mx-auto text-lg text-gray-600">
						Caserito te permite construir y mostrar una reputación sólida que
						incrementa la confianza y te ayuda a vender más.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<FeatureCard
						icon={<ShieldIcon className="w-7 h-7" />}
						title="Perfil profesional compartible"
						description="Crea un perfil que destaque tu reputación y puedas compartir fácilmente con potenciales clientes."
					/>

					<FeatureCard
						icon={<StarIcon className="w-7 h-7" />}
						title="Reputación verificable"
						description="Acumula calificaciones positivas de clientes que construirán tu credibilidad y generarán confianza instantánea."
					/>

					<FeatureCard
						icon={<BlockchainIcon className="w-7 h-7" />}
						title="Reputación inmutable en blockchain"
						description="Tu historial está asegurado en blockchain, no puede ser manipulado o borrado, lo que genera mayor confianza en tus clientes."
					/>

					<FeatureCard
						icon={<IdentityIcon className="w-7 h-7" />}
						title="Independencia de plataformas"
						description="Tu reputación es portable, no depende de Instagram, Facebook o cualquier otra red social, te pertenece a ti."
					/>

					<FeatureCard
						icon={<WalletIcon className="w-7 h-7" />}
						title="Compatible con métodos de pago locales"
						description="Integrado con Yape, Plin y transferencias bancarias, los métodos preferidos en Perú."
					/>

					<FeatureCard
						icon={<StarIcon className="w-7 h-7" />}
						title="Página de perfil completa"
						description="Tu perfil público muestra tu historial de ventas, calificación promedio y reseñas detalladas de tus clientes para generar confianza."
					/>
				</div>
			</div>
		</section>
	);
};
