"use client";

import { useState } from 'react'; // Import useState
import { Check } from "lucide-react";
import { motion, Variants } from "framer-motion";

// Define animation variants for the list and items
const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};


interface Service {
  title: string;
  description: string;
  features: string[];
}

interface MotionServiceCardProps {
  service: Service;
  index: number; 
}


export default function MotionServiceCard({ service, index }: MotionServiceCardProps) {
    // State to track if animation has run once
    const [hasAnimated, setHasAnimated] = useState(false);

    const cardVariants: Variants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    };

    return (
      <motion.div
        // Use variants for initial/animate states
        variants={cardVariants}
        initial="hidden" 
        // Animate card to visible and stay visible
        animate="visible" 
        transition={{ duration: 0.7, ease: "easeOut" }} 
        // Use onViewportEnter with once: true to set state for children
        viewport={{ once: true, amount: 0.2 }} 
        onViewportEnter={() => setHasAnimated(true)}
        className="service-card bg-white bg-opacity-20 text-xl backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-30 transition-all transform hover:scale-105 w-full" 
      >
        <h2 className="text-3xl font-semibold mb-4">{service.title}</h2>
        <p className="mb-4 text-xl">{service.description}</p>
        <motion.ul 
          className="space-y-2"
          variants={listVariants} 
          // Also control list animation with the same state
          animate={hasAnimated ? "visible" : "hidden"} 
          initial="hidden" // Set initial state for list
        >
          {service.features.map((feature, featureIndex) => (
            <motion.li
              key={featureIndex}
              variants={itemVariants} 
              className="flex items-center text-lx"
            >
              <Check className="text-yellow-400 mr-2" size={16} />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    );
  }
