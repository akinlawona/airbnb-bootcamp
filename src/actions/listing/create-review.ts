"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CreateReviewInput = {
  listingId: string;
  reservationId: string;
  rating: number;
  comment: string;
  cleanlinessRating: number;
  accuracyRating: number;
  checkInRating: number;
  communicationRating: number;
  locationRating: number;
  valueRating: number;
};

export type CreateReviewResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export const createReview = async (
  input: CreateReviewInput,
): Promise<CreateReviewResult> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to write a review",
      };
    }

    const userId = session.user.id;

    // Verify the reservation exists and belongs to the user
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: input.reservationId,
      },
    });

    if (!reservation) {
      return {
        success: false,
        error: "Reservation not found",
      };
    }

    if (reservation.guestId !== userId) {
      return {
        success: false,
        error: "You can only review your own reservations",
      };
    }

    // Check if reservation is completed
    if (reservation.status !== "completed") {
      return {
        success: false,
        error: "You can only review completed stays",
      };
    }

    // Check if user already reviewed this listing for this reservation
    const existingReview = await prisma.review.findFirst({
      where: {
        listingId: input.listingId,
        userId: userId,
      },
    });

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this listing",
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

    // Create the review and update reservation in a transaction
    await prisma.$transaction([
      prisma.review.create({
        data: {
          listingId: input.listingId,
          userId: userId,
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
      }),
      prisma.reservation.update({
        where: {
          id: input.reservationId,
        },
        data: {
          guestReviewedHost: true,
        },
      }),
    ]);

    // Revalidate relevant paths
    revalidatePath(`/listings/${input.listingId}`);
    revalidatePath("/trips/v1");

    return {
      success: true,
      message: "Review submitted successfully",
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again.",
    };
  }
};
