import { getUserWishlists } from "@/actions/wishlist/get-wishlists";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import WishlistsClient from "./WishlistsClient";

export default async function WishlistsPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const wishlists = await getUserWishlists();

  if (!wishlists.success) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Unable to load wishlists
          </h1>
          <p className="text-gray-600 text-center max-w-md">
            {wishlists.message ||
              "Something went wrong while loading your wishlists. Please try again later."}
          </p>
          <a
            href="/wishlists"
            className="mt-4 px-6 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  return <WishlistsClient wishlists={wishlists.data} />;
}
