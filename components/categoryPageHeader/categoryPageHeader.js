import React from "react";
import Link from "next/link";

const CategoryPageHeader = ({ filters, title, breadcrumb }) => {
    return (
        <div className="bg-gradient-to-r from-[#1c1c1c] via-[#2e2e2e] to-[#434343] pt-[75px]">
            <div className="max-w-[1280px] w-[90%] mx-auto pb-[50px]">
                {/* Breadcrumb */}
                <p
                    className="text-white text-sm"
                    // className="text-gray-300 text-sm"
                >
                    <Link href="/">Home</Link> &gt; {breadcrumb}
                </p>

                {/* Main Title */}
                <h1 className="text-white text-5xl font-extrabold mt-[30px]">
                    {title}
                </h1>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 mt-10 md:w-[80%]">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            className="hero-section-btn uppercase text-sm md:text-base py-[4px] px-[8px] md:py-[8px] md:px-[16px]"
                            style={{ border: "1.5px solid" }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPageHeader;
