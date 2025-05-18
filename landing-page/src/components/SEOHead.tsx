import Head from "next/head";
import React from "react";

interface SEOHeadProps {
	title?: string;
	description?: string;
	canonical?: string;
	ogType?: string;
	ogImage?: string;
}

export const SEOHead = ({
	title = "Caserito - Construye tu reputación. Vende más.",
	description = "Caserito es una plataforma que ayuda a vendedores a construir y mostrar su reputación digital, mejorando la confianza de sus clientes y aumentando sus ventas.",
	canonical = "https://caserito.app",
	ogType = "website",
	ogImage = "/og-image.png",
}: SEOHeadProps) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={canonical} />

			{/* Open Graph / Facebook */}
			<meta property="og:type" content={ogType} />
			<meta property="og:url" content={canonical} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={ogImage} />

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={canonical} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={ogImage} />

			{/* Favicon */}
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon-16x16.png"
			/>
			<link rel="manifest" href="/site.webmanifest" />
		</Head>
	);
};
