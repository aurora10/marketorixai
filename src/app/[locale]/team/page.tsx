"use client"
import { useState } from 'react'
import { motion, Variants } from 'framer-motion' // Import Variants
import { Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";
import { useTranslations } from 'next-intl';

// Define variants for common fade/slide-up animation
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, // Adjusted y for potentially larger sections
  visible: { opacity: 1, y: 0 }
};

export default function TeamPage() {
  const t = useTranslations("OurTeam");

  const teamMembers = [
    {
      name: t("members.robert.name"),
      role: t("members.robert.role"),
      image: "/rob.jpeg",
      bio: t("members.robert.bio"),
      linkedin: "#",
      twitter: "#"
    },
    {
      name: t("members.lars.name"),
      role: t("members.lars.role"),
      image: "/Face.jpeg",
      bio: t("members.lars.bio"),
      linkedin: "#",
      twitter: "#"
    }
  ];

  // Variants specifically for individual team cards (can inherit if simple)
  const teamCardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };


  return (
    <div className="relative min-h-screen text-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-10 text-center"
        >
          {t("title")}
        </motion.h1>

        <motion.div
          className="grid md:grid-cols-2 gap-12 mb-20"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={teamCardVariants}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-lg rounded-lg p-6 flex flex-col items-center text-center transition-all"
            >
              <div className="p-4 bg-white rounded-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold mt-4 mb-2">{member.name}</h2>
              <h3 className="text-xl text-yellow-300 mb-4">{member.role}</h3>
              <p className="mb-6">{member.bio}</p>
              <div className="flex space-x-4">
                {/* Social links */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8 text-center mb-20"
        >
          <h2 className="text-3xl font-bold mb-4">{t("devTeam.title")}</h2>
          <p className="text-lg mb-6">
            {t("devTeam.description")}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-yellow-400 text-purple-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
          >
            {t("devTeam.inquire")}
          </Link>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center"
        >
          <Link
            href="/contact"
            className="inline-block bg-yellow-400 text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            {t("letsTalk")}
          </Link>
        </motion.div>
      </main>

      <footer className="py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>{useTranslations("Footer")("copyright")}</p>
        </div>
      </footer>

      <InteractiveScrollToTop />
    </div>
  )
}
