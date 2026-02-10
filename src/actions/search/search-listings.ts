"use server";

import { SearchFilters } from "@/hooks/use-search-filter-store";
import { prisma } from "@/lib/prisma";
import { Prisma } from "../../../generated/prisma";

interface SearchListingsParams {
  filters: SearchFilters;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  location?: string;
  limit?: number;
  offset?: number;
}

export async function searchListings({
  filters,
  checkIn,
  checkOut,
  guests,
  location,
  limit = 20,
  offset = 0,
}: SearchListingsParams) {
  try {
    const where: Prisma.ListingWhereInput = {
      isPublished: true,
      isListed: true,
    };

    // Location search
    if (location) {
      where.OR = [
        { city: { contains: location, mode: "insensitive" } },
        { state: { contains: location, mode: "insensitive" } },
        { country: { contains: location, mode: "insensitive" } },
        { title: { contains: location, mode: "insensitive" } },
      ];
    }

    // Guest capacity
    if (guests && guests > 0) {
      where.guestCount = { gte: guests };
    }

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Bedroom count
    if (filters.bedroomCount !== undefined && filters.bedroomCount > 0) {
      where.bedroomCount = { gte: filters.bedroomCount };
    }

    // Bed count
    if (filters.bedCount !== undefined && filters.bedCount > 0) {
      where.bedCount = { gte: filters.bedCount };
    }

    // Bathroom count
    if (filters.bathroomCount !== undefined && filters.bathroomCount > 0) {
      where.bathroomCount = { gte: filters.bathroomCount };
    }

    // Privacy types
    if (filters.privacyTypeIds && filters.privacyTypeIds.length > 0) {
      where.privacyTypeId = { in: filters.privacyTypeIds };
    }

    // Categories
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      where.categoryId = { in: filters.categoryIds };
    }

    // Amenities
    if (filters.amenityIds && filters.amenityIds.length > 0) {
      where.amenityIds = { hasEvery: filters.amenityIds };
    }

    // Host types
    if (filters.hostTypes && filters.hostTypes.length > 0) {
      where.hostType = { in: filters.hostTypes };
    }

    // Availability check for dates
    if (checkIn && checkOut) {
      where.reservations = {
        none: {
          OR: [
            {
              AND: [
                { checkInDate: { lte: new Date(checkIn) } },
                { checkOutDate: { gt: new Date(checkIn) } },
              ],
            },
            {
              AND: [
                { checkInDate: { lt: new Date(checkOut) } },
                { checkOutDate: { gte: new Date(checkOut) } },
              ],
            },
            {
              AND: [
                { checkInDate: { gte: new Date(checkIn) } },
                { checkOutDate: { lte: new Date(checkOut) } },
              ],
            },
          ],
          status: { in: ["confirmed", "pending"] },
        },
      };
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          photos: {
            where: { isCoverPicture: true },
            take: 1,
          },
          category: true,
          privacyType: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.listing.count({ where }),
    ]);

    // Calculate average rating for each listing
    const listingsWithRating = listings.map((listing) => {
      const avgRating =
        listing.reviews.length > 0
          ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) /
            listing.reviews.length
          : 0;

      return {
        ...listing,
        averageRating: avgRating,
        reviewCount: listing.reviews.length,
      };
    });

    return {
      listings: listingsWithRating,
      total,
      success: true,
    };
  } catch (error) {
    console.error("Error searching listings:", error);
    return {
      listings: [],
      total: 0,
      success: false,
      error: "Failed to search listings",
    };
  }
}
