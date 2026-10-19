import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from './AppContext';
import { X, ShieldCheck, Heart, ShoppingBag, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, isInWishlist } = useApp();

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const isFav = isInWishlist(product.id);

  // Form selections
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M');
  const [selectedLensType, setSelectedLensType] = useState<'Classic Clear' | 'Blue-Blocker' | 'Photochromic Transition' | 'Premium Bifocal'>('Classic Clear');
  const [quantity, setQuantity] = useState<number>(1);

  // Lens types dictionary
  const lensOptions = [
    {
      name: 'Classic Clear' as const,
      price: 0,
      description: 'Premium anti-scratch high index clear lenses included for free.'
    },
    {
      name: 'Blue-Blocker' as const,
      price: 200,
      description: 'Blocks high-energy digital screen blue light and prevents eye strain.'
    },
    {
      name: 'Photochromic Transition' as const,
      price: 350,
      description: 'Auto-darkens to dark sunglasses style under sunlight. High-UV defense.'
    },
    {
      name: 'Premium Bifocal' as const,
      price: 500,
      description: 'Dual correction sectors matching reading power and distance focus.'
    }
  ];

  const activeLensObj = lensOptions.find(l => l.name === selectedLensType)!;
  const unitTotal = product.price + activeLensObj.price;
  const grandTotal = unitTotal * quantity;

  const handleAddToCartSubmit = () => {
    addToCart(product, quantity, selectedColor, selectedSize, selectedLensType);
    setSelectedProduct(null); // close modal
  };

  const frameSizeGuide = {
    S: 'Small (Frame width: 130mm - Kids / Narrow faces)',
    M: 'Medium (Frame width: 138mm - Fits 85% of adults)',
    L: 'Large (Frame width: 145mm - Broad face shapes)'
  };

  return (
    <div className="fixed inset-0 z-50" id="product-detail-modal">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm"
        onClick={() => setSelectedProduct(null)}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        {/* Modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-white text-left shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 my-8"
        >
          {/* Close button */}
          <button 
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors flex items-center justify-center"
            id="modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Visual Vector Display (md:col-span-5) */}
          <div className="md:col-span-5 bg-neutral-50 p-8 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-neutral-100">
            <div className="w-full flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-[#261606]/70 bg-[#fbe311]/20 px-2.5 py-0.5 rounded uppercase">
                {product.collection} COLLECTION
              </span>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border ${isFav ? 'text-red-500 border-red-100' : 'text-neutral-400 border-neutral-200'}`}
              >
                <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Product photography */}
            <div className="w-full h-56 flex items-center justify-center">
              <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-500 hover:scale-105" />
            </div>

            {/* Micro Details box */}
            <div className="w-full space-y-2 border-t border-neutral-200/50 pt-4 text-xs font-mono text-neutral-500">
              <div className="flex justify-between">
                <span>Material:</span>
                <span className="font-bold text-neutral-800">{product.material}</span>
              </div>
              <div className="flex justify-between">
                <span>Hinge:</span>
                <span className="font-bold text-neutral-800">Flexible Spring Joints</span>
              </div>
              <div className="flex justify-between">
                <span>Coating:</span>
                <span className="font-bold text-neutral-800">Double Hydrophobic Anti-Glare</span>
              </div>
            </div>

          </div>

          {/* Right Column: Configuration panel (md:col-span-7) */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            
            {/* Title & Basics */}
            <div className="space-y-2">
              <h2 className="text-2xl font-sans font-black tracking-tight text-[#111111] leading-none">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xl font-sans font-black text-neutral-900">₹{product.price}</span>
                <span className="text-xs text-neutral-400 line-through">₹2,499</span>
                <span className="text-[10px] text-green-700 bg-green-50 font-bold px-2 py-0.5 rounded font-mono">
                  SAVE 64% FACTORY DISPATCH
                </span>
              </div>
            </div>

            {/* Configuration Options */}
            <div className="space-y-4">
              
              {/* 1. Frame Color */}
              <div className="space-y-2">
                <span className="block text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                  Select Frame Color
                </span>
                <div className="flex gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        selectedColor === color ? 'ring-2 ring-[#261606] ring-offset-2 scale-110' : 'border-neutral-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Frame Size */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                    Select Frame Size
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono font-medium">
                    {frameSizeGuide[selectedSize]}
                  </span>
                </div>
                <div className="flex gap-2">
                  {(['S', 'M', 'L'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'bg-[#261606] text-white border-transparent'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Lens Configuration Package */}
              <div className="space-y-2">
                <span className="block text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                  Select Premium Lens Package
                </span>
                <div className="space-y-2">
                  {lensOptions.map((lens) => (
                    <div 
                      key={lens.name}
                      onClick={() => setSelectedLensType(lens.name)}
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        selectedLensType === lens.name
                          ? 'border-[#261606] bg-neutral-50 shadow-inner'
                          : 'border-neutral-200/60 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="radio" 
                          name="lensTypeRadio" 
                          checked={selectedLensType === lens.name}
                          onChange={() => {}} // handled by click parent
                          className="mt-0.5 accent-[#261606]"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-800">{lens.name}</p>
                          <p className="text-[10px] text-neutral-500 leading-tight pr-4">{lens.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-neutral-800 whitespace-nowrap">
                        {lens.price === 0 ? 'FREE' : `+₹${lens.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Zero Friction Prescription Announcement Box */}
            <div className="bg-amber-500/5 border border-yellow-500/15 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#261606] flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-1">
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-tight">Post-Payment Prescription Support</h4>
                <p className="text-[11px] text-[#261606]/85 leading-relaxed">
                  No complex forms! Just complete your order checkout. Our optical consultation crew will contact you on WhatsApp/Call immediately to receive your prescription sheet photo. 
                </p>
              </div>
            </div>

            {/* Footer Pricing & Buy Block */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
              
              {/* Quantity */}
              <div className="flex items-center border border-neutral-200 rounded-xl px-2 h-12 bg-white">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 text-neutral-500 font-bold text-lg hover:text-[#261606]"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-mono font-bold text-neutral-800">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 text-neutral-500 font-bold text-lg hover:text-[#261606]"
                >
                  +
                </button>
              </div>

              {/* Price tally & Submit button */}
              <button 
                onClick={handleAddToCartSubmit}
                className="flex-1 h-12 bg-[#261606] hover:bg-[#111111] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                id="modal-add-to-cart-cta"
              >
                <ShoppingBag className="w-4 h-4 text-[#fbe311]" />
                <span>Add to Cart • ₹{grandTotal}</span>
              </button>

            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
};
