"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const toggleWishlist = async (listingId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to save favorites",
      };
    }

    const userId = session.user.id;

    // Get or create default wishlist for user
    let wishlist = await prisma.wishlist.findFirst({
      where: {
        userId,
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId,
          name: "My Wishlist",
        },
      });
    }

    // Check if listing is already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_listingId: {
          wishlistId: wishlist.id,
          listingId,
        },
      },
    });

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: {
          id: existingItem.id,
        },
      });

      revalidatePath("/");
      revalidatePath("/wishlists");
      revalidatePath(`/listings/${listingId}`);

      return {
        success: true,
        message: "Removed from wishlist",
        isSaved: false,
      };
    } else {
      // Add to wishlist
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          listingId,
        },
      });

      revalidatePath("/");
      revalidatePath("/wishlists");
      revalidatePath(`/listings/${listingId}`);

      return {
        success: true,
        message: "Added to wishlist",
        isSaved: true,
      };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
