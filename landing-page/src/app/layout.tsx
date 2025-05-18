import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Caserito - Construye tu reputación. Vende más.",
	description:
		"Caserito es una plataforma que ayuda a vendedores a construir y mostrar su reputación digital, mejorando la confianza de sus clientes y aumentando sus ventas.",
	icons: {
		icon: "/logo_caserito_customer.png",
		apple: "/logo_caserito_customer.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" className="scroll-smooth">
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
