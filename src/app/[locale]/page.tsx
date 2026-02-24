"use client"; // Add this if not already present

import { useState } from 'react'; // Import useState
import { motion, Variants } from 'framer-motion'; // Import motion and Variants
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";
import MotionServiceCard from "@/components/MotionServiceCard";
import { useTranslations } from 'next-intl';

// Define variants for the grid container to stagger children
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 }, // Can be simple or empty
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Adjust stagger delay as needed
    },
  },
};

export default function LandingPage() {
  const t = useTranslations();
  // State to track if the service grid has animated
  const [gridAnimated, setGridAnimated] = useState(false);

  const services = [
    {
      title: t("Services.autonomous_agents.title"),
      description: t("Services.autonomous_agents.description"),
    },
    {
      title: t("Services.strategy.title"),
      description: t("Services.strategy.description"),
    },
    {
      title: t("Services.custom_solutions.title"),
      description: t("Services.custom_solutions.description"),
    },
    {
      title: t("Services.integration.title"),
      description: t("Services.integration.description"),
    },
    {
      title: t("Services.support.title"),
      description: t("Services.support.description"),
    },
    {
      title: t("Services.industry_specific.title"),
      description: t("Services.industry_specific.description"),
    },
    {
      title: t("Services.nl_to_sql.title"),
      description: t("Services.nl_to_sql.description"),
    },
    {
      title: t("Services.chatbots.title"),
      description: t("Services.chatbots.description"),
    },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden">
      <Header darkMode={false} />

      <main className="flex-grow">
        <section id="services" className="container mx-auto px-4 py-16 md:py-20">
          <h2 className="text-5xl text-white md:text-5xl font-bold mb-10 text-center">{t("HomePage.whatWeDo")}</h2>
          {/* Wrap grid in motion.div for animation control */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible" // Animate when parent is visible
            viewport={{ once: true, amount: 0.1 }} // Trigger once
          >
            {services.map((service, index) => {
              // Define card variants here to be used in the motion component
              const cardVariants: Variants = {
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              };

              return (
                <motion.div
                  key={service.title}
                  variants={cardVariants}
                // The parent's staggerChildren will handle the timing
                >
                  <Link href="/services" className="block h-full">
                    <MotionServiceCard service={service} index={index} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground dark:text-dark-muted-foreground">
          <p>{t("Footer.copyright")}</p>
        </div>
      </footer>

      <InteractiveScrollToTop />
    </div>
  );
}
