import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getConversations } from "@/actions/messages/get-conversations";
import { MessagesInbox } from "@/components/messages/MessagesInbox";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const result = await getConversations();

  return <MessagesInbox initialConversations={result.conversations || []} />;
}
