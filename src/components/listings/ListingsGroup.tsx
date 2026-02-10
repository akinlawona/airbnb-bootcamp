import { ListingCardData } from "@/lib/types";
import Image from "next/image";
import React from "react";
import ListingCard from "./ListingCard";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

type ListingGroupProps = {
  city: string;
  country: string;
  listings: ListingCardData[];
};

const ListingsGroup = ({ city, country, listings }: ListingGroupProps) => {
  if (listings.length === 0) {
    return null;
  }

  const header = country ? `${city}, ${country}` : city;

  return (
    <div className="mb-10">
      <div className="flex items-center mb-5">
        <Link
          href={`/search?city=${city}`}
          className="flex items-center hover:underline"
        >
          <p className="font-semibold text-lg text-gray-900">{header}</p>
          <IoIosArrowForward
            size={16}
            className="font-semibold text-gray-900"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default ListingsGroup;
