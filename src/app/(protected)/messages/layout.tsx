import type { Metadata } from "next";
import ProfileNavbar from "@/components/desktop/ProfileNavbar";

export const metadata: Metadata = {
  title: "Messages - Airbnb Julan",
  description: "View and manage your messages",
};

export default function MessagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden md:block">
        <ProfileNavbar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
