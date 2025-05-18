import React from "react";
import { Button } from "./Button";
import { LogoIcon } from "./Icons";

export const Header = () => {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<LogoIcon />
						<span className="ml-2 text-xl font-bold text-blue-600">
							Caserito
						</span>
					</div>

					<nav className="hidden md:flex space-x-8">
						<a
							href="#features"
							className="text-gray-600 hover:text-blue-600 transition-colors"
						>
							Características
						</a>
						<a
							href="#how-it-works"
							className="text-gray-600 hover:text-blue-600 transition-colors"
						>
							Cómo funciona
						</a>
						<a
							href="#benefits"
							className="text-gray-600 hover:text-blue-600 transition-colors"
						>
							Beneficios
						</a>
					</nav>

					<div className="flex space-x-4">
						<Button primary={false} className="hidden md:block">
							Iniciar Sesión
						</Button>
						<Button>Registrarse</Button>
					</div>
				</div>
			</div>
		</header>
	);
};
