import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StepsSection } from './components/StepsSection';
import { FAQSection } from './components/FAQSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { RazorpayModal } from './components/RazorpayModal';
import { AmbientBackground } from './components/AmbientBackground';
import { PageTransition } from './components/PageTransition';
import { OpticalCta } from './components/OpticalCta';

// Sub Pages
import { AdminLogin } from './components/AdminLogin';
import { lazy, Suspense } from 'react';
import { pageLoaders, prefetchPage } from './pageLoaders';

// Data
import { PRODUCTS, TESTIMONIALS } from './data';
import { ArrowRight, Star, Quote } from 'lucide-react';
import { motion, AnimatePresence, LazyMotion, MotionConfig, domAnimation, useReducedMotion } from 'motion/react';
import { springEase, viewportOnce } from './utils/animations';
import { useCanHover } from './hooks/useCanHover';

const Shop = lazy(pageLoaders.shop!);
const WishlistPage = lazy(pageLoaders.wishlist!);
const OrderTracking = lazy(pageLoaders['track-order']!);
const AboutContact = lazy(pageLoaders.about!);
const OrderSuccess = lazy(pageLoaders['order-success']!);
const AdminDashboard = lazy(pageLoaders.admin!);

const MainAppContent: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setSelectedCategory,
    selectedProduct,
    showCartDrawer,
    showRazorpay,
  } = useApp();

  // Admin auth state — drives re-render on login success
  const [isAdminAuthed, setIsAdminAuthed] = useState(
    () => Boolean(sessionStorage.getItem('niyaz_admin_token'))
  );
  const [adminToken, setAdminToken] = useState(
    () => sessionStorage.getItem('niyaz_admin_token') || ''
  );

  const [checkoutDetails, setCheckoutDetails] = useState<{
    name: string; email: string; phone: string; address: string;
  } | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string; discountPercent: number;
  } | null>(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();

  const featuredBestsellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  const handleProceedToPay = (
    details: { name: string; email: string; phone: string; address: string; },
    coupon: { code: string; discountPercent: number; } | null
  ) => {
    setCheckoutDetails(details);
    setAppliedCoupon(coupon);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <div className="space-y-20">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <Hero />
            <OpticalCta placement="hero" />

            {/* ── BOGO Promo Strip ─────────────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-gradient-to-r from-[#261606] via-[#3a220a] to-[#261606] text-white py-12 px-4 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-xl pointer-events-none" />
              <div className="max-w-4xl mx-auto space-y-4">
                <span className="bg-[#fbe311] text-neutral-900 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                  LIMITED DIRECT DEAL
                </span>
                <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight uppercase">
                  BUY 1 GET 1 FREE (BOGO) ON ALL PREMIUM FRAMES
                </h2>
                <p className="text-neutral-300 text-xs sm:text-sm font-medium max-w-xl mx-auto">
                  Add any two frame styles to your shopping bag. The system automatically applies a 50% flat discount on frames. Includes standard computer lenses for free.
                </p>
                <div>
                  <button
                    onClick={() => { prefetchPage('shop'); setSelectedCategory('all'); setActivePage('shop'); window.scrollTo(0, 0); }}
                    className="px-6 py-2.5 bg-[#fbe311] text-neutral-900 font-bold rounded-full text-xs uppercase tracking-wide hover:bg-white transition-all flex items-center gap-1.5 mx-auto shadow-md"
                  >
                    <span>Claim Offer Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* ── Collections ──────────────────────────────────────────────── */}
            {/* bg-white is the base; AmbientBackground adds the shader on top */}
            <section className="ambient-accent ambient-accent--collections relative overflow-hidden py-10">
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
              >
                <div className="text-center space-y-2">
                  <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">CHOOSE YOUR LOOK</span>
                  <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#111111] uppercase tracking-tight">
                    Premium Eyewear Collections
                  </h2>
                  <div className="w-12 h-0.5 bg-[#fbe311] mx-auto" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { id: 'full',       label: 'Full Frame',      desc: 'Bold & Durable',         icon: '🕶️' },
                    { id: 'half',       label: 'Half Frame',      desc: 'Semi-Rimless Classic',   icon: '👓' },
                    { id: 'rimless',    label: 'Rimless Premium', desc: 'Ultralight Titanium',    icon: '💎' },
                    { id: 'sunglasses', label: 'Sunglasses',      desc: 'UV400 Polarized',        icon: '☀️' },
                    { id: 'kids',       label: 'Kids Flexible',   desc: 'Shatterproof Acetate',   icon: '🎒' },
                  ].map((cat, index) => (
                    <motion.button
                      key={cat.id}
                      animate={shouldReduceMotion ? undefined : { y: [-6, 6, -6] }}
                      transition={{ duration: 4 + (index % 3) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
                      whileHover={canHover && !shouldReduceMotion ? { y: -8, scale: 1.03 } : undefined}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { prefetchPage('shop'); setSelectedCategory(cat.id); setActivePage('shop'); window.scrollTo(0, 0); }}
                      className="group flex min-h-[140px] flex-col justify-between rounded-3xl border border-neutral-200/50 bg-neutral-50/50 p-6 text-left shadow-sm transition-colors hover:border-transparent hover:bg-[#2a1b0a] hover:text-white will-change-transform cursor-pointer"
                    >
                      <span className="text-3xl filter saturate-100 group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <div>
                        <h4 className="font-sans font-extrabold text-xs text-neutral-800 group-hover:text-[#fbe311] uppercase tracking-wider mt-4">
                          {cat.label}
                        </h4>
                        <p className="text-[10px] text-neutral-400 group-hover:text-neutral-300 font-medium">
                          {cat.desc}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* ── Trending Products ─────────────────────────────────────────── */}
            {/* bg-white is the base; AmbientBackground adds the shader on top */}
            <section className="ambient-accent ambient-accent--products relative overflow-hidden py-16">

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Heading — word-by-word reveal + animated underline */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className="text-center space-y-4"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="inline-block text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest"
                  >
                    BEST SELLERS UNDER ₹999
                  </motion.span>

                  <div className="overflow-hidden relative inline-block">
                    <h2 className="text-2xl sm:text-3xl font-sans font-black text-neutral-900 uppercase tracking-tight">
                      {"Trending Frame Grinds".split(' ').map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={viewportOnce}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.06 + i * 0.06 }}
                          className="inline-block mr-[0.3em]"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </h2>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#fbe311] via-[#d4a42b] to-transparent origin-left"
                    />
                  </div>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
                    className="w-12 h-0.5 bg-[#fbe311] mx-auto origin-left"
                  />
                </motion.div>

                {/* 4 Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredBestsellers.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.6, delay: 0.07 * idx, ease: 'easeOut' }}
                    >
                      <ProductCard product={product} motionIndex={idx} floating={canHover} />
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={canHover && !shouldReduceMotion ? { scale: 1.03, y: -2 } : undefined}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => { prefetchPage('shop'); setSelectedCategory('all'); setActivePage('shop'); window.scrollTo(0, 0); }}
                    className="px-8 py-3 bg-[#261606] text-[#fbe311] hover:bg-[#111111] font-bold text-xs rounded-full uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-lg"
                  >
                    <span>View All 100+ Catalog Models</span>
                    <ArrowRight className="w-4 h-4 text-[#fbe311]" />
                  </motion.button>
                </motion.div>
              </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────────────── */}
            <StepsSection />

            {/* ── Reviews ──────────────────────────────────────────────────── */}
            {/* bg-[#1a0e04] is the dark base; shader adds gold ambient glow */}
            <section className="relative overflow-hidden bg-[#1a0e04] py-10">
              <motion.section
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
              >
                <div className="text-center space-y-2">
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">PROUD TAMIL NADU CUSTOMERS</span>
                  <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-tight">
                    Honest Reviews
                  </h2>
                </div>

                <div className="relative bg-[#261606] text-white p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl text-left space-y-6">
                  <Quote className="w-10 h-10 text-yellow-400/20 absolute top-6 right-6" />

                  <div className="flex gap-1 text-[#fbe311]">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>

                  <motion.blockquote
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="text-sm sm:text-base text-neutral-200 leading-relaxed italic"
                  >
                    "{TESTIMONIALS[activeTestimonial].text}"
                  </motion.blockquote>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div>
                      <h4 className="font-sans font-black text-xs text-[#fbe311] uppercase tracking-wider">
                        {TESTIMONIALS[activeTestimonial].name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {TESTIMONIALS[activeTestimonial].role} • Verified Buyer
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {TESTIMONIALS.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestimonial(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === idx ? 'bg-[#fbe311] w-4' : 'bg-white/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <FAQSection />

            {/* ── Contact / Location ───────────────────────────────────────── */}
            <LocationSection />

          </div>
        );

      case 'shop':        return <Shop />;
      case 'wishlist':    return <WishlistPage />;
      case 'track-order': return <OrderTracking />;
      case 'about':
      case 'contact':     return <AboutContact />;
      case 'order-success': return <OrderSuccess />;
      case 'admin':
        if (!isAdminAuthed) {
          return (
            <AdminLogin onSuccess={(token) => {
              sessionStorage.setItem('niyaz_admin_token', token);
              setAdminToken(token);
              setIsAdminAuthed(true);
            }} />
          );
        }
        return <AdminDashboard adminToken={adminToken} onSignOut={() => {
          sessionStorage.removeItem('niyaz_admin_token');
          setAdminToken('');
          setIsAdminAuthed(false);
        }} />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <AnimatePresence mode="sync" initial={false}>
          <PageTransition key={activePage} id={activePage}>
            <Suspense fallback={<PageLoadingFallback />}>
              {renderPage()}
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />

      <AnimatePresence mode="wait">
        {selectedProduct && <ProductDetailModal key={selectedProduct.id} />}
      </AnimatePresence>

      {showCartDrawer && (
        <CartDrawer onProceedToPay={handleProceedToPay} />
      )}

      {showRazorpay && checkoutDetails && (
        <RazorpayModal
          customerDetails={checkoutDetails}
          couponApplied={appliedCoupon}
        />
      )}
    </div>
  );
};

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <AppProvider>
          <AmbientBackground />
          <MainAppContent />
        </AppProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

const PageLoadingFallback = () => (
  <div className="min-h-[55vh] px-4 py-16" aria-label="Loading page" role="status">
    <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
      <div className="mx-auto h-8 w-64 rounded bg-neutral-200/70" />
      <div className="mx-auto h-4 w-96 max-w-full rounded bg-neutral-200/50" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-80 rounded-2xl bg-neutral-200/50" />)}
      </div>
    </div>
  </div>
);
