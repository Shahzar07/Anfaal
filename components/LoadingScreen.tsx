'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('anfaal-visited');
    if (hasVisited) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('anfaal-visited', 'true');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8"
        >
          <div className="relative overflow-hidden w-fit">
            <motion.h1 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-9xl tracking-tight text-white"
            >
              ANFAAL
            </motion.h1>
          </div>
          <div className="mt-8 overflow-hidden w-[200px] md:w-[300px]">
            <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: '100%' }}
               transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
               className="h-[1px] bg-crimson w-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
