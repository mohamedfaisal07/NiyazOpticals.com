import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Order } from '../types';
import { createRazorpayOrder, getRazorpayKeyId, openRazorpayCheckout, verifyPaymentAndCreateOrder } from '../lib/razorpay';
import { CheckCircle, Shield, Sparkles } from 'lucide-react';

interface RazorpayModalProps {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  couponApplied: {
    code: string;
    discountPercent: number;
  } | null;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({ 
  customerDetails,
  couponApplied 
}) => {
  const { 
    cart, 
    clearCart, 
    addOrder, 
    setShowRazorpay, 
    setCurrentOrderSuccess, 
    setActivePage 
  } = useApp();

  const [processing, setProcessing] = useState(false);

  // Cart pricing calculation
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price + item.lensPrice) * item.quantity, 0);
  const discountAmount = couponApplied ? Math.round((subtotal * couponApplied.discountPercent) / 100) : 0;
  const shippingFee = subtotal > 700 ? 0 : 60;
  const gstAmount = Math.round((subtotal - discountAmount) * 0.18); // 18% GST standard in India
  const grandTotal = subtotal - discountAmount + shippingFee + gstAmount;

  const buildPaidOrder = (paymentId: string) => {
    const orderId = `NY-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      id: orderId,
      customerName: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
      items: [...cart],
      total: grandTotal,
      status: 'Awaiting Prescription',
      paymentId,
      date: new Date().toISOString()
    } satisfies Order;
  };

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const razorpayKeyId = getRazorpayKeyId();
    if (!razorpayKeyId) {
      alert('Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID in .env and restart the dev server.');
      return;
    }

    setProcessing(true);

    try {
      const razorpayOrder = await createRazorpayOrder({
        amount: grandTotal * 100,
        receipt: `ny_${Date.now()}`.slice(0, 40),
        notes: {
          customer_name: customerDetails.name,
          phone: customerDetails.phone,
          source: 'Niyaz Opticals website',
        },
      });

      await openRazorpayCheckout({
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: 'INR',
        order_id: razorpayOrder.id,
        name: 'Niyaz Opticals',
        description: 'Premium eyewear order',
        image: `${window.location.origin}/niyaz-logo.svg`,
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        notes: {
          customer_name: customerDetails.name,
          phone: customerDetails.phone,
          source: 'Niyaz Opticals website',
        },
        theme: {
          color: '#261606',
        },
        handler: (response) => {
          void (async () => {
            try {
              const draftOrder = buildPaidOrder(response.razorpay_payment_id);
              const savedOrder = await verifyPaymentAndCreateOrder({
                ...response,
                order: draftOrder,
              });
              addOrder(savedOrder);
              setCurrentOrderSuccess(savedOrder);
              clearCart();
              setShowRazorpay(false);
              setActivePage('order-success');
            } catch (error) {
              console.error('Payment verification/order save failed:', error);
              alert('Payment could not be verified. If money was deducted, please contact support with your Razorpay payment ID.');
            } finally {
              setProcessing(false);
            }
          })();
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      });
    } catch (error) {
      console.error('Failed to open Razorpay Checkout:', error);
      const message = error instanceof Error ? error.message : 'Please check your internet connection and Razorpay key.';
      alert(`Unable to open Razorpay Checkout. ${message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm" id="razorpay-overlay">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col justify-between">
        
        {/* Real Razorpay Brand Header */}
        <div className="bg-[#2a1b0a] text-white p-5 flex justify-between items-center relative">
          <div>
            <span className="text-[10px] tracking-widest font-mono text-[#fbe311] font-bold uppercase block">SECURE GATEWAY</span>
            <h3 className="font-sans font-black text-lg tracking-tight uppercase">NIYAZ OPTICALS</h3>
            <p className="text-[10px] text-neutral-300">Order Ref: NY_RP_PORTAL</p>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] text-neutral-300 block">AMOUNT TO PAY</span>
            <span className="text-lg font-mono font-extrabold text-[#fbe311]">₹{grandTotal}</span>
          </div>

          <button 
            onClick={() => setShowRazorpay(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-white text-xs bg-black/25 px-2 py-0.5 rounded"
            id="cancel-payment-btn"
          >
            Cancel
          </button>
        </div>

        {/* Razorpay Body forms */}
        {processing ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-6 text-center min-h-[300px]">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-amber-600">RP</div>
            </div>
            <div>
              <p className="font-extrabold text-[#111111]">Verifying with Razorpay Bank Servers...</p>
              <p className="text-neutral-500 text-xs mt-1">Please do not refresh or click back. Securing connection.</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>PCI-DSS Level 1 Encryption Active</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRazorpayPayment} className="p-6 space-y-6">
            
            {/* Payment Method Selector column */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                CHOOSE PAYMENT METHOD
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 border border-[#261606] bg-neutral-50 text-[#261606] rounded-xl flex flex-col items-center justify-center gap-1 text-center">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold">UPI / QR</span>
                </div>

                <div className="p-3 border border-neutral-200 text-neutral-500 rounded-xl flex flex-col items-center justify-center gap-1 text-center">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Card</span>
                </div>

                <div className="p-3 border border-neutral-200 text-neutral-500 rounded-xl flex flex-col items-center justify-center gap-1 text-center">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Banking</span>
                </div>
              </div>
            </div>

            {/* Selected Method Details */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-800">Razorpay secure checkout</span>
                  <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-mono font-bold">LIVE MODE</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Continue to Razorpay to pay by UPI QR, UPI ID, card, wallet, or netbanking. Your order is created only after Razorpay confirms payment success.
                </p>
              </div>
            </div>

            {/* Security disclaimer */}
            <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 flex items-start gap-2 text-[10px] text-emerald-800">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Payment opens in Razorpay Checkout. Server-side signature verification is active for every successful payment.</span>
            </div>

            {/* Pay Action button */}
            <button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
              id="simulate-rpay-submit-btn"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Payment • ₹{grandTotal}</span>
            </button>

          </form>
        )}

        {/* Real Razorpay Brand Footer */}
        <div className="bg-neutral-100 p-4 border-t border-neutral-150 flex justify-between items-center text-[10px] text-neutral-500">
          <span>Razorpay Security Suite</span>
          <span className="font-bold">POWERED BY RAZORPAY</span>
        </div>

      </div>
    </div>
  );
};
