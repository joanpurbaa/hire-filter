import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Hire Filter",
	description: "Platform that can filter the CV!",
	icons: {
		icon: "/icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta property="og:url" content="https://hire-filter.vercel.app/" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Hire Filter" />
				<meta
					property="og:description"
					content="Platform that can filter the CV!"
				/>
				<meta
					property="og:image"
					content="https://opengraph.b-cdn.net/production/images/f945d2cf-5848-441d-999b-d6d70c23db4a.png?token=Juyti1ESZIeDDWUyfTTyQXuAgbLyOMI79JBzLyYSf8Q&height=270&width=642&expires=33290759920"
				/>

				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="hire-filter.vercel.app" />
				<meta property="twitter:url" content="https://hire-filter.vercel.app/" />
				<meta name="twitter:title" content="Hire Filter" />
				<meta
					name="twitter:description"
					content="Platform that can filter the CV!"
				/>
				<meta
					name="twitter:image"
					content="https://opengraph.b-cdn.net/production/images/f945d2cf-5848-441d-999b-d6d70c23db4a.png?token=Juyti1ESZIeDDWUyfTTyQXuAgbLyOMI79JBzLyYSf8Q&height=270&width=642&expires=33290759920"
				/>
			</head>
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
