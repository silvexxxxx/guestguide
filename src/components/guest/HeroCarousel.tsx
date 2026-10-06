import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import type { Property } from '@/types';
import type { Lang } from '@/lib/i18n';

interface Slide {
  url: string;
  title: string;
  subtitle: string;
  tag: string;
}

const CARLOFORTE_SLIDES: Slide[] = [
  {
    url: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Acque Cristalline',
    subtitle: 'Calette incontaminate e mare turchese',
    tag: 'Cala Fico & Spiagge',
  },
  {
    url: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Tramonto sulle Falesie',
    subtitle: 'La magia dell\'orizzonte a perdita d\'occhio',
    tag: 'Capo Sandalo',
  },
  {
    url: 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'I Caruggi Tabarchini',
    subtitle: 'Colori, profumi e tradizioni marinare',
    tag: 'Borgo di Carloforte',
  },
  {
    url: 'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Il Tuo Relax sull\'Isola',
    subtitle: 'Sentiti a casa nel cuore del Mediterraneo',
    tag: 'Benvenuti',
  },
];

interface Props {
  property: Property;
  lang: Lang;
}

export function HeroCarousel({ property }: Props) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % CARLOFORTE_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + CARLOFORTE_SLIDES.length) % CARLOFORTE_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Saluto dinamico in base all'orario
  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Buongiorno • Buona giornata di mare!', icon: '🌅' };
    }
    if (hour >= 12 && hour < 18) {
      return { text: 'Buon Pomeriggio • Sole & relax tra le calette', icon: '☀️' };
    }
    return { text: 'Buona Serata • Tramonto & sapori dell\'isola', icon: '🌇' };
  };

  const greeting = getDynamicGreeting();

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-xl border border-sky-100/60 group print:hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{ minHeight: '380px' }}
    >
      {/* Background Slides con Ken Burns animation */}
      {CARLOFORTE_SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className={`w-full h-full object-cover transform transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Gradient overlays per leggibilità testi */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-950/40 via-transparent to-transparent" />
          </div>
        );
      })}

      {/* Dynamic Content Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-8" style={{ minHeight: '380px' }}>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Orario / Saluto Dinamico */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium shadow-sm">
            <span>{greeting.icon}</span>
            <span>{greeting.text}</span>
          </div>

          {/* Tag Località Carloforte */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/80 backdrop-blur-md border border-sky-300/40 text-white text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>{CARLOFORTE_SLIDES[current].tag}</span>
          </div>
        </div>

        {/* Center / Bottom Info */}
        <div className="space-y-3 mt-auto pt-16">
          <div className="flex items-center gap-1.5 text-sky-200 text-xs font-medium tracking-wide uppercase">
            <MapPin className="w-3.5 h-3.5 text-cyan-300" />
            <span>{property.city ? `${property.city} • Isola di San Pietro` : 'Carloforte, Sardegna'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
            {property.name || 'Benvenuti a Carloforte'}
          </h1>

          <p className="text-sm text-sky-100/90 max-w-lg leading-relaxed line-clamp-2">
            {CARLOFORTE_SLIDES[current].subtitle}
          </p>
        </div>

        {/* Bottom controls: Arrows + Dots */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/15">
          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {CARLOFORTE_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-cyan-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Vai alla foto ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation Chevrons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition active:scale-95"
              aria-label="Foto precedente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition active:scale-95"
              aria-label="Foto successiva"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delicate Wave Divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-4 text-sky-50/20 fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,20 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
}
