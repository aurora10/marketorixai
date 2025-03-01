import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";
import MotionServiceCard from "@/components/MotionServiceCard";

// const services = [
//   {
//     title: "AI Strategy Formulation",
//     description:
//       "Our AI Strategy Formulation service helps businesses develop a clear roadmap for implementing AI, aligned with long-term goals and industry dynamics. From initial concept to detailed planning, we analyze your current capabilities and market opportunities to craft an AI strategy that drives measurable outcomes and gives you a competitive edge.",
//   },
//   {
//     title: "Custom AI Solution Development",
//     description:
//       "Our team specializes in building bespoke AI solutions tailored to address your organization's specific challenges. By understanding your unique requirements, we design and develop applications that enhance workflows, improve decision-making, and create value across your entire operation—from predictive analytics to real-time data processing.",
//   },
//   {
//     title: "AI Integration",
//     description:
//       "AI Integration services ensure a smooth adoption of AI into your existing systems, minimizing disruption and maximizing efficiency. We work alongside your IT and operations teams to incorporate AI tools into your workflows, enabling intelligent automation, enhanced analytics, and improved productivity throughout your organization.",
//   },
//   {
//     title: "Autonomous Agents Development",
//     description:
//       "We design and deploy intelligent, adaptive AI agents that can independently execute complex workflows across multiple domains. Our service transforms repetitive or intricate business processes by creating custom autonomous agents tailored to your specific organizational needs.",
//   },
//   {
//     title: "Ongoing Support",
//     description:
//       "To ensure long-term success, we provide Ongoing Support tailored to your AI solutions, covering maintenance, updates, and enhancements. Our dedicated support team is here to resolve issues, implement improvements, and keep your AI solutions optimized, allowing you to stay ahead of the curve in a rapidly evolving field.",
//   },
//   {
//     title: "Industry-Specific AI Applications",
//     description:
//       "Our Industry-Specific AI Applications leverage domain knowledge and advanced AI models tailored to the unique needs of various sectors. Whether you are in healthcare, finance, retail, or manufacturing, we design solutions that drive innovation, efficiency, and value, using insights and predictive analytics tailored to your industry.",
//   },
//   {
//     title: "Natural Language to SQL",
//     description:
//       "Transform natural language queries into precise, efficient SQL database interactions. Our advanced AI-powered solution bridges the gap between human communication and database querying, enabling non-technical users to extract complex insights with simple, conversational input.",
//   },
//   {
//     title: "AI Chatbot Development Service",
//     description:
//       "We craft intelligent conversational interfaces that revolutionize customer interaction, support, and engagement. Our custom AI chatbots are designed to understand, respond, and learn from complex user interactions across multiple platforms and industries.",
//   },
// ];

const services = [
  {
    title: "Autonomous AI Agents",
    description: "We design and deploy intelligent AI agents that can independently handle complex tasks and workflows. These agents are customized to your specific needs, transforming repetitive or intricate processes into efficient, automated operations that save time and resources.",
  },
  {
    title: "AI Strategy",
    description: "We help businesses develop a clear and actionable AI strategy that aligns with their long-term goals. By analyzing your current capabilities and market opportunities, we create a roadmap for AI implementation that drives measurable results and gives you a competitive edge in your industry.",
  },
  {
    title: "Custom AI Solutions",
    description: "Our team designs and builds AI solutions tailored to your organization’s unique challenges. Whether it’s predictive analytics, real-time data processing, or workflow automation, we create tools that improve decision-making, enhance efficiency, and deliver value across your operations.",
  },
  {
    title: "AI Integration",
    description: "We ensure a smooth and seamless integration of AI into your existing systems. By working closely with your IT and operations teams, we minimize disruption and maximize efficiency, enabling intelligent automation, advanced analytics, and improved productivity across your organization.",
  },
  
  {
    title: "Ongoing Support",
    description: "We provide dedicated, long-term support to ensure your AI solutions remain effective and up-to-date. From maintenance and updates to enhancements and troubleshooting, our team is here to keep your systems optimized and ready to adapt to evolving business needs.",
  },
  {
    title: "Industry-Specific AI",
    description: "We develop AI applications tailored to the unique requirements of your industry. Whether you’re in healthcare, finance, retail, or manufacturing, our solutions leverage domain expertise and advanced AI models to drive innovation, efficiency, and value in your sector.",
  },
  {
    title: "Natural Language to SQL",
    description: "Our AI-powered solution transforms natural language queries into precise SQL database interactions. This bridges the gap between human communication and technical data retrieval, enabling non-technical users to access complex insights with simple, conversational input.",
  },
  {
    title: "AI Chatbots",
    description: "We create intelligent, conversational AI chatbots that revolutionize customer interaction and support. Designed to understand, respond, and learn from user interactions, our chatbots enhance engagement and streamline communication across multiple platforms and industries.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 text-white min-h-screen flex flex-col">
      <Header />

      <main>
        <section id="services" className="container mx-auto px-4 py-20">
          <h2 className="text-5xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid text-xl   grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <MotionServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-purple-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Marketorix. All rights reserved.</p>
        </div>
      </footer>

      {/* Client-Side Interactive Component */}
      <InteractiveScrollToTop />
    </div>
  );
}
