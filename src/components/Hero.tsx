import React from 'react';
import { useApp } from './AppContext';
import { HERO_IMAGES } from '../imageCatalog';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { CinematicBackground } from './CinematicBackground';
import { useCanHover } from '../hooks/useCanHover';

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 280, damping: 26, delay },
});

export const Hero: React.FC = () => {
  const { setActivePage } = useApp();
  const canHover = useCanHover();
  const trustBadges = [
    'Factory direct pricing',
    'Premium quality assured',
    'Home delivery across India',
    'Trusted optical store',
  ];

  return (
    <section className="ambient-accent ambient-accent--hero relative isolate min-h-[calc(100vh-120px)] overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8 lg:py-20">
      <CinematicBackground />

      {/* Static ambient blobs — no JS animation */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(255,255,255,0.9),transparent_26%)]" />

      <img
        src="/niyaz-logo.svg"
        alt="Niyaz Opticals"
        className="absolute left-4 top-4 z-20 h-18 w-18 rounded-full border border-white/80 bg-white shadow-[0_16px_38px_rgba(38,22,6,0.14)] sm:left-6 sm:top-5 sm:h-20 sm:w-20 lg:left-8 lg:top-7"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-7 lg:pr-10">
          <motion.div {...reveal(0.02)} className="inline-flex items-center gap-2 rounded-full border border-[#261606]/10 bg-white/65 px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] text-[#261606] shadow-[0_8px_30px_rgba(38,22,6,0.05)] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d3a42b] shadow-[0_0_0_4px_rgba(251,227,17,0.22)]" />
            DIRECT FROM MANUFACTURER
          </motion.div>

          <div className="mt-6 sm:mt-7">
            <motion.h1 {...reveal(0.08)} className="max-w-3xl leading-[0.95] tracking-[-0.04em] text-[#15110d]">
              <span className="block overflow-hidden">
                {['Premium'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 * i + 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block mr-[0.2em] text-[2.6rem] font-black sm:text-[3.6rem] lg:text-[4.2rem] font-sans uppercase"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-[3.1rem] sm:text-[4.3rem] lg:text-[5.1rem] font-serif font-normal italic tracking-[-0.02em] text-[#261606]"
                >
                  Eyewear.
                </motion.span>
              </span>

              <span className="block overflow-hidden mt-1">
                {['Factory', 'Direct'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 * i + 0.26, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block mr-[0.2em] text-[2.6rem] font-black sm:text-[3.6rem] lg:text-[4.2rem] font-sans uppercase"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>

              <span className="block overflow-hidden mt-1 relative inline-block">
                <motion.span
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="relative inline-block text-[2.6rem] font-black sm:text-[3.6rem] lg:text-[4.2rem] font-sans uppercase text-[#261606]"
                >
                  Prices.
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-1 h-[5px] origin-left rounded-full bg-[#fbe311]"
                  />
                </motion.span>
              </span>
            </motion.h1>
          </div>

          <motion.p {...reveal(0.19)} className="mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            Crafted with precision. Delivered without middlemen. Discover prescription eyewear with considered design, uncompromising quality, and honest pricing.
          </motion.p>

          <motion.div {...reveal(0.28)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.button
              whileHover={canHover ? { y: -2, scale: 1.01 } : undefined}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setActivePage('shop')}
              id="hero-shop-cta"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#261606] px-7 py-4 text-sm font-semibold text-white shadow-[0_13px_28px_rgba(38,22,6,0.25)] sm:w-auto"
            >
              Shop collection
              <ShoppingBag className="h-4 w-4 text-[#fbe311]" />
            </motion.button>
            <motion.a
              whileHover={canHover ? { y: -2, scale: 1.01 } : undefined}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              href="https://wa.me/919443617786?text=Hi%20Niyaz%20Opticals,%20I%20would%20like%20to%20consult%20about%20your%20premium%20eyewear."
              target="_blank"
              rel="noreferrer"
              id="hero-whatsapp-cta"
              className="group flex w-full items-center justify-center gap-3 rounded-full border border-[#261606]/15 bg-white/60 px-7 py-4 text-sm font-semibold text-[#261606] shadow-[0_10px_25px_rgba(38,22,6,0.05)] backdrop-blur-xl transition-colors duration-200 hover:border-[#261606]/30 hover:bg-[#261606] hover:text-white sm:w-auto"
            >
              <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-[#25d366]">
                <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Chat on WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.a>
          </motion.div>

          <motion.div {...reveal(0.37)} className="mt-8 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-2.5 text-xs font-medium tracking-[0.01em] text-neutral-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fbe311]/45 text-[#261606]">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                {badge}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: product cards — CSS float via Tailwind animate-bounce-slow, no JS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.3 }}
          className="relative flex min-h-[390px] items-center justify-center py-8 sm:min-h-[450px] lg:col-span-5 lg:min-h-[500px]"
        >
          <div aria-hidden="true" className="absolute h-72 w-72 rounded-full border border-[#261606]/10 bg-white/35 shadow-[inset_0_1px_30px_rgba(255,255,255,0.8)] backdrop-blur-sm sm:h-96 sm:w-96" />
          <div aria-hidden="true" className="absolute h-60 w-60 rounded-full border border-[#d3a42b]/15 sm:h-80 sm:w-80" />

          {/* Main card */}
          <div
            className="relative z-10 w-[min(100%,20rem)] rounded-[1.65rem] border border-white/80 bg-white/70 p-5 shadow-[0_24px_55px_rgba(38,22,6,0.12)] backdrop-blur-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-[0.14em] text-neutral-400">VINCI TITANIUM</span>
              <span className="rounded-full bg-[#fbe311]/35 px-2.5 py-1 text-[11px] font-bold text-[#261606]">₹899</span>
            </div>
            <div className="flex h-28 items-center justify-center px-2">
              <img src={HERO_IMAGES.fullFrame} alt="Premium titanium full-frame eyewear" className="h-full w-full object-contain" />
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-[#261606]/8 pt-3">
              <div>
                <h4 className="text-xs font-bold text-neutral-800">Titanium Hexagonal</h4>
                <p className="mt-0.5 text-[10px] text-neutral-400">Pure titanium · rose gold finish</p>
              </div>
              <span className="text-[11px] font-bold text-[#a87711]">★ 4.9</span>
            </div>
          </div>

          {/* Bottom-left card */}
          <div
            className="absolute bottom-2 left-0 z-20 hidden w-56 rounded-2xl border border-white/80 bg-white/72 p-4 shadow-[0_18px_40px_rgba(38,22,6,0.10)] backdrop-blur-xl sm:block lg:-left-8"
          >
            <div className="mb-2 flex justify-between text-[9px] font-semibold tracking-[0.12em] text-neutral-400">
              <span>STEALTH POLARIZED</span>
              <span className="tracking-normal text-neutral-800">₹799</span>
            </div>
            <div className="flex h-16 items-center justify-center">
              <img src={HERO_IMAGES.sunglasses} alt="Premium polarized sunglasses" className="h-full w-full object-contain" />
            </div>
            <p className="mt-2 border-t border-[#261606]/8 pt-2 text-center text-[10px] font-medium text-neutral-500">UV400 polarized shield</p>
          </div>

          {/* Top-right card */}
          <div
            className="absolute right-0 top-1 z-20 hidden w-52 rounded-2xl border border-white/80 bg-white/76 p-4 shadow-[0_18px_40px_rgba(38,22,6,0.09)] backdrop-blur-xl sm:block lg:-right-7"
          >
            <div className="mb-2 flex justify-between text-[9px] font-semibold tracking-[0.12em] text-neutral-400">
              <span>ZEPHYR RIMLESS</span>
              <span className="tracking-normal text-emerald-700">₹949</span>
            </div>
            <div className="flex h-14 items-center justify-center">
              <img src={HERO_IMAGES.rimless} alt="Premium rimless eyewear" className="h-full w-full object-contain" />
            </div>
            <div className="mt-1 flex justify-between border-t border-[#261606]/8 pt-2 text-[9px] text-neutral-500">
              <span>Aura lite frame</span>
              <span className="font-bold text-neutral-700">4.8 ★</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
