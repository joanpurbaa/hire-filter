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
	const baseUrl = "https://hire-filter.vercel.app";
	const ogImage = `${baseUrl}/opengraph.png`;

	return (
		<html lang="en">
			<head>
				<meta property="og:title" content="Hire Filter" />
				<meta
					property="og:description"
					content="Platform that can filter the CV!"
				/>
				<meta property="og:image" content={ogImage} />
				<meta property="og:image:type" content="image/png" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={baseUrl} />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Hire Filter" />
				<meta
					name="twitter:description"
					content="Platform that can filter the CV!"
				/>
				<meta name="twitter:image" content={ogImage} />
				<meta name="twitter:image:type" content="image/png" />
				<meta name="twitter:image:width" content="1200" />
				<meta name="twitter:image:height" content="630" />
			</head>
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
