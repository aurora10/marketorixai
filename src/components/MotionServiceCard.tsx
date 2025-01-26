
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-20 transition-all transform hover:scale-105"
    >
      <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
      <p className="text-md opacity-80">{service.description}</p>
    </motion.div>
  );
}