"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type DeleteReviewResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export const deleteReview = async (
  reviewId: string,
): Promise<DeleteReviewResult> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete a review",
      };
    }

    const userId = session.user.id;

    // Verify the review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
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
        error: "You can only delete your own reviews",
      };
    }

    // Delete the review and update reservation in a transaction
    await prisma.$transaction([
      prisma.review.delete({
        where: {
          id: reviewId,
        },
      }),
      // Optionally update the reservation to mark as not reviewed
      // This depends on if you want to allow re-reviews
    ]);

    // Revalidate relevant paths
    revalidatePath(`/listings/${existingReview.listingId}`);
    revalidatePath("/trips/v1");

    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete review. Please try again.",
    };
  }
};
