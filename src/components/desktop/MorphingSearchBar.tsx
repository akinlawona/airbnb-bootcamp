"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import GuestFilter from "./GuestFilter";
import useGuestFilterStore from "@/hooks/use-guest-filter-store";
import useReservationCalendarStore from "@/hooks/use-reservation-calendar-store";
import useSearchFilterStore from "@/hooks/use-search-filter-store";
import useSearchLocationStore from "@/hooks/use-search-location-store";
import { IoMdClose } from "react-icons/io";
import { dateRangeText } from "@/lib/helpers";
import { useRouter, useSearchParams } from "next/navigation";

interface MorphingSearchBarProps {
  isScrolled: boolean;
  compact?: boolean;
}

const MorphingSearchBar = ({
  isScrolled,
  compact = false,
}: MorphingSearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { adultsCount, childrenCount, infantsCount, petsCount, reset } =
    useGuestFilterStore();

  const { date, setDate } = useReservationCalendarStore();
  const { open: openFilters, getActiveFilterCount } = useSearchFilterStore();
  const { location, setLocation } = useSearchLocationStore();

  const isGuestNotEmpty =
    adultsCount > 0 || childrenCount > 0 || infantsCount > 0 || petsCount > 0;

  const totalGuests = adultsCount + childrenCount + infantsCount + petsCount;

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.set("location", location);
    if (date?.from) params.set("checkIn", formatDateLocal(date.from));
    if (date?.to) params.set("checkOut", formatDateLocal(date.to));
    if (adultsCount > 0) params.set("adults", adultsCount.toString());
    if (childrenCount > 0) params.set("children", childrenCount.toString());
    if (infantsCount > 0) params.set("infants", infantsCount.toString());
    if (petsCount > 0) params.set("pets", petsCount.toString());

    router.push(`/search?${params.toString()}`);
  };

  // Helper function to format date in local timezone
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Update URL when dates or guests change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    const currentCheckIn = params.get("checkIn");
    const currentCheckOut = params.get("checkOut");
    const newCheckIn = date?.from ? formatDateLocal(date.from) : null;
    const newCheckOut = date?.to ? formatDateLocal(date.to) : null;

    if (newCheckIn !== currentCheckIn) {
      hasChanges = true;
      if (newCheckIn) {
        params.set("checkIn", newCheckIn);
      } else {
        params.delete("checkIn");
      }
    }

    if (newCheckOut !== currentCheckOut) {
      hasChanges = true;
      if (newCheckOut) {
        params.set("checkOut", newCheckOut);
      } else {
        params.delete("checkOut");
      }
    }

    const currentAdults = params.get("adults");
    if (adultsCount > 0) {
      if (currentAdults !== adultsCount.toString()) {
        hasChanges = true;
        params.set("adults", adultsCount.toString());
      }
    } else if (currentAdults) {
      hasChanges = true;
      params.delete("adults");
    }

    const currentChildren = params.get("children");
    if (childrenCount > 0) {
      if (currentChildren !== childrenCount.toString()) {
        hasChanges = true;
        params.set("children", childrenCount.toString());
      }
    } else if (currentChildren) {
      hasChanges = true;
      params.delete("children");
    }

    const currentInfants = params.get("infants");
    if (infantsCount > 0) {
      if (currentInfants !== infantsCount.toString()) {
        hasChanges = true;
        params.set("infants", infantsCount.toString());
      }
    } else if (currentInfants) {
      hasChanges = true;
      params.delete("infants");
    }

    const currentPets = params.get("pets");
    if (petsCount > 0) {
      if (currentPets !== petsCount.toString()) {
        hasChanges = true;
        params.set("pets", petsCount.toString());
      }
    } else if (currentPets) {
      hasChanges = true;
      params.delete("pets");
    }

    if (hasChanges) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    date,
    adultsCount,
    childrenCount,
    infantsCount,
    petsCount,
    router,
    searchParams,
  ]);

  // For compact mode, render simple button
  if (compact) {
    return (
      <motion.button
        className="flex items-center gap-3 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow pl-4 pr-2 py-2 bg-white overflow-hidden min-w-[320px]"
        initial={{ width: "600px", opacity: 0 }}
        animate={{ width: "380px", opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.1,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm font-semibold whitespace-nowrap truncate max-w-[120px]">
          {location || "Anywhere"}
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-semibold whitespace-nowrap">
          {date?.from && date?.to
            ? `${format(date.from, "MMM d")} - ${format(date.to, "MMM d")}`
            : "Any Time"}
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-semibold whitespace-nowrap">
          {totalGuests > 0
            ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
            : "Add guests"}
        </span>
        <motion.div
          className="bg-[#FF385C] text-white p-3 rounded-full flex-shrink-0 ml-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SearchIcon size={15} />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <div className="hidden md:flex justify-center py-4">
      <motion.div
        className="flex items-center rounded-full bg-white shadow-2xl border-1 border-gray-300 overflow-hidden"
        initial={false}
        animate={{
          width: isScrolled ? "360px" : "66.666667%",
          height: isScrolled ? "48px" : "64px",
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {!isScrolled ? (
          /* Expanded State */
          <>
            <motion.div
              onClick={() => inputRef.current?.focus()}
              className="flex flex-col w-1/3 justify-center px-6 border-r-1 rounded-l-full border-gray-300 hover:bg-gray-200 hover:cursor-pointer"
              initial={false}
              animate={{ opacity: 1, flex: "1 1 33.333333%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="text-gray-900 text-xs font-semibold whitespace-nowrap"
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Where
              </motion.div>
              <Input
                ref={inputRef}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search destinations"
                className="placeholder:text-xs placeholder:text-gray-500 h-7 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none p-0"
              />
            </motion.div>

            <motion.div
              className="flex flex-col w-1/5 justify-center px-6 border-r-1 border-gray-300 hover:bg-gray-200 hover:cursor-pointer"
              initial={false}
              animate={{ opacity: 1, flex: "1 1 20%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="text-gray-900 text-xs font-semibold whitespace-nowrap"
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Check in
              </motion.div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date?.from}
                    className="data-[empty=true]:text-muted-foreground h-7 justify-start text-left text-xs border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none p-0 hover:bg-transparent bg-transparent hover:cursor-pointer"
                  >
                    {date?.from ? (
                      format(date.from, "PP")
                    ) : (
                      <span className="text-gray-500 whitespace-nowrap">
                        Add dates
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </motion.div>

            <motion.div
              className="flex flex-col w-1/5 justify-center px-6 border-r-1 border-gray-300 hover:bg-gray-200 hover:cursor-pointer"
              initial={false}
              animate={{ opacity: 1, flex: "1 1 20%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="text-gray-900 text-xs font-semibold whitespace-nowrap"
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Check out
              </motion.div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date?.to}
                    className="data-[empty=true]:text-muted-foreground h-7 justify-start text-left text-xs border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none p-0 hover:bg-transparent bg-transparent hover:cursor-pointer"
                  >
                    {date?.to ? (
                      format(date.to, "PP")
                    ) : (
                      <span className="text-gray-500 whitespace-nowrap">
                        Add dates
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </motion.div>

            <motion.div
              className="flex w-1/3 justify-between items-center pl-6 pr-2 border-gray-300 hover:bg-gray-200 rounded-r-full"
              initial={false}
              animate={{ opacity: 1, flex: "1 1 33.333333%" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <div>
                <motion.div
                  className="text-gray-900 text-xs font-semibold whitespace-nowrap"
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  Who
                </motion.div>
                <GuestFilter />
              </div>
              {isGuestNotEmpty && (
                <IoMdClose
                  onClick={reset}
                  size={16}
                  className="font-semibold hover:cursor-pointer"
                />
              )}
              <div>
                <SearchIcon
                  onClick={handleSearch}
                  className="text-white bg-[#FF385C] rounded-full p-4 hover:cursor-pointer"
                  size={50}
                />
              </div>
            </motion.div>
          </>
        ) : (
          /* Compact State */
          <motion.div
            className="flex items-center gap-3 px-4 py-2 w-full"
            layout
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className="text-sm font-semibold whitespace-nowrap truncate max-w-[100px]">
              {location || "Anywhere"}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-semibold whitespace-nowrap">
              Any week
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {totalGuests > 0
                ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
                : "Add guests"}
            </span>
            <motion.div
              className="bg-[#FF385C] text-white p-2 rounded-full flex-shrink-0 ml-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SearchIcon className="w-3 h-3" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MorphingSearchBar;
