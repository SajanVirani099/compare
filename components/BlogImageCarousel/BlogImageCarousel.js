"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { imageUrl } from "@/components/utils/config";

const BlogImageCarousel = ({ images = [], title = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images provided, return null
  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full mb-8 bg-[#e6e7ee] border border-[#d1d9e6] rounded-xl shadow-inset p-14">
       <div className="absolute top-4 left-1/2 bg-black/50 text-white px-3 py-1 rounded-lg text-xs sm:text-sm">
          Credit
        </div>
      {/* Main Image Container */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft">
        <Image
          src={imageUrl + images[currentIndex]}
          alt={title || `Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />
        
        {/* Credit Label */}
       

        {/* Navigation Arrows - Right Side */}
        {images.length > 1 && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
            <button
              onClick={goToPrevious}
              className="w-10 h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
              aria-label="Previous image"
            >
              <FaChevronUp className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
              aria-label="Next image"
            >
              <FaChevronDown className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[#3c59fc] w-8"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogImageCarousel;
