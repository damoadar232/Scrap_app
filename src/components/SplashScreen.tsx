import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete after fade animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 flex flex-col items-center justify-center z-50"
    >
      {/* Logo with animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
        className="mb-6"
      >
        <div className="bg-white p-6 rounded-3xl shadow-2xl">
          <Logo size={80} className="text-green-600" />
        </div>
      </motion.div>

      {/* App name with staggered animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          delay: 0.3,
          ease: "easeOut"
        }}
        className="text-center"
      >
        <h1 className="text-white text-5xl mb-2 tracking-tight">
          Scrap Square
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.4,
            delay: 0.6
          }}
          className="text-green-100 text-lg"
        >
          Smart Recycling Solutions
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.4,
          delay: 1
        }}
        className="absolute bottom-16"
      >
        <div className="flex gap-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: 0
            }}
            className="w-2 h-2 bg-white rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: 0.2
            }}
            className="w-2 h-2 bg-white rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: 0.4
            }}
            className="w-2 h-2 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
