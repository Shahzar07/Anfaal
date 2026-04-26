'use client';

import { ReactNode, useEffect, useState } from 'react';
import Lenis from 'lenis';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Custom Cursor logic
    const cursor = document.getElementById('custom-cursor');
    const moveCursor = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      <div id="custom-cursor" className="cursor-dot hidden md:block" />
      {children}
    </>
  );
}
