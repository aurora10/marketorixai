"use client"; // Add this if not already present

import { useState } from 'react'; // Import useState
import { motion, Variants } from 'framer-motion'; // Import motion and Variants
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";
import MotionServiceCard from "@/components/MotionServiceCard";

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

const services = [
  {
    title: "Autonomous AI Agents",
    description: "We design and deploy intelligent AI agents that can independently handle complex tasks and workflows. These agents are customized to your specific needs, transforming repetitive or intricate processes into efficient, automated operations that save time and resources.",
  },
  {
    title: "AI Strategy",
    description: "We help businesses develop a clear and actionable AI strategy that aligns with their long-term goals. By analyzing your current capabilities and market opportunities, we create a roadmap for AI implementation that drives measurable results and gives you a competitive edge in your industry.",
  },
  {
    title: "Custom AI Solutions",
    description: "Our team designs and builds AI solutions tailored to your organization’s unique challenges. Whether it’s predictive analytics, real-time data processing, or workflow automation, we create tools that improve decision-making, enhance efficiency, and deliver value across your operations.",
  },
  {
    title: "AI Integration",
    description: "We ensure a smooth and seamless integration of AI into your existing systems. By working closely with your IT and operations teams, we minimize disruption and maximize efficiency, enabling intelligent automation, advanced analytics, and improved productivity across your organization.",
  },
  {
    title: "Ongoing Support",
    description: "We provide dedicated, long-term support to ensure your AI solutions remain effective and up-to-date. From maintenance and updates to enhancements and troubleshooting, our team is here to keep your systems optimized and ready to adapt to evolving business needs.",
  },
  {
    title: "Industry-Specific AI",
    description: "We develop AI applications tailored to the unique requirements of your industry. Whether you’re in healthcare, finance, retail, or manufacturing, our solutions leverage domain expertise and advanced AI models to drive innovation, efficiency, and value in your sector.",
  },
  {
    title: "Natural Language to SQL",
    description: "Our AI-powered solution transforms natural language queries into precise SQL database interactions. This bridges the gap between human communication and technical data retrieval, enabling non-technical users to access complex insights with simple, conversational input.",
  },
  {
    title: "AI Chatbots",
    description: "We create intelligent, conversational AI chatbots that revolutionize customer interaction and support. Designed to understand, respond, and learn from user interactions, our chatbots enhance engagement and streamline communication across multiple platforms and industries.",
  },

   
];

export default function LandingPage() {
  // State to track if the service grid has animated
  const [gridAnimated, setGridAnimated] = useState(false);

  return (
    <div className="relative flex flex-col overflow-hidden"> 
      <Header />

      <main className="flex-grow">
        <section id="services" className="container mx-auto px-4 py-16 md:py-20">
          <h2 className="text-5xl text-white md:text-5xl font-bold mb-10 text-center">What We Do</h2> 
          {/* Wrap grid in motion.div for animation control */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={gridContainerVariants}
            initial="hidden"
            animate={gridAnimated ? "visible" : "hidden"} // Control via state
            viewport={{ once: true, amount: 0.1 }} // Trigger once when 10% visible
            onViewportEnter={() => setGridAnimated(true)} // Set state on enter
          >
            {services.map((service, index) => (
              // Link now inherits animation state from the grid wrapper
              <Link key={service.title} href="/services" className="block h-full"> 
                {/* MotionServiceCard now inherits animation from parent motion.div */}
                <MotionServiceCard service={service} index={index} /> 
              </Link>
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="py-8"> 
        <div className="container mx-auto px-4 text-center text-muted-foreground dark:text-dark-muted-foreground">
          <p>&copy; 2024 Marketorix. All rights reserved.</p>
        </div>
      </footer>

      <InteractiveScrollToTop />
    </div>
  );
}
