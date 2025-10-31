// src/components/common/LazyMotion.tsx
import React from 'react';
import { motion } from 'framer-motion';

// Carga diferida de Framer Motion
const LazyMotion = ({ children, ...props }: any) => {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
        type: "tween" // Más eficiente
      }}
    >
      {children}
    </motion.div>
  );
};

export default LazyMotion;