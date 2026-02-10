import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get total unread count across all conversations
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ guestId: userId }, { hostId: userId }],
      },
      select: {
        guestId: true,
        guestUnreadCount: true,
        hostUnreadCount: true,
      },
    });

    const totalUnread = conversations.reduce((acc, conv) => {
      const count =
        conv.guestId === userId ? conv.guestUnreadCount : conv.hostUnreadCount;
      return acc + count;
    }, 0);

    return NextResponse.json({ unreadCount: totalUnread });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 },
    );
  }
}
