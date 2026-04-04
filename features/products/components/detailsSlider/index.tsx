"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import CaruselArroButtons from "@/components/carousel/carouselArrowButtons";

interface DetailsSliderProps {
  images?: string[];
  productName?: string;
}

export default function DetailsSlider({
  images = [
    "/imgs/product.png",
    "https://www.dewaltgeorgia.com/uploads/images/1590924950_1.jpeg",
    "/imgs/product.png",
    "https://www.dewaltgeorgia.com/uploads/images/1743418677_1.jpeg",
    "/imgs/product.png",
    "https://www.dewaltgeorgia.com/uploads/images/1590924950_1.jpeg",
  ],
  productName = "Product",
}: DetailsSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHoveringThumbnails, setIsHoveringThumbnails] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<{
    transform: string;
    transformOrigin: string;
  }>({ transform: "scale(1)", transformOrigin: "center" });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "keepSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Initial state check
    const checkState = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Use requestAnimationFrame to avoid synchronous setState
    requestAnimationFrame(checkState);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const container = imageContainerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomStyle({
      transform: "scale(2)",
      transformOrigin: `${xPercent}% ${yPercent}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center",
    });
  };

  return (
    <div className="mx-auto w-full max-w-[410px]">
      {/* Main Image with Zoom */}
      <div
        ref={imageContainerRef}
        className="relative mb-4 aspect-195/164 w-full overflow-hidden rounded-[6px] bg-white md:aspect-208/175"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="h-full w-full transition-transform duration-300 ease-out"
          style={zoomStyle}
        >
          <Image
            src={images[selectedIndex] || images[0]}
            alt={productName}
            fill
            className="object-cover p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div
        className="relative m-auto max-w-[84%]"
        onMouseEnter={() => setIsHoveringThumbnails(true)}
        onMouseLeave={() => setIsHoveringThumbnails(false)}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleThumbnailClick(index)}
                className={`border-line-color relative aspect-square h-18 min-w-0 flex-[0_0_calc(85px-0.375rem)] overflow-hidden rounded-sm border bg-white transition-all ${
                  selectedIndex === index
                    ? "border-primary"
                    : "border-line-color hover:border-primary"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover p-1"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Show on hover */}
        {images.length > 4 && (
          <div
            className={`transition-opacity duration-200 ${
              isHoveringThumbnails ? "opacity-100" : "opacity-0"
            }`}
          >
            <CaruselArroButtons
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              prevBtnDisabled={false}
              nextBtnDisabled={false}
              nextBtnClass="right-[-10px] shadow-sm"
              prevBtnClass="left-[-10px] shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
