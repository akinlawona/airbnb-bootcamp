"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const getUserWishlists = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to view wishlists",
        data: [],
      };
    }

    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            listing: {
              include: {
                photos: {
                  where: {
                    isCoverPicture: true,
                  },
                  take: 1,
                },
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: wishlists,
    };
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return {
      success: false,
      message: "Failed to fetch wishlists",
      data: [],
    };
  }
};
