import { create } from "zustand";

type ReviewData = {
  reviewId?: string;
  rating: number;
  comment: string;
  cleanlinessRating: number;
  accuracyRating: number;
  checkInRating: number;
  communicationRating: number;
  locationRating: number;
  valueRating: number;
};

type WriteReviewDialogState = {
  isOpen: boolean;
  listingId: string | null;
  reservationId: string | null;
  mode: "create" | "edit";
  existingReview: ReviewData | null;
};

type WriteReviewDialogAction = {
  open: (listingId: string, reservationId: string) => void;
  openEdit: (listingId: string, reservationId: string, reviewData: ReviewData) => void;
  close: () => void;
};

const initialState: WriteReviewDialogState = {
  isOpen: false,
  listingId: null,
  reservationId: null,
  mode: "create",
  existingReview: null,
};

const useWriteReviewDialogStore = create<
  WriteReviewDialogState & WriteReviewDialogAction
>((set) => ({
  ...initialState,
  open: (listingId: string, reservationId: string) =>
    set({ isOpen: true, listingId, reservationId, mode: "create", existingReview: null }),
  openEdit: (listingId: string, reservationId: string, reviewData: ReviewData) =>
    set({ isOpen: true, listingId, reservationId, mode: "edit", existingReview: reviewData }),
  close: () => set(initialState),
}));

export default useWriteReviewDialogStore;
