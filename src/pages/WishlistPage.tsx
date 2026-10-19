import React from 'react';
import { useApp } from '../components/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { BackgroundShader } from '../components/BackgroundShader';

export const WishlistPage: React.FC = () => {
  const { wishlist, setActivePage } = useApp();

  return (
    <div className="ambient-page relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden" id="wishlist-page">
      <BackgroundShader variant="cream-flow" />
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">YOUR SAVED FAVORITES</span>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#111111]">
            Curated Eyewear Wishlist
          </h1>
          <div className="w-12 h-1 bg-[#fbe311] mx-auto rounded" />
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto font-medium">
            Keep track of your preferred frame styles, materials, and custom colors before final checkout.
          </p>
        </div>

        {wishlist.length === 0 ? (
          // Empty Wishlist
          <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-neutral-100 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-50 border flex items-center justify-center mx-auto text-neutral-300">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-800 text-base">Your Wishlist is empty!</h3>
              <p className="text-neutral-400 text-xs mt-1">Bookmark custom titanium and acetate frames to view them here.</p>
            </div>
            <button 
              onClick={() => {
                setActivePage('shop');
                window.scrollTo(0,0);
              }}
              className="px-6 py-3 bg-[#261606] text-white rounded-full text-xs font-bold transition-all"
            >
              Explore Frame Styles
            </button>
          </div>
        ) : (
          // Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
