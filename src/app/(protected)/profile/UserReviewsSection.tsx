"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import StarRatings from "react-star-ratings";

type Review = {
  id: string;
  rating: number;
  averageRating: number;
  comment: string | null;
  createdAt: Date;
  cleanlinessRating: number;
  accuracyRating: number;
  checkInRating: number;
  communicationRating: number;
  locationRating: number;
  valueRating: number;
  listing: {
    id: string;
    title: string | null;
    city: string | null;
    state: string | null;
  };
};

type Props = {
  reviews: Review[];
};

const UserReviewsSection = ({ reviews }: Props) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No reviews yet</p>
        <p className="text-sm text-gray-400">
          Reviews will appear here after your trips
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <Link
                  href={`/listings/${review.listing.id}`}
                  className="hover:underline"
                >
                  <h3 className="font-semibold text-lg mb-1">
                    {review.listing.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">
                  {review.listing.city}, {review.listing.state}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <StarRatings
                    rating={review.averageRating}
                    starRatedColor="black"
                    starDimension="16px"
                    starSpacing="1px"
                    numberOfStars={5}
                  />
                  <span className="text-sm font-semibold">
                    {review.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {review.comment && (
              <p className="text-sm text-gray-700 mb-4">{review.comment}</p>
            )}

            {/* Rating Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Cleanliness:</span>
                <span className="font-semibold">{review.cleanlinessRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold">{review.accuracyRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-semibold">{review.checkInRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Communication:</span>
                <span className="font-semibold">
                  {review.communicationRating}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold">{review.locationRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Value:</span>
                <span className="font-semibold">{review.valueRating}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserReviewsSection;
