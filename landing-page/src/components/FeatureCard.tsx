import type React from "react";

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
	return (
		<div className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
			<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	);
};
