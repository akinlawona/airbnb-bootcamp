"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/actions/wishlist/toggle-wishlist";
import { checkIsInWishlist } from "@/actions/wishlist/check-wishlist";
import { useCurrentUser } from "@/hooks/use-current-user";
import useAuthCardDialogStore from "@/hooks/use-auth-card-dialog";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type Props = {
  listingId: string;
  className?: string;
};

export const WishlistButton = ({ listingId, className }: Props) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useCurrentUser();
  const { open: openAuthDialog } = useAuthCardDialogStore();

  useEffect(() => {
    const checkSaved = async () => {
      const result = await checkIsInWishlist(listingId);
      if (result.success) {
        setIsSaved(result.isSaved);
      }
    };

    if (user) {
      checkSaved();
    }
  }, [listingId, user]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthDialog();
      return;
    }

    setIsLoading(true);

    try {
      const result = await toggleWishlist(listingId);

      if (result.success) {
        setIsSaved(result.isSaved!);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full hover:bg-white/80 transition-all group",
        className
      )}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-6 h-6 transition-all",
          isSaved
            ? "fill-[#FF385C] stroke-[#FF385C]"
            : "fill-transparent stroke-gray-800 group-hover:stroke-gray-600"
        )}
      />
    </button>
  );
};
