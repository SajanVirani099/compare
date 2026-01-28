"use client";
import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { imageUrl } from "../utils/config";
import Link from "next/link";

const BestSmartphones = ({ products = [] }) => {
    const scrollRef = useRef(null);
    const [scrollPos, setScrollPos] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const itemWidth = 200; // Approx width of each item including gap

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
    }, [products]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = itemWidth * 2; // Scroll 2 items at a time
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

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-0 mt-10 mb-14">
            <h2 className="text-xl md:text-2xl font-bold text-[#434343] mb-6 text-center tracking-wide">
                WHICH ARE THE BEST SMARTPHONES?
            </h2>

            <div className="relative w-full">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-[#E6E7EE] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] border border-transparent transition-all ${
                        !canScrollLeft
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]"
                    }`}
                >
                    <FaChevronLeft className="w-5 h-5 text-[#616161]" />
                </button>

                {/* Scrollable Content */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 md:gap-7 overflow-x-auto scrollbar-hide scroll-smooth px-10 md:px-12 py-6 rounded-3xl bg-[#E6E7EE] shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]"
                >
                    {products.map((product, index) => {
                        const productName =
                            product?.title ||
                            product?.name ||
                            product?.uniqueTitle ||
                            `Product ${index + 1}`;
                        const productImage = product?.thumbnail
                            ? `${imageUrl}${product.thumbnail}`
                            : "/popular-comparison.jpg";
                        const productUniqueTitle =
                            product?.uniqueTitle || product?.title || "";

                        return (
                            <div
                                key={product?._id || product?.id || index}
                                className="flex-shrink-0 w-[180px] md:w-[200px] text-center relative"
                            >
                                {/* Numbered Badge */}
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 bg-[#3c59fc] text-white font-bold text-sm md:text-base px-3 py-1 rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.15)]">
                                    {index + 1}
                                </div>

                                {/* Product Image */}
                                <div className="mt-6 flex items-center justify-center">
                                    <img
                                        src={productImage}
                                        alt={productName}
                                        className="w-[120px] md:w-[140px] h-auto object-contain rounded-2xl bg-[#E6E7EE] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] p-3"
                                    />
                                </div>

                                {/* Product Name */}
                                <div className="mt-4">
                                    <Link
                                        href={
                                            productUniqueTitle
                                                ? `/compare/${encodeURIComponent(
                                                      productUniqueTitle
                                                  )}`
                                                : "#"
                                        }
                                        className="text-sm md:text-base font-medium text-[#434343] hover:text-[#3c59fc] transition-colors"
                                    >
                                        {productName}
                                    </Link>
                                </div>

                                {/* Show all link - appears below 3rd product */}
                                {index === 2 && (
                                    <div className="mt-4">
                                        <Link
                                            href="/quick-compare"
                                            className="inline-block text-[#3c59fc] text-xs md:text-sm font-medium hover:text-[#2d47d4] transition-colors"
                                        >
                                            Show all
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-[#E6E7EE] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] border border-transparent transition-all ${
                        !canScrollRight
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]"
                    }`}
                >
                    <FaChevronRight className="w-5 h-5 text-[#616161]" />
                </button>
            </div>
        </div>
    );
};

export default BestSmartphones;
