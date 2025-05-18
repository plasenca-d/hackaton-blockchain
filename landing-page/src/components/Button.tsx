import type { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	primary?: boolean;
	className?: string;
	onClick?: () => void;
}

export const Button = ({
	children,
	primary = true,
	className = "",
	onClick,
}: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`px-6 py-3 rounded-lg font-medium transition-all ${
				primary
					? "bg-blue-600 text-white hover:bg-blue-700"
					: "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
			} ${className}`}
		>
			{children}
		</button>
	);
};
