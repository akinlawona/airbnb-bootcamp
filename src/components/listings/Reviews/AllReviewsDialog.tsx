"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useShowAllReviewsDialogStore from "@/hooks/use-show-all-reviews-dialog";
import { ReviewWithUserInfo } from "@/lib/types";
import ReviewCard from "./ReviewCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangeEvent, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReviewsHeader from "./ReviewsHeader";

type Props = {
  reviews: ReviewWithUserInfo[];
  listingId: string;
};

const AllReviewsDialog = ({ reviews, listingId }: Props) => {
  const { isOpen, close } = useShowAllReviewsDialogStore();
  const [selectedSort, setSelectedSort] = useState("Most relevant");
  const [sortedReviews, setSortedReviews] = useState(reviews);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleDialogClose = () => {
    close();
  };

  const handleMostRelevant = () => {
    setSelectedSort("Most Relevant");
    setSortedReviews(reviews);
  };

  const handleMostRecent = () => {
    setSelectedSort("Most recent");
    const sorted = [...sortedReviews].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setSortedReviews(sorted);
  };

  const handleHighestRated = () => {
    setSelectedSort("Highest rated");
    const sorted = [...sortedReviews].sort(
      (a, b) => b.averageRating - a.averageRating,
    );
    setSortedReviews(sorted);
  };
  const handleLowestRated = () => {
    setSelectedSort("Lowest rated");
    const sorted = [...sortedReviews].sort(
      (a, b) => a.averageRating - b.averageRating,
    );
    setSortedReviews(sorted);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() === "") {
      setSortedReviews(reviews);
    } else {
      const filteredReview = reviews.filter(
        (review) =>
          review.comment?.toLowerCase().includes(value.toLowerCase()) ||
          review.user.name?.toLowerCase().includes(value.toLowerCase()),
      );
      setSortedReviews(filteredReview);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="rounded-3xl md:min-w-5xl max-h-[80vh] flex flex-col  ">
        <DialogTitle className="text-center">All Reviews</DialogTitle>
        {/* <hr /> */}
        {toggleSearch ? (
          <Input onChange={(e) => handleSearch(e)} value={searchText} />
        ) : null}
        <div className="flex flex-col gap-10 flex-1 overflow-y-auto">
          <div className=" py-3">
            <ReviewsHeader reviews={reviews} />
          </div>

          <div className=" flex flex-col pr-2 gap-10">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-md font-semibold">
                  {sortedReviews.length === 1
                    ? `${sortedReviews.length} review`
                    : `${sortedReviews.length} reviews`}
                </p>
                <p className="text-xs underline">How reviews work </p>
              </div>
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                  <div
                    className={`text-xs border rounded-lg pl-3 pr-3 pt-1 pb-1 flex items-center gap-2
                hover:cursor-pointer ${isDropdownOpen ? "border-black" : ""}
                    `}
                  >
                    {selectedSort}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleMostRelevant}>
                    Most relevant
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMostRecent}>
                    Most recent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleHighestRated}>
                    Highest rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLowestRated}>
                    Lowest rated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {sortedReviews.length > 0 ? (
                sortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    listingId={listingId}
                  />
                ))
              ) : searchText.trim() !== "" ? (
                <div className="col-span-2 text-center py-10 text-gray-500">
                  No results match your search term &quot;{searchText}&quot;
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllReviewsDialog;
