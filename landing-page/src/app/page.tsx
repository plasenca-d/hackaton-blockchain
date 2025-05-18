import { Benefits } from "@/components/Benefits";
import { CTA } from "@/components/CTA";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
	return (
		<>
			<Header />
			<main className="pt-0">
				<Hero />
				<Features />
				<HowItWorks />
				<Benefits />
				<Testimonials />
				<CTA />
			</main>
			<Footer />
		</>
	);
}
