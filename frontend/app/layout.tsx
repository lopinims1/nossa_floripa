import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TemaProvider } from "@/lib/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nossa Floripa",
  description: "A rede social do bem de Florianópolis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn("min-h-full flex flex-col", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
        <TemaProvider>
          {children}
        </TemaProvider>
      </body>
    </html>
  );
}