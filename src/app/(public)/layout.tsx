"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/desktop/Navbar";
import Container from "@/components/Container";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import AuthCard from "@/components/auth/AuthCard";
import { SessionProvider } from "next-auth/react";
import AuthDialog from "@/components/auth/AuthDialog";
import CreateListingDialog from "@/components/listings/CreateListingDialog";
import ExitDialog from "@/components/listings/ExitDialog";
import { usePathname } from "next/navigation";

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

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isListingPage = pathname?.startsWith("/listings/");

  return (
    <>
      <AuthDialog />
      <CreateListingDialog />

      {!isListingPage && (
        <div className="hidden md:block">
          <Navbar />
        </div>
      )}
      <div className={isListingPage ? "" : "md:mt-60"}>
        <Container>
          <div className="min-h-screen">{children}</div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
