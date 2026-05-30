'use client';

import { motion } from 'motion/react';

export default function PageAnimateWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: 'easeInOut'
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
