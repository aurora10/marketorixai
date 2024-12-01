"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function InteractiveScrollToTop() {
  return (
    <motion.div
      className="fixed bottom-8 right-8 bg-yellow-400 text-purple-900 rounded-full p-4 cursor-pointer "
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronDown className="transform rotate-180" />
    </motion.div>
  );
}
