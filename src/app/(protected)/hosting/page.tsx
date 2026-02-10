import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import HostingClient from "./HostingClient";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const page = (props: Props) => {
  const todaysReservations = [{}];
  const upcomingReservations = [{}];

  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      }
    >
      <HostingClient
        todaysReservations={todaysReservations}
        upcomingReservations={upcomingReservations}
      />
    </Suspense>
  );
};

export default page;
