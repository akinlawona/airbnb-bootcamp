"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import useGuestFilterStore from "@/hooks/use-guest-filter-store";

const CompactSearchBar = () => {
  const { adultsCount, childrenCount, infantsCount, petsCount } =
    useGuestFilterStore();

  const totalGuests = adultsCount + childrenCount + infantsCount + petsCount;

  return (
    <motion.button
      className="flex items-center gap-3 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow px-4 py-2 bg-white overflow-hidden max-w-md"
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-sm font-semibold whitespace-nowrap">Anywhere</span>
      <span className="text-gray-300">|</span>
      <span className="text-sm font-semibold whitespace-nowrap">Any week</span>
      <span className="text-gray-300">|</span>
      <span className="text-sm text-gray-600 whitespace-nowrap">
        {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
      </span>
      <motion.div
        className="bg-[#FF385C] text-white p-2 rounded-full flex-shrink-0 ml-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SearchIcon className="w-3 h-3" />
      </motion.div>
    </motion.button>
  );
};

export default CompactSearchBar;
