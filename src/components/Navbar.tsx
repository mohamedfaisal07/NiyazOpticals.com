import React, { useState } from 'react';
import { useApp } from './AppContext';
import { ShoppingBag, Heart, Search, Menu, X, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { prefetchPage } from '../pageLoaders';
import type { ActivePage } from '../types';

export const Navbar: React.FC = () => {
  const { 
    cart, 
    wishlist, 
    activePage, 
    setActivePage, 
    searchQuery,
    setSearchQuery,
    setShowCartDrawer
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleNavLink = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setShowSearch(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrefetch = (page: ActivePage) => () => prefetchPage(page);

  // Secret admin access: triple-click the logo
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [logoClickTimer, setLogoClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (next >= 7) {
      setLogoClickCount(0);
      setActivePage('admin');
      window.scrollTo(0, 0);
    } else {
      setActivePage('home');
      setMobileMenuOpen(false);
      setShowSearch(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const t = setTimeout(() => setLogoClickCount(0), 800);
      setLogoClickTimer(t);
    }
  };

  return (
    <>
      {/* 1. Announcement Bar */}
      <div id="announcement-bar" className="w-full bg-[#261606] text-white py-2 px-4 text-xs font-mono flex flex-wrap justify-between items-center border-b border-yellow-500/15 relative z-50">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fbe311]"></span>
          <span>FACTORY DIRECT PRICES: EVERY STYLE BELOW ₹1000</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#fbe311]" /> Free Lenses Included
          </span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-[#fbe311]" /> Home Delivery Across India
          </span>
        </div>
      </div>

      {/* 2. Premium Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="nav-logo"
          >
            <img src="/niyaz-logo.svg" alt="Niyaz Opticals" className="h-10 w-10 shrink-0 rounded-full border border-neutral-100 bg-white sm:h-11 sm:w-11" />
            <span className="flex flex-col">
              <span className="font-sans text-lg font-black tracking-widest text-[#111111] sm:text-xl">
                NIYAZ <span className="text-[#261606] font-light">OPTICALS</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#261606] uppercase font-bold group-hover:text-yellow-600 transition-colors sm:text-[10px]">
                Factory Price. <span className="text-yellow-500 font-extrabold">Premium Vision.</span>
              </span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-700">
            <button 
              onClick={() => handleNavLink('home')}
              className={`hover:text-[#261606] transition-colors relative py-1 ${activePage === 'home' ? 'text-[#261606] font-bold' : ''}`}
            >
              Home
              {activePage === 'home' && (
                <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fbe311]" />
              )}
            </button>
            <button 
              onClick={() => handleNavLink('shop')}
              onMouseEnter={handlePrefetch('shop')}
              onFocus={handlePrefetch('shop')}
              className={`hover:text-[#261606] transition-colors relative py-1 ${activePage === 'shop' ? 'text-[#261606] font-bold' : ''}`}
            >
              Shop Collections
              {activePage === 'shop' && (
                <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fbe311]" />
              )}
            </button>
            <button 
              onClick={() => handleNavLink('track-order')} 
              onMouseEnter={handlePrefetch('track-order')}
              onFocus={handlePrefetch('track-order')}
              className={`hover:text-[#261606] transition-colors relative py-1 ${activePage === 'track-order' ? 'text-[#261606] font-bold' : ''}`}
            >
              Track Order
              {activePage === 'track-order' && (
                <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fbe311]" />
              )}
            </button>
            <button 
              onClick={() => handleNavLink('about')} 
              onMouseEnter={handlePrefetch('about')}
              onFocus={handlePrefetch('about')}
              className={`hover:text-[#261606] transition-colors relative py-1 ${activePage === 'about' ? 'text-[#261606] font-bold' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavLink('contact')} 
              onMouseEnter={handlePrefetch('contact')}
              onFocus={handlePrefetch('contact')}
              className={`hover:text-[#261606] transition-colors relative py-1 ${activePage === 'contact' ? 'text-[#261606] font-bold' : ''}`}
            >
              Contact
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search toggler */}
            <div className="relative">
              <AnimatePresence>
                {showSearch && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-10 top-1/2 w-[220px] -translate-y-1/2 origin-right"
                  >
                    <input 
                      type="text"
                      placeholder="Search frames..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-8 py-1.5 border border-neutral-200 rounded-full text-xs focus:outline-none focus:border-[#261606]"
                      autoFocus
                    />
                    {searchQuery && (
                      <X 
                        className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600"
                        onClick={() => setSearchQuery('')}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (activePage !== 'shop') setActivePage('shop');
                }}
                className="p-2 text-neutral-600 hover:text-[#261606] transition-colors"
                id="search-toggle-btn"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist */}
            <button 
              onClick={() => handleNavLink('wishlist')}
              className="p-2 text-neutral-600 hover:text-[#261606] transition-colors relative"
              id="wishlist-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#261606] text-[#fbe311] border border-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="p-2 text-neutral-600 hover:text-[#261606] transition-colors relative"
              id="cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#fbe311] text-[#261606] border border-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>


          </div>

          {/* Mobile Actions and Toggler */}
          <div className="flex md:hidden items-center gap-4">
            {/* Wishlist on mobile */}
            <button 
              onClick={() => handleNavLink('wishlist')}
              className="p-1.5 text-neutral-600 relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#261606] text-[#fbe311] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart on mobile */}
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="p-1.5 text-neutral-600 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fbe311] text-[#261606] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggler */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-800"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="md:hidden w-full bg-white border-b border-neutral-100 overflow-hidden"
              id="mobile-nav-panel"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                {/* Mobile Search */}
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search premium glasses..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activePage !== 'shop') setActivePage('shop');
                    }}
                    className="w-full pl-8 pr-4 py-2 border border-neutral-200 rounded-lg text-sm"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <button 
                  onClick={() => handleNavLink('home')} 
                  className={`text-left text-sm py-2 px-1 border-l-2 ${activePage === 'home' ? 'border-[#261606] font-bold text-[#261606]' : 'border-transparent text-neutral-600'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNavLink('shop')} 
                  className={`text-left text-sm py-2 px-1 border-l-2 ${activePage === 'shop' ? 'border-[#261606] font-bold text-[#261606]' : 'border-transparent text-neutral-600'}`}
                >
                  Shop Collections
                </button>
                <button 
                  onClick={() => handleNavLink('track-order')} 
                  className={`text-left text-sm py-2 px-1 border-l-2 ${activePage === 'track-order' ? 'border-[#261606] font-bold text-[#261606]' : 'border-transparent text-neutral-600'}`}
                >
                  Track Order
                </button>
                <button 
                  onClick={() => handleNavLink('about')} 
                  className="text-left text-sm py-2 px-1 text-neutral-600"
                >
                  About
                </button>
                <button 
                  onClick={() => handleNavLink('contact')} 
                  className={`text-left text-sm py-2 px-1 border-l-2 ${activePage === 'contact' ? 'border-[#261606] font-bold text-[#261606]' : 'border-transparent text-neutral-600'}`}
                >
                  Contact
                </button>


              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
