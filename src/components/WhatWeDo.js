"use client"; // Ensures this component is rendered on the client-side

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function What_we_do() {
  const t = useTranslations("ServicesSection");

  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-5xl md:text-6xl font-bold mb-10 text-center"
    >
      {t("title")}
    </motion.h1>
  );
}
