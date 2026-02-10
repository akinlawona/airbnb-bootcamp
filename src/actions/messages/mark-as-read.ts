"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markMessagesAsRead(conversationId: string) {
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

    const isGuest = conversation.guestId === userId;

    // Mark all unread messages from the other person as read
    await prisma.$transaction([
      // Update messages
      prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      }),
      // Reset unread count for current user
      prisma.conversation.update({
        where: { id: conversationId },
        data: isGuest ? { guestUnreadCount: 0 } : { hostUnreadCount: 0 },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error: "Failed to mark messages as read" };
  }
}
