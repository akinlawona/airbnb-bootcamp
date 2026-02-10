"use client";

import React, { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Animated Navbar Component - Airbnb Style (with Framer Motion Morphing)
 *
 * This navbar morphs between two states based on scroll position:
 * 1. Expanded State (default) - Full search bar with multiple inputs
 * 2. Compact State (scrolled) - Condensed search button
 *
 * Features:
 * - Smooth morphing animations (no disappearing/appearing)
 * - Elements shrink and transform in place
 * - Layout-based transitions for natural feel
 * - Shared layout IDs for seamless morphing
 *
 * Usage in your app:
 * 1. Replace the current Navbar component in src/components/desktop/Navbar.tsx
 * 2. Adjust the scroll threshold (default: 80px) to your preference
 * 3. Customize colors and styling to match your brand
 */

const ScrollNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollThreshold = 80;

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setIsScrolled(currentScroll > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      animate={{
        boxShadow: isScrolled
          ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Row - Always visible */}
        <motion.div
          className="flex justify-between items-center"
          animate={{
            paddingTop: isScrolled ? "16px" : "16px",
            paddingBottom: isScrolled ? "16px" : "16px",
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-rose-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
            <motion.span
              className="text-xl font-bold text-rose-500"
              animate={{
                opacity: isScrolled ? 0 : 1,
                width: isScrolled ? 0 : "auto",
              }}
              transition={{ duration: 0.3 }}
            >
              airbnb
            </motion.span>
          </div>

          {/* Center - Morphing Search Bar */}
          <motion.div
            className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            layout
            animate={{
              maxWidth: isScrolled ? "360px" : "720px",
            }}
            transition={{
              layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            {!isScrolled ? (
              /* Expanded Search Inputs */
              <>
                <motion.div
                  className="flex-1 px-6 py-3 border-r border-gray-300 hover:bg-gray-100 rounded-l-full cursor-pointer min-w-0"
                  layout
                  initial={false}
                  animate={{ opacity: 1, flex: 1 }}
                  exit={{ opacity: 0, flex: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="text-xs font-semibold whitespace-nowrap">
                    Where
                  </div>
                  <Input
                    placeholder="Search destinations"
                    className="w-full text-sm placeholder:text-gray-500 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0 h-auto bg-transparent"
                  />
                </motion.div>
                <motion.div
                  className="flex-1 px-6 py-3 border-r border-gray-300 hover:bg-gray-100 cursor-pointer min-w-0"
                  layout
                  initial={false}
                  animate={{ opacity: 1, flex: 1 }}
                  exit={{ opacity: 0, flex: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="text-xs font-semibold whitespace-nowrap">
                    Check in
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    Add dates
                  </div>
                </motion.div>
                <motion.div
                  className="flex-1 px-6 py-3 border-r border-gray-300 hover:bg-gray-100 cursor-pointer min-w-0"
                  layout
                  initial={false}
                  animate={{ opacity: 1, flex: 1 }}
                  exit={{ opacity: 0, flex: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="text-xs font-semibold whitespace-nowrap">
                    Check out
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    Add dates
                  </div>
                </motion.div>
                <motion.div
                  className="flex-1 px-6 py-3 flex items-center justify-between hover:bg-gray-100 rounded-r-full cursor-pointer min-w-0"
                  layout
                  initial={false}
                  animate={{ opacity: 1, flex: 1 }}
                  exit={{ opacity: 0, flex: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div>
                    <div className="text-xs font-semibold whitespace-nowrap">
                      Who
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      Add guests
                    </div>
                  </div>
                  <motion.button
                    className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 transition-colors flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SearchIcon className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </>
            ) : (
              /* Compact Search Button */
              <motion.div
                className="flex items-center gap-3 px-4 py-2 w-full"
                layout
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="text-sm font-semibold whitespace-nowrap">
                  Anywhere
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-semibold whitespace-nowrap">
                  Any week
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Add guests
                </span>
                <motion.div
                  className="bg-rose-500 text-white p-2 rounded-full flex-shrink-0 ml-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SearchIcon className="w-3 h-3" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            <motion.button
              className="text-sm font-semibold text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-full whitespace-nowrap"
              animate={{
                opacity: isScrolled ? 0 : 1,
                width: isScrolled ? 0 : "auto",
                paddingLeft: isScrolled ? 0 : "12px",
                paddingRight: isScrolled ? 0 : "12px",
              }}
              transition={{ duration: 0.3 }}
            >
              Airbnb your home
            </motion.button>
            <button className="flex items-center gap-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow flex-shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <div className="w-7 h-7 bg-gray-600 rounded-full"></div>
            </button>
          </div>
        </motion.div>

        {/* Center Links Row - Only in Expanded State */}
        <motion.div
          className="flex justify-center gap-8 overflow-hidden"
          animate={{
            height: isScrolled ? 0 : "auto",
            opacity: isScrolled ? 0 : 1,
            marginBottom: isScrolled ? 0 : "16px",
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <button className="text-sm font-semibold text-gray-900 hover:text-gray-600 pb-3 border-b-2 border-gray-900">
            Stays
          </button>
          <button className="text-sm font-semibold text-gray-500 hover:text-gray-900 pb-3">
            Experiences
          </button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default ScrollNavbar;
