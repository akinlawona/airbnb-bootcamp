"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getConversations } from "@/actions/messages/get-conversations";
import { MessagesChatView } from "./MessagesChatView";
import Image from "next/image";

interface Conversation {
  id: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  guestUnreadCount: number;
  hostUnreadCount: number;
  listing: {
    id: string;
    title: string | null;
    images: unknown;
    city: string | null;
    state: string | null;
  };
  guest: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  host: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface MessagesInboxProps {
  initialConversations: Conversation[];
}

export function MessagesInbox({ initialConversations }: MessagesInboxProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const user = useCurrentUser();

  // Poll for updated conversations
  const refreshConversations = useCallback(async () => {
    const result = await getConversations();
    if (result.conversations) {
      setConversations(result.conversations as Conversation[]);
    }
  }, []);

  useEffect(() => {
    // Poll every 5 seconds
    const interval = setInterval(refreshConversations, 5000);
    return () => clearInterval(interval);
  }, [refreshConversations]);

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Optimistically mark as read in the UI
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const isGuest = conv.guest.id === user?.id;
          return {
            ...conv,
            guestUnreadCount: isGuest ? 0 : conv.guestUnreadCount,
            hostUnreadCount: !isGuest ? 0 : conv.hostUnreadCount,
          };
        }
        return conv;
      }),
    );
  };

  const handleConversationLoad = () => {
    // Refresh conversations after marking as read
    refreshConversations();
  };

  const handleBack = () => {
    setSelectedConversationId(null);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start a conversation with a host to see your messages here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Conversations List - Left Sidebar */}
      <div
        className={`w-full md:w-96 border-r bg-white flex flex-col ${
          selectedConversationId ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {conversations.map((conversation) => {
              const isGuest = conversation.guest.id === user?.id;
              const otherUser = isGuest
                ? conversation.host
                : conversation.guest;
              const unreadCount = isGuest
                ? conversation.guestUnreadCount
                : conversation.hostUnreadCount;
              const hasUnread = unreadCount > 0;
              const isSelected = conversation.id === selectedConversationId;

              // Get listing image
              let listingImage: string | undefined;
              try {
                if (conversation.listing.images) {
                  const images = Array.isArray(conversation.listing.images)
                    ? conversation.listing.images
                    : typeof conversation.listing.images === "string"
                      ? JSON.parse(conversation.listing.images)
                      : [];
                  if (images.length > 0) {
                    listingImage = images[0];
                  }
                }
              } catch (e) {
                // Fallback if parsing fails
              }

              return (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-gray-100" : ""
                  } ${hasUnread ? "bg-blue-50/50" : ""}`}
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser.image || undefined} />
                        <AvatarFallback>
                          {otherUser.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1">
                          <Badge
                            variant="default"
                            className="h-5 min-w-5 px-1.5 text-xs rounded-full"
                          >
                            {unreadCount}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold truncate ${
                              hasUnread ? "text-primary" : ""
                            }`}
                          >
                            {otherUser.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.listing.title}
                          </p>
                        </div>
                        {conversation.lastMessageAt && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(
                              new Date(conversation.lastMessageAt),
                              {
                                addSuffix: false,
                              },
                            )}
                          </span>
                        )}
                      </div>

                      {conversation.lastMessage && (
                        <p
                          className={`text-sm mt-1 truncate ${
                            hasUnread
                              ? "font-medium text-gray-900"
                              : "text-muted-foreground"
                          }`}
                        >
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat View - Right Side */}
      <div
        className={`flex-1 ${selectedConversationId ? "flex" : "hidden md:flex"}`}
      >
        <MessagesChatView
          conversationId={selectedConversationId}
          onConversationLoad={handleConversationLoad}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
