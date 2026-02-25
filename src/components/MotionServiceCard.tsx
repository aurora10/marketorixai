
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

  return (
    <div
      // Apply card background, border, padding, 16px rounding, and add soft shadow + subtle scale and lift
      className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6 transition-all duration-300 shadow-soft hover:shadow-cardHover hover:scale-[1.03] hover:-translate-y-[2px] ease-out h-full"
    >
      {/* Use foreground color and accent underline */}
      <h3 className="text-2xl font-semibold mb-4 text-foreground dark:text-dark-foreground relative inline-block after:block after:h-[2px] after:bg-accent after:w-full after:absolute after:left-0 after:-bottom-2">{service.title}</h3>
      {/* Use muted foreground and base text size */}
      <p className="text-base text-muted-foreground dark:text-dark-muted-foreground">{service.description}</p>
    </div>
  );
}
