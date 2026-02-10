"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useCurrentUser } from "@/hooks/use-current-user";
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
  const [isLoading, setIsLoading] = useState(initialConversations.length === 0);
  const user = useCurrentUser();

  // Poll for updated conversations
  const refreshConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/messages/conversations");
      if (response.ok) {
        const data = await response.json();
        if (data.conversations) {
          setConversations(data.conversations as Conversation[]);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch initial conversations if empty
    if (initialConversations.length === 0) {
      refreshConversations();
    }

    // Poll every 30 seconds for updates
    const interval = setInterval(refreshConversations, 30000);
    return () => clearInterval(interval);
  }, [refreshConversations, initialConversations.length]);

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

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  const handleBack = () => {
    setSelectedConversationId(null);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)]">
        {/* Conversations List Skeleton */}
        <div className="w-full md:w-96 border-r bg-white flex flex-col">
          <div className="px-6 py-4 border-b">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex-1 divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4">
                <div className="flex gap-3">
                  <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Empty chat view */}
        <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mb-4 text-gray-400">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

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
                          {otherUser.name?.[0] ||
                            otherUser.email?.charAt(0).toUpperCase()}
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
          conversationData={selectedConversation}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
