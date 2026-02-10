"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const checkIsInWishlist = async (listingId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: true,
        isSaved: false,
      };
    }

    const userId = session.user.id;

    // Get user's wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        userId,
      },
      include: {
        items: {
          where: {
            listingId,
          },
        },
      },
    });

    return {
      success: true,
      isSaved: wishlist ? wishlist.items.length > 0 : false,
    };
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return {
      success: false,
      isSaved: false,
    };
  }
};
