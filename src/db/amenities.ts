"use server";

import { prisma } from "@/lib/prisma";

export const getAmenities = async () => {
  const amenities = await prisma.amenity.findMany();
  return amenities;
};
