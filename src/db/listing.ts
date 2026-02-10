import { prisma } from "@/lib/prisma";

export const getUserListings = async (userId: string) => {
  const listings = await prisma.listing.findMany({
    where: {
      userId: userId,
    },
    include: {
      photos: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return listings;
};

export const getListingById = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });
  return listing;
};

export const getListingWithRelations = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      amenities: true,
      category: true,
      photos: true,
      reservations: true,
      reviews: {
        include: {
          user: {
            select: {
              image: true,
              createdAt: true,
              name: true,
            },
          },
          helpfulness: {
            select: {
              isHelpful: true,
            },
          },
        },
      },
      privacyType: true,
      user: true,
    },
  });
  return listing;
};

export const getListingWithAmenitiesById = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      amenities: true,
    },
  });
  return listing;
};

export const getListingWithPhotosById = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      photos: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return listing;
};

export const getPublishedListings = async () => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        isPublished: true,
        isListed: true,
      },
      include: {
        photos: {
          where: {
            isCoverPicture: true,
          },
          take: 1,
        },
        reviews: true,
        category: true,
        privacyType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });

    return {
      success: true,
      data: listings,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return {
      success: false,
      message: "Failed to fetch listings",
      data: [],
    };
  }
};

export const getListingsByCity = async () => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        isPublished: true,
        isListed: true,
        city: {
          not: null,
        },
      },
      include: {
        photos: {
          where: {
            isCoverPicture: true,
          },
          take: 1,
        },
        reviews: true,
        category: true,
        privacyType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group listings by city
    const listingsByCity = listings.reduce(
      (acc, listing) => {
        const city = listing.city || "Other";
        if (!acc[city]) {
          acc[city] = [];
        }
        acc[city].push(listing);
        return acc;
      },
      {} as Record<string, typeof listings>,
    );

    // Convert to array format with city info
    const groupedListings = Object.entries(listingsByCity).map(
      ([city, listings]) => ({
        city,
        country: listings[0]?.country || "",
        listings: listings.slice(0, 6), // Limit to 6 per city
      }),
    );

    return {
      success: true,
      data: groupedListings,
    };
  } catch (error) {
    console.error("Error fetching listings by city:", error);
    return {
      success: false,
      message: "Failed to fetch listings by city",
      data: [],
    };
  }
};
