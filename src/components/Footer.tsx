import React from 'react';
import { useApp } from './AppContext';
import { Phone, MessageSquare, MapPin, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useCanHover } from '../hooks/useCanHover';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();

  const handleLinkClick = (page: any, category?: string) => {
    setActivePage(page);
    if (category) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#111111] text-white pt-16 pb-8 border-t border-neutral-800">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <motion.div
            whileHover={canHover && !shouldReduceMotion ? { x: 2 } : undefined}
            className="flex flex-col cursor-pointer"
            onClick={() => handleLinkClick('home')}
          >
            <span className="font-sans text-lg font-black tracking-widest text-white uppercase">
              NIYAZ <span className="text-yellow-400 font-light">OPTICALS</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              Factory Price. Premium Vision.
            </span>
          </motion.div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            Premium prescription eyeglasses at factory direct pricing. Utilizing automated lens grinding technologies to serve Trichy and deliver safely across all of India.
          </p>
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono">
            <Shield className="w-4 h-4 text-[#fbe311]" />
            <span>ISO 9001:2015 Optical Lab</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-[#fbe311] uppercase">QUICK LINKS</h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>
              <button onClick={() => handleLinkClick('home')} className="hover:text-white transition-colors duration-300">
                Home Landing
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('shop')} className="hover:text-white transition-colors duration-300">
                Shop Catalog
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('track-order')} className="hover:text-white transition-colors duration-300">
                Track Order Status
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('contact')} className="hover:text-white transition-colors duration-300">
                Contact Outlets
              </button>
            </li>
          </ul>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-[#fbe311] uppercase font-bold">COLLECTIONS</h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            {[
              { label: 'Full Frame Eyeglasses', cat: 'full' as const },
              { label: 'Half Frame Styles', cat: 'half' as const },
              { label: 'Rimless Titanium', cat: 'rimless' as const },
              { label: "Men's Polarized Sunglasses", cat: 'sunglasses' as const },
              { label: 'Flexible Kids Glasses', cat: 'kids' as const },
            ].map((item) => (
              <li key={item.cat}>
                <button
                  onClick={() => handleLinkClick('shop', item.cat)}
                  className="hover:text-white transition-colors duration-300"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Outlet Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-[#fbe311] uppercase font-bold">STORE OUTLET</h4>
          <div className="space-y-3 text-xs text-neutral-400 leading-relaxed">
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-[#fbe311] flex-shrink-0" />
              <p>
                No 22/1, 1st Floor,<br />
                Melaputhur Main Road,<br />
                Tiruchirappalli – 620001,<br />
                Tamil Nadu, India
              </p>
            </div>
            
            <div className="flex flex-col gap-1 border-t border-neutral-800 pt-2 text-neutral-300">
              <p className="font-bold">Contact Support:</p>
              <a href="tel:9443617786" className="hover:text-[#fbe311] transition-colors">📞 9443617786</a>
              <a href="tel:9443537786" className="hover:text-[#fbe311] transition-colors">📞 9443537786</a>
              <a href="tel:9443639786" className="hover:text-[#fbe311] transition-colors">📞 9443639786</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p>© 2026 Niyaz Opticals. Owner: Sathiq Hussain M. All Rights Reserved.</p>
          <p className="text-[10px] text-neutral-600 mt-0.5">Manufacturing & Optics Laboratory License No: TN-TRY-OPT-89712</p>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.a
            whileHover={canHover && !shouldReduceMotion ? { scale: 1.02 } : undefined}
            href="tel:9443617786"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#fbe311]" />
            <span>Call Store</span>
          </motion.a>
          <span className="text-neutral-700">|</span>
          <motion.a
            whileHover={canHover && !shouldReduceMotion ? { scale: 1.02 } : undefined}
            href="https://wa.me/919443617786"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-green-500" />
            <span>WhatsApp Consultation</span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
};
