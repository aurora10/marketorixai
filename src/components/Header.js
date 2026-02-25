"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image"; // Reverted back to next/image
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ darkMode = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textColor = darkMode ? "text-gray-800" : "text-gray-200";
  const t = useTranslations("Navigation");
  const locale = useLocale();

  // Helper to build localized URL
  const getHref = (path) => {
    if (locale && path.startsWith('/')) {
      const isRoot = path === '/';
      return `/${locale}${isRoot ? '' : path}`;
    }
    return path;
  };

  const menuItems = [
    { name: t("home"), href: getHref("/") },
    { name: t("services"), href: getHref("/services") },
    { name: t("team"), href: getHref("/team") },
    { name: t("blog"), href: getHref("/blog") },
    { name: t("contact"), href: getHref("/contact") },
  ];

  return (
    <header className={`container mx-auto px-4 py-6 ${textColor}`}>
      <nav className="flex justify-between items-center">
        <Link href={getHref("/")} className="text-2xl font-bold" aria-label="Marketorix Home">
          {/* Reverted back to using next/image for the logo */}
          {darkMode ? (
            <Image
              src="/logo2.svg"
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
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative text-lg transition-colors group ${textColor}`}
            >
              {item.name}
              {/* Use accent color for underline */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <div className="pl-4 border-l border-current">
            <LanguageSwitcher darkMode={darkMode} />
          </div>
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
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-2 relative transition-colors group"
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              {item.name}
              {/* Use accent color for underline and adjust height */}
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-border">
            <LanguageSwitcher darkMode={true} />
          </div>
        </motion.div>
      )}
    </header>
  );
}