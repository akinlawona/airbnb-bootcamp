"use client";

import { Button } from "@/components/ui/button";
import { useMessagesDialog } from "@/hooks/use-messages-dialog";
import { MessageCircle } from "lucide-react";

interface ContactHostButtonProps {
  listingId: string;
  hostName?: string;
}

export function ContactHostButton({
  listingId,
  hostName,
}: ContactHostButtonProps) {
  const { open } = useMessagesDialog();

  return (
    <Button
      variant="outline"
      onClick={() => open(undefined, listingId)}
      className="w-full"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Contact {hostName || "Host"}
    </Button>
  );
}
