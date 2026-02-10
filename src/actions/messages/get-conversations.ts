"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getConversations() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get all conversations where user is either guest or host
    const conversations = await prisma.conversation.findMany({
      where: {
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
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    return { conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { error: "Failed to fetch conversations" };
  }
}
