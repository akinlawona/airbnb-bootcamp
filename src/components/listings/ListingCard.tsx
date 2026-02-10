import { ListingCardData } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { MIDDOT } from "@/lib/constants";
import { FaStar } from "react-icons/fa";
import { WishlistButton } from "./WishlistButton";
import { meanBy } from "lodash";
import { priceFormatter } from "@/lib/helpers";

type ListingCardProps = {
  listing: ListingCardData;
};

const ListingCard = ({ listing }: ListingCardProps) => {
  const averageRating = listing.reviews.length
    ? meanBy(listing.reviews, (review) => review.averageRating)
    : null;

  const coverPhoto = listing.photos[0];

  return (
    <div className="flex flex-col gap-1">
      <Link href={`/listings/${listing.id}`}>
        <div className="flex flex-col gap-3">
          <div className="relative w-full rounded-2xl overflow-hidden group">
            <div className="h-72 w-72 md:h-48 md:w-48">
              <Image
                src={coverPhoto?.url || "/images/placeholder.avif"}
                alt={listing.title || "Listing"}
                fill={true}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {listing.isGuestFavorite && (
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 rounded-full opacity-90 text-xs"
              >
                Guest favorite
              </Badge>
            )}
            <div className="absolute top-2 right-2">
              <WishlistButton listingId={listing.id} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-gray-900">
                {listing.city && listing.country
                  ? `${listing.city}, ${listing.country}`
                  : listing.location || "Location not specified"}
              </p>
              {averageRating && (
                <div className="flex items-center gap-1">
                  <FaStar className="text-xs" />
                  <p className="text-xs font-medium">
                    {averageRating.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600">
              {listing.privacyType?.name || "Entire place"}
            </p>

            {listing.price && (
              <div className="flex items-center gap-1 text-sm mt-1">
                <p className="font-semibold">
                  {priceFormatter.format(listing.price)} kr
                </p>
                <p className="text-gray-600">night</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
