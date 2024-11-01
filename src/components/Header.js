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
              className="text-lg hover:text-yellow-300 transition-colors"
            >
              {item}
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
              className="block py-2 hover:text-yellow-300 transition-colors"
            >
              {item}
            </a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
