"use client"; // Ensures this component is rendered on the client-side

import { motion } from "framer-motion";

export default function TransformBusinessCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-20 text-center"
    >
      <h2 className="text-3xl font-bold mb-6">
        Ready to Transform Your Business with AI?
      </h2>
      <motion.a
        href="/contact"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-yellow-400 text-purple-900 px-8 py-4 mb-10 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-colors inline-block"
      >
        Get Started Now
      </motion.a>
    </motion.div>
  );
}
