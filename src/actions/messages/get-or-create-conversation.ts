"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getOrCreateConversation(listingId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get the listing to find the host
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!listing) {
      return { error: "Listing not found" };
    }

    const hostId = listing.userId;

    // Don't allow host to message themselves
    if (hostId === userId) {
      return { error: "You cannot message yourself" };
    }

    // Try to find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId,
        guestId: userId,
        hostId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            city: true,
            state: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId,
          guestId: userId,
          hostId,
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              images: true,
              city: true,
              state: true,
            },
          },
          guest: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          host: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    }

    return { conversation };
  } catch (error) {
    console.error("Error getting/creating conversation:", error);
    return { error: "Failed to get conversation" };
  }
}
