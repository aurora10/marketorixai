
"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Menu, X, MapPin, Phone } from 'lucide-react'
import Header from "@/components/Header"

export default function ContactsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        alert('Message sent successfully!')
        setFormState({ name: '', email: '', message: '' })
      } else {
        alert('Failed to send message. Please try again later.')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 text-white">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-10 text-center"
        >
          Contact Us
        </motion.h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-md bg-white bg-opacity-20 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-md bg-white bg-opacity-20 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 rounded-md bg-white bg-opacity-20 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-semibold mb-6">Contact Information</h2>
            <div className="flex items-start space-x-4">
              <MapPin className="mt-1 text-yellow-400" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>150 Franslaan</p>
                <p>Nieuwpoort, WF 8620</p>
                <p>Belgium</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="text-yellow-400" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>+32 (465) 811-031</p>
              </div>
              <div className="flex items-center space-x-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366" className="text-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>               </svg>
               <div>
                 <h3 className="font-semibold">WhatsApp</h3>
                 <p>+32 (465) 811-031</p>
               </div>
             </div>
            </div>
          </motion.div>
        </div>
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



