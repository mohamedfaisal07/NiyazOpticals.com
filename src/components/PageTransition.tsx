import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  id?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, id }) => (
  <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
    <div className="page-progress" aria-hidden="true" />
    {children}
  </motion.div>
);
