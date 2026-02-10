"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMessagesDialog } from "@/hooks/use-messages-dialog";
import { getOrCreateConversation } from "@/actions/messages/get-or-create-conversation";
import { getConversation } from "@/actions/messages/get-conversation";
import { getMessages } from "@/actions/messages/get-messages";
import { sendMessage } from "@/actions/messages/send-message";
import { markMessagesAsRead } from "@/actions/messages/mark-as-read";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Send, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDistanceToNow } from "date-fns";

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

export function MessagesDialog() {
  const { isOpen, close, conversationId, listingId } = useMessagesDialog();
  const user = useCurrentUser();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageTimeRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConversation();
    } else {
      // Reset state when dialog closes
      setConversation(null);
      setMessages([]);
      setNewMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, conversationId, listingId]);

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

            // Update last message time
            const lastMessage = data.messages[data.messages.length - 1];
            lastMessageTimeRef.current = lastMessage.createdAt;
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [conversation?.id]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversation?.id) {
      markMessagesAsRead(conversation.id);
    }
  }, [conversation?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadConversation = async () => {
    setIsLoading(true);
    try {
      let conv: Conversation | null = null;

      if (listingId) {
        // Create or get conversation for a listing
        const result = await getOrCreateConversation(listingId);
        if (result.conversation) {
          conv = result.conversation as Conversation;
        }
      } else if (conversationId) {
        // Load existing conversation
        const result = await getConversation(conversationId);
        if (result.conversation) {
          conv = result.conversation as Conversation;
        }
      }

      if (conv) {
        setConversation(conv);
        // Load messages for this conversation
        const messagesResult = await getMessages(conv.id);
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

  const otherUser =
    conversation && conversation.guest.id === user?.id
      ? conversation.host
      : conversation?.guest;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl h-[600px] !flex flex-col p-0 gap-0 overflow-hidden"
      >
        <DialogClose className="absolute top-6 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:outline-none hover:cursor-pointer">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          {!otherUser ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherUser.image || undefined} />
                <AvatarFallback>{otherUser.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogTitle>{otherUser.name || "Messages"}</DialogTitle>
                {conversation?.listing && (
                  <p className="text-sm text-muted-foreground">
                    {conversation.listing.title}
                  </p>
                )}
              </div>
            </div>
          )}
          {!otherUser && (
            <DialogTitle className="sr-only">Messages</DialogTitle>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </div>

            <div className="p-4 border-t shrink-0">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={isSending}
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
      </DialogContent>
    </Dialog>
  );
}
