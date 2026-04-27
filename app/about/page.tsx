import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="font-display text-4xl md:text-6xl mb-8 uppercase">About Us</h1>
        <div className="space-y-6 font-body text-white-muted leading-relaxed">
          <p>
            Anfaal isn't just another clothing brand; it's a movement born out of necessity.
            Founded in 2024, our mission is to redefine streetwear by merging contemporary design
            with unparalleled quality.
          </p>
          <p>
            We believe that clothing speaks before you do. Every piece we create is engineered for the bold,
            the trendsetters, and the rule-breakers. We source premium fabrics and employ meticulous
            craftsmanship, ensuring that each garment is as durable as it is aesthetic.
          </p>
          <p>
            Based in Pakistan, our vision stretches globally. We proudly showcase local talent, bringing
            innovative streetwear culture to the forefront. Join us as we redefine what premium menswear means today.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
