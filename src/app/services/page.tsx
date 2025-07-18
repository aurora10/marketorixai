import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";
import MotionServiceCardService from "@/components/MotionServiceCardService";
import Call from "@/components/Call";
import WhatWeDo from "@/components/WhatWeDo";

const services = [
  {
  title: "AI-Generated Code Review & Debug",
  description:
    "Ensure the reliability and performance of AI-generated code through thorough reviews and debugging services.",
  features: [
    "Code quality assessment",
    "Bug detection and resolution",
    "Security vulnerability checks",
    "Optimization for performance and readability",
  ],
},
{
  title: "AI App Recovery & Enhancement",
  description:
    "We fix broken or underperforming AI-generated applications and enhance them for long-term scalability.",
  features: [
    "Root-cause analysis of malfunctioning features",
    "Rebuilding unstable components",
    "Improving UX/UI and system logic",
    "Ongoing enhancement for evolving business needs",
  ],
}
,

  {
    title: "Autonomous AI Agents Development",
    description:
      "Unlock the power of your data with our advanced analytics and management solutions.",
    features: [
      "Advanced decision-making algorithms",
      "Seamless integration with existing systems",
      "Increased operational efficiency",
      "24/7 autonomous task execution",
    ],
  },
  {
    title: "AI Chatbot Development Service",
    description:
      "Harness the power of natural language processing for advanced AI capabilities.",
    features: [
      "Natural language processing",
      "Contextual understanding",
      "Multi-language support",
      "Personalized conversation flows",
    ],
  },

  {
    title: "AI Integration",
    description:
      "Seamlessly integrate AI technologies with your existing systems and workflows for maximum efficiency.",
    features: [
      "Legacy system integration",
      "API development",
      "Cloud migration",
      "Performance optimization",
    ],
  },
  {
    title: "AI Strategy Formulation",
    description:
      "We help businesses develop comprehensive AI strategies aligned with their goals and industry trends.",
    features: [
      "AI readiness assessment",
      "Technology roadmap creation",
      "ROI projections",
      "Implementation planning",
    ],
  },
  {
    title: "Custom AI Solution Development",
    description:
      "Our team of experts designs and builds tailored AI solutions to address your unique business challenges.",
    features: [
      "Machine learning models",
      "Deep learning algorithms",
      "AI-powered applications",
      "Prototype development",
    ],
  },
  
  
  {
    title: "Ongoing Support",
    description:
      "We provide continuous support and maintenance to ensure your AI solutions perform optimally.",
    features: [
      "24/7 technical support",
      "Performance monitoring",
      "Regular updates",
      "Training and workshops",
    ],
  },
  {
    title: "Industry-Specific AI Applications",
    description:
      "Leverage our expertise in developing AI solutions tailored for various industries.",
    features: [
      "Healthcare diagnostics",
      "Financial fraud detection",
      "E-commerce personalization",
      "Manufacturing optimization",
    ],
  },
  {
    title: "Natural Language to SQL",
    description:
      "Streamline your operations with intelligent automation solutions that learn and adapt.",
    features: [
      "Advanced semantic understanding",
      "Intelligent query translation",
      "Multi-dialect SQL support",
      "Minimizes human error",
    ],
  },

  

  
  
];

export default function ServicesPage() {
  return (
    <div className="relative text-white min-h-screen flex flex-col"> {/* Removed z-0 */}
      <Header />

      <section id="services" className="container mx-auto px-4 py-20 mb-8">
        {/* <h2 className="text-4xl font-bold text-center mb-12">What We Do</h2> */}
        <WhatWeDo />

        {/* Ensure grid layout is applied correctly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <MotionServiceCardService
              key={service.title}
              service={service}
              index={index}
            />
          ))}
        </div>

        <Call />
      </section>

      <footer className="py-8"> {/* Ensure bg-purple-900 is removed (already done) */}
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Marketorix. All rights reserved.</p>
        </div>
      </footer>

      {/* Client-Side Interactive Component */}
      <InteractiveScrollToTop />
    </div>
  );
}
