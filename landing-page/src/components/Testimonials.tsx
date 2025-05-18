import React from "react";

interface TestimonialProps {
	content: string;
	author: string;
	role: string;
}

const Testimonial = ({ content, author, role }: TestimonialProps) => {
	return (
		<div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 relative">
			<div className="absolute top-4 left-4 text-blue-500 text-4xl opacity-20"></div>
			<div className="relative z-10">
				<p className="text-gray-700 mb-6 italic">{content}</p>
				<div className="flex items-center">
					<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
						<span className="text-blue-600 font-bold">
							{author
								.split(" ")
								.map((name) => name[0])
								.join("")}
						</span>
					</div>
					<div>
						<p className="font-bold">{author}</p>
						<p className="text-sm text-gray-500">{role}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Testimonials = () => {
	return (
		<section className="py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
						Historias de éxito de vendedores
					</h2>
					<p className="max-w-3xl mx-auto text-lg text-gray-600">
						Descubre cómo Caserito está ayudando a vendedores a construir su
						reputación y aumentar sus ventas.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<Testimonial
						content="Desde que tengo mi perfil en Caserito con todas mis reseñas visibles, mis clientes confían más en mí. He aumentado mis ventas en un 45% en solo 3 meses."
						author="Carlos Mendoza"
						role="Vendedor de accesorios"
					/>

					<Testimonial
						content="Mi negocio creció exponencialmente gracias a Caserito. Ahora puedo mostrar mi historial de ventas exitosas y los clientes nuevos me compran sin dudarlo."
						author="Ana Rodríguez"
						role="Emprendedora de ropa"
					/>

					<Testimonial
						content="Antes mis clientes tenían dudas para hacer el primer pedido. Con mi perfil verificado de Caserito y mis 50 reseñas positivas, ahora vendo el doble que antes."
						author="Miguel Sánchez"
						role="Vendedor de electrónicos"
					/>
				</div>
			</div>
		</section>
	);
};
