"use server";

import { SearchFilters } from "@/hooks/use-search-filter-store";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../generated/prisma";

interface CountListingsParams {
  filters: SearchFilters;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export async function countFilteredListings({
  filters,
  location,
  checkIn,
  checkOut,
  guests,
}: CountListingsParams) {
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

    // Amenities - must have all selected amenities
    if (filters.amenityIds && filters.amenityIds.length > 0) {
      where.amenityIds = { hasEvery: filters.amenityIds };
    }

    // Host types
    if (filters.hostTypes && filters.hostTypes.length > 0) {
      where.hostType = { in: filters.hostTypes };
    }

    // Security camera filter
    if (filters.selfCheckIn === false) {
      where.isSecurityCamera = false;
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

    const count = await prisma.listing.count({ where });

    return { count, success: true };
  } catch (error) {
    console.error("Error counting listings:", error);
    return { count: 0, success: false, error: "Failed to count listings" };
  }
}
