'use client';
import { motion } from 'motion/react';

export function MarqueeStrip() {
  const text = "ANFAAL • PREMIUM MENS WEAR • PAKISTAN'S FINEST • STREET CULTURE • ";
  const textArray = new Array(5).fill(text);

  return (
    <div className="w-full bg-[#0a0a0a] h-12 overflow-hidden border-y border-white/5 relative flex items-center">
      <motion.div 
        className="flex whitespace-nowrap opacity-30"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        <div className="flex">
          {textArray.map((t, i) => (
            <span 
              key={`first-${i}`} 
              className="font-accent text-white tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm px-2 md:px-4 shrink-0 uppercase"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex">
          {textArray.map((t, i) => (
            <span 
              key={`second-${i}`} 
              className="font-accent text-white tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm px-2 md:px-4 shrink-0 uppercase"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
