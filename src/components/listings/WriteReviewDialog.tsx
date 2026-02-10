"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useWriteReviewDialogStore from "@/hooks/use-write-review-dialog";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createReview } from "@/actions/listing/create-review";
import { updateReview } from "@/actions/listing/update-review";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const StarRatings = dynamic(() => import("react-star-ratings"), {
  ssr: false,
});

type Props = {
  listingTitle?: string;
};

type RatingKey =
  | "cleanlinessRating"
  | "accuracyRating"
  | "checkInRating"
  | "communicationRating"
  | "locationRating"
  | "valueRating";

type RatingCategory = {
  label: string;
  key: RatingKey;
  description: string;
};

const ratingCategories: RatingCategory[] = [
  {
    label: "Cleanliness",
    key: "cleanlinessRating",
    description: "How clean was the space?",
  },
  {
    label: "Accuracy",
    key: "accuracyRating",
    description: "Did the listing match expectations?",
  },
  {
    label: "Check-in",
    key: "checkInRating",
    description: "How smooth was the check-in process?",
  },
  {
    label: "Communication",
    key: "communicationRating",
    description: "How responsive was the host?",
  },
  {
    label: "Location",
    key: "locationRating",
    description: "How was the neighborhood?",
  },
  {
    label: "Value",
    key: "valueRating",
    description: "Was it worth the price?",
  },
];

const WriteReviewDialog = ({ listingTitle }: Props) => {
  const { isOpen, close, listingId, reservationId, mode, existingReview } =
    useWriteReviewDialogStore();
  const router = useRouter();

  const [ratings, setRatings] = useState({
    cleanlinessRating: 5,
    accuracyRating: 5,
    checkInRating: 5,
    communicationRating: 5,
    locationRating: 5,
    valueRating: 5,
  });

  const [overallRating, setOverallRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing review data when in edit mode
  useEffect(() => {
    if (mode === "edit" && existingReview) {
      setRatings({
        cleanlinessRating: existingReview.cleanlinessRating,
        accuracyRating: existingReview.accuracyRating,
        checkInRating: existingReview.checkInRating,
        communicationRating: existingReview.communicationRating,
        locationRating: existingReview.locationRating,
        valueRating: existingReview.valueRating,
      });
      setOverallRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      // Reset to defaults for create mode
      setRatings({
        cleanlinessRating: 5,
        accuracyRating: 5,
        checkInRating: 5,
        communicationRating: 5,
        locationRating: 5,
        valueRating: 5,
      });
      setOverallRating(5);
      setComment("");
    }
  }, [mode, existingReview]);

  const handleRatingChange = (category: RatingKey, newRating: number) => {
    setRatings((prev) => ({
      ...prev,
      [category]: newRating,
    }));

    // Auto-update overall rating based on average
    const newRatings = { ...ratings, [category]: newRating };
    const average = Math.round(
      Object.values(newRatings).reduce((sum, val) => sum + val, 0) / 6,
    );
    setOverallRating(average);
  };

  const handleDialogClose = () => {
    if (!isSubmitting) {
      close();
      // Reset form
      setRatings({
        cleanlinessRating: 5,
        accuracyRating: 5,
        checkInRating: 5,
        communicationRating: 5,
        locationRating: 5,
        valueRating: 5,
      });
      setOverallRating(5);
      setComment("");
    }
  };

  const handleSubmit = async () => {
    // Only validate listingId/reservationId for CREATE mode
    // EDIT mode only needs the reviewId which is in existingReview
    if (mode === "create" && (!listingId || !reservationId)) {
      toast.error("Missing listing or reservation information");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review");
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (mode === "edit" && existingReview?.reviewId) {
        // Update existing review
        result = await updateReview({
          reviewId: existingReview.reviewId,
          rating: overallRating,
          comment: comment.trim(),
          cleanlinessRating: ratings.cleanlinessRating,
          accuracyRating: ratings.accuracyRating,
          checkInRating: ratings.checkInRating,
          communicationRating: ratings.communicationRating,
          locationRating: ratings.locationRating,
          valueRating: ratings.valueRating,
        });
      } else {
        // Create new review
        // TypeScript knows listingId and reservationId are not null here
        // because we validated them above in create mode
        result = await createReview({
          listingId: listingId!,
          reservationId: reservationId!,
          rating: overallRating,
          comment: comment.trim(),
          cleanlinessRating: ratings.cleanlinessRating,
          accuracyRating: ratings.accuracyRating,
          checkInRating: ratings.checkInRating,
          communicationRating: ratings.communicationRating,
          locationRating: ratings.locationRating,
          valueRating: ratings.valueRating,
        });
      }

      if (result.success) {
        toast.success(
          result.message ||
            (mode === "edit"
              ? "Review updated successfully!"
              : "Review submitted successfully!"),
        );
        handleDialogClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Review submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = Math.round(
    Object.values(ratings).reduce((sum, val) => sum + val, 0) / 6,
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-semibold">
          {mode === "edit"
            ? listingTitle
              ? `Edit your review for ${listingTitle}`
              : "Edit your review"
            : listingTitle
              ? `Review your stay at ${listingTitle}`
              : "Write a review"}
        </DialogTitle>

        <div className="flex flex-col gap-6 py-4">
          {/* Overall Rating */}
          <div className="flex flex-col gap-3 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Overall rating</h3>
                <p className="text-sm text-gray-600">How was your stay?</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <StarRatings
                  rating={overallRating}
                  starRatedColor="#FF385C"
                  starHoverColor="#FF385C"
                  changeRating={setOverallRating}
                  numberOfStars={5}
                  starDimension="32px"
                  starSpacing="4px"
                  name="overallRating"
                />
                <span className="text-sm font-medium">
                  {overallRating} stars
                </span>
              </div>
            </div>
          </div>

          {/* Category Ratings */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Rate specific aspects</h3>
            {ratingCategories.map((category) => (
              <div
                key={category.key}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{category.label}</p>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StarRatings
                    rating={ratings[category.key]}
                    starRatedColor="#FF385C"
                    starHoverColor="#FF385C"
                    changeRating={(newRating: number) =>
                      handleRatingChange(category.key, newRating)
                    }
                    numberOfStars={5}
                    starDimension="24px"
                    starSpacing="2px"
                    name={category.key}
                  />
                  <span className="text-sm w-8 text-center">
                    {ratings[category.key]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Written Review */}
          <div className="flex flex-col gap-3 pt-2">
            <div>
              <h3 className="text-lg font-semibold">Share your experience</h3>
              <p className="text-sm text-gray-600">
                Tell future guests what made your stay special
              </p>
            </div>
            <Textarea
              placeholder="What did you love about this place? What could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-32 resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Minimum 10 characters</span>
              <span>{comment.length}/1000</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || comment.trim().length < 10}
              className="flex-1 bg-[#FF385C] hover:bg-[#E31C5F]"
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Submitting..."
                : mode === "edit"
                  ? "Update review"
                  : "Submit review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewDialog;
