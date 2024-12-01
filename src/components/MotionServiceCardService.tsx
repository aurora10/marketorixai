

// "use client";

// import { Check } from "lucide-react";
// import { motion } from "framer-motion";

// interface Service {
//   title: string;
//   description: string;
//   features: string[];
// }

// interface MotionServiceCardProps {
//   service: Service;
//   index: number;
// }

// export default function MotionServiceCard({ service, index }: MotionServiceCardProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-20 transition-all transform hover:scale-105"
//     >
//       <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
//       <p className="mb-4">{service.description}</p>
//       <ul>
//         {service.features.map((feature, featureIndex) => (
//           <motion.li
//             key={featureIndex}
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.1 }}
//             className="flex items-center mb-2"
//           >
//             <Check className="text-yellow-400 mr-2" size={16} />
//             <span>{feature}</span>
//           </motion.li>
//         ))}
//       </ul>
//     </motion.div>
//   );
// }

"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Service {
  title: string;
  description: string;
  features: string[];
}

interface MotionServiceCardProps {
  service: Service;
  index: number;
}

// export default function MotionServiceCard({ service, index }: MotionServiceCardProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-20 transition-all transform hover:scale-105"
//     >
//       <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
//       <p className="mb-4">{service.description}</p>
//       <ul className="space-y-2">
//         {service.features.map((feature, featureIndex) => (
//           <motion.li
//             key={featureIndex}
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.1 }}
//             className="flex items-center"
//           >
//             <Check className="text-yellow-400 mr-2" size={16} />
//             <span>{feature}</span>
//           </motion.li>
//         ))}
//       </ul>
//     </motion.div>
//   );
// }

// export default function MotionServiceCard({ service, index }: MotionServiceCardProps) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: index * 0.1 }}
//           className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-20 transition-all transform hover:scale-105"
//         >
//           <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
//           <p className="mb-4">{service.description}</p>
//           <ul className="space-y-2">
//             {service.features.map((feature, featureIndex) => (
//               <motion.li
//                 key={featureIndex}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.1 }}
//                 className="flex items-center"
//               >
//                 <Check className="text-yellow-400 mr-2" size={16} />
//                 <span>{feature}</span>
//               </motion.li>
//             ))}
//           </ul>
//         </motion.div>
//       </div>
//     );
//   }

export default function MotionServiceCard({ service, index }: MotionServiceCardProps) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-20 transition-all transform hover:scale-105 w-full" // Ensure the card takes full width of grid item
      >
        <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
        <p className="mb-4">{service.description}</p>
        <ul className="space-y-2">
          {service.features.map((feature, featureIndex) => (
            <motion.li
              key={featureIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.1 }}
              className="flex items-center"
            >
              <Check className="text-yellow-400 mr-2" size={16} />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  }