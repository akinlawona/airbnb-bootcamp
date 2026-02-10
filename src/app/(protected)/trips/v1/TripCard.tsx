"use client";
import { Trips } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import { dateRangeText, priceFormatter } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MIDDOT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import useWriteReviewDialogStore from "@/hooks/use-write-review-dialog";
import { FaStar } from "react-icons/fa";

type Props = {
  trip: Trips;
};

const TripCard = ({ trip }: Props) => {
  const { open } = useWriteReviewDialogStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleWriteReview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    open(trip.listingId, trip.id);
  };

  const checkInDate = new Date(trip.checkInDate);
  const checkOutDate = new Date(trip.checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isUpcoming = checkInDate > today;
  const isActive = checkInDate <= today && checkOutDate >= today;
  const isPast = checkOutDate < today;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer p-2">
      <div className="flex flex-col sm:flex-row">
        <Link href={`/listings/${trip.listingId}`} className="flex-shrink-0">
          <div className="relative w-full sm:w-64 h-48 p-2">
            <Image
              src={trip.listing.photos[0]?.url || "/images/placeholder.avif"}
              alt={trip.listing.title || "Listing"}
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute top-3 right-3">
              <Badge className={getStatusColor(trip.status)}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Badge>
            </div>
          </div>
        </Link>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {trip.listing.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Hosted by {trip.listing.user.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {isUpcoming && (
                  <Badge variant="outline" className="text-xs">
                    Upcoming
                  </Badge>
                )}
                {isActive && (
                  <Badge variant="outline" className="text-xs bg-green-50">
                    Active
                  </Badge>
                )}
                {isPast && trip.status === "completed" && (
                  <Badge variant="outline" className="text-xs">
                    Past
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Check-in:</span>
                <span className="text-gray-600">
                  {format(checkInDate, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Check-out:</span>
                <span className="text-gray-600">
                  {format(checkOutDate, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Nights:</span>
                <span className="text-gray-600">{trip.nights}</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-3 border-t">
            <div>
              <p className="text-sm text-gray-600">Total price</p>
              <p className="font-semibold text-lg">
                {priceFormatter.format(trip.totalPrice)} kr NOK
              </p>
              {trip.confirmationCode && (
                <div className="text-xs text-gray-500 mt-1">
                  Code: {trip.confirmationCode}
                </div>
              )}
            </div>

            {/* Show Write Review button for completed trips that haven't been reviewed */}
            {trip.status === "completed" && !trip.guestReviewedHost && (
              <Button
                onClick={handleWriteReview}
                className="bg-[#FF385C] hover:bg-[#E31C5F] gap-2"
                size="sm"
              >
                <FaStar className="w-4 h-4" />
                Write a review
              </Button>
            )}

            {/* Show badge if already reviewed */}
            {trip.guestReviewedHost && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <FaStar className="w-3 h-3 mr-1" />
                Reviewed
              </Badge>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default TripCard;
