"use client";

import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function ProcessTimeline() {
  const t = useTranslations("Process");

  const steps = [
    { key: "step1", num: "01" },
    { key: "step2", num: "02" },
    { key: "step3", num: "03" },
    { key: "step4", num: "04" },
  ];

  return (
    <section className="container mx-auto px-4 py-24 border-t border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl text-white md:text-5xl font-bold mb-10 text-center tracking-tight">{t("title")}</h2>
        <p className="text-lg text-white/80">{t("description")}</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {steps.map(({ key, num }, index) => (
          <motion.div key={key} variants={stepVariants} className="relative group">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 h-full hover:bg-opacity-30 transition-all duration-300">
              <div className="text-5xl font-black text-white/20 mb-6 group-hover:text-yellow-400/50 transition-colors">
                {num}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-white/80 text-sm">
                {t(`steps.${key}.description`)}
              </p>
            </div>
            
            {/* Arrow connecting steps on large screens */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 text-white/20">
                <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
