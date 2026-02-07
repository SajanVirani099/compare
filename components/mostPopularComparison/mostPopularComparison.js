import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { imageUrl } from "../utils/config";

// Popular comparisons carousel driven by API data
// Expects an array like: [{ left: {...}, right: {...} }, ...]
const MostPopularComparison = ({ popularComparison = [] }) => {
    const scrollRef = useRef(null);
    const [scrollPos, setScrollPos] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const visibleItems = 3; // Number of visible items at a time
    const itemWidth = 220; // Approx width of each item including margin

    // Ensure we have an array of { left, right } pairs
    const pairs = Array.isArray(popularComparison) ? popularComparison : [];

    const maxScroll = Math.max(0, (pairs.length - visibleItems) * itemWidth);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollPos;
            setCanScrollLeft(scrollPos > 0);
            setCanScrollRight(scrollPos < maxScroll);
        }
    }, [scrollPos, maxScroll]);

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

    if (!pairs || pairs.length === 0) {
        return null;
    }

    return (
        <div className="max-w-[1280px] w-full mx-auto mt-6 sm:mt-8 px-4 sm:px-6 md:px-8 lg:px-0 border-[#d1d9e6] border-2 rounded-lg">
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
                    Which are the most popular comparisons?
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
                    {pairs.map((pair, index) => {
                        const left = pair.left;
                        const right = pair.right;

                        const leftName =
                            left?.title ||
                            left?.name ||
                            left?.uniqueTitle ||
                            `Product ${index * 2 + 1}`;
                        const rightName =
                            right?.title ||
                            right?.name ||
                            right?.uniqueTitle ||
                            `Product ${index * 2 + 2}`;

                        const leftImg = left?.thumbnail
                            ? `${imageUrl}${left.thumbnail}`
                            : "/popular-comparison.jpg";
                        const rightImg = right?.thumbnail
                            ? `${imageUrl}${right.thumbnail}`
                            : "/popular-comparison.jpg";

                        return (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]"
                            >
                                {/* Card - Neumorphic Up Theme */}
                                <div className="rounded-xl bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] p-4 sm:p-5">
                                    {/* Top Section - Product Images with VS Badge */}
                                    <div className="relative flex items-center justify-center gap-2 sm:gap-3 mb-4">
                                        {/* Left Product Image */}
                                        {left && (
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg bg-white shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] p-1.5 sm:p-2 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={leftImg}
                                                    alt={leftName}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.src = "/popular-comparison.jpg";
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* VS Badge - Circular Neumorphic Up Theme */}
                                        {left && right && (
                                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center z-10">
                                                <span className="text-xs sm:text-sm font-bold text-[#434343]">VS</span>
                                            </div>
                                        )}

                                        {/* Right Product Image */}
                                        {right && (
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg bg-white shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] p-1.5 sm:p-2 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={rightImg}
                                                    alt={rightName}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.src = "/popular-comparison.jpg";
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Section - Product Names with VS (Vertical Layout) */}
                                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        {/* First Product Name */}
                                        <p className="text-xs sm:text-sm font-medium text-[#434343] w-full truncate px-2">
                                            {leftName}
                                        </p>
                                        
                                        {/* VS Button with Left and Right Borders */}
                                        {right && (
                                            <div className="relative w-full flex items-center justify-center">
                                                {/* VS Badge with Horizontal Borders on Left and Right */}
                                                <div className="relative bg-[#E6E7EE] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] rounded-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 font-bold text-[#434343] flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 before:content-[''] before:absolute before:h-[1px] before:w-[60px] sm:before:w-[40px] md:before:w-[60px] before:bg-[#d1d9e6] before:left-[-65px] sm:before:left-[-45px] md:before:left-[-65px] before:top-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:h-[1px] after:w-[60px] sm:after:w-[40px] md:after:w-[60px] after:bg-[#d1d9e6] after:right-[-65px] sm:after:right-[-45px] md:after:right-[-65px] after:top-1/2 after:-translate-y-1/2 z-10">
                                                    <span className="text-[6px] sm:text-xs font-bold text-[#434343]">VS</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Second Product Name */}
                                        {right && (
                                            <p className="text-xs sm:text-sm font-medium text-[#434343] w-full truncate px-2">
                                                {rightName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MostPopularComparison;
