"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={300}
            height={300}
            priority={true}
          />
        </a>
        <div className="hidden md:flex space-x-6">
          {["Home", "Services", "Team", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative text-lg transition-colors group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4"
        >
          {["Home", "Services", "Team", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="block py-2 relative transition-colors group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-5 bg-yellow-300 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
