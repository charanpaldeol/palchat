import { motion } from "framer-motion";

export default function AnimatedCard({ 
  iconPath, 
  title, 
  description, 
  gradientFrom, 
  gradientTo, 
  iconBgFrom, 
  iconBgTo, 
  iconColor,
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="group cursor-pointer"
    >
      <div className={`text-center p-8 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} border border-opacity-20 h-full relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon container with enhanced animation */}
        <motion.div 
          className={`w-16 h-16 bg-gradient-to-br ${iconBgFrom} ${iconBgTo} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.3 }
          }}
        >
          <motion.div
            className={`w-8 h-8 ${iconColor}`}
            whileHover={{ 
              scale: 1.2,
              transition: { duration: 0.2 }
            }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
            </svg>
          </motion.div>
        </motion.div>
        
        {/* Content */}
        <motion.h3 
          className="text-xl font-semibold text-gray-900 mb-4 relative z-10"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 relative z-10"
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
        >
          {description}
        </motion.p>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </motion.div>
  );
} 