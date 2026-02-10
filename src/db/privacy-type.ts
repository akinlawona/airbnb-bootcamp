"use server";

import { prisma } from "@/lib/prisma";

export const getPrivacyTypes = async () => {
  const privacyTypes = await prisma.privacyType.findMany();
  return privacyTypes;
};
