import React, { useEffect, useState, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring as useMotionSpring,
  type Variants,
} from 'motion/react';
import { useApp } from '../AppContext';
import { SHOP_GALLERY_IMAGES } from '../../imageCatalog';
import { ArrowRight, Star, ChevronRight, X } from 'lucide-react';
import { BackgroundShader } from '../BackgroundShader';
import { CinematicBackground } from '../CinematicBackground';
import { useCanHover } from '../../hooks/useCanHover';

type LocalImage = { src: string; alt: string };

const shopImage = (index: number): LocalImage =>
  SHOP_GALLERY_IMAGES[index % SHOP_GALLERY_IMAGES.length];

const viewportConfig = { once: true, amount: 0.2 };
const springEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const sectionSpace = 'py-20 sm:py-20 lg:py-24';

const staggerReveal: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: springEase },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: springEase },
  },
};

/* ==========================================
   EYEBROW (small label)
   ========================================== */
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
    {children}
  </span>
);

/* ==========================================
   SECTION 1 — MEET THE CRAFTSMAN
   ========================================== */
const MeetTheCraftsman: React.FC = () => {
  const { setActivePage } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] });
  const imageY = useMotionSpring(useTransform(scrollYProgress, [0, 1], [-18, 18]), { stiffness: 160, damping: 28 });
  const imageScale = useMotionSpring(useTransform(scrollYProgress, [0, 1], [1.03, 1.1]), { stiffness: 160, damping: 28 });

  const image = shopImage(0);

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-24 lg:py-28">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#fbe311]/8 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#c7a56b]/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16 lg:gap-20">
          {/* Left — Text */}
          <motion.div
            variants={staggerReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="space-y-5"
          >
            <motion.span variants={fadeUpItem}>
              <Eyebrow>OUR STORY</Eyebrow>
            </motion.span>

            <motion.h2
              variants={fadeUpItem}
              className="text-4xl font-sans font-black leading-[0.98] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl"
            >
              Crafted by Hand.
              <br />
              <span className="text-[#261606]">Priced with Honesty.</span>
            </motion.h2>

            <motion.div
              variants={fadeUpItem}
              className="h-1 w-16 rounded-full bg-[#fbe311]"
            />

            <motion.p
              variants={fadeUpItem}
              className="text-base font-bold text-[#111111] sm:text-lg"
            >
              Meet Sathiq Hussain.
            </motion.p>

            <motion.p
              variants={fadeUpItem}
              className="max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base"
            >
              Every pair of spectacles is personally measured, assembled, checked,
              and adjusted inside our workshop.
            </motion.p>

            <motion.p
              variants={fadeUpItem}
              className="max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base"
            >
              For years we have believed one thing—customers deserve craftsmanship
              instead of shortcuts.
            </motion.p>

            <motion.button
              variants={fadeUpItem}
              whileHover={
                canHover && !shouldReduceMotion ? { y: -2, scale: 1.02 } : undefined
              }
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActivePage('contact');
                window.scrollTo(0, 0);
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#261606] px-6 py-3 text-xs font-bold text-white shadow-lg transition-colors hover:bg-[#111111]"
            >
              Visit Our Store
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </motion.div>

          {/* Right — Portrait Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={shouldReduceMotion || !canHover ? undefined : { y: imageY }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:rounded-3xl">
              <motion.img
                src={image.src}
                alt={image.alt}
                style={shouldReduceMotion || !canHover ? undefined : { scale: imageScale }}
                className="aspect-[4/5] w-full object-cover object-center"
              />
            </div>
            <div className="pointer-events-none absolute -inset-1 rounded-[26px] border border-[#261606]/5 sm:rounded-[28px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   SECTION 2 — FRAME TO FINISHED SPECTACLES
   ========================================== */
const WORKSHOP_STEPS = [
  {
    step: 1,
    title: 'Choose Your Frame',
    description: 'Browse our premium collection and select your perfect style.',
    imageIndex: 1,
  },
  {
    step: 2,
    title: 'Select Prescription Lens',
    description: 'Pick clear, blue-blocker, or photochromic transition lenses.',
    imageIndex: 2,
  },
  {
    step: 3,
    title: 'Precision Lens Grinding',
    description: 'Computer-guided cutting and shaping for exact specifications.',
    imageIndex: 3,
  },
  {
    step: 4,
    title: 'Frame Assembly',
    description: 'Carefully hand-fitted with attention to every detail.',
    imageIndex: 4,
  },
  {
    step: 5,
    title: 'Quality Check',
    description: 'Every pair is verified for fit, clarity, and finish.',
    imageIndex: 5,
  },
  {
    step: 6,
    title: 'Ready in Around 10 Minutes*',
    description: '*Depending on prescription and lens availability.',
    imageIndex: 6,
  },
];

const FrameToFinished: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className={`${sectionSpace} relative overflow-hidden bg-transparent`}>
      <BackgroundShader variant="cream-flow" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-12 space-y-3 text-center"
        >
          <motion.span variants={fadeUpItem}>
            <Eyebrow>THE PROCESS</Eyebrow>
          </motion.span>
          <motion.h2
            variants={fadeUpItem}
            className="text-3xl font-sans font-black tracking-tight text-[#111111] sm:text-4xl lg:text-5xl"
          >
            From Frame to Finished Spectacles
          </motion.h2>
          <motion.div
            variants={fadeUpItem}
            className="mx-auto h-1 w-12 rounded-full bg-[#fbe311]"
          />
        </motion.div>

        {/* Connecting line (desktop) */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[calc(50%+60px)] hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-neutral-200 to-transparent md:block"
        />

        {/* Cards */}
        <motion.div
          ref={scrollRef}
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] md:gap-6 lg:gap-8"
        >
          {WORKSHOP_STEPS.map((step, index) => (
            <React.Fragment key={step.step}>
              <motion.article
                variants={cardReveal}
                whileHover={
                  canHover && !shouldReduceMotion ? { y: -6, scale: 1.01 } : undefined
                }
                className="group flex min-w-[230px] snap-start flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-lg sm:min-w-[250px]"
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden bg-neutral-50">
                  <img
                    src={shopImage(step.imageIndex).src}
                    alt={step.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 p-5">
                  <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#261606] text-[11px] font-bold text-white">
                    {step.step}
                  </span>
                  <h3 className="mt-2 font-sans text-sm font-extrabold text-[#111111]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                    {step.description}
                  </p>
                </div>
              </motion.article>

              {/* Arrow between cards (desktop only) */}
              {index < WORKSHOP_STEPS.length - 1 && (
                <div className="hidden items-center md:flex">
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-300" />
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ==========================================
   SECTION 3 — INSIDE OUR WORKSHOP
   (cinematic crossfade showcase)
   ========================================== */
const SHOWCASE_IMAGES = [
  { index: 7, label: 'Our Workshop' },
  { index: 8, label: 'Grinding Machine' },
  { index: 9, label: 'Lens Cutting' },
  { index: 10, label: 'Frame Adjustment' },
  { index: 11, label: 'Owner Working' },
];

const InsideWorkshop: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % SHOWCASE_IMAGES.length), 4000);
    return () => window.clearInterval(timer);
  }, []);

  const current = SHOWCASE_IMAGES[active];

  return (
    <section className={`${sectionSpace} relative overflow-hidden bg-transparent`}>
      <BackgroundShader variant="gold-radial" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-10 space-y-3 text-center"
        >
          <motion.span variants={fadeUpItem}>
            <Eyebrow>INSIDE OUR WORKSHOP</Eyebrow>
          </motion.span>
          <motion.h2
            variants={fadeUpItem}
            className="text-3xl font-sans font-black tracking-tight text-[#111111] sm:text-4xl lg:text-5xl"
          >
            Inside Niyaz Opticals
          </motion.h2>
          <motion.p
            variants={fadeUpItem}
            className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-500"
          >
            Every spectacle is assembled, aligned and checked inside our own
            workshop before it reaches the customer.
          </motion.p>
        </motion.div>

        {/* Cinematic Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.4, ease: springEase }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
        >
          <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.index}
                src={shopImage(current.index).src}
                alt={current.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Slide indicator (bottom-centre dots) */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {SHOWCASE_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show slide ${idx + 1}`}
                onClick={() => setActive(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === active
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ==========================================
   RADIAL CAROUSEL — inline component
   ========================================== */
interface GalleryItem { id: string | number; url: string; }

const RadialItem: React.FC<{
  item: GalleryItem; baseAngle: number; radius: number;
  thumbnailSize: number; rotation: any; onClick: () => void;
}> = ({ item, baseAngle, radius, thumbnailSize, rotation, onClick }) => {
  const x = useTransform(rotation, (r: number) => Math.cos(baseAngle + (r * Math.PI) / 180) * radius);
  const y = useTransform(rotation, (r: number) => Math.sin(baseAngle + (r * Math.PI) / 180) * radius);
  const rotate = useTransform(rotation, (r: number) => ((baseAngle + (r * Math.PI) / 180) * 180) / Math.PI + 90);

  const itemVariants: Variants = {
    collapsed: { opacity: 0, scale: 0.8, transition: { type: 'spring', bounce: 0.4, duration: 0.5 } },
    expanded:  { opacity: 1, scale: 1,   transition: { type: 'spring', bounce: 0.4, duration: 0.5 } },
  };

  return (
    <motion.div variants={itemVariants} style={{ x, y, rotate }} onClick={onClick} className="absolute cursor-pointer">
      <motion.div
        layoutId={`radial-card-${item.id}`}
        style={{ width: thumbnailSize, height: thumbnailSize }}
        className="overflow-hidden rounded-[18px] border border-neutral-700 bg-neutral-900 p-1 shadow-2xl ring-1 ring-white/5 sm:rounded-[24px]"
      >
        <motion.img
          layoutId={`radial-img-${item.id}`}
          src={item.url} alt=""
          className="h-full w-full rounded-[13px] object-cover sm:rounded-[18px]"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

const RadialCarousel: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [sizes, setSizes] = useState({ radius: 260, thumbnailSize: 110, centerSize: 400 });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 400)       setSizes({ radius: 110, thumbnailSize: 70,  centerSize: 260 });
      else if (w < 640)  setSizes({ radius: 140, thumbnailSize: 80,  centerSize: 300 });
      else if (w < 1024) setSizes({ radius: 200, thumbnailSize: 90,  centerSize: 340 });
      else               setSizes({ radius: 260, thumbnailSize: 110, centerSize: 400 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const rotation = useMotionValue(0);
  const smoothRotation = useMotionSpring(rotation, { bounce: 0.15, duration: 0.1 });

  const containerVariants: Variants = {
    collapsed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
    expanded:  { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
  };

  return (
    <div className="relative flex h-[350px] w-full touch-pan-y items-center justify-center overflow-visible select-none sm:h-[500px]">
      <AnimatePresence mode="popLayout">
        {!isExpanded ? (
          <motion.div key="center" layout transition={{ type: 'spring', bounce: 0.15, duration: 0.15 }} className="relative z-10">
            <motion.div
              layoutId={`radial-card-${items[activeIndex].id}`}
              style={{ width: sizes.centerSize, height: sizes.centerSize }}
              className="relative overflow-hidden rounded-[32px] border border-neutral-700 bg-neutral-900 p-3 shadow-2xl sm:rounded-[42px] sm:p-4"
            >
              <motion.img
                layoutId={`radial-img-${items[activeIndex].id}`}
                src={items[activeIndex].url} alt=""
                className="h-full w-full rounded-[28px] object-cover sm:rounded-[36px]"
                draggable={false}
              />
              <button
                onClick={() => setIsExpanded(true)}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 shadow-xl backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/20 active:scale-95 sm:top-8 sm:right-8 sm:h-10 sm:w-10"
              >
                <X size={18} className="text-white" />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="radial"
            variants={containerVariants}
            initial="collapsed" animate="expanded" exit="collapsed"
            className={`relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing ${
              isPanning ? 'touch-none' : 'touch-pan-y'
            }`}
            onPanStart={() => setIsPanning(true)}
            onPanEnd={() => setIsPanning(false)}
            onPan={(_, info) => rotation.set(rotation.get() + info.delta.x * 0.5)}
          >
            {items.map((item, index) => (
              <RadialItem
                key={item.id}
                item={item}
                baseAngle={(index / items.length) * (2 * Math.PI) - Math.PI / 2}
                radius={sizes.radius}
                thumbnailSize={sizes.thumbnailSize}
                rotation={smoothRotation}
                onClick={() => { setActiveIndex(index); setIsExpanded(false); }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================
   SECTION 4 — GALLERY CAROUSEL
   ========================================== */
const GalleryCarousel: React.FC = () => {
  const galleryItems = SHOP_GALLERY_IMAGES.slice(0, 12).map((img, i) => ({
    id: i,
    url: img.src,
  }));

  return (
    <section className="py-16 sm:py-20 bg-[#111111]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
          THE EXPERIENCE
        </span>
        <h2 className="text-3xl font-sans font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          Walk Through Our World
        </h2>
        <p className="mt-3 mx-auto max-w-xl text-sm leading-relaxed text-neutral-400">
          Click any photo to expand · Drag to spin the carousel
        </p>
      </div>
      <RadialCarousel items={galleryItems} />
    </section>
  );
};

const GalleryMarquee: React.FC = () => {
  const [paused, setPaused] = useState(false);
  const images = SHOP_GALLERY_IMAGES.slice(0, 10);
  const track = [...images, ...images];

  return (
    <section className="relative overflow-hidden bg-[#111111] py-16 sm:py-20">
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">THE EXPERIENCE</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Walk Through Our World</h2>
        <p className="mt-3 text-sm text-neutral-400">Drag to explore • hover to pause</p>
      </div>
      <div className="space-y-4" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {[false, true].map((reverse) => (
          <motion.div
            key={String(reverse)}
            drag="x"
            dragConstraints={{ left: -260, right: 260 }}
            dragElastic={0.08}
            onDragStart={() => setPaused(true)}
            onDragEnd={() => setPaused(false)}
            animate={paused ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
            transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
            className="flex w-max gap-4 will-change-transform"
          >
            {track.map((image, index) => (
              <div key={`${reverse}-${index}`} className="h-40 w-60 flex-none overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 sm:h-48 sm:w-72">
                <img src={image.src} alt="Niyaz Opticals gallery" loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ==========================================
   SECTION 5 — REAL CUSTOMERS
   (premium carousel)
   ========================================== */
const CUSTOMER_MOMENTS = [
  {
    imageIndex: 12,
    caption: 'Prescription completed and delivered.',
  },
  {
    imageIndex: 13,
    caption: 'Frame adjusted before handover.',
  },
  {
    imageIndex: 14,
    caption: 'Another happy customer from Trichy.',
  },
  {
    imageIndex: 0,
    caption: 'Trust built through honest service.',
  },
];

const RealCustomers: React.FC = () => {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % CUSTOMER_MOMENTS.length), 4000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goTo = (index: number) => setActive(index);

  const prev = () => goTo((active - 1 + CUSTOMER_MOMENTS.length) % CUSTOMER_MOMENTS.length);
  const next = () => goTo((active + 1) % CUSTOMER_MOMENTS.length);

  const current = CUSTOMER_MOMENTS[active];

  return (
    <section className={`${sectionSpace} relative overflow-hidden bg-transparent`}>
      <BackgroundShader variant="warm-sunlight" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-10 space-y-3 text-center"
        >
          <motion.span variants={fadeUpItem}>
            <Eyebrow>REAL CUSTOMERS</Eyebrow>
          </motion.span>
          <motion.h2
            variants={fadeUpItem}
            className="text-3xl font-sans font-black tracking-tight text-[#111111] sm:text-4xl lg:text-5xl"
          >
            Real Customers.
            <br />
            Real Smiles.
          </motion.h2>
          <motion.p
            variants={fadeUpItem}
            className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-500"
          >
            Nothing tells our story better than the people who trust us every day.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.4, ease: springEase }}
          drag="x"
          dragConstraints={{ left: -80, right: 80 }}
          dragElastic={0.15}
          onHoverStart={() => setIsPaused(true)}
          onHoverEnd={() => setIsPaused(false)}
          onDragStart={() => setIsPaused(true)}
          onDragEnd={(_, info) => {
            if (info.offset.x < -40) next();
            if (info.offset.x > 40) prev();
            setIsPaused(false);
          }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Slide */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
            <div className="aspect-[4/3] overflow-hidden bg-neutral-50 sm:aspect-[16/9]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.imageIndex}
                  src={shopImage(current.imageIndex).src}
                  alt={current.caption}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="h-full w-full object-cover object-center"
                />
              </AnimatePresence>
            </div>

            {/* Caption overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6 pt-12">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5 fill-[#fbe311] text-[#fbe311]"
                  />
                ))}
              </div>
              <p className="mt-2 text-sm font-medium text-white">
                {current.caption}
              </p>
            </div>
          </div>

          {/* Navigation arrows (desktop) */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md transition-all hover:scale-105 hover:shadow-lg md:block"
          >
            <ChevronRight className="h-5 w-5 rotate-180 text-[#111111]" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md transition-all hover:scale-105 hover:shadow-lg md:block"
          >
            <ChevronRight className="h-5 w-5 text-[#111111]" />
          </button>

          {/* Progress dots */}
          <div className="mt-4 flex justify-center gap-2">
            {CUSTOMER_MOMENTS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === active
                    ? 'w-6 bg-[#261606]'
                    : 'w-2 bg-neutral-200 hover:bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ==========================================
   SECTION 5 — ENDING (DARK CTA)
   ========================================== */
const EndingSection: React.FC = () => {
  const { setActivePage } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();

  const bgImage = shopImage(7);

  return (
    <section className="relative overflow-hidden py-24 sm:py-28 lg:py-32">
      {/* Dark overlay background */}
      <div className="absolute inset-0 bg-[#111111]" />
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={bgImage.src}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20"
        />
        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-[#111111]/60" />
      </div>

      {/* Subtle glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fbe311]/5 blur-[120px]"
      />

      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="space-y-8 text-center"
        >
          <motion.h2
            variants={fadeUpItem}
            className="text-4xl font-sans font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Every Pair.
            <br />
            <span className="text-[#fbe311]">Personally Crafted.</span>
          </motion.h2>

          <motion.p
            variants={fadeUpItem}
            className="mx-auto max-w-lg text-sm leading-relaxed text-neutral-400"
          >
            From raw lenses to finished spectacles, everything is built under one
            roof.
          </motion.p>

          <motion.div
            variants={fadeUpItem}
            className="flex flex-wrap justify-center gap-x-8 gap-y-2"
          >
            {['Factory Price.', 'Premium Vision.', 'Honest Service.'].map(
              (item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-neutral-300"
                >
                  <span className="h-1 w-1 rounded-full bg-[#fbe311]" />
                  {item}
                </span>
              ),
            )}
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
          >
            <motion.button
              whileHover={
                canHover && !shouldReduceMotion ? { y: -2, scale: 1.02 } : undefined
              }
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActivePage('contact');
                window.scrollTo(0, 0);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#fbe311] px-8 py-3.5 text-xs font-bold text-[#111111] shadow-lg transition-colors hover:bg-white"
            >
              Visit Store
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>

            <motion.button
              whileHover={
                canHover && !shouldReduceMotion ? { y: -2, scale: 1.02 } : undefined
              }
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActivePage('shop');
                window.scrollTo(0, 0);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-xs font-bold text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              Browse Collections
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ==========================================
   MAIN EXPORT
   ========================================== */
export const AboutExperience: React.FC = () => (
  <main id="about-page" className="ambient-accent ambient-accent--about relative overflow-hidden">
    <CinematicBackground />
    <div className="relative z-10">
      <MeetTheCraftsman />
      <FrameToFinished />
      <InsideWorkshop />
      <GalleryMarquee />
      <RealCustomers />
      <EndingSection />
    </div>
  </main>
);
