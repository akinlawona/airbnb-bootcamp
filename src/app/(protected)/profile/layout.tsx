import type { Metadata } from "next";
import Container from "@/components/Container";
import Footer from "@/components/Footer/Footer";
import ProfileNavbar from "@/components/desktop/ProfileNavbar";

export const metadata: Metadata = {
  title: "Profile | Airbnb Julan",
  description: "View your profile and trip history",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="hidden md:block">
        <ProfileNavbar />
      </div>
      <div className="">
        <Container>
          <div className="min-h-screen">{children}</div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
