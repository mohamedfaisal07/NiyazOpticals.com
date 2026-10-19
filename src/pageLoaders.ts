import type { ComponentType } from 'react';
import type { ActivePage } from './types';

type PageModule = { default: ComponentType<any> };

// Keep secondary routes out of the initial bundle. These promises are also used
// by the navbar to prefetch a route when the user shows intent to navigate.
export const pageLoaders: Partial<Record<ActivePage, () => Promise<PageModule>>> = {
  shop: () => import('./pages/Shop').then(({ Shop }) => ({ default: Shop })),
  wishlist: () => import('./pages/WishlistPage').then(({ WishlistPage }) => ({ default: WishlistPage })),
  'track-order': () => import('./pages/OrderTracking').then(({ OrderTracking }) => ({ default: OrderTracking })),
  about: () => import('./pages/AboutContact').then(({ AboutContact }) => ({ default: AboutContact })),
  contact: () => import('./pages/AboutContact').then(({ AboutContact }) => ({ default: AboutContact })),
  'order-success': () => import('./pages/OrderSuccess').then(({ OrderSuccess }) => ({ default: OrderSuccess })),
  admin: () => import('./components/AdminDashboard').then(({ AdminDashboard }) => ({ default: AdminDashboard })),
};

const prefetched = new Set<ActivePage>();

export const prefetchPage = (page: ActivePage) => {
  const loader = pageLoaders[page];
  if (!loader || prefetched.has(page)) return;
  prefetched.add(page);
  void loader();
};
