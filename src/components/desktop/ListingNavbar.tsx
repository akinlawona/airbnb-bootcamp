"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "../logo/Logo";
import Menu from "./Menu";
import Container from "../Container";
import HeaderLinks from "./HeaderLinks";
import MorphingSearchBar from "./MorphingSearchBar";

const ListingNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Overlay backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <motion.div
        className="bg-gray-50 fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200"
        animate={{
          boxShadow: isExpanded
            ? "0 10px 15px -3px rgb(0 0 0 / 0.1)"
            : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
        transition={{ duration: 0.3 }}
      >
        <Container>
          <div className="flex justify-between items-center">
            <Logo />

            {/* Center area - Compact SearchBar with click to expand */}
            <div className="flex-1 flex justify-center">
              <AnimatePresence mode="wait">
                {!isExpanded && (
                  <motion.div
                    key="compact-search"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsExpanded(true)}
                  >
                    <MorphingSearchBar isScrolled={true} compact />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Menu />
          </div>

          {/* Expanded state - HeaderLinks + SearchBar */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                {/* HeaderLinks */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex justify-center items-center w-full py-4"
                >
                  <HeaderLinks />
                </motion.div>

                {/* Expanded SearchBar */}
                <motion.div
                  initial={{ scaleX: 0.5, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0.5, opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ transformOrigin: "center" }}
                >
                  <MorphingSearchBar isScrolled={false} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </motion.div>
    </>
  );
};

export default ListingNavbar;
