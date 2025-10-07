import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

// Hero images
import heroWater from '@/assets/hero-water.jpg';
import hero3 from '@/assets/hero3.jpg';
import hero4 from '@/assets/hero4.jpg';
import hero5 from '@/assets/hero5.jpg';
import hero6 from '@/assets/hero6.jpg';
import hero7 from '@/assets/hero7.jpg';

const heroImages = [heroWater, hero3, hero4, hero5, hero6, hero7];

const HeroCarousel = ({ onSectionChange }) => {
  const [current, setCurrent] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Images */}
      {heroImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`hero-${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          } brightness-50`}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>

      {/* Content Overlay */}
      <div className="relative z-20 container mx-auto px-6 py-16 md:py-24 flex flex-col justify-center items-start h-full text-white max-w-4xl text-left">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-snug drop-shadow-lg">
            Revolutionary Heavy Metal Detection System
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 text-gray-100 leading-relaxed drop-shadow-md">
            Real-time monitoring, AI-powered analysis, and geospatial intelligence for safeguarding India's groundwater from heavy metal contamination.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => onSectionChange('upload')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 font-semibold px-6 py-4 text-base shadow-xl transition-all duration-300 border border-white/30"
            >
              <Database className="h-5 w-5 mr-2" />
              Upload Sample Data
            </Button>
            <Button
              size="lg"
              onClick={() => onSectionChange('connect')}
              className="bg-white/20 backdrop-blur-md border border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-6 py-4 text-base transition-all duration-300 shadow-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 z-30 transition-all duration-300"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 z-30 transition-all duration-300"
      >
        &#8594;
      </button>
    </div>
  );
};

export default HeroCarousel;