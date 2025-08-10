// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motus-messine-6ulf.vercel.app";

const title = "SUTOM – Mot du jour";
const description =
  "Jouez chaque jour à SUTOM : trouvez le mot mystère en 6 essais, avec indices de couleur. Version francophone du mot du jour.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · SUTOM",
  },
  description,
  applicationName: "SUTOM",
  keywords: ["Sutom", "mot du jour", "Wordle", "jeu de lettres", "jeu gratuit", "français"],
  category: "game",
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "SUTOM",
    images: ["/og-image.jpg"], // mets ce fichier dans /public
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { "src": "/favicon.ico" },
      { "src": "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { "src": "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { "src": "/favicon-192x192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/favicon-512x512.png", "sizes": "512x512", "type": "image/png" },
    ],
    apple: [{ url: "/apple-icon-180x180.png", sizes: "180x180" }],
  },
  manifest: "/manifest", // optionnel mais recommandé
  themeColor: "#0ea5e9",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, maxImagePreview: "large", maxSnippet: -1, maxVideoPreview: -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
