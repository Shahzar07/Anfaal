import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function LookbookPage() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1528228377194-2faca82540e4?w=800', alt: 'Look 1' },
    { src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800', alt: 'Look 2' },
    { src: 'https://images.unsplash.com/photo-1489987707023-afc7e17b1013?w=800', alt: 'Look 3' },
    { src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800', alt: 'Look 4' },
    { src: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', alt: 'Look 5' },
    { src: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800', alt: 'Look 6' }
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl mb-4 uppercase">Lookbook</h1>
          <p className="font-body tracking-[0.2em] text-white-muted uppercase text-sm">Fall / Winter 2024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, i) => (
            <div key={i} className="aspect-[3/4] relative overflow-hidden group">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
