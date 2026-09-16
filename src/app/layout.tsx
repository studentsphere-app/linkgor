import type { Metadata } from "next";
import localFont from "next/font/local";
import { Provider } from "@/components/provider";
import "./global.css";

const lexend = localFont({
	src: "../../public/fonts/Lexend/Lexend.ttf",
	variable: "--font-lexend",
});

export const metadata: Metadata = {
	title: {
		template: "%s | Linkgor",
		default: "Linkgor - Lightweight TypeScript Wrapper for Wigor Services",
	},
	description:
		"A lightweight, zero-dependency TypeScript wrapper designed to interact with WigorServices portals.",
	metadataBase: new URL("https://linkgor.studentsphere.app"),
	alternates: {
		canonical: "/",
	},
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon.ico", sizes: "any" },
		],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
	manifest: "/site.webmanifest",
	openGraph: {
		title: "Linkgor - Lightweight TypeScript Wrapper for Wigor Services",
		description:
			"Interact programmatically with Wigor school portals. Zero dependencies, TypeScript-first, compatible with 20+ schools from Compétences & Développement and IGENSIA Education.",
		url: "https://linkgor.studentsphere.app",
		siteName: "Linkgor",
		images: [
			{
				url: "/banner.png",
				width: 1200,
				height: 640,
				alt: "Linkgor - Wigor Services Wrapper banner",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Linkgor - Lightweight TypeScript Wrapper for Wigor Services",
		description:
			"Interact programmatically with Wigor school portals. Zero dependencies, TypeScript-first, compatible with 20+ schools from Compétences & Développement and IGENSIA Education.",
		images: ["/banner.png"],
	},
};

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${lexend.variable} font-sans`}
			suppressHydrationWarning
		>
			<body className="flex flex-col min-h-screen">
				<div className="bg-orange-500 text-white text-center p-3 text-sm font-medium">
					⚠️ This project has been abandoned and archived. It is no longer
					relevant or maintained as the Compétences & Développement school group
					changed its infrastructure and abandoned Wigor for HyperPlanning.
				</div>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
