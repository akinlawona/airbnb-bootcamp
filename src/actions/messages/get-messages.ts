"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getMessages(conversationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ guestId: userId }, { hostId: userId }],
      },
    });

    if (!conversation) {
      return { error: "Conversation not found or access denied" };
    }

    // Get all messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
}
