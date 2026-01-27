import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { imageUrl } from "../utils/config";

// Popular comparisons carousel driven by API data
// Expects an array like: [{ left: {...}, right: {...} }, ...]
const MostPopularComparison = ({ popularComparison = [] }) => {
    const scrollRef = useRef(null);
    const [scrollPos, setScrollPos] = useState(0);
    const visibleItems = 5; // Number of visible items at a time
    const itemWidth = 160; // Approx width of each item including margin

    // Ensure we have an array of { left, right } pairs
    const pairs = Array.isArray(popularComparison) ? popularComparison : [];

    const maxScroll = Math.max(0, (pairs.length - visibleItems) * itemWidth);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollPos;
        }
    }, [scrollPos]);

    const scroll = (direction) => {
        let newScrollPos =
            direction === "left"
                ? scrollPos - itemWidth * visibleItems
                : scrollPos + itemWidth * visibleItems;
        newScrollPos = Math.max(0, Math.min(newScrollPos, maxScroll));
        setScrollPos(newScrollPos);
    };

    if (!pairs || pairs.length === 0) {
        return null;
    }

    return (
        <div className="max-w-[1280px] w-[95%] md:w-[55%] mx-auto mt-6">
            <p className="mb-2 text-md font-bold text-[#616161] ml-10 uppercase">
                Which are the most popular comparisons?
            </p>

            <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg">
                {/* Left Button */}
                <button
                    onClick={() => scroll("left")}
                    disabled={scrollPos === 0}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 z-10 bg-white shadow-md rounded-full ${
                        scrollPos === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <FaChevronLeft className="w-6 h-6" />
                </button>

                {/* Scrollable Content */}
                <div
                    ref={scrollRef}
                    className="w-full flex overflow-hidden scroll-smooth md:pl-12"
                >
                    <div
                        className="flex space-x-4"
                        style={{
                            minWidth: `${pairs.length * itemWidth}px`,
                        }}
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
                                    className="rounded-lg py-4 text-center min-w-[170px]"
                                >
                                    <div className="relative flex items-center justify-center space-x-1">
                                        {left && (
                                            <img
                                                src={leftImg}
                                                alt={leftName}
                                                className="w-20 h-20 rounded-lg object-top"
                                            />
                                        )}
                                        {left && right && (
                                            <span className="absolute text-base font-bold bg-white px-2 py-[2px] rounded-full">
                                                vs
                                            </span>
                                        )}
                                        {right && (
                                            <img
                                                src={rightImg}
                                                alt={rightName}
                                                className="w-20 h-20 rounded-lg object-top"
                                            />
                                        )}
                                    </div>
                                    <div className="mt-4 text-[#616161]">
                                        <p className="text-sm">{leftName}</p>
                                        {right && (
                                            <>
                                                <p className="text-xs">vs</p>
                                                <p className="text-sm">{rightName}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Button */}
                <button
                    onClick={() => scroll("right")}
                    disabled={scrollPos === maxScroll}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 z-10 bg-white shadow-md rounded-full ${
                        scrollPos === maxScroll
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    <FaChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default MostPopularComparison;
