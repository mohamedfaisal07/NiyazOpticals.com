import { Order } from '../types';

export const createOrder = async (order: Order) => {
  console.warn('Direct browser order creation is disabled. Paid orders are created by the server after Razorpay verification.');
  return order;
};

export const getOrders = async (adminToken: string) => {
  const response = await fetch('/api/orders', {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to load orders.');
  }

  return (data.orders || []) as Order[];
};

export const updateOrderStatus = async (adminToken: string, orderId: string, status: Order['status']) => {
  const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to update order status.');
  }

  return data.order as Order;
};
