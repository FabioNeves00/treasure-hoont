import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/src/styles/global.css";
import { Footer } from "@/src/components/Footer";
import { Header } from "@/src/components/Header";
import { Toaster } from "@/src/components/ui/toaster";
import { Providers } from "./Providers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authOptions } from "../server/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Argoween",
    absolute: "Argoween",
  },
  description:
    "Sistema de gameficação do evento Argoween 2024",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="antialiased" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#f0ebf8]`}>
        <Providers>
          <header>
            <div className="left-0 right-0 top-2 z-40 pb-6 pt-6">
              <Header />
            </div>
          </header>
          {children}

          <Toaster />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
