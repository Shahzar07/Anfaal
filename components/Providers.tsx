'use client';

import { ReactNode, useEffect, useState } from 'react';
import Lenis from 'lenis';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Hide benign Next.js/React aborted request errors from error overlay
    const originalError = console.error;
    console.error = (...args) => {
      if (/The user aborted a request|signal is aborted without reason/.test(args[0])) return;
      originalError.call(console, ...args);
    };

    window.addEventListener('unhandledrejection', (event) => {
      if (
        event.reason && 
        (event.reason.message?.includes('The user aborted a request') || 
         event.reason.message?.includes('signal is aborted without reason') ||
         event.reason.name === 'AbortError')
      ) {
        event.preventDefault();
      }
    });

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
