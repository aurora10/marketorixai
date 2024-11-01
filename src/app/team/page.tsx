"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Menu, X, Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from "@/components/Header";


export default function TeamPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const teamMembers = [
    {
      name: "Robert Zimerman",
      role: "CEO & Founder",
      image: "/rob.jpeg",
      bio: "Robert brings over 10 years of experience in Web Developmen, AI and machine learning. He's passionate about leveraging AI to solve complex business problems.",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Lars Nyberg",
      role: "CTO",
      image: "/Face.jpeg",
      bio: "Lars is an expert in deep learning and natural language processing. He leads our technical strategy and innovation initiatives.",
      linkedin: "#",
      twitter: "#"
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
          Our Team
        </motion.h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 flex flex-col items-center text-center"
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


              <h2 className="text-2xl font-bold mb-2">{member.name}</h2>
              <h3 className="text-xl text-yellow-300 mb-4">{member.role}</h3>
              <p className="mb-6">{member.bio}</p>
              <div className="flex space-x-4">
                {/* <a href={member.linkedin} className="text-white hover:text-yellow-300 transition-colors">
                  <Linkedin />
                </a>
                <a href={member.twitter} className="text-white hover:text-yellow-300 transition-colors">
                  <Twitter />
                </a> */}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 text-center mb-20"
        >
          <h2 className="text-3xl font-bold mb-4">Our Development Team</h2>
          <p className="text-lg mb-6">
            In addition to our leadership, we have a team of highly trained developers available worldwide for individual projects. 
            Our experts specialize in various areas of AI and machine learning, ensuring we can meet the unique needs of each client.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-yellow-400 text-purple-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
          >
            Inquire About Custom Projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link 
            href="/contact"
            className="inline-block bg-yellow-400 text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Let's Talk
          </Link>
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