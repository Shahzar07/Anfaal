'use client';
import { motion } from 'motion/react';

export function AnnouncementBar() {
  const items = [
    "🔥 EXCLUSIVE DROPS LIVE NOW",
    "⚡ FREE SHIPPING ON ORDERS OVER 5,000 PKR",
    "💥 LIMITED EDITION FALL WARDROBE",
    "🚀 NEW STREETWEAR ESSENTIALS ADDED"
  ];
  
  const text = items.join(" • ") + " • ";
  const textArray = new Array(4).fill(text); // lots of repeats to ensure coverage

  return (
    <div className="bg-crimson w-full h-[30px] md:h-[40px] text-white flex items-center overflow-hidden fixed top-0 left-0 z-[60] font-accent tracking-widest text-xs md:text-sm">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        <div className="flex">
          {textArray.map((t, i) => <span key={`first-${i}`} className="px-4 shrink-0">{t}</span>)}
        </div>
        <div className="flex">
          {textArray.map((t, i) => <span key={`second-${i}`} className="px-4 shrink-0">{t}</span>)}
        </div>
      </motion.div>
    </div>
  );
}
