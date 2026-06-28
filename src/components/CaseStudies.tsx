"use client";

import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";

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

export default function CaseStudies() {
  const t = useTranslations("CaseStudies");

  const icons = [TrendingUp, ShieldCheck, Zap];

  const cases = [
    { key: "fintech" },
    { key: "healthcare" },
    { key: "retail" },
  ];

  return (
    <section className="container mx-auto px-4 py-24 bg-white/5 border-y border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl text-white md:text-5xl font-bold mb-10 text-center tracking-tight">{t("title")}</h2>
        <p className="text-lg text-white/80">{t("description")}</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {cases.map(({ key }, idx) => {
          const Icon = icons[idx];
          return (
            <motion.div
              key={key}
              variants={cardVariants}
              className="bg-white bg-opacity-20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:shadow-soft transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t(`items.${key}.title`)}</h3>
              <div className="text-3xl font-black text-yellow-400 mb-4 tracking-tight">
                {t(`items.${key}.metric`)}
              </div>
              <p className="text-white/80 leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
