"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdateReviewInput = {
  reviewId: string;
  rating: number;
  comment: string;
  cleanlinessRating: number;
  accuracyRating: number;
  checkInRating: number;
  communicationRating: number;
  locationRating: number;
  valueRating: number;
};

export type UpdateReviewResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export const updateReview = async (
  input: UpdateReviewInput,
): Promise<UpdateReviewResult> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to edit a review",
      };
    }

    const userId = session.user.id;

    // Verify the review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: {
        id: input.reviewId,
      },
    });

    if (!existingReview) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (existingReview.userId !== userId) {
      return {
        success: false,
        error: "You can only edit your own reviews",
      };
    }

    // Calculate average rating
    const averageRating = Math.round(
      (input.cleanlinessRating +
        input.accuracyRating +
        input.checkInRating +
        input.communicationRating +
        input.locationRating +
        input.valueRating) /
        6,
    );

    // Update the review
    await prisma.review.update({
      where: {
        id: input.reviewId,
      },
      data: {
        rating: input.rating,
        comment: input.comment,
        cleanlinessRating: input.cleanlinessRating,
        accuracyRating: input.accuracyRating,
        checkInRating: input.checkInRating,
        communicationRating: input.communicationRating,
        locationRating: input.locationRating,
        valueRating: input.valueRating,
        averageRating: averageRating,
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/listings/${existingReview.listingId}`);
    revalidatePath("/trips/v1");

    return {
      success: true,
      message: "Review updated successfully",
    };
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update review. Please try again.",
    };
  }
};
