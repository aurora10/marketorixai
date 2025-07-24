"use client";

import { motion } from "framer-motion";

const MotionDivWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-8"
    >
      {children}
    </motion.div>
  );
};

export default MotionDivWrapper;
