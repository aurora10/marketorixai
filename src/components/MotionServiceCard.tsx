
"use client";

interface Service {
  title: string;
  description: string;
}

interface MotionServiceCardProps {
  service: Service;
  index: number;
}

import { motion } from "framer-motion";

export default function MotionServiceCard({ service, index }: MotionServiceCardProps) { // Specify the type here
  
  // Define variants directly in the component or import if shared
  const cardVariants = { 
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants} // Apply variants
      // Remove initial, whileInView, viewport, transition - will be controlled by parent
      // Apply card background, border, padding, rounding, and add hover shadow + subtle lift animation
      className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full" 
    >
      {/* Use foreground color and accent underline */}
      <h3 className="text-2xl font-semibold mb-4 text-foreground dark:text-dark-foreground relative inline-block after:block after:h-[2px] after:bg-accent after:w-full after:absolute after:left-0 after:-bottom-2">{service.title}</h3>
      {/* Use muted foreground and base text size */}
      <p className="text-base text-muted-foreground dark:text-dark-muted-foreground">{service.description}</p>
    </motion.div>
  );
}
