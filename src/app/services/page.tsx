"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Menu, X, Check } from 'lucide-react'
import Image from "next/image";
import Header from "@/components/Header";

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    {
      title: "AI Strategy Formulation",
      description: "We help businesses develop comprehensive AI strategies aligned with their goals and industry trends.",
      features: ["AI readiness assessment", "Technology roadmap creation", "ROI projections", "Implementation planning"]
    },
    {
      title: "Custom AI Solution Development",
      description: "Our team of experts designs and builds tailored AI solutions to address your unique business challenges.",
      features: ["Machine learning models", "Deep learning algorithms", "AI-powered applications", "Prototype development"]
    },
    {
      title: "AI Integration",
      description: "Seamlessly integrate AI technologies with your existing systems and workflows for maximum efficiency.",
      features: ["Legacy system integration", "API development", "Cloud migration", "Performance optimization"]
    },
    {
      title: "Autonomous Agents Development",
      description: "Unlock the power of your data with our advanced analytics and management solutions.",
      features: ["Advanced decision-making algorithms", "Seamless integration with existing systems", "Increased operational efficiency", "24/7 autonomous task execution"]
    },
    {
      title: "Ongoing Support",
      description: "We provide continuous support and maintenance to ensure your AI solutions perform optimally.",
      features: ["24/7 technical support", "Performance monitoring", "Regular updates", "Training and workshops"]
    },
    {
      title: "Industry-Specific AI Applications",
      description: "Leverage our expertise in developing AI solutions tailored for various industries.",
      features: ["Healthcare diagnostics", "Financial fraud detection", "E-commerce personalization", "Manufacturing optimization"]
    },
    {
      title: "Natural Language to SQL",
      description: "Streamline your operations with intelligent automation solutions that learn and adapt.",
      features: ["Advanced semantic understanding", "Intelligent query translation", "Multi-dialect SQL support", "Minimizes human error"]
    },
    {
      title: "AI Chatbot Development Service",
      description: "Harness the power of natural language processing for advanced AI capabilities.",
      features: ["Natural language processing", "Contextual understanding", "Multi-language support", "Personalized conversation flows"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 text-white">
     < Header />

      <main className="container mx-auto px-4 py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-10 text-center"
        >
          Our Services
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-20 transition-all transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
              <p className="mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + (featureIndex * 0.1) }}
                    className="flex items-center"
                  >
                    <Check className="text-yellow-400 mr-2" size={16} />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business with AI?</h2>
          <motion.a 
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-colors inline-block"
          >
            Get Started Now
          </motion.a>
        </motion.div>
      </main>

      <footer className="bg-purple-900 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Marketorix. All rights reserved.</p>
        </div>
      </footer>

      <motion.div 
        className="fixed bottom-8 right-8 bg-yellow-400 text-purple-900 rounded-full p-4 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronDown className="transform rotate-180" />
      </motion.div>
    </div>
  )
}