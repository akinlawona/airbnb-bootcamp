"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import { Prisma } from "../../../../generated/prisma";

type Trip = Prisma.ReservationGetPayload<{
  include: {
    listing: {
      include: {
        photos: true;
        category: true;
      };
    };
  };
}>;

type Props = {
  trips: Trip[];
};

const TripsSection = ({ trips }: Props) => {
  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No trips yet</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Start exploring stays
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <Link key={trip.id} href={`/listings/${trip.listing.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-48 w-full">
              <Image
                src={trip.listing.photos[0]?.url || "/images/placeholder.avif"}
                alt={trip.listing.title || "Listing"}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="mb-2">
                <p className="font-semibold text-sm line-clamp-1">
                  {trip.listing.title}
                </p>
                <p className="text-xs text-gray-600">
                  {trip.listing.city}, {trip.listing.state}
                </p>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {format(new Date(trip.checkInDate), "MMM d")} -{" "}
                {format(new Date(trip.checkOutDate), "MMM d, yyyy")}
              </div>
              <div className="text-xs font-semibold">
                ${trip.totalPrice.toLocaleString()} total
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(trip.checkOutDate), {
                  addSuffix: true,
                })}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TripsSection;
