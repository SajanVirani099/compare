import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import CategoryIcon from "@/assets/icons/CategoryIcon";

const CategoryDropdown = ({ categories }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const categoryRef = useRef(null);
    const [menuHeight, setMenuHeight] = useState("auto");

    useEffect(() => {
        if (categoryRef.current) {
            setMenuHeight(`${categoryRef.current.clientHeight}px`);
        }
    }, [categories]);


    if (categories?.length <= 0) {
        return null;
    }

    return (
        <div className="relative group cursor-pointer">
            {/* Category Button */}
            <div className="navMenuTitle categories mx-4 flex gap-2 items-center cursor-pointer">
                <CategoryIcon />
                <span className="cursor-pointer">Categories</span>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full w-[500px] z-50 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 flex overflow-hidden cursor-pointer">
                {/* Left Section - Categories List */}
                <div
                    className="bg-white rounded-l-lg shadow-lg cursor-pointer"
                    ref={categoryRef}
                >
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className={`relative px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 ${hoveredCategory === category
                                    ? "bg-gray-200 border-b border-gray-300"
                                    : ""
                                }`}
                            onMouseEnter={() => {
                                console.log(category)
                                setHoveredCategory(category)
                            }}
                        >
                            <span className="w-6 cursor-pointer">{category.icon}</span>
                            <span className="cursor-pointer ml-2 text-black">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    className="w-[250px] bg-white rounded-r-lg shadow-lg transition-opacity duration-200 flex items-start justify-start p-4 cursor-pointer"
                >
                    {hoveredCategory &&
                        hoveredCategory.subCategory.length > 0 ? (
                        <div className="flex-1">
                            {hoveredCategory.subCategory.map(
                                (subCategory, subIndex) => (
                                    <Link
                                        key={subIndex}
                                        href={subCategory.uniqueName || "#"}
                                        className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer text-wrap"
                                    >
                                        {subCategory.name}
                                    </Link>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-400 cursor-pointer">
                            Hover over a category
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryDropdown;
