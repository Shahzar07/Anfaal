'use client';
import { motion, Variants } from 'motion/react';
import Link from 'next/link';

export function HeroSection() {
  const sentence = "ANFAAL";
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" as any }
    }
  };

  return (
    <section className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(8,8,8,0.8),rgba(8,8,8,0.5)),url('https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1800')] bg-cover bg-center bg-no-repeat"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 flex flex-col items-center text-center">
        
        {/* EST Tag (Vertical) */}
        <motion.div 
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 font-accent text-xs opacity-50 flex flex-col items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-[1px] h-12 bg-white hidden md:block"></div>
          <span className="md:rotate-90 origin-center whitespace-nowrap hidden md:block">EST. 2024</span>
        </motion.div>

        {/* Main Title Word Reveal */}
        <motion.h1 
          className="font-display text-[13vw] sm:text-[15vw] md:text-[120px] lg:text-[160px] leading-[0.9] text-white tracking-tight select-none"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sentence.split("").map((char, index) => (
            <motion.span key={char + "-" + index} variants={letterVariants} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="mt-6 md:mt-8 font-body text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.5em] text-white-muted uppercase max-w-2xl text-center leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          REDEFINE YOUR STREETWEAR • ENGINEERED FOR THE CULTURE
        </motion.p>

        {/* CTAs */}
        <motion.div 
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <Link href="/shop" className="bg-crimson px-8 sm:px-10 py-4 font-accent text-sm md:text-base shadow-[0_0_20px_rgba(139,0,0,0.4)] hover:bg-[#B22222] transition-colors text-white uppercase tracking-widest text-center w-full sm:w-auto">
            Shop Now →
          </Link>
          <Link href="/lookbook" className="border border-white/30 backdrop-blur-sm px-8 sm:px-10 py-4 font-accent text-sm md:text-base hover:bg-white hover:text-black transition-colors text-white uppercase tracking-widest text-center w-full sm:w-auto">
            View Lookbook
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white-muted font-body">Scroll</span>
        <motion.div 
          className="w-[1px] h-12 bg-gradient-to-b from-white-muted to-transparent"
          animate={{
            y: [0, 10, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      {/* Floating Elements on Desktop */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
        <div className="relative w-full max-w-7xl mx-auto h-full text-white">
            {/* Featured Product Card (Floating Preview) */}
            <motion.div 
              className="absolute right-12 bottom-20 w-64 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-sm pointer-events-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <Link href="/shop/p-1">
                <div className="relative aspect-[3/4] mb-4 bg-[#111] overflow-hidden group">
                  <motion.img 
                    src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                    alt="Shadow Drop Tee"
                  />
                  <div className="absolute top-2 right-2 bg-crimson text-[10px] font-accent px-2 py-0.5 uppercase tracking-widest text-white">Bestseller</div>
                </div>
                <h3 className="font-display text-lg mb-1">Shadow Drop Tee</h3>
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs text-white/50">Essential Series</span>
                  <span className="font-accent text-crimson tracking-widest">PKR 1,950</span>
                </div>
              </Link>
            </motion.div>

            {/* Social Link Floating */}
            <motion.div 
              className="absolute bottom-12 left-12 flex gap-4 opacity-40 pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <Link href="#" className="font-accent tracking-widest text-[10px] -rotate-90 origin-bottom-left hover:text-crimson transition-colors uppercase block translate-y-8">Instagram</Link>
              <Link href="#" className="font-accent tracking-widest text-[10px] -rotate-90 origin-bottom-left hover:text-crimson transition-colors uppercase block translate-y-8 ml-4">TikTok</Link>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
