import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Engine | Dynamic App Generator",
  description: "Next-generation dynamic app generator with high-end premium UI.",
  icons: {
    icon: '/icon.png',
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-screen overflow-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
