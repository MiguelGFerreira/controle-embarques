import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Sidebar from "./components/layout/Sidebar";

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
        <div className="flex h-full">
          {/* <Header /> */}
          <Sidebar />
          <main className="flex-1 min-h-screen p-6 sm:p-8 lg:p-10 overflow-y-auto">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </div>
      </body>
    </html>
  );
}
