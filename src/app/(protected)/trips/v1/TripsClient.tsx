"use client";
import { Trips } from "@/lib/types";
import React from "react";
import TripCard from "./TripCard";
import WriteReviewDialog from "@/components/listings/WriteReviewDialog";

type Props = {
  trips: Trips[];
};

const TripsClient = ({ trips }: Props) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Trips</h1>
      <div className="flex flex-col gap-4">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
      <WriteReviewDialog />
    </div>
  );
};

export default TripsClient;
