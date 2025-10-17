import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/desktop/Navbar";
import Container from "@/components/Container";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import AuthCard from "@/components/auth/AuthCard";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Airbnb Julan",
  description: "Book your vacations and stay anywhere you want",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${nunito.variable} antialiased `}>
        <SessionProvider>
          <NextTopLoader color="#FF5A5F" height={3} showSpinner={false} />
          <Toaster />
          <AuthCard />
          <div className="hidden md:block">
            <Navbar />
          </div>
          <div className="md:mt-60">
            <Container>
              <div className="">{children}</div>
            </Container>
          </div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
