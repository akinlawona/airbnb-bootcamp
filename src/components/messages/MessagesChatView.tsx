"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Info, ArrowLeft } from "lucide-react";
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
  onConversationLoad?: () => void;
  onBack?: () => void;
}

export function MessagesChatView({
  conversationId,
  onConversationLoad,
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

  useEffect(() => {
    if (conversationId) {
      loadConversation();
    } else {
      setConversation(null);
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Poll for new messages
  useEffect(() => {
    if (!conversation?.id) return;

    const pollMessages = async () => {
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
                (m: Message) => !existingIds.has(m.id),
              );
              return [...prev, ...newMessages];
            });

            const lastMessage = data.messages[data.messages.length - 1];
            lastMessageTimeRef.current = lastMessage.createdAt;
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [conversation?.id]);

  // Mark messages as read
  useEffect(() => {
    if (conversation?.id) {
      markMessagesAsRead(conversation.id);
      onConversationLoad?.();
    }
  }, [conversation?.id, onConversationLoad]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadConversation = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const result = await getConversation(conversationId);
      if (result.conversation) {
        setConversation(result.conversation as Conversation);

        const messagesResult = await getMessages(conversationId);
        if (messagesResult.messages) {
          setMessages(messagesResult.messages as Message[]);
          if (messagesResult.messages.length > 0) {
            lastMessageTimeRef.current =
              messagesResult.messages[
                messagesResult.messages.length - 1
              ].createdAt.toString();
          }
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation?.id || isSending) return;

    setIsSending(true);
    try {
      const result = await sendMessage(conversation.id, newMessage);
      if (result.message) {
        setMessages((prev) => [...prev, result.message as Message]);
        lastMessageTimeRef.current = result.message.createdAt.toString();
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
    <div className="flex-1 flex flex-col h-full bg-white">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b px-6 py-4 bg-white">
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
                      {otherUser.name?.[0] || "U"}
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
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
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
                            {message.sender.name?.[0] || "U"}
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
                        <p
                          className={`text-xs mt-1 px-2 ${
                            isOwnMessage ? "text-right" : "text-left"
                          } text-muted-foreground`}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t px-6 py-4 bg-white">
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
