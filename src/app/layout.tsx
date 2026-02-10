import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "react-hot-toast";
import HolyLoader from "holy-loader";
import { MessagesDialog } from "@/components/messages/MessagesDialog";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Airbnb Julan",
  description: "Book your vacations and stay anywhere you want",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={` ${nunito.variable} antialiased `}>
        <NextTopLoader height={3} color="#ff5a5f" />
        {/* <HolyLoader
          color="#ff5a5f"
          height="0.3rem"
          speed={250}
          easing="linear"
        /> */}
        <Toaster />
        <SessionProvider session={session}>
          {children}
          <MessagesDialog />
        </SessionProvider>
      </body>
    </html>
  );
}
