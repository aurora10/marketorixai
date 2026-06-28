"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQAccordion() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { key: "q1" },
    { key: "q2" },
    { key: "q3" },
    { key: "q4" },
  ];

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl text-white md:text-5xl font-bold mb-10 text-center tracking-tight">{t("title")}</h2>
        
        <div className="space-y-4">
          {faqs.map(({ key }, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={key} 
                className={`border rounded-2xl transition-colors duration-300 ${isOpen ? 'border-yellow-400 bg-white/10' : 'border-white/20 bg-white/5 hover:border-yellow-400/50 backdrop-blur-lg'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-6 flex items-center justify-between focus:outline-none"
                >
                  <span className="font-semibold text-lg pr-8 text-white">
                    {t(`items.${key}.question`)}
                  </span>
                  <span className="flex-shrink-0 text-yellow-400">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-white/80 leading-relaxed">
                        {t(`items.${key}.answer`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
