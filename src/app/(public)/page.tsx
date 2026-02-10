import Container from "@/components/Container";
import ListingsGroup from "@/components/listings/ListingsGroup";
import { getListingsByCity } from "@/db/listing";
import React from "react";

type Props = {};

const HomePage = async (props: Props) => {
  const result = await getListingsByCity();

  if (!result.success || result.data.length === 0) {
    return (
      <div className="max-w-7xl xl:max-w-5xl mx-auto py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-semibold">No listings available</h2>
          <p className="text-gray-600">
            Check back soon for amazing places to stay!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl xl:max-w-5xl mx-auto">
      {result.data.map((group) => (
        <ListingsGroup
          key={group.city}
          city={group.city}
          country={group.country}
          listings={group.listings}
        />
      ))}
    </div>
  );
};

export default HomePage;
