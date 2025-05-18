import Image from "next/image";
import React from "react";
import { Button } from "./Button";

export const Hero = () => {
	return (
		<section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row items-center">
					<div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
							Construye tu reputación.
							<span className="text-blue-600 block">Vende más.</span>
						</h1>
						<p className="text-lg text-gray-600 mb-8 max-w-lg">
							Caserito te ayuda a construir una sólida reputación digital que
							puedes compartir fácilmente, aumentando la confianza de tus
							clientes y mejorando tus ventas.
						</p>
						<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
							<Button className="text-lg">Crear mi perfil</Button>
							<Button primary={false} className="text-lg">
								Ver cómo funciona
							</Button>
						</div>
					</div>

					<div className="md:w-1/2 relative">
						<div className="w-full h-[500px] relative bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl overflow-hidden shadow-xl">
							<div className="absolute inset-0 flex items-center justify-center text-white">
								<div className="text-center px-8">
									<div className="mb-8 flex justify-center">
										<div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
											<div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-8 h-8 text-blue-600"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
													/>
												</svg>
											</div>
										</div>
									</div>
									<p className="text-xl mb-4">Perfil Público</p>
									<p className="opacity-80">
										Historial, calificaciones y reseñas
									</p>
								</div>
							</div>
						</div>

						{/* Floating Elements */}
						<div className="absolute -right-6 top-10 transform rotate-12 bg-white p-4 rounded-lg shadow-lg">
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
									<span
										role="img"
										aria-label="check"
										className="text-blue-600 text-xl"
									>
										✓
									</span>
								</div>
								<div>
									<p className="font-bold">Pago seguro</p>
									<p className="text-xs text-gray-500">
										Liberación después de entrega
									</p>
								</div>
							</div>
						</div>

						<div className="absolute -left-6 bottom-10 transform -rotate-6 bg-white p-4 rounded-lg shadow-lg">
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
									<span
										role="img"
										aria-label="star"
										className="text-yellow-600 text-xl"
									>
										★
									</span>
								</div>
								<div>
									<p className="font-bold">Reputación verificada</p>
									<p className="text-xs text-gray-500">
										Calificación transparente
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
