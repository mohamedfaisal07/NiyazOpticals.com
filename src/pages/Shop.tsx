import React, { useState, useMemo } from 'react';
import { useApp } from '../components/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Search, Sparkles, Filter, Grid, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '../data';
import { BackgroundShader } from '../components/BackgroundShader';
import { CinematicBackground } from '../components/CinematicBackground';

export const Shop: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = useApp();

  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating' | 'bestseller'>('default');
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Designs' },
    { id: 'full', label: 'Full Frame' },
    { id: 'half', label: 'Half Frame' },
    { id: 'rimless', label: 'Rimless Premium' },
    { id: 'sunglasses', label: "Sunglasses" },
    { id: 'kids', label: 'Kids Glasses' }
  ];

  // Unique Materials & Styles for advanced filters
  const uniqueMaterials = ['Titanium', 'Acetate', 'Stainless Steel', 'Ultem TR90', 'Carbon Fiber'];
  const uniqueStyles = ['Round', 'Aviator', 'Wayfarer', 'Clubmaster', 'Hexagonal', 'Rectangular', 'Cat-Eye'];

  // Load active products (supports products added dynamically by admin)
  const activeProductsList = useMemo(() => {
    const customProds = localStorage.getItem('niyaz_admin_products');
    if (customProds) {
      return JSON.parse(customProds);
    }
    return PRODUCTS;
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...activeProductsList];

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.collection === selectedCategory);
    }

    // Advanced Material Filter
    if (materialFilter !== 'all') {
      result = result.filter(p => p.material === materialFilter);
    }

    // Advanced Frame Style Filter
    if (styleFilter !== 'all') {
      result = result.filter(p => p.frameStyle === styleFilter);
    }

    // Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.frameStyle.toLowerCase().includes(q) || 
        p.material.toLowerCase().includes(q)
      );
    }

    // Sorting Logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'bestseller') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [activeProductsList, selectedCategory, materialFilter, styleFilter, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaterialFilter('all');
    setStyleFilter('all');
    setSortBy('default');
  };

  return (
    <div className="ambient-page relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden" id="shop-page-wrapper">
      <CinematicBackground />
      <BackgroundShader variant="gold-radial" />
      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        
        {/* Page Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">100+ HIGH END FRAME DESIGNS</span>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#111111]">
            Direct Manufacturer Outlet
          </h1>
          <div className="w-12 h-1 bg-[#fbe311] mx-auto rounded" />
          <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed">
            Every frame includes premium anti-reflection single-vision lenses. Fabricated under precise computerized parameters and shipped to your home. No middlemen markup.
          </p>
        </div>

        {/* Categories filters chips bar */}
        <div className="flex gap-2 pb-2 overflow-x-auto justify-start sm:justify-center border-b border-neutral-100 font-mono text-xs font-bold scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4.5 py-2.5 rounded-full border transition-all flex-shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#261606] text-[#fbe311] border-transparent shadow-md'
                  : 'bg-white text-neutral-600 border-neutral-200/60 hover:border-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer Panel */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Filters Selectors */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-neutral-500">
            
            {/* Search label indicator */}
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4 text-neutral-400" />
              <span>Filters:</span>
            </div>

            {/* Material selector */}
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Materials</option>
              {uniqueMaterials.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Shape style selector */}
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Shapes</option>
              {uniqueStyles.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

          </div>

          {/* Sort Controller and Reset */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 font-mono text-xs font-bold">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated (4.8+)</option>
              <option value="bestseller">Best Sellers</option>
            </select>

            <button 
              onClick={handleResetFilters}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-600 transition-colors"
              title="Reset all filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Active Filters list banner */}
        {(materialFilter !== 'all' || styleFilter !== 'all' || searchQuery || selectedCategory !== 'all') && (
          <div className="flex justify-between items-center bg-yellow-500/5 border border-yellow-500/10 p-3.5 rounded-2xl text-xs font-mono font-medium text-neutral-600">
            <div>
              <span>Active filters: </span>
              {selectedCategory !== 'all' && <span className="font-bold text-[#261606]">Collection: {selectedCategory} • </span>}
              {materialFilter !== 'all' && <span className="font-bold text-[#261606]">Material: {materialFilter} • </span>}
              {styleFilter !== 'all' && <span className="font-bold text-[#261606]">Shape: {styleFilter} • </span>}
              {searchQuery && <span className="font-bold text-[#261606]">Search: "{searchQuery}"</span>}
            </div>
            <button onClick={handleResetFilters} className="text-neutral-500 hover:text-[#261606] font-bold underline">
              Reset Filters
            </button>
          </div>
        )}

        {/* Dynamic Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-neutral-100">
            <Search className="w-10 h-10 text-neutral-300 mx-auto" />
            <div>
              <h3 className="font-extrabold text-neutral-800 text-base">No frames match your filters!</h3>
              <p className="text-neutral-400 text-xs mt-1">Try resetting the material filters or search terms.</p>
            </div>
            <button 
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#261606] text-white rounded-full text-xs font-bold transition-all"
            >
              View Full Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="shop-product-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} motionIndex={index} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
