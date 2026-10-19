import React from 'react';
import { useApp } from '../components/AppContext';
import { CheckCircle, PhoneCall, MessageCircle, ShoppingBag, MapPin, Printer } from 'lucide-react';
import { BackgroundShader } from '../components/BackgroundShader';

export const OrderSuccess: React.FC = () => {
  const { currentOrderSuccess, setActivePage } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const supportNumbers = ["9443617786", "9443537786", "9443639786"];

  const order = currentOrderSuccess || {
    id: 'NY-ORD-DUMMY',
    customerName: 'Guest Customer',
    email: 'guest@gmail.com',
    phone: '9443617786',
    address: 'Melaputhur Main Road, Trichy, Tamil Nadu',
    items: [],
    total: 899,
    paymentId: 'pay_NiyazDemoOnly'
  };

  const prefilledText = `Hi Niyaz Opticals, I just placed an order! Order ID: ${order.id}. Please consult with me for my lens prescription power details.`;
  const whatsappUrl = `https://wa.me/919443617786?text=${encodeURIComponent(prefilledText)}`;

  return (
    <div className="ambient-page relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden" id="order-success-page">
      <BackgroundShader variant="warm-sunlight" />
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-200/50 shadow-2xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
        
        {/* Confetti element decorations */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#261606] via-[#fbe311] to-[#261606]" />

        {/* Success Check Ring */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
          <CheckCircle className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Primary Notification headers */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Transaction Complete
          </span>
          <h1 className="text-3xl font-sans font-black tracking-tight text-[#111111]">
            Thank you for your order.
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
            Our consultation team will contact you shortly to collect your lens prescription and confirm your order.
          </p>
        </div>

        {/* Interactive Direct Support Block */}
        <div className="bg-[#261606] text-white p-6 rounded-2xl space-y-4">
          <p className="text-xs text-neutral-300 font-mono">
            IF YOU PREFER, YOU CAN ALSO CONTACT US DIRECTLY:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {supportNumbers.map((num) => (
              <a 
                key={num}
                href={`tel:${num}`}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-mono font-bold text-[#fbe311] flex items-center justify-center gap-1.5 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>{num}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              id="success-whatsapp-cta"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Contact Post-Payment WhatsApp Support</span>
            </a>
            
            <a 
              href={`tel:${supportNumbers[0]}`}
              className="flex-1 bg-white text-[#261606] hover:bg-neutral-50 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border"
              id="success-call-cta"
            >
              <PhoneCall className="w-4.5 h-4.5 text-[#261606]" />
              <span>Call Manufacturing Center</span>
            </a>
          </div>
        </div>

        {/* Invoice Summary Block */}
        <div className="border border-neutral-150 rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <div>
              <p className="text-xs font-mono font-bold text-neutral-400">ORDER SPEC SHEET</p>
              <h4 className="font-extrabold text-neutral-800 text-sm">Receipt ID: {order.id}</h4>
            </div>
            <button 
              onClick={handlePrint}
              className="text-neutral-400 hover:text-neutral-600 flex items-center gap-1 text-[11px] font-mono font-bold"
            >
              <Printer className="w-3.5 h-3.5" /> Print Receipt
            </button>
          </div>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <p className="font-bold text-neutral-800">{item.product.name} (Qty {item.quantity})</p>
                  <p className="text-[10px] text-neutral-400">{item.selectedLensType} / Size {item.selectedSize}</p>
                </div>
                <span className="font-mono font-bold text-neutral-700">
                  ₹{(item.product.price + item.lensPrice) * item.quantity}
                </span>
              </div>
            ))}

            <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-xs font-mono text-neutral-500">
              <div className="flex justify-between">
                <span>Shipping Address:</span>
                <span className="text-neutral-800 font-sans text-right font-medium max-w-xs">{order.address}</span>
              </div>
              <div className="flex justify-between">
                <span>Razorpay Payment ID:</span>
                <span className="text-neutral-800 font-bold">{order.paymentId}</span>
              </div>
              <div className="flex justify-between text-sm font-sans font-black text-neutral-900 border-t border-neutral-150 pt-2">
                <span>Grand Total Paid:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Return shop CTA */}
        <div className="pt-4">
          <button
            onClick={() => {
              setActivePage('shop');
              window.scrollTo(0,0);
            }}
            className="px-8 py-3.5 bg-neutral-100 hover:bg-[#261606] text-neutral-700 hover:text-white font-bold text-xs rounded-full transition-all"
            id="success-continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
