"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useSearchFilterStore from "@/hooks/use-search-filter-store";
import { countFilteredListings } from "@/actions/search/count-listings";
import { getAmenities } from "@/db/amenities";
import { getPrivacyTypes } from "@/db/privacy-type";
import { getCategories } from "@/db/category";
import { X } from "lucide-react";

interface Amenity {
  id: string;
  name: string;
  icon: string;
}

interface PrivacyType {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export function SearchFilterDialog() {
  const searchParams = useSearchParams();
  const { filters, isOpen, close, reset, getActiveFilterCount } =
    useSearchFilterStore();
  const [listingCount, setListingCount] = useState(0);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [privacyTypes, setPrivacyTypes] = useState<PrivacyType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = searchParams.get("location") || undefined;
  const checkIn = searchParams.get("checkIn") || undefined;
  const checkOut = searchParams.get("checkOut") || undefined;
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const guests =
    adults || children
      ? parseInt(adults || "0") + parseInt(children || "0")
      : undefined;

  const {
    setMinPrice,
    setMaxPrice,
    setBedroomCount,
    setBedCount,
    setBathroomCount,
    setPrivacyTypeIds,
    setCategoryIds,
    setAmenityIds,
  } = useSearchFilterStore();

  // Load options
  useEffect(() => {
    const loadOptions = async () => {
      const [amenitiesData, privacyTypesData, categoriesData] =
        await Promise.all([getAmenities(), getPrivacyTypes(), getCategories()]);
      setAmenities(amenitiesData);
      setPrivacyTypes(privacyTypesData);
      setCategories(categoriesData);
    };
    loadOptions();
  }, []);

  // Count listings whenever filters change
  useEffect(() => {
    const updateCount = async () => {
      setIsLoading(true);
      const result = await countFilteredListings({
        filters,
        location,
        checkIn,
        checkOut,
        guests,
      });
      if (result.success) {
        setListingCount(result.count);
      }
      setIsLoading(false);
    };

    if (isOpen) {
      updateCount();
    }
  }, [filters, isOpen, location, checkIn, checkOut, guests]);

  const handlePriceChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const handleAmenityToggle = (amenityId: string) => {
    const current = filters.amenityIds || [];
    const updated = current.includes(amenityId)
      ? current.filter((id) => id !== amenityId)
      : [...current, amenityId];
    setAmenityIds(updated);
  };

  const handlePrivacyTypeToggle = (typeId: string) => {
    const current = filters.privacyTypeIds || [];
    const updated = current.includes(typeId)
      ? current.filter((id) => id !== typeId)
      : [...current, typeId];
    setPrivacyTypeIds(updated);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const current = filters.categoryIds || [];
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    setCategoryIds(updated);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl max-h-[90vh] !flex flex-col p-0 gap-0 overflow-hidden"
      >
        <DialogClose className="absolute top-6 right-6 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-50">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <DialogHeader className="px-6 py-5 border-b shrink-0">
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-8">
            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Price range</h3>
              <p className="text-sm text-muted-foreground">
                Nightly prices before fees and taxes
              </p>
              <div className="pt-4">
                <Slider
                  min={0}
                  max={100000}
                  step={1000}
                  value={[filters.minPrice || 0, filters.maxPrice || 100000]}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
                <div className="flex justify-between mt-4 text-sm">
                  <div className="border rounded-lg px-4 py-2">
                    <p className="text-xs text-muted-foreground">Minimum</p>
                    <p className="font-semibold">NOK{filters.minPrice || 0}</p>
                  </div>
                  <div className="border rounded-lg px-4 py-2">
                    <p className="text-xs text-muted-foreground">Maximum</p>
                    <p className="font-semibold">
                      NOK {filters.maxPrice || 100000}+
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Rooms and beds */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rooms and beds</h3>

              <div>
                <Label className="text-sm font-medium">Bedrooms</Label>
                <div className="flex gap-2 mt-2">
                  {["Any", "1", "2", "3", "4", "5+"].map((option, idx) => (
                    <Button
                      key={option}
                      variant={
                        (idx === 0 && !filters.bedroomCount) ||
                        filters.bedroomCount === idx
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setBedroomCount(idx === 0 ? undefined : idx)
                      }
                      className="flex-1"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Beds</Label>
                <div className="flex gap-2 mt-2">
                  {["Any", "1", "2", "3", "4", "5+"].map((option, idx) => (
                    <Button
                      key={option}
                      variant={
                        (idx === 0 && !filters.bedCount) ||
                        filters.bedCount === idx
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setBedCount(idx === 0 ? undefined : idx)}
                      className="flex-1"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Bathrooms</Label>
                <div className="flex gap-2 mt-2">
                  {["Any", "1", "2", "3", "4+"].map((option, idx) => (
                    <Button
                      key={option}
                      variant={
                        (idx === 0 && !filters.bathroomCount) ||
                        filters.bathroomCount === idx
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setBathroomCount(idx === 0 ? undefined : idx)
                      }
                      className="flex-1"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Property type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property type</h3>
              <div className="grid grid-cols-2 gap-3">
                {privacyTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`privacy-${type.id}`}
                      checked={filters.privacyTypeIds?.includes(type.id)}
                      onCheckedChange={() => handlePrivacyTypeToggle(type.id)}
                    />
                    <Label
                      htmlFor={`privacy-${type.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.id}`}
                      checked={filters.amenityIds?.includes(amenity.id)}
                      onCheckedChange={() => handleAmenityToggle(amenity.id)}
                    />
                    <Label
                      htmlFor={`amenity-${amenity.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {amenity.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t shrink-0 flex justify-between items-center">
          <Button variant="ghost" onClick={handleReset}>
            Clear all
          </Button>
          <Button
            onClick={close}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? "Loading..." : `Show ${listingCount} places`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
