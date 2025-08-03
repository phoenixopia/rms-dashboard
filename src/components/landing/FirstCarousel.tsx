"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type CarouselProps = {
  images: {
    src: string;
  }[];
  autoSlide?: boolean;
  slideInterval?: number;
  visibleSlides?: number;
};

export default function SmoothInfiniteCarousel({
  images,
  autoSlide = false,
  slideInterval = 3000,
  visibleSlides = 4,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(images.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const transitionRef = useRef<NodeJS.Timeout | null>(null);

  const extendedImages = [...images, ...images, ...images];
  const slideWidth = 100 / visibleSlides;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= images.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(images.length);
    }
  };

  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      nextSlide();
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, nextSlide]);

  useEffect(() => {
    if (!isTransitioning) {
      transitionRef.current = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, [isTransitioning]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="flex"
        style={{
          transform: `translateX(-${currentIndex * slideWidth}%)`,
          transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedImages.map((image, index) => (
          <div
            key={`${index}-${image.src}`}
            className="flex-shrink-0 px-2"
            style={{ width: `${slideWidth}%` }}
          >
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-md">
              <Image
                src={image.src}
                alt="Trusted by Leading Companies"
                fill
                className="object-cover"
                sizes={`(max-width: 768px) 100vw, ${slideWidth}vw`}
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
