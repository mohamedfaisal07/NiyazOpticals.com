import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { m, useReducedMotion } from 'motion/react';
import { Product } from '../types';
import { useApp } from './AppContext';
import { GlassesIcon } from './GlassesIcon';
import { useCanHover } from '../hooks/useCanHover';

interface ProductCardProps {
  product: Product;
  motionIndex?: number;
  floating?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, motionIndex = 0, floating = false }) => {
  const { toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  const [activeColor, setActiveColor] = useState(product.colors[0]);
  const [imageFailed, setImageFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const isFav = isInWishlist(product.id);

  const floatAnimation = floating && canHover && !shouldReduceMotion
    ? { y: [0, -4, 0], rotate: [-0.7, 0.7, -0.7] }
    : { y: 0, rotate: 0 };

  return (
    <m.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: Math.min(motionIndex * 0.06, 0.3) }}
      className="will-change-transform"
    >
    <m.article
      animate={floatAnimation}
      transition={floating ? { duration: 4.8 + (motionIndex % 3) * 0.45, repeat: Infinity, ease: 'easeInOut', delay: motionIndex * 0.16 } : { duration: 0.2 }}
      whileHover={canHover && !shouldReduceMotion ? { y: -7, scale: 1.04 } : undefined}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      onClick={() => setSelectedProduct(product)}
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/50 bg-white will-change-transform hover:border-[#261606]/35 hover:shadow-lg"
      id={`product-card-${product.id}`}
    >
      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-neutral-100 bg-neutral-50/70 p-6">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
          {product.isBestSeller && <span className="rounded-full bg-[#261606] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-white">Best Seller</span>}
          {product.isTrending && <span className="rounded-full bg-[#fbe311] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#261606]">Trending</span>}
        </div>
        <button onClick={(event) => { event.stopPropagation(); toggleWishlist(product); }} className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/60 bg-white shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95 ${isFav ? 'border-red-100 text-red-500' : 'text-neutral-400 hover:text-neutral-600'}`} id={`wishlist-toggle-${product.id}`} aria-label={`Toggle ${product.name} in wishlist`}>
          <Heart className="h-4 w-4" fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          {product.image && !imageFailed ? <img src={product.image} alt={product.name} loading={motionIndex < 4 ? 'eager' : 'lazy'} fetchPriority={motionIndex < 4 ? 'high' : 'auto'} decoding="async" width="320" height="192" onError={() => setImageFailed(true)} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" /> : <GlassesIcon frameStyle={product.frameStyle} collection={product.collection} primaryColor={activeColor} showTemples />}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-4 p-4">
        <div className="space-y-1"><div className="flex items-center justify-between"><span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">{product.material} • {product.frameStyle}</span><div className="flex items-center gap-1 font-mono text-[10px] text-neutral-500"><span className="text-xs font-bold text-amber-400">★</span><span>{product.rating}</span></div></div><h3 className="line-clamp-1 font-sans text-sm font-extrabold tracking-tight text-[#111111]">{product.name}</h3><p className="line-clamp-1 text-xs font-light text-neutral-500">{product.description}</p></div>
        <div className="flex items-center justify-between border-t border-neutral-100/60 pt-3"><div><span className="block font-mono text-[10px] font-bold text-neutral-400">FACTORY DIRECT</span><span className="font-sans text-sm font-black tracking-tight text-neutral-900">₹{product.price}</span><span className="ml-1 text-[9px] font-bold text-neutral-400 line-through">₹2,499</span></div><div className="flex items-center gap-1.5" id={`color-selectors-${product.id}`}>{product.colors.map((color) => <button key={color} onClick={(event) => { event.stopPropagation(); setActiveColor(color); }} className={`h-3.5 w-3.5 rounded-full border transition-transform duration-150 hover:scale-110 ${activeColor === color ? 'scale-110 ring-2 ring-[#261606] ring-offset-1' : 'border-neutral-200'}`} style={{ backgroundColor: color }} title={`Frame option color ${color}`} aria-label={`Choose ${color} frame color`} />)}</div></div>
      </div>
    </m.article>
    </m.div>
  );
};
