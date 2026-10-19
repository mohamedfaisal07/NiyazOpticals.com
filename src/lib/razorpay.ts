import type { Order } from '../types';

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: 'INR';
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayCheckout = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

const checkoutScriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';

let checkoutScriptPromise: Promise<void> | null = null;

export const getRazorpayKeyId = () => import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export const createRazorpayOrder = async (payload: {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
}) => {
  const response = await fetch('/api/razorpay/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.description || data?.error || 'Unable to create Razorpay order.');
  }

  return data as {
    id: string;
    amount: number;
    currency: 'INR';
    receipt: string;
  };
};

export const verifyRazorpayPayment = async (payload: RazorpaySuccessResponse) => {
  const response = await fetch('/api/razorpay/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.verified) {
    throw new Error(data?.error || 'Razorpay payment verification failed.');
  }

  return data as { verified: true };
};

export const verifyPaymentAndCreateOrder = async (payload: RazorpaySuccessResponse & { order: Order }) => {
  const response = await fetch('/api/razorpay/verify-and-create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.verified || !data.order) {
    throw new Error(data?.error || 'Razorpay payment verification or order creation failed.');
  }

  return data.order as Order;
};

export const loadRazorpayCheckout = () => {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (checkoutScriptPromise) {
    return checkoutScriptPromise;
  }

  checkoutScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = checkoutScriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout.'));
    document.body.appendChild(script);
  });

  return checkoutScriptPromise;
};

export const openRazorpayCheckout = async (options: RazorpayOptions) => {
  await loadRazorpayCheckout();

  if (!window.Razorpay) {
    throw new Error('Razorpay Checkout is not available.');
  }

  const checkout = new window.Razorpay(options);
  checkout.open();
};
