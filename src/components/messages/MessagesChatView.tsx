"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Send,
  Info,
  ArrowLeft,
  Check,
  CheckCheck,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDistanceToNow } from "date-fns";
import { getConversation } from "@/actions/messages/get-conversation";
import { getMessages } from "@/actions/messages/get-messages";
import { sendMessage } from "@/actions/messages/send-message";
import { markMessagesAsRead } from "@/actions/messages/mark-as-read";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface Conversation {
  id: string;
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

interface MessagesChatViewProps {
  conversationId: string | null;
  conversationData?: Conversation | null;
  onBack?: () => void;
}

export function MessagesChatView({
  conversationData,
  conversationId,
  onBack,
}: MessagesChatViewProps) {
  const user = useCurrentUser();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageTimeRef = useRef<string | null>(null);
  const initializedConversationRef = useRef<string | null>(null);
  const markedAsReadRef = useRef<string | null>(null);

  const loadMessages = useCallback(async (convId: string) => {
    setIsLoading(true);
    try {
      const messagesResult = await getMessages(convId);
      if (messagesResult.messages) {
        setMessages(messagesResult.messages as Message[]);
        if (messagesResult.messages.length > 0) {
          lastMessageTimeRef.current =
            messagesResult.messages[
              messagesResult.messages.length - 1
            ].createdAt.toString();
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadConversation = useCallback(async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const result = await getConversation(conversationId);
      if (result.conversation) {
        setConversation(result.conversation as Conversation);
        await loadMessages(conversationId);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, loadMessages]);

  useEffect(() => {
    if (conversationId) {
      // Only initialize once per conversationId
      if (initializedConversationRef.current !== conversationId) {
        initializedConversationRef.current = conversationId;

        // If conversation data is already provided, use it to avoid refetch
        if (conversationData) {
          setConversation(conversationData);
          // Still need to load messages
          loadMessages(conversationId);
        } else {
          loadConversation();
        }
      }
    } else {
      setConversation(null);
      setMessages([]);
      initializedConversationRef.current = null;
      markedAsReadRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, loadMessages, loadConversation]);

  // Poll for new messages
  useEffect(() => {
    if (!conversation?.id) return;

    const pollMessagesInterval = async () => {
      try {
        const since = lastMessageTimeRef.current;
        const url = new URL("/api/messages/poll", window.location.origin);
        url.searchParams.set("conversationId", conversation.id);
        if (since) {
          url.searchParams.set("since", since);
        }

        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const newMessages = data.messages.filter(
                (m: Message) =>
                  !existingIds.has(m.id) && !m.id.startsWith("temp-"),
              );
              // Remove temporary messages and replace with real ones
              const withoutTemp = prev.filter((m) => !m.id.startsWith("temp-"));
              return [...withoutTemp, ...newMessages];
            });

            const lastMessage = data.messages[data.messages.length - 1];
            lastMessageTimeRef.current = lastMessage.createdAt;
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    // Poll immediately when conversation loads
    pollMessagesInterval();

    // Reduced to 2 seconds for faster updates
    const interval = setInterval(pollMessagesInterval, 2000);
    return () => clearInterval(interval);
  }, [conversation?.id]);

  // Mark messages as read
  useEffect(() => {
    if (conversation?.id && markedAsReadRef.current !== conversation.id) {
      markedAsReadRef.current = conversation.id;
      markMessagesAsRead(conversation.id);
    }
  }, [conversation?.id]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation?.id || isSending) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistically add message to UI immediately
    const optimisticMessage: Message = {
      id: tempId,
      content: messageContent,
      createdAt: new Date(),
      senderId: user?.id || "",
      isRead: false,
      sender: {
        id: user?.id || "",
        name: user?.name || null,
        email: user?.email || null,
        image: user?.image || null,
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setIsSending(true);

    try {
      const result = await sendMessage(conversation.id, messageContent);
      if (result.message) {
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? (result.message as Message) : msg,
          ),
        );
        lastMessageTimeRef.current = result.message.createdAt.toString();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setNewMessage(messageContent); // Restore message
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
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
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Your Messages
          </h3>
          <p className="text-sm text-gray-500">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  const otherUser =
    conversation && conversation.guest.id === user?.id
      ? conversation.host
      : conversation?.guest;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] bg-white">
      {isLoading ? (
        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <div className="border-b px-6 py-4 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>

          {/* Messages Skeleton */}
          <div className="flex-1 px-6 py-4 space-y-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div className="flex items-end gap-2 max-w-[70%]">
                  {i % 2 === 0 && (
                    <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full" />
                  )}
                  <div className="space-y-2">
                    <div
                      className={`h-16 ${i % 3 === 0 ? "w-64" : i % 3 === 1 ? "w-48" : "w-56"} bg-gray-200 animate-pulse rounded-2xl`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Skeleton */}
          <div className="border-t px-6 py-4 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 h-12 bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b px-6 py-4 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              {otherUser && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherUser.image || undefined} />
                    <AvatarFallback>
                      {otherUser.name?.[0] ||
                        otherUser.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="font-semibold">{otherUser.name}</h2>
                    {conversation?.listing && (
                      <p className="text-sm text-muted-foreground">
                        {conversation.listing.title}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {!isOwnMessage && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={message.sender.image || undefined}
                          />
                          <AvatarFallback className="text-xs">
                            {message.sender.name?.[0] ||
                              message.sender.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 mt-1 px-2 ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                          {isOwnMessage && (
                            <span className="text-muted-foreground">
                              {message.id.startsWith("temp-") ? (
                                // Sending (clock icon)
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              ) : message.isRead ? (
                                // Read (double check, blue)
                                <CheckCheck className="w-4 h-4 text-blue-500" />
                              ) : (
                                // Delivered (double check, gray)
                                <CheckCheck className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t px-6 py-4 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={isSending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                size="icon"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
