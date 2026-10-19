import React, { useEffect, useState } from 'react';
import { useApp } from './AppContext';
import { Product, Order, Appointment, Coupon } from '../types';
import { PRODUCTS, COUPONS } from '../data';
import { getOrders, updateOrderStatus } from '../lib/orders';
import { deleteAdminAppointment, getAdminAppointments, updateAdminAppointmentStatus } from '../lib/appointments';
import { GlassesIcon } from './GlassesIcon';
import { 
  TrendingUp, Users, Calendar, ShoppingCart, 
  Plus, Edit2, Trash2, Check, RefreshCw, BarChart2,
  Package, Tag, Clock, ArrowRight, Settings, SlidersHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  adminToken: string;
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminToken, onSignOut }) => {
  const { 
    orders, 
    addOrder, 
    syncOrderStatus,
    appointments, 
    activePage, 
    setActivePage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'appointments' | 'coupons'>('analytics');

  // Dynamic products list so the admin can edit on the fly
  const [localProducts, setLocalProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('niyaz_admin_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('niyaz_admin_coupons');
    return saved ? JSON.parse(saved) : COUPONS;
  });

  const [localOrders, setLocalOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('niyaz_orders');
    return saved ? JSON.parse(saved) : orders;
  });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const dbOrders = await getOrders(adminToken);
        if (dbOrders.length > 0) {
          setLocalOrders(dbOrders);
          localStorage.setItem('niyaz_orders', JSON.stringify(dbOrders));
        }
      } catch (error) {
        console.error('Failed to load Supabase orders:', error);
      }
    };

    void loadOrders();
  }, [adminToken]);

  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('niyaz_appointments');
    return saved ? JSON.parse(saved) : appointments;
  });

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const dbAppointments = await getAdminAppointments(adminToken);
        setLocalAppointments(dbAppointments);
        localStorage.setItem('niyaz_appointments', JSON.stringify(dbAppointments));
      } catch (error) {
        console.error('Failed to load Supabase appointments:', error);
      }
    };

    void loadAppointments();
  }, [adminToken]);

  // Keep state synced with localStorage and parent context
  const saveProducts = (updated: Product[]) => {
    setLocalProducts(updated);
    localStorage.setItem('niyaz_admin_products', JSON.stringify(updated));
  };

  const saveCoupons = (updated: Coupon[]) => {
    setLocalCoupons(updated);
    localStorage.setItem('niyaz_admin_coupons', JSON.stringify(updated));
  };

  // State for creating new product
  const [newProduct, setNewProduct] = useState({
    name: '',
    collection: 'full' as any,
    price: 699,
    material: 'Titanium' as any,
    frameStyle: 'Hexagonal' as any,
    colors: '#111111,#D4AF37',
    description: 'Bespoke custom order design created via admin portal.'
  });

  // State for creating coupon
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 10,
    description: ''
  });

  // Math Analytics indicators
  const totalRevenue = localOrders.reduce((acc, o) => acc + o.total, 0);
  const totalSpecsGrinded = localOrders.length * 2 + 140; // some starter offset
  const activeBookings = localAppointments.length;
  const popularCollection = 'Rimless Titanium';

  // Handlers
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const added: Product = {
      id: `${newProduct.collection}-${Date.now().toString().slice(-4)}`,
      name: newProduct.name,
      collection: newProduct.collection,
      price: newProduct.price,
      rating: 4.8,
      reviewsCount: 1,
      frameStyle: newProduct.frameStyle,
      material: newProduct.material,
      colors: newProduct.colors.split(','),
      image: `/products/${newProduct.collection}/custom.jpg`,
      description: newProduct.description
    };

    const updated = [added, ...localProducts];
    saveProducts(updated);
    // Also inject into parent global storage to let consumers purchase it!
    localStorage.setItem('niyaz_cart_compatible_products', JSON.stringify(updated));

    setNewProduct({
      name: '',
      collection: 'full',
      price: 699,
      material: 'Titanium',
      frameStyle: 'Hexagonal',
      colors: '#111111,#D4AF37',
      description: 'Bespoke custom order design created via admin portal.'
    });
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    const updated = localProducts.map(p => p.id === id ? { ...p, price: Math.min(999, Math.max(100, newPrice)) } : p);
    saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = localProducts.filter(p => p.id !== id);
    saveProducts(updated);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const previousOrders = localOrders;
    const updatedOrders = previousOrders.map((o: Order) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );

    setLocalOrders(updatedOrders);
    syncOrderStatus(orderId, newStatus);
    localStorage.setItem('niyaz_orders', JSON.stringify(updatedOrders));

    try {
      const updatedOrder = await updateOrderStatus(adminToken, orderId, newStatus);
      if (!updatedOrder) return;

      const confirmedOrders = updatedOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
      setLocalOrders(confirmedOrders);
      syncOrderStatus(updatedOrder.id, updatedOrder.status);
      localStorage.setItem('niyaz_orders', JSON.stringify(confirmedOrders));
    } catch (error) {
      console.error('Failed to update Supabase order status:', error);
      setLocalOrders(previousOrders);
      const previousOrder = previousOrders.find((order) => order.id === orderId);
      if (previousOrder) {
        syncOrderStatus(orderId, previousOrder.status);
      }
      localStorage.setItem('niyaz_orders', JSON.stringify(previousOrders));
      alert(error instanceof Error ? error.message : 'Could not update this order status.');
    }

    // Trigger update notification
    window.dispatchEvent(new Event('storage'));
  };

  const handleUpdateAppointmentStatus = async (aptId: string, newStatus: Appointment['status']) => {
    const previousAppointments = localAppointments;
    const updated = previousAppointments.map((a: Appointment) =>
      a.id === aptId ? { ...a, status: newStatus } : a
    );
    setLocalAppointments(updated);
    localStorage.setItem('niyaz_appointments', JSON.stringify(updated));

    try {
      const confirmedAppointment = await updateAdminAppointmentStatus(adminToken, aptId, newStatus);
      const confirmed = updated.map((appointment) =>
        appointment.id === confirmedAppointment.id ? confirmedAppointment : appointment
      );
      setLocalAppointments(confirmed);
      localStorage.setItem('niyaz_appointments', JSON.stringify(confirmed));
    } catch (error) {
      console.error('Failed to update Supabase appointment:', error);
      setLocalAppointments(previousAppointments);
      localStorage.setItem('niyaz_appointments', JSON.stringify(previousAppointments));
      alert(error instanceof Error ? error.message : 'Could not update this appointment.');
    }
  };

  const handleDeleteAppointment = async (aptId: string) => {
    const previousAppointments = localAppointments;
    const updated = previousAppointments.filter((appointment) => appointment.id !== aptId);
    setLocalAppointments(updated);
    localStorage.setItem('niyaz_appointments', JSON.stringify(updated));

    try {
      await deleteAdminAppointment(adminToken, aptId);
    } catch (error) {
      console.error('Failed to delete Supabase appointment:', error);
      setLocalAppointments(previousAppointments);
      localStorage.setItem('niyaz_appointments', JSON.stringify(previousAppointments));
      alert(error instanceof Error ? error.message : 'Could not delete this appointment.');
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    const added: Coupon = {
      code: newCoupon.code.toUpperCase().trim(),
      discountPercent: newCoupon.discountPercent,
      description: newCoupon.description || `${newCoupon.discountPercent}% flat off`
    };

    const updated = [added, ...localCoupons];
    saveCoupons(updated);
    setNewCoupon({ code: '', discountPercent: 10, description: '' });
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-neutral-200/50">
          <div>
            <span className="text-[10px] bg-amber-500 text-white font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
              Demonstration Portal
            </span>
            <h1 className="text-3xl font-sans font-black tracking-tight text-[#111111] mt-1">
              Admin Command Center
            </h1>
            <p className="text-xs text-neutral-400">
              Manage Niyaz Opticals products, process prescription states, track eye test slots, and configure coupons.
            </p>
          </div>
          
          <button 
            onClick={() => {
              onSignOut();
              setActivePage('home');
              window.scrollTo(0,0);
            }}
            className="px-5 py-2.5 bg-[#261606] hover:bg-[#111111] text-white text-xs font-bold rounded-full transition-all"
            id="admin-exit-btn"
          >
            Sign Out
          </button>
        </div>

        {/* Dynamic Metric Widget Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/50 space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span className="text-xs font-mono font-bold uppercase">Total Receipts</span>
              <ShoppingCart className="w-5 h-5 text-[#261606]" />
            </div>
            <p className="text-2xl font-mono font-extrabold text-neutral-900">₹{totalRevenue}</p>
            <p className="text-[10px] text-green-600 font-bold">↑ 14% this month</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/50 space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span className="text-xs font-mono font-bold uppercase">Glasses Crafted</span>
              <Package className="w-5 h-5 text-[#261606]" />
            </div>
            <p className="text-2xl font-mono font-extrabold text-neutral-900">{totalSpecsGrinded}</p>
            <p className="text-[10px] text-neutral-400">Standard single-vision lenses</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/50 space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span className="text-xs font-mono font-bold uppercase">Eye Tests Logged</span>
              <Calendar className="w-5 h-5 text-[#261606]" />
            </div>
            <p className="text-2xl font-mono font-extrabold text-neutral-900">{activeBookings}</p>
            <p className="text-[10px] text-amber-600 font-semibold">Home & In-store appointments</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/50 space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span className="text-xs font-mono font-bold uppercase">AOV (Average Order)</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-mono font-extrabold text-neutral-900">₹914</p>
            <p className="text-[10px] text-neutral-400">Under direct factory limits</p>
          </div>

        </div>

        {/* Tab Controls */}
        <div className="border-b border-neutral-200 flex gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
          {(['analytics', 'products', 'orders', 'appointments', 'coupons'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-xl font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#261606] text-white'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {tab === 'coupons' ? 'Configure Coupons' : tab === 'appointments' ? 'Eye Tests' : tab}
            </button>
          ))}
        </div>

        {/* TAB WORKSPACE */}
        <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 sm:p-8">
          
          {/* 1. Analytics & Charts Demo */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-sans font-black text-[#111111]">Laboratory Fabrication Ratios</h3>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">7-Day Rolling Live metrics</span>
              </div>

              {/* Progress meters representing e-commerce categories */}
              <div className="space-y-4">
                {[
                  { label: "Rimless Titanium Series", percentage: "45%", count: 18, color: "bg-amber-500" },
                  { label: "Classic Wayfarers & Clubmasters", percentage: "30%", count: 12, color: "bg-blue-600" },
                  { label: "Blue Light Computer Frames", percentage: "15%", count: 6, color: "bg-emerald-500" },
                  { label: "Kids Shatterproof eyewear", percentage: "10%", count: 4, color: "bg-pink-500" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-neutral-800">{item.label}</span>
                      <span className="text-neutral-500 font-mono font-bold">{item.percentage} ({item.count} orders)</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.percentage }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Business statement box */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex gap-3 mt-6">
                <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-left text-xs">
                  <p className="font-extrabold text-neutral-800">Middlemen Elimination Strategy is Successful</p>
                  <p className="text-neutral-500 mt-1 leading-relaxed">
                    By keeping prices strictly below ₹999, customer lifetime values have improved by 34%. 85% of buyers elect to receive WhatsApp coordination for post-payment prescription support rather than utilizing traditional complex checkout inputs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Manage Products catalog */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              
              {/* Add Product Inline Form */}
              <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200/50">
                <h4 className="text-sm font-sans font-black text-neutral-800 mb-4 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#261606]" /> Create New Premium Frame style
                </h4>
                
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" 
                    placeholder="Frame Name (e.g. Aero Pro)" 
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606]"
                  />
                  <select
                    value={newProduct.collection}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, collection: e.target.value }))}
                    className="bg-white border rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="full">Full Frame Eyeglasses</option>
                    <option value="half">Half Frame Eyeglasses</option>
                    <option value="rimless">Rimless Premium</option>
                    <option value="sunglasses">Sunglasses Series</option>
                    <option value="kids">Kids Series</option>
                  </select>
                  <input 
                    type="number" 
                    max={999}
                    min={100}
                    placeholder="Price (₹100 to ₹999)" 
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    className="bg-white border rounded-xl px-3 py-2 text-xs"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#261606] text-white hover:bg-[#111111] font-bold text-xs py-2 rounded-xl"
                  >
                    Publish Product
                  </button>
                </form>
              </div>

              {/* Product Inventory List */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Active Store catalog ({localProducts.length} items)</h4>
                
                <div className="divide-y divide-neutral-100 max-h-[50vh] overflow-y-auto pr-1">
                  {localProducts.slice(0, 30).map((product) => ( // cap view to avoid token flood
                    <div key={product.id} className="flex items-center justify-between py-3 gap-4" id={`admin-prod-row-${product.id}`}>
                      
                      <div className="flex items-center gap-3">
                        {/* vector thumbnail */}
                        <div className="w-12 h-10 bg-neutral-50 rounded-lg p-0.5 border flex items-center justify-center">
                          <GlassesIcon frameStyle={product.frameStyle} collection={product.collection} primaryColor={product.colors[0]} showTemples={false} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-800">{product.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono uppercase">{product.collection} collection • {product.frameStyle} style</p>
                        </div>
                      </div>

                      {/* Modify Price */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg px-2 py-1">
                          <span className="text-xs text-neutral-400">₹</span>
                          <input 
                            type="number" 
                            value={product.price}
                            onChange={(e) => handlePriceChange(product.id, parseInt(e.target.value) || 0)}
                            className="w-16 bg-transparent text-xs font-mono font-bold text-neutral-800 focus:outline-none"
                            max={999}
                          />
                        </div>

                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 3. Live Orders processor */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-base font-sans font-black text-neutral-800">Processing Order States ({localOrders.length} records)</h3>
              
              <div className="divide-y divide-neutral-100">
                {localOrders.map((order) => (
                  <div key={order.id} className="py-4 space-y-3" id={`admin-order-${order.id}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-neutral-400">ORDER {order.id} • {new Date(order.date).toLocaleDateString()}</span>
                        <h4 className="text-sm font-extrabold text-[#111111]">{order.customerName} ({order.phone})</h4>
                        <p className="text-xs text-neutral-500 leading-tight">Addr: {order.address}</p>
                      </div>

                      {/* Status Dropdown selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 font-mono font-medium">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-[#261606]"
                        >
                          <option value="Awaiting Prescription">Awaiting Prescription</option>
                          <option value="Prescription Confirmed">Prescription Confirmed</option>
                          <option value="Lens Manufacturing">Lens Manufacturing</option>
                          <option value="Quality Check">Quality Check</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Order items lists */}
                    <div className="bg-neutral-50/50 p-3 rounded-xl border border-neutral-150 flex items-center gap-6 overflow-x-auto text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-8 h-8 bg-white border rounded p-0.5 flex items-center justify-center">
                            <GlassesIcon frameStyle={item.product.frameStyle} collection={item.product.collection} primaryColor={item.selectedColor} showTemples={false} />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800">{item.product.name} (Qty {item.quantity})</p>
                            <p className="text-[10px] text-neutral-400 font-mono">{item.selectedLensType} / Size {item.selectedSize}</p>
                          </div>
                        </div>
                      ))}
                      <div className="ml-auto font-mono font-bold text-neutral-800">Total: ₹{order.total}</div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 4. Eye Test Bookings appointments */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <h3 className="text-base font-sans font-black text-neutral-800">Eye Test Reservations</h3>
              
              <div className="divide-y divide-neutral-100">
                {localAppointments.map((apt) => (
                  <div key={apt.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id={`admin-apt-row-${apt.id}`}>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black bg-neutral-900 text-[#fbe311] px-2 py-0.5 rounded">
                          {apt.type}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#111111]">{apt.name} (📞 {apt.phone})</h4>
                      <p className="text-xs text-neutral-500 font-medium">Slot: {apt.date} @ {apt.slot}</p>
                      <p className="text-xs text-neutral-400">Interest: {apt.interestedIn} {apt.message ? `• "${apt.message}"` : ''}</p>
                    </div>

                    {/* Quick status actions */}
                    <div className="flex gap-2">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'Confirmed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Approve Slot
                        </button>
                      )}
                      
                      <button
                        onClick={() => void handleDeleteAppointment(apt.id)}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 5. Coupons manager */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              
              <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200/50">
                <h4 className="text-sm font-sans font-black text-neutral-800 mb-4 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#261606]" /> Create Custom Promotion Coupon
                </h4>
                
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" 
                    placeholder="Coupon Code (e.g. TRICHY50)" 
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                    className="bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606]"
                  />
                  <input 
                    type="number" 
                    placeholder="Discount % (1 to 100)" 
                    required
                    max={100}
                    min={1}
                    value={newCoupon.discountPercent}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discountPercent: parseInt(e.target.value) }))}
                    className="bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606]"
                  />
                  <input 
                    type="text" 
                    placeholder="Brief details label" 
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#261606] md:col-span-2"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#261606] text-white hover:bg-[#111111] font-bold text-xs py-2 rounded-xl md:col-span-4 mt-2"
                  >
                    Activate Coupon
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Active Coupons</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {localCoupons.map((coupon, idx) => (
                    <div key={idx} className="bg-white border border-neutral-200/60 p-4 rounded-2xl flex justify-between items-center" id={`admin-coupon-${coupon.code}`}>
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded uppercase">
                          {coupon.code}
                        </span>
                        <p className="text-[11px] text-neutral-500">{coupon.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-mono font-black text-neutral-900">{coupon.discountPercent}% OFF</span>
                        <button 
                          onClick={() => {
                            const updated = localCoupons.filter(c => c.code !== coupon.code);
                            saveCoupons(updated);
                          }}
                          className="block text-[10px] text-red-500 font-bold hover:underline ml-auto mt-1"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
