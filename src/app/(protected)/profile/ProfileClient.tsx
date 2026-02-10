"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

import { Prisma } from "../../../../generated/prisma";
import TripsSection from "./TripsSection";
import UserReviewsSection from "./UserReviewsSection";

type ProfileData = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    createdAt: Date;
  };
  stats: {
    totalTrips: number;
    totalReviews: number;
    memberSince: Date;
  };
  trips: Prisma.ReservationGetPayload<{
    include: {
      listing: {
        include: {
          photos: true;
          category: true;
        };
      };
    };
  }>[];
  reviews: Prisma.ReviewGetPayload<{
    include: {
      listing: {
        select: {
          id: true;
          title: true;
          city: true;
          state: true;
        };
      };
    };
  }>[];
};

type Props = {
  profileData: ProfileData;
};

const ProfileClient = ({ profileData }: Props) => {
  const { user, stats, trips, reviews } = profileData;

  const memberDuration = formatDistanceToNow(stats.memberSince, {
    addSuffix: false,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="size-24">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-3xl">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600">Airbnb member for {memberDuration}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">{stats.totalTrips}</p>
                <p className="text-gray-600 text-sm">
                  {stats.totalTrips === 1 ? "Trip" : "Trips"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">{stats.totalReviews}</p>
                <p className="text-gray-600 text-sm">
                  {stats.totalReviews === 1 ? "Review" : "Reviews"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">
                  {new Date(stats.memberSince).getFullYear()}
                </p>
                <p className="text-gray-600 text-sm">Member since</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="trips" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="trips">
          <TripsSection trips={trips} />
        </TabsContent>

        <TabsContent value="reviews">
          <UserReviewsSection reviews={reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileClient;
