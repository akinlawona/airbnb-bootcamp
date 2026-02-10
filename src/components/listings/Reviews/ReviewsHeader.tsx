import { ReviewWithUserInfo } from "@/lib/types";
import { meanBy } from "lodash";
import LeftFlower from "../LeftFlower";
import RightFlower from "../RightFlower";
import { PiSprayBottle } from "react-icons/pi";
import { FaRegCheckCircle, FaRegCommentAlt } from "react-icons/fa";
import { BsKey } from "react-icons/bs";
import { GrMapLocation } from "react-icons/gr";
import { LuTag } from "react-icons/lu";
import { Progress } from "@/components/ui/progress";

type Props = {
  reviews: ReviewWithUserInfo[];
};

const ReviewsHeader = ({ reviews }: Props) => {
  const averageRating =
    reviews.length > 0 ? meanBy(reviews, (review) => review.averageRating) : 0;
  const averageCleanlinessRating =
    reviews.length > 0
      ? meanBy(reviews, (review) => review.cleanlinessRating)
      : 0;
  const averageAccuracyRating =
    reviews.length > 0 ? meanBy(reviews, (review) => review.accuracyRating) : 0;
  const averageCheckInRating =
    reviews.length > 0 ? meanBy(reviews, (review) => review.checkInRating) : 0;
  const averageCommunicationRating =
    reviews.length > 0
      ? meanBy(reviews, (review) => review.communicationRating)
      : 0;
  const averageLocationRating =
    reviews.length > 0 ? meanBy(reviews, (review) => review.locationRating) : 0;
  const averageValueRating =
    reviews.length > 0 ? meanBy(reviews, (review) => review.valueRating) : 0;

  const fiveStarCount = reviews.filter(
    (review) => review.averageRating === 5,
  ).length;
  const fourStarCount = reviews.filter(
    (review) => review.averageRating >= 4 && review.averageRating < 5,
  ).length;
  const threeStarCount = reviews.filter(
    (review) => review.averageRating >= 3 && review.averageRating < 4,
  ).length;
  const twoStarCount = reviews.filter(
    (review) => review.averageRating >= 2 && review.averageRating < 3,
  ).length;
  const oneStarCount = reviews.filter(
    (review) => review.averageRating >= 1 && review.averageRating < 2,
  ).length;

  const totalReviews = reviews.length;
  const fiveStarPercentage =
    totalReviews > 0 ? (fiveStarCount / totalReviews) * 100 : 0;
  const fourStarPercentage =
    totalReviews > 0 ? (fourStarCount / totalReviews) * 100 : 0;
  const threeStarPercentage =
    totalReviews > 0 ? (threeStarCount / totalReviews) * 100 : 0;
  const twoStarPercentage =
    totalReviews > 0 ? (twoStarCount / totalReviews) * 100 : 0;
  const oneStarPercentage =
    totalReviews > 0 ? (oneStarCount / totalReviews) * 100 : 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <LeftFlower height={96} />

          <p className="text-8xl font-bold">{averageRating.toFixed(1)}</p>

          <RightFlower height={96} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p>Guest Favorite</p>
          <p className="text-xs text-muted-foreground w-3/4">
            This home is in the top 10% of eligible listings based on ratings,
            reviews, and reliability
          </p>
        </div>
      </div>
      <div className="flex items-center justify-around ">
        <div className="flex flex-col font-bold ">
          <div className="flex flex-col gap-1 mb-1">
            <p className="text-xs">Overall rating</p>
          </div>
          <div className="flex gap-2 items-center ">
            <p className="text-xs">5</p>
            <Progress value={fiveStarPercentage} className="w-full" />
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xs">4</p>
            <Progress value={fourStarPercentage} className="w-full" />
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xs">3</p>
            <Progress value={threeStarPercentage} className="w-full" />
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xs">2</p>
            <Progress value={twoStarPercentage} className="w-full" />
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xs">1</p>
            <Progress value={oneStarPercentage} className="w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-8 border-l pl-2 font-bold">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Cleanliness</p>
            <p className="text-xs">{averageCleanlinessRating}</p>
          </div>
          <PiSprayBottle size={30} />
        </div>

        <div className="flex flex-col gap-8 border-l pl-2 font-bold">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Accuracy</p>
            <p className="text-xs">{averageAccuracyRating}</p>
          </div>
          <FaRegCheckCircle size={30} />
        </div>
        <div className="flex flex-col gap-8 border-l pl-2 font-bold">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Check-in</p>
            <p className="text-xs">{averageCheckInRating}</p>
          </div>
          <BsKey size={30} />
        </div>
        <div className="flex flex-col gap-8 border-l pl-2 font-bold">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Communication</p>
            <p className="text-xs">{averageCommunicationRating}</p>
          </div>
          <FaRegCommentAlt size={30} />
        </div>
        <div className="flex flex-col gap-8 border-l pl-2 font-bold">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Location</p>
            <p className="text-xs">{averageLocationRating}</p>
          </div>
          <GrMapLocation size={30} />
        </div>
        <div className="flex flex-col gap-8 border-l pl-2 font-bold">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Value</p>
            <p className="text-xs">{averageValueRating}</p>
          </div>
          <LuTag size={30} />
        </div>
      </div>
    </div>
  );
};

export default ReviewsHeader;
