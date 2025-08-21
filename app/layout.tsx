import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "./components/Header";

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Controle de Embarques",
  description: "Ambiente para gerenciamento das datas dos embarques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Header />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
