"use client"; // Ensures this component is rendered on the client-side

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function TransformBusinessCTA() {
  const t = useTranslations("CTA");
  const locale = useLocale();
  const contactHref = locale ? `/${locale}/contact` : "/contact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-20 text-center"
    >
      <h2 className="text-3xl font-bold mb-6">
        {t("title")}
      </h2>
      <Link href={contactHref} passHref legacyBehavior>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-400 text-purple-900 px-10 py-5 mb-10 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-cardHover inline-block"
        >
          {t("button")}
        </motion.a>
      </Link>
    </motion.div>
  );
}
