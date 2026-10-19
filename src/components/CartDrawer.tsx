import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Trash2, X, Plus, Minus, ArrowRight, ShoppingBag, CreditCard, Tag, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COUPONS } from '../data';

interface CartDrawerProps {
  onProceedToPay: (customerDetails: { name: string; email: string; phone: string; address: string; }, coupon: { code: string; discountPercent: number; } | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToPay }) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    showCartDrawer, 
    setShowCartDrawer,
    setShowRazorpay
  } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountPercent: number; description: string; } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Checkout Form Details
  const [addressDetails, setAddressDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Math Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price + item.lensPrice) * item.quantity, 0);
  const discountAmount = couponApplied ? Math.round((subtotal * couponApplied.discountPercent) / 100) : 0;
  const shippingFee = subtotal === 0 ? 0 : subtotal > 700 ? 0 : 60;
  const gstAmount = Math.round((subtotal - discountAmount) * 0.18); // 18% standard India GST
  const grandTotal = subtotal - discountAmount + shippingFee + gstAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');

    const found = COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (found) {
      setCouponApplied(found);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try FACTORYDIRECT or VISION2026!');
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddressDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleValidationAndCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!addressDetails.name) errors.name = 'Full name is required';
    if (!addressDetails.email) errors.email = 'Email address is required';
    if (!addressDetails.phone) errors.phone = 'Phone number is required';
    if (addressDetails.phone && addressDetails.phone.length < 10) errors.phone = 'Enter valid 10-digit mobile number';
    if (!addressDetails.address) errors.address = 'Detailed shipping address is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    // Trigger callback to parent to record details, close drawer, open payment portal
    onProceedToPay(addressDetails, couponApplied);
    setShowCartDrawer(false);
    setShowRazorpay(true);
  };

  if (!showCartDrawer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Dynamic Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[1px] transition-opacity"
        onClick={() => setShowCartDrawer(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Drawer Slide Card */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#261606]" />
              <h3 className="font-sans font-black text-neutral-900 text-lg uppercase tracking-tight">
                {step === 'cart' ? 'Your Shopping Cart' : 'Checkout Delivery'}
              </h3>
              <span className="bg-[#261606] text-[#fbe311] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            <button 
              onClick={() => setShowCartDrawer(false)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
              id="close-cart-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body content depends on step */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {cart.length === 0 ? (
              // Empty Cart display
              <div className="py-20 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200/50">
                  <ShoppingBag className="w-7 h-7 text-neutral-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-800 text-base">Your cart is empty!</h4>
                  <p className="text-neutral-400 text-xs mt-1">Select from our 100+ premium direct-to-home spectacles designs.</p>
                </div>
                <button 
                  onClick={() => {
                    setShowCartDrawer(false);
                    // active page shop is handled at root
                  }}
                  className="px-6 py-3 bg-[#261606] hover:bg-[#111111] text-white rounded-full text-xs font-bold shadow-md transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : step === 'cart' ? (
              // Cart item list & coupon
              <div className="space-y-6">
                
                {/* List */}
                <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-4 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-200/30"
                      id={`cart-item-row-${item.id}`}
                    >
                      {/* Product image */}
                      <div className="w-16 h-14 bg-white border border-neutral-150 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                      </div>

                      {/* Detail */}
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="text-xs font-extrabold text-neutral-900 tracking-tight truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-medium">
                          Size: {item.selectedSize} • {item.selectedLensType}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2 pt-1 border-t border-neutral-200/50">
                          <span className="text-xs font-mono font-black text-neutral-800">
                            ₹{(item.product.price + item.lensPrice) * item.quantity}
                          </span>
                          
                          {/* Qty increment */}
                          <div className="flex items-center border border-neutral-200 bg-white rounded-lg px-1">
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-neutral-400 hover:text-neutral-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-neutral-700">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-neutral-400 hover:text-neutral-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Trash */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-neutral-300 hover:text-red-500 rounded-lg hover:bg-neutral-100 flex-shrink-0 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  ))}
                </div>

                {/* Coupon Application Row */}
                <div className="border-t border-neutral-100 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Apply Promo Coupon</span>
                    {couponApplied && (
                      <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                        ACTIVE Code
                      </span>
                    )}
                  </div>

                  {couponApplied ? (
                    <div className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Code Applied: {couponApplied.code}</span>
                        </p>
                        <p className="text-[10px] text-neutral-500">{couponApplied.description}</p>
                      </div>
                      <button 
                        onClick={() => setCouponApplied(null)}
                        className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. FACTORYDIRECT"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606]"
                      />
                      <button 
                        type="submit"
                        className="bg-[#261606] text-white hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                </div>

                {/* Prescription Notice for absolute clarity */}
                <div className="bg-blue-500/5 border border-blue-500/15 p-3.5 rounded-2xl flex gap-2.5 items-start">
                  <span className="text-xs bg-blue-500/10 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold mt-0.5">INFO</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-blue-900">Post-Payment Prescription Intake</p>
                    <p className="text-[10px] text-neutral-500 leading-tight">No store visits or prescription uploads are requested now. Just make the secure payment; our optical team will message you on WhatsApp to collect your power sheets.</p>
                  </div>
                </div>

              </div>
            ) : (
              // Step 2: Checkout Form
              <form onSubmit={handleValidationAndCheckout} className="space-y-4 text-left">
                
                {/* Back Link */}
                <button 
                  type="button" 
                  onClick={() => setStep('cart')}
                  className="text-xs font-bold text-[#261606] hover:underline flex items-center gap-1.5 mb-2"
                >
                  ← Back to Shopping Cart
                </button>

                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="checkout-name" className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">Your Full Name *</label>
                  <input 
                    id="checkout-name"
                    type="text"
                    name="name"
                    value={addressDetails.name}
                    onChange={handleFormInputChange}
                    placeholder="Enter full name"
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606]"
                  />
                  {formErrors.name && <p className="text-[10px] text-red-500 font-semibold">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="checkout-email" className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">Email Address *</label>
                  <input 
                    id="checkout-email"
                    type="email"
                    name="email"
                    value={addressDetails.email}
                    onChange={handleFormInputChange}
                    placeholder="e.g. buyer@gmail.com"
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606]"
                  />
                  {formErrors.email && <p className="text-[10px] text-red-500 font-semibold">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="checkout-phone" className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">Mobile Number *</label>
                  <input 
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={addressDetails.phone}
                    onChange={handleFormInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606]"
                  />
                  {formErrors.phone && <p className="text-[10px] text-red-500 font-semibold">{formErrors.phone}</p>}
                </div>

                {/* Detailed Shipping Address */}
                <div className="space-y-1">
                  <label htmlFor="checkout-address" className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">Detailed Shipping Address *</label>
                  <textarea 
                    id="checkout-address"
                    name="address"
                    rows={3}
                    value={addressDetails.address}
                    onChange={handleFormInputChange}
                    placeholder="Door No, Street Name, Landmark, City, State, Pincode"
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606] resize-none"
                  />
                  {formErrors.address && <p className="text-[10px] text-red-500 font-semibold">{formErrors.address}</p>}
                </div>

                {/* Cash on delivery unavailable alert */}
                <div className="bg-amber-500/5 p-3 rounded-xl border border-yellow-500/10 flex items-start gap-2.5 text-[10px] text-amber-900 leading-tight">
                  <AlertTriangle className="w-4 h-4 text-[#261606] flex-shrink-0 mt-0.5" />
                  <span>Niyaz Opticals utilizes prepaid online processing using standard Razorpay to initiate custom prescription grinding immediately. COD is currently unavailable.</span>
                </div>

              </form>
            )}

          </div>

          {/* Drawer Footer Price Summary & Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 space-y-4 bg-neutral-50/70">
              
              {/* Calculations Block */}
              <div className="space-y-2 text-xs text-neutral-600 font-mono">
                <div className="flex justify-between">
                  <span>Cart Subtotal:</span>
                  <span className="font-bold text-neutral-800">₹{subtotal}</span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({couponApplied.code}):</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span className="font-bold text-neutral-800">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes (18% GST):</span>
                  <span className="font-bold text-neutral-800">₹{gstAmount}</span>
                </div>

                <div className="flex justify-between text-sm text-[#111111] font-sans font-black border-t border-neutral-200/60 pt-2">
                  <span>Order Total:</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Action triggers */}
              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full h-12 bg-[#261606] hover:bg-[#111111] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  id="checkout-proceed-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#fbe311]" />
                </button>
              ) : (
                <button
                  onClick={handleValidationAndCheckout}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  id="checkout-place-order-btn"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Secure Pay via Razorpay • ₹{grandTotal}</span>
                </button>
              )}

              <p className="text-[10px] text-center text-neutral-400 font-mono">
                ✓ 256-bit Secure Sockets Layer Encryption / RBI Compliant checkout
              </p>

            </div>
          )}

        </motion.div>

      </div>
    </div>
  );
};
