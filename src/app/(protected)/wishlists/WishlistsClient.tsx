"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { meanBy } from "lodash";
import { Heart } from "lucide-react";
import { priceFormatter } from "@/lib/helpers";
import { WishlistButton } from "@/components/listings/WishlistButton";

type Wishlist = {
  id: string;
  name: string;
  createdAt: Date;
  items: {
    id: string;
    listing: {
      id: string;
      title: string | null;
      price: number | null;
      photos: {
        url: string;
        isCoverPicture: boolean;
      }[];
      reviews: {
        averageRating: number;
      }[];
      location: string | null;
    };
  }[];
};

type Props = {
  wishlists: Wishlist[];
};

export default function WishlistsClient({ wishlists }: Props) {
  const defaultWishlist = wishlists[0];

  if (!defaultWishlist || defaultWishlist.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            No favorites yet
          </h1>
          <p className="text-gray-600 text-center max-w-md">
            When you find a place you like, click the heart icon to save it
            here.
          </p>
          <Link
            href="/"
            className="mt-4 px-6 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition"
          >
            Start exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Wishlists</h1>
        <p className="text-gray-600">
          {defaultWishlist.items.length}{" "}
          {defaultWishlist.items.length === 1 ? "place" : "places"} saved
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {defaultWishlist.items.map((item) => {
          const listing = item.listing;
          const averageRating = listing.reviews.length
            ? meanBy(listing.reviews, (r) => r.averageRating)
            : null;

          return (
            <Link href={`/listings/${listing.id}`} key={item.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative w-full h-64">
                  <Image
                    src={
                      listing.photos[0]?.url || "/images/placeholder.avif"
                    }
                    alt={listing.title || "Listing"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistButton
                      listingId={listing.id}
                      className="bg-white/90"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {listing.location}
                    </p>
                    {averageRating && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>★</span>
                        <span className="font-medium">
                          {averageRating.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {listing.price && (
                      <div className="mt-1">
                        <span className="font-semibold">
                          {priceFormatter.format(listing.price)} kr
                        </span>
                        <span className="text-sm text-gray-600"> night</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
