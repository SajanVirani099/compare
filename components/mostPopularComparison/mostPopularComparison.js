import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const comparisons = [
    {
        img1: "/iphone-16-pro-max.jpg",
        img2: "/s25-ultra.jpg",
        item1: "Apple iPhone 16 Pro Max",
        item2: "Samsung Galaxy S25 Ultra",
    },
    {
        img1: "/galaxy-a16.jpg",
        img2: "/galaxy-a25.jpg",
        item1: "Samsung Galaxy A16 5G",
        item2: "Samsung Galaxy A25 5G",
    },
    {
        img1: "/galaxy-a16.jpg",
        img2: "/galaxy-a35.jpg",
        item1: "Samsung Galaxy A16 5G",
        item2: "Samsung Galaxy A35 5G",
    },
    {
        img1: "/galaxy-a35.jpg",
        img2: "/galaxy-a55.jpg",
        item1: "Samsung Galaxy A35 5G",
        item2: "Samsung Galaxy A55 5G",
    },
    {
        img1: "/redmi-note-13.jpg",
        img2: "/redmi-note-14.jpg",
        item1: "Xiaomi Redmi Note 13",
        item2: "Xiaomi Redmi Note 14",
    },
    {
        img1: "/redmi-note-13.jpg",
        img2: "/redmi-note-14.jpg",
        item1: "Xiaomi Redmi Note 13",
        item2: "Xiaomi Redmi Note 14",
    },
    {
        img1: "/redmi-note-13.jpg",
        img2: "/redmi-note-14.jpg",
        item1: "Xiaomi Redmi Note 13",
        item2: "Xiaomi Redmi Note 14",
    },
    {
        img1: "/redmi-note-13.jpg",
        img2: "/redmi-note-14.jpg",
        item1: "Xiaomi Redmi Note 13",
        item2: "Xiaomi Redmi Note 14",
    },
];

const MostPopularComparison = () => {
    const scrollRef = useRef(null);
    const [scrollPos, setScrollPos] = useState(0);
    const visibleItems = 5; // Number of visible items at a time
    const itemWidth = 160; // Approx width of each item including margin
    const maxScroll = (comparisons.length - visibleItems) * itemWidth;

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
                            minWidth: `${comparisons.length * itemWidth}px`,
                        }}
                    >
                        {comparisons.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-lg py-4 text-center min-w-[170px]"
                            >
                                <div className="relative flex items-center justify-center space-x-1">
                                    <img
                                        src={"/popular-comparison.jpg"}
                                        alt="Phone 1"
                                        className="w-20 h-20 rounded-lg object-top"
                                    />
                                    <span className="absolute text-base font-bold bg-white px-2 py-[2px] rounded-full">
                                        vs
                                    </span>
                                    <img
                                        src={"/popular-comparison.jpg"}
                                        alt="Phone 2"
                                        className="w-20 h-20 rounded-lg object-top"
                                    />
                                </div>
                                <div className="mt-4 text-[#616161]">
                                    <p className="text-sm">{item.item1}</p>
                                    <p className="text-xs">vs</p>
                                    <p className="text-sm">{item.item2}</p>
                                </div>
                            </div>
                        ))}
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
