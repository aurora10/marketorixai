
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
      className="service-card bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 shadow-soft hover:shadow-cardHover transition-all duration-[250ms] transform hover:scale-[1.03] hover:-translate-y-[2px] h-full ease-out"
    >
      <h2 className="text-3xl font-semibold mb-4 text-white">{service.title}</h2>
      <p className="text-lg text-white/80">{service.description}</p>
    </div>
  );
}
