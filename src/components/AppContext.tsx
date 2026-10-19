import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Appointment, Coupon, ActivePage } from '../types';
import { PRODUCTS } from '../data';

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  appointments: Appointment[];
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  addToCart: (product: Product, quantity: number, color: string, size: 'S' | 'M' | 'L', lensType: 'Classic Clear' | 'Blue-Blocker' | 'Photochromic Transition' | 'Premium Bifocal') => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  addOrder: (order: Order) => void;
  syncOrderStatus: (orderId: string, status: Order['status']) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  showCartDrawer: boolean;
  setShowCartDrawer: (show: boolean) => void;
  showRazorpay: boolean;
  setShowRazorpay: (show: boolean) => void;
  currentOrderSuccess: Order | null;
  setCurrentOrderSuccess: (order: Order | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  userRole: 'customer' | 'admin';
  setUserRole: (role: 'customer' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('niyaz_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('niyaz_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('niyaz_orders');
    if (saved) return JSON.parse(saved);
    
    // Seed default orders to make Admin Dashboard instantly alive and interesting!
    const seedOrders: Order[] = [
      {
        id: 'NY-ORD-87122',
        customerName: 'Aravind Swamy',
        email: 'aravind@gmail.com',
        phone: '9845123456',
        address: 'No 45, West Boule Road, Trichy - 620002, Tamil Nadu',
        items: [
          {
            id: 'full-01-M-#111111-Blue-Blocker',
            product: PRODUCTS.find(p => p.id === 'full-01') || PRODUCTS[0],
            quantity: 1,
            selectedColor: '#111111',
            selectedSize: 'M',
            selectedLensType: 'Blue-Blocker',
            lensPrice: 200
          }
        ],
        total: 1099, // 899 frame + 200 lens
        status: 'Prescription Confirmed',
        paymentId: 'pay_NiyazMockX89172',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        id: 'NY-ORD-86221',
        customerName: 'Kavitha R',
        email: 'kavitha@yahoo.com',
        phone: '9443528172',
        address: 'Melaputhur Cross Street, Tiruchirappalli - 620001, Tamil Nadu',
        items: [
          {
            id: 'rimless-03-S-#B76E79-Classic Clear',
            product: PRODUCTS.find(p => p.id === 'rimless-03') || PRODUCTS[40],
            quantity: 1,
            selectedColor: '#B76E79',
            selectedSize: 'S',
            selectedLensType: 'Classic Clear',
            lensPrice: 0
          }
        ],
        total: 949,
        status: 'Awaiting Prescription',
        paymentId: 'pay_NiyazMockY27118',
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      }
    ];
    return seedOrders;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('niyaz_appointments');
    if (saved) return JSON.parse(saved);

    // Seed default appointments to make Admin Dashboard alive and interactive!
    const seedAppointments: Appointment[] = [
      {
        id: 'NY-APT-301',
        name: 'Suresh Kumar',
        phone: '9876543210',
        date: '2026-07-18',
        slot: '11:00 AM - 12:00 PM',
        type: 'Home Eye Test',
        interestedIn: 'Computer Glasses Upgrade',
        message: 'Need blue light block and anti-glare specs.',
        status: 'Confirmed'
      },
      {
        id: 'NY-APT-302',
        name: 'Gitanjali Sen',
        phone: '9443657123',
        date: '2026-07-20',
        slot: '04:00 PM - 05:00 PM',
        type: 'Store Visit',
        interestedIn: 'Rimless Premium Collection',
        message: 'Wants lightweight titanium frames.',
        status: 'Pending'
      }
    ];
    return seedAppointments;
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [showRazorpay, setShowRazorpay] = useState<boolean>(false);
  const [currentOrderSuccess, setCurrentOrderSuccess] = useState<Order | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('niyaz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('niyaz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('niyaz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('niyaz_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Helper pricing logic for lenses
  const getLensPrice = (type: string) => {
    switch (type) {
      case 'Blue-Blocker': return 200;
      case 'Photochromic Transition': return 350;
      case 'Premium Bifocal': return 500;
      default: return 0;
    }
  };

  // State methods
  const addToCart = (
    product: Product, 
    quantity: number, 
    color: string, 
    size: 'S' | 'M' | 'L', 
    lensType: 'Classic Clear' | 'Blue-Blocker' | 'Photochromic Transition' | 'Premium Bifocal'
  ) => {
    const lensPrice = getLensPrice(lensType);
    const cartItemId = `${product.id}-${size}-${color}-${lensType}`;

    setCart(prev => {
      const exists = prev.find(item => item.id === cartItemId);
      if (exists) {
        return prev.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, {
        id: cartItemId,
        product,
        quantity,
        selectedColor: color,
        selectedSize: size,
        selectedLensType: lensType,
        lensPrice
      }];
    });

    setShowCartDrawer(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const syncOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => (
      order.id === orderId ? { ...order, status } : order
    )));
  };

  const addAppointment = (apt: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...apt,
      id: `NY-APT-${300 + appointments.length + 1}`,
      status: 'Pending'
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      orders,
      appointments,
      activePage,
      setActivePage,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      addOrder,
      syncOrderStatus,
      addAppointment,
      selectedProduct,
      setSelectedProduct,
      showCartDrawer,
      setShowCartDrawer,
      showRazorpay,
      setShowRazorpay,
      currentOrderSuccess,
      setCurrentOrderSuccess,
      isLoggedIn,
      setIsLoggedIn,
      userRole,
      setUserRole,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
