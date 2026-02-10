import React, { useState, useTransition } from "react";
import { Review } from "../../../../generated/prisma";
import { ReviewWithUserInfo } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/helpers";
import StarRatings from "react-star-ratings";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateReviewHelpfulness } from "@/actions/update-review-helpfulness";
import { deleteReview } from "@/actions/listing/delete-review";
import { useCurrentUser } from "@/hooks/use-current-user";
import useWriteReviewDialogStore from "@/hooks/use-write-review-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  review: ReviewWithUserInfo;
  listingId?: string;
  reservationId?: string;
};

const ReviewCard = ({ review, listingId, reservationId }: Props) => {
  const router = useRouter();
  const user = useCurrentUser();
  const { openEdit } = useWriteReviewDialogStore();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [notHelpfulCount, setNotHelpfulCount] = useState(
    review.notHelpfulCount,
  );

  const isOwner = user?.id === review.userId;

  const handleVote = (isHelpful: boolean) => {
    startTransition(async () => {
      const result = await updateReviewHelpfulness(review.id, isHelpful);

      if (result.success) {
        setUserVote(result.userVote);
        setHelpfulCount(result.helpfulCount);
        setNotHelpfulCount(result.notHelpfulCount);
        // router.refresh();
      } else {
        console.error(result.error);
        toast.error(result.error || "Failed to update vote");
      }
    });
  };

  const handleEdit = () => {
    console.log("Edit clicked - review.listingId:", review.listingId);
    // For editing, we use the review's own listingId
    // reservationId is not needed for updates (only for creation)
    openEdit(review.listingId, "", {
      reviewId: review.id,
      rating: review.rating,
      comment: review.comment || "",
      cleanlinessRating: review.cleanlinessRating,
      accuracyRating: review.accuracyRating,
      checkInRating: review.checkInRating,
      communicationRating: review.communicationRating,
      locationRating: review.locationRating,
      valueRating: review.valueRating,
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteReview(review.id);

      if (result.success) {
        toast.success(result.message || "Review deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete review error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 justify-between">
          <div className="flex gap-3">
            <Avatar className="size-12">
              <AvatarImage src={`${review.user.image}`} />
              <AvatarFallback>{review.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-md font-bold">{review.user.name}</p>

              <p className="text-xs text-muted-foreground">
                Joined Airbnb {timeAgo(review.user.createdAt)}
              </p>
            </div>
          </div>

          {/* Edit/Delete buttons for review owner */}
          {isOwner && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 px-2 hover:bg-gray-100"
              >
                <MdEdit className="w-4 h-4" />
                <span className="ml-1 text-xs">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="h-8 px-2 hover:bg-red-50 hover:text-red-600"
              >
                <MdDelete className="w-4 h-4" />
                <span className="ml-1 text-xs">Delete</span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <StarRatings
            rating={review.averageRating}
            starRatedColor="black"
            starDimension="12px"
            starSpacing="1px"
          />
          <p>&middot;</p>
          <p className="text-xs">{timeAgo(review.createdAt)}</p>
        </div>
        <div className="text-xs">
          {review.comment} Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Error impedit est sit porro velit rerum delectus ullam! Cumque
          at dolorum voluptatum dolores ratione provident? Ducimus omnis maiores
          doloribus ea corrupti?
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-xs">Is this helpful?</p>

          <Button
            variant="ghost"
            onClick={() => handleVote(true)}
            disabled={isPending}
            className={userVote === true ? "bg-blue-50" : ""}
          >
            <FaThumbsUp
              className={`text-xs ${userVote === true ? "text-blue-600" : ""}`}
            />
            <span className="ml-1">{helpfulCount}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleVote(false)}
            disabled={isPending}
            className={userVote === false ? "bg-red-50" : ""}
          >
            <FaThumbsDown
              className={`text-xs ${userVote === false ? "text-red-500" : ""}`}
            />
            <span className="ml-1">{notHelpfulCount}</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewCard;
