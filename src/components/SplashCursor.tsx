import { useEffect, useRef } from 'react';

type Splat = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  alpha: number;
};

const MAX_SPLATS = 120;
const BUTTON_SCALE = 0.7;
const PRODUCT_SCALE = 1.18;

const interactiveSelector = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[data-cursor="button"]',
].join(',');

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const SplashCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const splatsRef = useRef<Splat[]>([]);
  const pointerRef = useRef({
    x: -200,
    y: -200,
    smoothX: -200,
    smoothY: -200,
    previousX: -200,
    previousY: -200,
    visible: false,
    scale: 1,
    targetScale: 1,
    lastSplatX: -200,
    lastSplatY: -200,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addSplat = (x: number, y: number, velocityX: number, velocityY: number, strong = false) => {
      const splats = splatsRef.current;
      const speed = Math.min(Math.hypot(velocityX, velocityY), 42);
      const amount = strong ? 12 : Math.max(3, Math.round(speed / 8));

      for (let index = 0; index < amount; index += 1) {
        const angle = Math.atan2(velocityY, velocityX) + (Math.random() - 0.5) * 1.6;
        const force = (strong ? 9 : 4.5) + Math.random() * 11 + speed * 0.1;
        const spread = strong ? 30 : 18;

        splats.push({
          x: x + (Math.random() - 0.5) * spread,
          y: y + (Math.random() - 0.5) * spread,
          vx: Math.cos(angle) * force + (Math.random() - 0.5) * 2.4,
          vy: Math.sin(angle) * force + (Math.random() - 0.5) * 2.4,
          radius: (strong ? 74 : 52) + Math.random() * 62,
          life: 0,
          maxLife: strong ? 44 + Math.random() * 18 : 32 + Math.random() * 20,
          alpha: strong ? 0.28 : 0.21,
        });
      }

      if (splats.length > MAX_SPLATS) {
        splats.splice(0, splats.length - MAX_SPLATS);
      }
    };

    const updatePointerTarget = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.visible = true;

      const target = event.target instanceof Element ? event.target : null;
      const isProduct = Boolean(target?.closest('[data-cursor="product"]'));
      const isInteractive = Boolean(target?.closest(interactiveSelector));
      pointer.targetScale = isInteractive ? BUTTON_SCALE : isProduct ? PRODUCT_SCALE : 1;
    };

    const handlePointerDown = (event: PointerEvent) => {
      updatePointerTarget(event);
      addSplat(event.clientX, event.clientY, 0, 0, true);
    };

    const handlePointerLeave = () => {
      pointerRef.current.visible = false;
    };

    const drawSplash = (x: number, y: number, radius: number, alpha: number) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255, 249, 172, ${alpha})`);
      gradient.addColorStop(0.32, `rgba(255, 243, 112, ${alpha * 0.48})`);
      gradient.addColorStop(0.66, `rgba(255, 238, 72, ${alpha * 0.14})`);
      gradient.addColorStop(1, 'rgba(255, 243, 112, 0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const render = () => {
      const pointer = pointerRef.current;
      const splats = splatsRef.current;

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;
      pointer.scale += (pointer.targetScale - pointer.scale) * 0.16;

      const velocityX = pointer.smoothX - pointer.previousX;
      const velocityY = pointer.smoothY - pointer.previousY;
      const moved = Math.hypot(pointer.smoothX - pointer.lastSplatX, pointer.smoothY - pointer.lastSplatY);

      if (pointer.visible && moved > 9) {
        addSplat(pointer.smoothX, pointer.smoothY, velocityX, velocityY);
        pointer.lastSplatX = pointer.smoothX;
        pointer.lastSplatY = pointer.smoothY;
      }

      pointer.previousX = pointer.smoothX;
      pointer.previousY = pointer.smoothY;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = 'source-over';

      for (let index = splats.length - 1; index >= 0; index -= 1) {
        const splat = splats[index];
        const progress = splat.life / splat.maxLife;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const alpha = splat.alpha * Math.pow(1 - progress, 1.7);
        const radius = splat.radius * (0.72 + easeOut * 0.76);

        splat.x += splat.vx;
        splat.y += splat.vy;
        splat.vx *= 0.92;
        splat.vy *= 0.92;
        splat.life += 1;

        drawSplash(splat.x, splat.y, radius, alpha);

        if (splat.life >= splat.maxLife) {
          splats.splice(index, 1);
        }
      }

      context.globalCompositeOperation = 'source-over';
      rafRef.current = window.requestAnimationFrame(render);
    };

    resize();
    rafRef.current = window.requestAnimationFrame(render);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', updatePointerTarget, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointerTarget);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[35] h-screen w-screen"
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
        opacity: 0.72,
      }}
    />
  );
};

export default SplashCursor;
