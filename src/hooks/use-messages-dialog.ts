import { create } from "zustand";

interface MessagesDialogStore {
  isOpen: boolean;
  conversationId?: string;
  listingId?: string;
  open: (conversationId?: string, listingId?: string) => void;
  close: () => void;
}

export const useMessagesDialog = create<MessagesDialogStore>((set) => ({
  isOpen: false,
  conversationId: undefined,
  listingId: undefined,
  open: (conversationId?: string, listingId?: string) =>
    set({ isOpen: true, conversationId, listingId }),
  close: () =>
    set({ isOpen: false, conversationId: undefined, listingId: undefined }),
}));
