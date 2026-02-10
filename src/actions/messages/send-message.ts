"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendMessage(conversationId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    if (!content || content.trim().length === 0) {
      return { error: "Message cannot be empty" };
    }

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

    // Determine who is receiving this message
    const isGuest = conversation.guestId === userId;
    const receiverId = isGuest ? conversation.hostId : conversation.guestId;

    // Create the message and update conversation in a transaction
    const [message] = await prisma.$transaction([
      // Create the message
      prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          content: content.trim(),
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
      }),
      // Update conversation with last message info and increment unread count
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessage: content.trim().substring(0, 100), // Store first 100 chars
          lastMessageAt: new Date(),
          // Increment unread count for the receiver
          ...(isGuest
            ? { hostUnreadCount: { increment: 1 } }
            : { guestUnreadCount: { increment: 1 } }),
        },
      }),
    ]);

    revalidatePath("/messages");

    return { message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}
