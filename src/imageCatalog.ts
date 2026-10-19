import type { Product } from './types';
import heroFullFrame from './assets/images/hero/premium-full-frame.jpg';
import heroRimless from './assets/images/hero/premium-rimless.jpeg';
import heroSunglasses from './assets/images/hero/premium-sunglasses.jpeg';

type ProductCollection = Product['collection'];

const imageModules = import.meta.glob('./assets/images/products/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const imagesFor = (collection: ProductCollection) =>
  Object.entries(imageModules)
    .filter(([path]) => path.includes(`/products/${collection}/`))
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, url]) => url);

const productImages: Record<ProductCollection, string[]> = {
  full: imagesFor('full'),
  half: imagesFor('half'),
  rimless: imagesFor('rimless'),
  sunglasses: imagesFor('sunglasses'),
  kids: imagesFor('kids'),
};

export const getProductImage = (collection: ProductCollection, index: number) => {
  const images = productImages[collection];
  return images.length ? images[index % images.length] : '';
};

export const HERO_IMAGES = {
  fullFrame: heroFullFrame,
  sunglasses: heroSunglasses,
  rimless: heroRimless,
};

const shopModules = import.meta.glob('./assets/images/shop/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const SHOP_GALLERY_IMAGES = Object.entries(shopModules)
  .sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }))
  .map(([, src], index) => ({ src, alt: `Niyaz Opticals workshop and store photograph ${index + 1}` }));
