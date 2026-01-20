"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { imageUrl } from "@/components/utils/config";

const RelatedArticles = ({ articles = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, [articles]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Scroll by card width + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16 md:mt-20">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
        Related Articles
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-10 md:px-12"
        >
          {articles.map((article, index) => (
            <Link
              key={article?._id || article?.id || index}
              href={`/blog/${article?.uniqueTitle || article?.slug || ""}`}
              className="flex-shrink-0 w-[300px] sm:w-[350px] border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Article Image */}
              {article?.thumbnail && (
                <div className="relative w-full h-[200px] sm:h-[250px] overflow-hidden">
                  <Image
                    src={imageUrl + article.thumbnail}
                    alt={article?.title || "Article image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article?.title || "Article Title"}
                </h3>
                {article?.description && (
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                    {article.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedArticles;
