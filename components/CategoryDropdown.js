import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryIcon from "@/assets/icons/CategoryIcon";

const CategoryDropdown = ({ categories }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    // Calculate how many columns to show based on screen size
    const getColumnCount = () => {
        if (typeof window === 'undefined') return 5;
        if (window.innerWidth >= 1400) return 5;
        if (window.innerWidth >= 1200) return 4;
        if (window.innerWidth >= 992) return 3;
        return 2;
    };

    const [columnCount, setColumnCount] = useState(5);

    useEffect(() => {
        const updateColumnCount = () => {
            setColumnCount(getColumnCount());
        };

        updateColumnCount();
        window.addEventListener('resize', updateColumnCount);
        return () => window.removeEventListener('resize', updateColumnCount);
    }, []);

    // Split categories into columns
    const splitIntoColumns = (items, cols) => {
        const columns = Array.from({ length: cols }, () => []);
        items.forEach((item, index) => {
            columns[index % cols].push(item);
        });
        return columns;
    };

    // Handle opening dropdown with immediate effect
    const handleMouseEnter = () => {
        // Clear any pending close timeout
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsOpen(true);
    };

    // Handle closing dropdown with delay to allow cursor movement
    const handleMouseLeave = () => {
        // Add a small delay before closing to allow cursor to move between trigger and dropdown
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150); // 150ms delay
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when dropdown is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    if (!categories || categories.length <= 0) {
        return null;
    }

    const categoryColumns = splitIntoColumns(categories, columnCount);

    return (
        <>
            <div className="relative group cursor-pointer">
                {/* Category Button */}
                <div 
                    ref={triggerRef}
                    className="navMenuTitle categories mx-4 flex gap-2 items-center cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <CategoryIcon />
                    <span className="cursor-pointer">Categories</span>
                </div>

                {/* Full-Screen Dropdown Menu */}
                <div
                    ref={dropdownRef}
                    className={`fixed left-0 right-0 bg-[#E6E7EE] shadow-2xl z-[10000] transition-all duration-300 ease-in-out ${
                        isOpen 
                            ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                            : 'opacity-0 invisible -translate-y-4 pointer-events-none'
                    }`}
                    style={{
                        top: '60px', // Height of navbar
                        maxHeight: 'calc(100vh - 60px)',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Invisible bridge area at top to catch mouse movement */}
                    <div 
                        className="absolute left-0 right-0 bg-transparent pointer-events-auto"
                        style={{
                            top: '-10px',
                            height: '10px',
                        }}
                        onMouseEnter={handleMouseEnter}
                    />
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 overflow-y-auto max-h-[calc(100vh-140px)]">
                        {/* Category Columns Grid */}
                        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 mb-6`}>
                            {categoryColumns.map((column, colIndex) => (
                                <div key={colIndex} className="flex flex-col">
                                    {column.map((category, index) => (
                                        <div key={`${colIndex}-${index}`} className="mb-8 last:mb-0 border-[2px] border-[#d1d9e6] rounded-xl bg-[#e6e7ee] hover:shadow-soft transition-all duration-200">
                                            {/* Category Title */}
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center bg-[#E6E7EE] pl-4 py-4 shadow-inset overflow-hidden !rounded-s-xl !rounded-e-xl !rounded-ee-none !rounded-bl-none">
                                                {category.name || category.title}
                                            </h3>
                                            
                                            {/* Subcategories List */}
                                            {(category.subCategory || category.subCategories) && 
                                             (category.subCategory?.length > 0 || category.subCategories?.length > 0) && (
                                                <ul className="space-y-2 px-5 pb-5">
                                                    {(category.subCategory || category.subCategories || []).map((subCategory, subIndex) => (
                                                        <li key={subIndex}>
                                                            <Link
                                                                href={
                                                                    subCategory.uniqueName 
                                                                        ? `/${subCategory.uniqueName}` 
                                                                        : subCategory.path || "#"
                                                                }
                                                                className="text-sm text-gray-700 hover:text-[#F98A1A] transition-colors duration-200 block py-1 capitalize"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {subCategory.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* See All Categories Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <Link
                                href="/categories"
                                className="inline-flex items-center gap-2 px-6 py-2.5 btn btn-primary !bg-[#F98A1A] !hover:bg-[#F98A1A] !text-white rounded-full font-medium text-sm transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                See all categories
                                <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 5l7 7-7 7" 
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop overlay for mobile/tablet */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-20 z-[9999] lg:hidden"
                    style={{ top: '60px' }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default CategoryDropdown;
