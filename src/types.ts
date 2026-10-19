export interface Product {
  id: string;
  name: string;
  collection: 'full' | 'half' | 'rimless' | 'sunglasses' | 'kids';
  price: number;
  rating: number;
  reviewsCount: number;
  frameStyle: 'Round' | 'Aviator' | 'Wayfarer' | 'Clubmaster' | 'Hexagonal' | 'Rectangular' | 'Cat-Eye';
  material: 'Titanium' | 'Acetate' | 'Stainless Steel' | 'Ultem TR90' | 'Carbon Fiber';
  colors: string[]; // hex codes or names
  image: string; // fallback placeholder
  hoverImage?: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
  description: string;
}

export interface CartItem {
  id: string; // custom combining product.id + size + color + lens
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: 'S' | 'M' | 'L';
  selectedLensType: 'Classic Clear' | 'Blue-Blocker' | 'Photochromic Transition' | 'Premium Bifocal';
  lensPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'Awaiting Prescription' | 'Prescription Confirmed' | 'Lens Manufacturing' | 'Quality Check' | 'Shipped' | 'Delivered';
  paymentId: string;
  date: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  date: string;
  slot: string;
  type: 'Store Visit' | 'Home Eye Test';
  interestedIn: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

export type ActivePage = 
  | 'home' 
  | 'shop' 
  | 'wishlist' 
  | 'track-order' 
  | 'about' 
  | 'contact' 
  | 'admin'
  | 'order-success';
