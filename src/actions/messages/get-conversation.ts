"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getConversation(conversationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get conversation and verify user is part of it
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ guestId: userId }, { hostId: userId }],
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

    if (!conversation) {
      return { error: "Conversation not found or access denied" };
    }

    return { conversation };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return { error: "Failed to fetch conversation" };
  }
}
