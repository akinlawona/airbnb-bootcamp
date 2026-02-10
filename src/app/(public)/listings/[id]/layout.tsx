import ListingNavbar from "@/components/desktop/ListingNavbar";

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <ListingNavbar />
      </div>
      {children}
    </>
  );
}
