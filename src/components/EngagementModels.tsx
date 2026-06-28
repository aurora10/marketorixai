"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function EngagementModels() {
  const t = useTranslations("EngagementModels");
  const locale = useLocale();

  const models = [
    { key: "audit" },
    { key: "poc" },
    { key: "retainer" },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-24 border-t border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl text-white font-bold mb-10 text-center tracking-tight">{t("title")}</h2>
        <p className="text-lg text-white/80">{t("description")}</p>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {models.map(({ key }) => (
          <motion.div
            key={key}
            variants={cardVariants}
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 flex flex-col hover:bg-opacity-30 transition-colors duration-300 shadow-soft"
          >
            <h3 className="text-2xl font-bold mb-2 text-white">{t(`models.${key}.title`)}</h3>
            <div className="text-3xl font-extrabold text-yellow-400 mb-2">{t(`models.${key}.price`)}</div>
            <div className="text-sm text-white/80 mb-6 font-medium">
              Timeline: {t(`models.${key}.duration`)}
            </div>
            
            <p className="text-white/80 mb-8 flex-grow">
              {t(`models.${key}.description`)}
            </p>

            <ul className="space-y-4 mb-8">
              {/* @ts-ignore - we know it's an array */}
              {t.raw(`models.${key}.features`).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/contact`}
              className="mt-auto block text-center bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              {key === "retainer" ? t("ctaButtonRetainer") : t("ctaButton")}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
