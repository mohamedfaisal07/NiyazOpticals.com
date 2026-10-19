import { Product, Coupon } from './types';
import { getProductImage } from './imageCatalog';

// Static coupon codes
export const COUPONS: Coupon[] = [
  { code: 'FACTORYDIRECT', discountPercent: 10, description: '10% off on all Factory-Direct premium frames' },
  { code: 'VISION2026', discountPercent: 15, description: '15% off for New Year Vision celebration' },
  { code: 'TRICHY5', discountPercent: 5, description: 'Special 5% discount for Tamil Nadu users' },
  { code: 'BOGO50', discountPercent: 20, description: 'Premium tier club coupon giving 20% flat discount' }
];

// Helper to generate deterministic list of 100 luxury optical products
const generateCatalog = (): Product[] => {
  const collections: ('full' | 'half' | 'rimless' | 'sunglasses' | 'kids')[] = [
    'full',
    'half',
    'rimless',
    'sunglasses',
    'kids'
  ];

  const prices = [1200, 1250, 1300, 1350, 1400, 1450, 1500];
  const frameStyles: ('Round' | 'Aviator' | 'Wayfarer' | 'Clubmaster' | 'Hexagonal' | 'Rectangular' | 'Cat-Eye')[] = [
    'Round', 'Aviator', 'Wayfarer', 'Clubmaster', 'Hexagonal', 'Rectangular', 'Cat-Eye'
  ];

  const materials: ('Titanium' | 'Acetate' | 'Stainless Steel' | 'Ultem TR90' | 'Carbon Fiber')[] = [
    'Titanium', 'Acetate', 'Stainless Steel', 'Ultem TR90', 'Carbon Fiber'
  ];

  const colorsMap: Record<string, string[]> = {
    full: ['#111111', '#261606', '#D4AF37', '#708090', '#C0C0C0'], // Black, Bistre Brown, Gold, Slate Gray, Silver
    half: ['#111111', '#C0C0C0', '#4A3B32', '#708090', '#1A365D'], // Black, Silver, Antique Bronze, Slate Gray, Navy
    rimless: ['#D4AF37', '#C0C0C0', '#B76E79', '#319795', '#111111'], // Gold, Silver, Rose Gold, Teal, Matte Black
    sunglasses: ['#111111', '#261606', '#2D3748', '#2F855A', '#9B2C2C'], // Glossy Black, Tortoise, Gunmetal, Forest Green, Amber
    kids: ['#4299E1', '#F56565', '#ED64A6', '#48BB78', '#ECC94B'] // Electric Blue, Tomato Red, Candy Pink, Mint Green, Sunny Yellow
  };

  const namePrefixes: Record<string, string[]> = {
    full: ['Vinci', 'Milan', 'Urban', 'Aero', 'Prism', 'Vertex', 'Signature', 'Apex', 'Empire', 'Legacy'],
    half: ['Clubmaster', 'Regent', 'Consul', 'Metropolitan', 'Bespoke', 'Vanguard', 'Horizon', 'District', 'Alpine', 'Meridian'],
    rimless: ['Zephyr', 'Titan', 'Aura', 'Ghost', 'Airwear', 'Silhouette', 'Liteframe', 'Minimal', 'Float', 'Nimbus'],
    sunglasses: ['Stealth', 'Wayfarer', 'Outlaw', 'Cruiser', 'Cosmo', 'Monolith', 'Safari', 'Blaze', 'Eclipse', 'Viper'],
    kids: ['Triumph', 'Junior', 'Sprocket', 'Pixel', 'Play', 'Spark', 'Chippy', 'Bouncer', 'Tiny', 'Zippy']
  };

  const nameSuffixes = [
    'Pro', 'X', 'Ultra', 'Elite', 'Classic', 'Lite', 'Neo', 'Max', 'Prime', 'Zero',
    'Carbon', 'Titanium', 'Hologram', 'Studio', 'One', 'Matrix', 'Eclipse', 'Nova', 'Pulse', 'Edge'
  ];

  const catalog: Product[] = [];

  collections.forEach((col) => {
    // Generate exactly 20 products for each collection
    for (let i = 1; i <= 20; i++) {
      const id = `${col}-${String(i).padStart(2, '0')}`;
      const priceIndex = (i + col.charCodeAt(0)) % prices.length;
      const styleIndex = (i * 3) % frameStyles.length;
      const materialIndex = (i * 7) % materials.length;
      
      const price = prices[priceIndex];
      const frameStyle = frameStyles[styleIndex];
      const material = materials[materialIndex];
      const colors = colorsMap[col] || ['#111111'];

      const prefix = namePrefixes[col][i % namePrefixes[col].length];
      const suffix = nameSuffixes[(i * 11) % nameSuffixes.length];
      const name = `${prefix} ${suffix}`;

      const rating = parseFloat((4.4 + (i % 6) * 0.1).toFixed(1));
      const reviewsCount = 12 + (i * 17) % 150;

      const descriptions: Record<string, string> = {
        full: 'A timeless silhouette engineered with resilient materials for full-day facial contour comfort.',
        half: 'Retro executive styling combined with sleek modern hardware accents and premium lens structural slots.',
        rimless: 'Feather-light minimalist design made from premium titanium alloys. Feels completely weightless.',
        sunglasses: 'High-performance polarized defense and premium glare shields with rich scratch-resistant UV400 coatings.',
        kids: 'Highly flexible, shatterproof, food-grade materials tailored perfectly for energetic young adventurers.'
      };

      catalog.push({
        id,
        name,
        collection: col,
        price,
        rating,
        reviewsCount,
        frameStyle,
        material,
        colors,
        image: getProductImage(col, i - 1),
        hoverImage: getProductImage(col, i),
        isBestSeller: i <= 3,
        isTrending: i >= 17,
        description: descriptions[col]
      });
    }
  });

  return catalog;
};

