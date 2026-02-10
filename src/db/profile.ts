import { prisma } from "@/lib/prisma";

export const getUserProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reservations: {
          include: {
            listing: {
              include: {
                photos: {
                  where: {
                    isCoverPicture: true,
                  },
                  take: 1,
                },
                category: true,
              },
            },
          },
          orderBy: {
            checkOutDate: "desc",
          },
        },
        reviews: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                city: true,
                state: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Calculate stats
    const totalTrips = user.reservations.length;
    const totalReviews = user.reviews.length;
    const memberSince = user.createdAt;

    return {
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        createdAt: user.createdAt,
      },
      stats: {
        totalTrips,
        totalReviews,
        memberSince,
      },
      trips: user.reservations,
      reviews: user.reviews,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
