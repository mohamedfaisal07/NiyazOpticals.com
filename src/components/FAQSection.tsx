import React, { useState } from 'react';
import { FAQS } from '../data';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerReveal, fadeUp, springEase, viewportOnce } from '../utils/animations';
import { useCanHover } from '../hooks/useCanHover';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="ambient-accent ambient-accent--faq relative overflow-hidden py-20 border-t border-neutral-100">

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <motion.span variants={fadeUp} className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">COMMON INQUIRIES</motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#111111]">
            Frequently Asked Questions
          </motion.h2>
          <motion.div variants={fadeUp} className="w-12 h-1 bg-[#fbe311] mx-auto rounded" />
          <motion.p variants={fadeUp} className="text-neutral-500 font-medium text-base">
            Everything you need to know about factory pricing, post-payment prescription confirmation, and free lens packages.
          </motion.p>
        </motion.div>

        {/* FAQs Accordion */}
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-4"
          id="faq-container"
        >
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'border-[#261606]/30 shadow-[0_10px_25px_rgba(38,22,6,0.03)]' 
                    : 'border-neutral-200/50 hover:border-neutral-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none group"
                  aria-expanded={isOpen}
                  id={`faq-btn-${idx}`}
                >
                  <span className="font-sans font-extrabold text-[#111111] text-base group-hover:text-[#261606] transition-colors duration-300">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: springEase }}
                    className={`w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isOpen ? 'bg-[#fbe311]/15 text-[#261606]' : 'text-neutral-400'}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="origin-top border-t border-neutral-100/60 bg-neutral-50/20 px-6 pb-6 pt-4 text-sm leading-relaxed text-neutral-600"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dynamic support helper card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4, delay: 0.1, ease: springEase }}
          whileHover={canHover && !shouldReduceMotion ? { y: -2 } : undefined}
          className="mt-12 bg-white border border-neutral-200/50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={canHover && !shouldReduceMotion ? { rotate: [0, -10, 10, 0], scale: 1.1 } : undefined}
              transition={{ duration: 0.4 }}
              className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-neutral-800">Have a custom query or complex power prescription?</p>
              <p className="text-xs text-neutral-500">Connect directly with our optometrists in Trichy for quick advisory.</p>
            </div>
          </div>
          <motion.a
            whileHover={canHover && !shouldReduceMotion ? { scale: 1.03, y: -2 } : undefined}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            href="https://wa.me/919443617786?text=Hi%20Niyaz%20Opticals,%20I%20have%20questions%20regarding%20my%20prescription."
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 text-white hover:bg-[#261606] rounded-full text-xs font-bold text-center transition-colors"
          >
            Chat with Optometrist
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};