export const PRODUCTS: Product[] = generateCatalog();

export const TESTIMONIALS = [
  {
    name: 'Ramesh Krishnan',
    role: 'IT Consultant, Trichy',
    text: 'I ordered the Vinci Carbon full-frame. Incredible build quality under ₹799! The consultation team called me immediately after payment, collected my prescription, and delivered the specs in 3 days. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Priyanka Sen',
    role: 'Designer, Chennai',
    text: 'Absolutely in love with my Zephyr Rimless Gold glasses! They look extremely premium and lightweight, exactly like those luxury designer brands charging 10x the price. True factory prices and high-end vision care.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Sathiq Hussain M',
    role: 'Managing Director, Niyaz Opticals',
    text: 'Our mission is simple: eliminate middlemen to offer world-class prescription glasses and sunglasses at direct factory prices. We stand behind our quality with direct customer support.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120'
  }
];

export const FAQS = [
  {
    question: 'How do I submit my lens prescription power details?',
    answer: 'Buying is simple! Just select your frame, complete the secure online payment, and our consultation team will contact you directly on WhatsApp or Call within an hour to collect your power prescription sheet. You don\'t need to fill out complex forms during checkout!'
  },
  {
    question: 'Do you charge extra for prescription lenses?',
    answer: 'All our frames include premium basic single-vision power lenses for free! You can also opt for premium upgrades like Blue-Light blocking computer coatings, Photochromic (Sun-sensors), or Bifocals during frame configuration at very low factory rates.'
  },
  {
    question: 'Where is Niyaz Opticals located? Do you ship across India?',
    answer: 'Our main flagship retail outlet and manufacturing lab is located at No 22/1, 1st Floor, Melaputhur Main Road, Tiruchirappalli - 620001, Tamil Nadu. We pack and ship our glasses directly to homes across India.'
  },
  {
    question: 'What is your return policy or warranty?',
    answer: 'We provide a 1-Year manufacturing warranty on all frames and lenses. If you face any issues with your prescription or power adjustments, our team provides free replacements or adjustments within 14 days of delivery.'
  },
  {
    question: 'How can I contact Niyaz Opticals directly?',
    answer: 'You can call or WhatsApp us on 9443617786, 9443537786, or 9443639786. Our support is active 7 days a week from 9:00 AM to 9:00 PM.'
  }
];

export const STATIC_STATS = [
  { label: 'Happy Customers', value: '45,000+' },
  { label: 'Spectacles Fabricated', value: '80,000+' },
  { label: 'Flagship Store', value: 'Trichy, TN' },
  { label: 'Max Frame Price', value: '₹999' }
];
