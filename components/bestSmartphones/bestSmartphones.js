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
    const visibleItems = 3; // Number of visible items at a time
    const itemWidth = 220; // Approx width of each item including margin

    const maxScroll = Math.max(0, (products.length - visibleItems) * itemWidth);

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
            const scrollAmount = itemWidth * visibleItems;
            const newScrollPos =
                direction === "left"
                    ? scrollRef.current.scrollLeft - scrollAmount
                    : scrollRef.current.scrollLeft + scrollAmount;
            
            scrollRef.current.scrollTo({
                left: newScrollPos,
                behavior: "smooth",
            });
            setScrollPos(newScrollPos);
        }
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="max-w-[1280px] w-full mx-auto my-6 sm:my-8 px-4 sm:px-6 md:px-8 lg:px-0 border-[#d1d9e6] border-2 rounded-lg">
            {/* Header with Title and Navigation Arrows */}
            <div className="flex items-center justify-between gap-4 border-b border-[#d1d9e6] py-4 px-6">
                {/* Left Navigation Arrow - Neumorphic Up Theme */}
                <button
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center transition-all duration-200 ${
                        !canScrollLeft
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
                    }`}
                >
                    <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#434343]" />
                </button>

                {/* Title */}
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#434343] text-center uppercase">
                    Which are the best smartphones?
                </h2>

                {/* Right Navigation Arrow - Neumorphic Up Theme */}
                <button
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center transition-all duration-200 ${
                        !canScrollRight
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
                    }`}
                >
                    <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#434343]" />
                </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="relative w-full overflow-hidden shadow-inset">
                <div
                    ref={scrollRef}
                    className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-4 px-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
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
                                className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]"
                            >
                                {/* Card - Neumorphic Up Theme */}
                                <Link
                                    href={
                                        productUniqueTitle
                                            ? `/compare/${encodeURIComponent(productUniqueTitle)}`
                                            : "#"
                                    }
                                    className="block rounded-xl bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] p-4 sm:p-5 hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] transition-all duration-200"
                                >
                                    {/* Product Image */}
                                    <div className="w-full flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg bg-white shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] p-1.5 sm:p-2 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.src = "/popular-comparison.jpg";
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Product Name */}
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-medium text-[#434343] hover:text-[#F98A1A] transition-all duration-300 cursor-pointer truncate">
                                            {productName}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BestSmartphones;
