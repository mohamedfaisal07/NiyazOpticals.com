import React from 'react';
import { Send, Glasses, Home, ArrowRight, Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useApp } from './AppContext';
import { staggerReveal, fadeUp, springEase, viewportOnce } from '../utils/animations';
import { useCanHover } from '../hooks/useCanHover';

export const StepsSection: React.FC = () => {
  const { setActivePage } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();

  const steps = [
    {
      num: "01",
      icon: <Send className="w-8 h-8 text-[#261606]" />,
      title: "Send Prescription on WhatsApp",
      description: "Take a photo of your power sheet or prescription and send it to us on WhatsApp. It takes less than a minute."
    },
    {
      num: "02",
      icon: <Glasses className="w-8 h-8 text-[#261606]" />,
      title: "Choose Your Frame Style",
      description: "Browse our Full Frame, Half Frame, Rimless, Sunglasses, or Kids collections and select your preferred frame."
    },
    {
      num: "03",
      icon: <Home className="w-8 h-8 text-[#261606]" />,
      title: "Get Delivered to Your Home",
      description: "We manufacture your prescription glasses and deliver them safely to your doorstep."
    }
  ];

  return (
    <section id="steps-section" className="ambient-accent ambient-accent--steps relative overflow-hidden py-20 border-y border-neutral-100">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <motion.span variants={fadeUp} className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">ZERO FRICTION EXPERIENCE</motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#111111]">
            Get Your Specs in 3 Easy Steps
          </motion.h2>
          <motion.div variants={fadeUp} className="w-12 h-1 bg-[#fbe311] mx-auto rounded" />
          <motion.p variants={fadeUp} className="text-neutral-500 font-medium text-base">
            No store visit needed. Just your prescription and we handle the rest.
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connecting Background Line for Desktop */}
          <div className="hidden md:block absolute top-[2.25rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 z-0" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: 'easeOut' }}
              whileHover={canHover && !shouldReduceMotion ? { y: -6, scale: 1.015, transition: { type: 'spring', stiffness: 250, damping: 20 } } : undefined}
              className="relative z-10 flex flex-col justify-between rounded-3xl border border-neutral-200/40 bg-[#fafafa] p-8 transition-colors duration-200 hover:border-[#261606]/20 hover:bg-white"
            >
              <div>
                {/* Step Icon and Number Row */}
                <div className="flex justify-between items-center mb-6">
                  <motion.div 
                    whileHover={canHover && !shouldReduceMotion ? { rotate: [0, -8, 8, 0], scale: 1.05 } : undefined}
                    transition={{ duration: 0.4 }}
                    className="w-14 h-14 rounded-2xl bg-[#fbe311]/25 flex items-center justify-center shadow-inner"
                  >
                    {step.icon}
                  </motion.div>
                  <span className="text-4xl font-sans font-black text-neutral-200/80 font-mono select-none">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-sans font-extrabold text-[#111111] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-200/50 flex items-center justify-between">
                {idx === 0 ? (
                  <motion.a 
                    whileHover={canHover && !shouldReduceMotion ? { x: 3 } : undefined}
                    href="https://wa.me/919443617786"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#261606] hover:text-green-600 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Consult on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.a>
                ) : idx === 1 ? (
                  <motion.button 
                    whileHover={canHover && !shouldReduceMotion ? { x: 3 } : undefined}
                    onClick={() => setActivePage('shop')}
                    className="text-xs font-bold text-[#261606] hover:underline flex items-center gap-1.5"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                ) : (
                  <div className="text-[10px] font-mono font-bold text-neutral-400">
                    FACTORY DISPATCH SECURE
                  </div>
                )}
              </div>
            </motion.div>
          ))}

        </div>

        {/* Home eye testing booking trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="relative mt-16 bg-gradient-to-r from-[#261606] to-[#111111] p-8 md:p-10 rounded-3xl text-white shadow-xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] bg-[#fbe311] text-[#261606] font-mono px-2.5 py-0.5 rounded font-bold uppercase">FREE LOCAL EYE TESTS</span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Need an Eye Test? We come to your Home.</h3>
              <p className="text-neutral-300 text-xs sm:text-sm max-w-xl">
                Live in Trichy? Book a certified optometrist visit at your doorstep or drop by our Melaputhur outlet. Testing is 100% free with any frame order.
              </p>
            </div>
            <motion.button 
              whileHover={canHover && !shouldReduceMotion ? { scale: 1.02 } : undefined}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              onClick={() => setActivePage('contact')}
              className="w-full md:w-auto px-6 py-3.5 bg-[#fbe311] text-[#261606] hover:bg-yellow-400 font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-lg transition-all"
              id="steps-book-appointment-btn"
            >
              <span>Book Appointment</span>
              <Phone className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
