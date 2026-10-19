import React, { useState, useEffect } from 'react';
import { useApp } from '../components/AppContext';
import { Order } from '../types';
import { Search, MapPin, Truck, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { BackgroundShader } from '../components/BackgroundShader';
import { CinematicBackground } from '../components/CinematicBackground';

export const OrderTracking: React.FC = () => {
  const { orders } = useApp();
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto load the first active seed order if there is any, or let them enter.
  useEffect(() => {
    if (orders.length > 0) {
      // prefill search with the first order to show off the system immediately
      setSearchId(orders[0].id);
      setSearchedOrder(orders[0]);
    }
  }, [orders]);

  // Sync searched order state when global orders change (e.g. from admin updates)
  useEffect(() => {
    if (searchedOrder) {
      const match = orders.find(o => o.id === searchedOrder.id);
      if (match) {
        setSearchedOrder(match);
      }
    }
  }, [orders, searchedOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSearchedOrder(null);

    const match = orders.find(o => o.id.trim().toUpperCase() === searchId.trim().toUpperCase());
    if (match) {
      setSearchedOrder(match);
    } else {
      setErrorMsg('No order found with that ID. Double check your receipt code (e.g., NY-ORD-87122).');
    }
  };

  // Progression steps list
  const steps: ('Awaiting Prescription' | 'Prescription Confirmed' | 'Lens Manufacturing' | 'Quality Check' | 'Shipped' | 'Delivered')[] = [
    'Awaiting Prescription',
    'Prescription Confirmed',
    'Lens Manufacturing',
    'Quality Check',
    'Shipped',
    'Delivered'
  ];

  const getStepIndex = (status: string) => {
    return steps.indexOf(status as any);
  };

  const getStepDescription = (step: string) => {
    switch (step) {
      case 'Awaiting Prescription': return 'Our advisory team is waiting to collect your optical power sheet via WhatsApp.';
      case 'Prescription Confirmed': return 'Your prescription has been validated by our certified Trichy optometrists.';
      case 'Lens Manufacturing': return 'Your custom lenses are undergoing robotic grinding and anti-reflective coating.';
      case 'Quality Check': return 'We verify laser alignments and frame structural integrity under high precision.';
      case 'Shipped': return 'Your custom spectacles are packaged and dispatched with secure tracking coordinates.';
      case 'Delivered': return 'The spectacles have reached your home. Thank you for choosing Niyaz Opticals!';
      default: return '';
    }
  };

  const activeIndex = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="ambient-page relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden" id="order-tracking-wrapper">
      <CinematicBackground />
      <BackgroundShader variant="translucent-waves" />
      <div className="relative z-10 max-w-3xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">TRACK PROGRESS LIVE</span>
          <h1 className="text-3xl font-sans font-black tracking-tight text-[#111111]">
            Spectacles Fabrication Tracker
          </h1>
          <div className="w-12 h-1 bg-[#fbe311] mx-auto rounded" />
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto font-medium">
            Enter your receipt code to track your custom lens grinding, alignment validation, and shipment statuses live.
          </p>
        </div>

        {/* Search Field */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200/50 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Enter Receipt ID (e.g., NY-ORD-87122)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#261606]"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            
            <button
              type="submit"
              className="px-6 py-3 bg-[#261606] hover:bg-[#111111] text-white rounded-xl text-sm font-bold transition-all"
            >
              Search Order
            </button>
          </form>

          {errorMsg && <p className="text-xs text-red-500 font-semibold mt-3 text-left pl-2">{errorMsg}</p>}
        </div>

        {/* Tracking Details display */}
        {searchedOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/50 shadow-md space-y-8 text-left"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 pb-4">
              <div>
                <p className="text-[10px] font-mono text-neutral-400 font-bold">RECEIPT STATUS SPEC</p>
                <h3 className="font-sans font-black text-neutral-800 text-lg">ID: {searchedOrder.id}</h3>
              </div>
              <div className="text-left sm:text-right font-mono text-xs text-neutral-500">
                <p className="flex items-center sm:justify-end gap-1"><Calendar className="w-3.5 h-3.5" /> Ordered: {new Date(searchedOrder.date).toLocaleDateString()}</p>
                <p className="flex items-center sm:justify-end gap-1 mt-0.5"><Truck className="w-3.5 h-3.5" /> Ship to: {searchedOrder.customerName}</p>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div className="relative pl-6 sm:pl-0 space-y-8 sm:space-y-0 sm:grid sm:grid-cols-6 sm:gap-4 pt-4">
              
              {/* Connecting Desktop Line */}
              <div className="hidden sm:block absolute top-[1.35rem] left-[8%] right-[8%] h-[2.5px] bg-neutral-100 z-0" />
              {/* Connecting Desktop Progress Line */}
              {activeIndex > 0 && (
                <div 
                  className="hidden sm:block absolute top-[1.35rem] left-[8%] h-[2.5px] bg-emerald-500 z-0 transition-all duration-500" 
                  style={{ width: `${(activeIndex / 5) * 84}%` }}
                />
              )}

              {steps.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={idx} className="relative z-10 flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-3" id={`tracking-step-col-${idx}`}>
                    
                    {/* Ring dot indicator */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isPassed 
                        ? 'bg-emerald-500 text-white border-transparent shadow' 
                        : 'bg-white text-neutral-300 border-neutral-200'
                    }`}>
                      {isPassed ? (
                        <CheckCircle2 className="w-4.5 h-4.5 stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step label text */}
                    <div>
                      <h4 className={`text-xs font-sans font-black tracking-tight leading-tight ${isCurrent ? 'text-neutral-900 font-extrabold scale-105' : 'text-neutral-500'}`}>
                        {step}
                      </h4>
                      {isCurrent && (
                        <p className="text-[10px] text-neutral-400 mt-1 leading-tight sm:max-w-[130px] mx-auto hidden sm:block font-light">
                          {getStepDescription(step)}
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Current Active Step Explanatory card */}
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-150 flex gap-3">
              <Sparkles className="w-5 h-5 text-[#261606] flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-extrabold text-neutral-800">Current Phase Status details:</p>
                <p className="text-neutral-500 mt-1 leading-relaxed">
                  {getStepDescription(steps[activeIndex])}
                </p>
                
                {searchedOrder.status === 'Awaiting Prescription' && (
                  <div className="mt-3">
                    <a 
                      href={`https://wa.me/919443617786?text=Hi,%20I'm%20tracking%20order%20${searchedOrder.id}.%20Here's%20my%20optical%20prescription.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wide transition-all"
                    >
                      <span>Send Prescription Now</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};
