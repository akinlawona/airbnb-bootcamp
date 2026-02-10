"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "../logo/Logo";
import Menu from "./Menu";
import Container from "../Container";
import HeaderLinks from "./HeaderLinks";
import MorphingSearchBar from "./MorphingSearchBar";

const Navbar = () => {
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
    <motion.div
      className="bg-gray-50 fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200"
      animate={{
        boxShadow: isScrolled
          ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
      transition={{ duration: 0.3 }}
    >
      <Container>
        <div className="flex justify-between items-center ">
          <Logo />

          {/* Center area - either HeaderLinks or Compact SearchBar */}
          <div className="flex-1 flex justify-center">
            <AnimatePresence mode="wait">
              {!isScrolled ? (
                <motion.div
                  key="header-links"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <HeaderLinks />
                </motion.div>
              ) : (
                <MorphingSearchBar isScrolled={isScrolled} compact />
              )}
            </AnimatePresence>
          </div>

          <Menu />
        </div>

        {/* Expanded SearchBar - collapses when scrolled */}
        {!isScrolled && (
          <motion.div
            key="expanded-search"
            initial={{ scaleX: 0.5, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0.5, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ transformOrigin: "center" }}
          >
            <MorphingSearchBar isScrolled={isScrolled} />
          </motion.div>
        )}
      </Container>
    </motion.div>
  );
};

export default Navbar;
