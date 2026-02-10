"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchListings } from "@/actions/search/search-listings";
import useSearchFilterStore from "@/hooks/use-search-filter-store";
import { Button } from "@/components/ui/button";
import { SearchFilterDialog } from "@/components/search/SearchFilterDialog";
import ListingsMap from "@/components/search/ListingsMap";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Listing {
  id: string;
  title: string | null;
  price: number | null;
  city: string | null;
  state: string | null;
  lat: number | null;
  lng: number | null;
  photos: Array<{ url: string; isCoverPicture: boolean }>;
  averageRating: number;
  reviewCount: number;
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { filters, open, getActiveFilterCount } = useSearchFilterStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || undefined;
  const checkOut = searchParams.get("checkOut") || undefined;
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const guests =
    adults || children
      ? parseInt(adults || "0") + parseInt(children || "0")
      : undefined;

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      const result = await searchListings({
        filters,
        checkIn,
        checkOut,
        guests,
        location,
      });

      if (result.success) {
        setListings(result.listings as Listing[]);
        setTotal(result.total);
      }
      setIsLoading(false);
    };

    loadListings();
  }, [filters, checkIn, checkOut, guests, location]);

  const activeFilterCount = getActiveFilterCount();
  const handleMarkerClick = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  return (
    <div className="min-h-screen pt-24">
      <SearchFilterDialog />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              {location ? `Stays in ${location}` : "Search results"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isLoading
                ? "Loading..."
                : `${total} ${total === 1 ? "stay" : "stays"}`}
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={open} className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Listings Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No properties found matching your criteria
                </p>
                <Button variant="outline" onClick={open} className="mt-4">
                  Adjust filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                      {listing.photos[0] ? (
                        <Image
                          src={listing.photos[0].url}
                          alt={listing.title || "Listing"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">No image</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold truncate">
                          {listing.city}, {listing.state}
                        </p>
                        {listing.reviewCount > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <span>★</span>
                            <span>{listing.averageRating.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {listing.title}
                      </p>
                      <p className="font-semibold">
                        ${listing.price}{" "}
                        <span className="font-normal text-muted-foreground">
                          night
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="hidden lg:block w-1/2 sticky top-24 h-[calc(100vh-8rem)]">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ListingsMap
                listings={listings}
                onMarkerClick={handleMarkerClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
