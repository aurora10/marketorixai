"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image"; // Reverted back to next/image
import Link from "next/link";

export default function Header({ darkMode = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textColor = darkMode ? "text-gray-800" : "text-gray-200";

  return (
    <header className={`container mx-auto px-4 py-6 ${textColor}`}>
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" aria-label="Marketorix Home">
          {/* Reverted back to using next/image for the logo */}
          {darkMode ? (
            <Image
              src="/logo-dark.svg"
              alt="Logo"
              width={300}
              height={300}
              priority={true}
              className="h-12 w-auto"
            />
          ) : (
            <Image
              src="/logo.svg"
              alt="Logo"
              width={300}
              height={300}
              priority={true}
              className="h-12 w-auto"
            />
          )}
        </Link>
        <div className="hidden md:flex space-x-6">
          {["Home", "Services", "Team", "Blog", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={`relative text-lg transition-colors group ${textColor}`}
            >
              {item}
              {/* Use accent color for underline */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          // Use card background, shadow, and consistent rounding for mobile menu
          className="md:hidden mt-4 bg-card shadow-md rounded-lg p-4"
        >
          {["Home", "Services", "Team", "Blog", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="block py-2 relative transition-colors group"
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              {item}
              {/* Use accent color for underline and adjust height */}
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
}