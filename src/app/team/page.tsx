"use client"
import { useState } from 'react'
import { motion, Variants } from 'framer-motion' // Import Variants
import { Menu, X, Linkedin, Twitter } from 'lucide-react' 
import Image from 'next/image'
import Link from 'next/link'
import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop"; 

// Define variants for common fade/slide-up animation
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, // Adjusted y for potentially larger sections
  visible: { opacity: 1, y: 0 }
};

export default function TeamPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for each animated section
  const [teamGridAnimated, setTeamGridAnimated] = useState(false);
  const [devTeamSectionAnimated, setDevTeamSectionAnimated] = useState(false);
  const [letsTalkAnimated, setLetsTalkAnimated] = useState(false);


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
  ];

  // Variants specifically for individual team cards (can inherit if simple)
  const teamCardVariants: Variants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
  };


  return (
    <div className="relative min-h-screen text-white"> 
      <Header />

      <main className="container mx-auto px-4 py-20">
        {/* Keep H1 animation simple or manage with state if needed */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-10 text-center"
        >
          Our Team
        </motion.h1>
        
        {/* Wrap grid in motion.div to control animation state */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 mb-20"
          initial="hidden"
          animate={teamGridAnimated ? "visible" : "hidden"}
          variants={{ // Define simple variant for the container itself if needed, or just use it to trigger children
             hidden: {}, // Can be empty if only controlling children
             visible: { transition: { staggerChildren: 0.1 } } // Stagger children cards
          }}
          viewport={{ once: true, amount: 0.2 }}
          onViewportEnter={() => setTeamGridAnimated(true)}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={teamCardVariants} // Use defined variants
              // initial/animate inherited from parent ul/div
              transition={{ duration: 0.7, ease: "easeOut" }} // Individual card transition (delay handled by stagger)
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-lg rounded-lg p-6 flex flex-col items-center text-center transition-all" 
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
              <h2 className="text-2xl font-bold mt-4 mb-2">{member.name}</h2> {/* Added mt-4 */}
              <h3 className="text-xl text-yellow-300 mb-4">{member.role}</h3>
              <p className="mb-6">{member.bio}</p>
              <div className="flex space-x-4">
                {/* Social links */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={sectionVariants} // Use common variants
          initial="hidden"
          animate={devTeamSectionAnimated ? "visible" : "hidden"}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} // Keep a small delay relative to viewport enter
          viewport={{ once: true, amount: 0.2 }} 
          onViewportEnter={() => setDevTeamSectionAnimated(true)}
          className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8 text-center mb-20" 
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
          variants={sectionVariants} // Use common variants
          initial="hidden"
          animate={letsTalkAnimated ? "visible" : "hidden"}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }} // Keep a small delay relative to viewport enter
          viewport={{ once: true, amount: 0.2 }} 
          onViewportEnter={() => setLetsTalkAnimated(true)}
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

      <footer className="py-8 mt-20"> 
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Marketorix. All rights reserved.</p>
        </div>
      </footer>

      <InteractiveScrollToTop /> 
    </div>
  )
}
