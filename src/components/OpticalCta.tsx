import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from './AppContext';

type OpticalCtaPlacement = 'hero' | 'about' | 'contact';

const content: Record<OpticalCtaPlacement, { eyebrow: string; title: React.ReactNode; description: string }> = {
  hero: {
    eyebrow: 'PERSONAL OPTICAL GUIDANCE',
    title: <>See clearly.<br /><em className="font-serif font-normal text-[#fbe311]">Feel exceptional.</em></>,
    description: 'Find a frame that feels like you, with factory-direct pricing and personal support from our Trichy opticians.',
  },
  about: {
    eyebrow: 'THE NIYAZ DIFFERENCE',
    title: <>Your vision deserves<br /><em className="font-serif font-normal text-[#fbe311]">personal craft.</em></>,
    description: 'From frame selection to final fitting, our team makes every pair with the care your eyes deserve.',
  },
  contact: {
    eyebrow: 'WE ARE HERE TO HELP',
    title: <>Your clearest vision<br /><em className="font-serif font-normal text-[#fbe311]">starts here.</em></>,
    description: 'Message an optician, visit our Trichy outlet, or explore the collection whenever you are ready.',
  },
};

export const OpticalCta: React.FC<{ placement: OpticalCtaPlacement }> = ({ placement }) => {
  const { setActivePage, setSelectedCategory } = useApp();
  const copy = content[placement];

  const browseCollection = () => {
    setSelectedCategory('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#17100a] px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8" aria-label="Eyewear consultation call to action">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_15%,rgba(251,227,17,0.16),transparent_68%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_8%_100%,rgba(199,165,107,0.13),transparent_68%)]" />

      <div className="relative mx-auto max-w-3xl">
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#fbe311]">{copy.eyebrow}</span>
        <h2 className="mt-5 text-4xl font-black leading-[0.94] tracking-tight text-white sm:text-5xl lg:text-6xl">{copy.title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">{copy.description}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={browseCollection} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/15">
            Browse collection <ArrowUpRight className="h-4 w-4" />
          </button>
          <a href="https://wa.me/919443617786?text=Hi%20Niyaz%20Opticals,%20I%20would%20like%20help%20choosing%20my%20eyewear." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#fbe311] px-6 py-3 text-sm font-bold text-[#261606] transition-colors duration-150 hover:bg-white">
            Talk to an optician <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
