"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { imageUrl } from "../utils/config";
import Image from "next/image";

const FloatingComparison = ({ category }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { subCategoryProducts } = useSelector((state) => state.product);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [comparisonList, setComparisonList] = useState([]);
    const [comparisonProducts, setComparisonProducts] = useState([]);

    const fetchComparisonList = () => {
        if (typeof window !== "undefined") {
            const storedList = localStorage.getItem("comparisonList");
            if (storedList) {
                setComparisonList(JSON.parse(storedList));
            }
            
            const productsRaw = localStorage.getItem("comparisonProducts");
            if (productsRaw) {
                setComparisonProducts(JSON.parse(productsRaw));
            }
        }
    };

    useEffect(() => {
        fetchComparisonList();

        const handleComparisonUpdate = () => {
            fetchComparisonList();
        };

        window.addEventListener(
            "comparisonListUpdated",
            handleComparisonUpdate
        );

        return () => {
            window.removeEventListener(
                "comparisonListUpdated",
                handleComparisonUpdate
            );
        };
    }, []);

    // Update comparison products when subCategoryProducts or comparisonList changes
    useEffect(() => {
        if (!subCategoryProducts || subCategoryProducts.length === 0) return;
        if (comparisonList.length === 0) return;

        setComparisonProducts((prevProducts) => {
            const updatedProducts = comparisonList
                .map((id) => {
                    const currentProduct = subCategoryProducts.find((p) => p._id === id);
                    if (currentProduct) return currentProduct;

                    const storedProduct = prevProducts.find((p) => p._id === id);
                    return storedProduct || null;
                })
                .filter(Boolean);

            if (updatedProducts.length > 0) {
                try {
                    localStorage.setItem(
                        "comparisonProducts",
                        JSON.stringify(updatedProducts)
                    );
                } catch (error) {
                    console.error("Error saving to localStorage:", error);
                }
                return updatedProducts;
            }

            return prevProducts;
        });
    }, [subCategoryProducts, comparisonList]);

    const getProduct = (id) => {
        return subCategoryProducts.find((p) => p._id === id) ||
               comparisonProducts.find((p) => p._id === id);
    };

    const handleRemoveFromComparison = (id) => {
        const updated = comparisonList.filter((item) => item !== id);
        setComparisonList(updated);

        const updatedProducts = comparisonProducts.filter((p) => p._id !== id);
        setComparisonProducts(updatedProducts);

        try {
            localStorage.setItem("comparisonList", JSON.stringify(updated));
            localStorage.setItem(
                "comparisonProducts",
                JSON.stringify(updatedProducts)
            );
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }

        window.dispatchEvent(new Event("comparisonListUpdated"));
    };

    const handleCompare = () => {
        if (comparisonList.length < 2) {
            return;
        }
        
        const compareValues = comparisonList.map((id) => {
            const product = getProduct(id);
            const label = product?.uniqueTitle || product?.title;
            return encodeURIComponent(label);
        });

        const compareUrl = `/compare/${compareValues.join(",")}`;
        router.push(compareUrl);
    };

    if (comparisonList.length === 0) return null;

    return (
        <div className="fixed bottom-2 left-0 right-0 z-[9999]">
            <div className="mx-auto max-w-7xl px-2">
                <div className="bg-[#e6e7ee] rounded-xl shadow-lg border border-gray-200 w-full shadow-inset mt-4">
                    {/* Header */}
                    <div
                        className="bg-[#F98A1A] text-white px-4 py-3 rounded-t-xl rounded-bl-xl cursor-pointer flex items-center justify-between shadow-soft"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-[#F98A1A] rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold text-center">
                                <span className="m-0 -mt-1">vs</span>
                            </div>
                            <span className="font-medium">
                                Comparison list ({comparisonList?.length || 0})
                            </span>
                        </div>
                        <div className="text-white">
                            {isDropdownOpen ? (
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
                                        d="M5 15l7-7 7 7"
                                    />
                                </svg>
                            ) : (
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
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {isDropdownOpen && (
                        <div className="p-4">
                            {/* Product List */}
                            <div className="space-y-2 mb-4">
                                {comparisonList.map((productId, index) => {
                                    const product = getProduct(productId);

                                    if (!product) {
                                        return (
                                            <div
                                                key={productId}
                                                className="flex items-center justify-between p-2 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#e6e7ee] rounded flex items-center justify-center">
                                                        <svg
                                                            className="w-4 h-4 text-gray-600"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-500 truncate">
                                                            Product {index + 1} (Not available)
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveFromComparison(productId)
                                                    }
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
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
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={productId}
                                            className="flex items-center justify-between p-2 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft"
                                        >
                                            <div className="flex items-center w-full gap-3">
                                                {product.thumbnail && (
                                                    <Image
                                                        src={`${imageUrl}${product.thumbnail}`}
                                                        alt={product.title}
                                                        height={32}
                                                        width={32}
                                                        className="w-8 h-8 object-cover rounded"
                                                    />
                                                )}
                                                {!product.thumbnail && (
                                                    <div className="w-8 h-8 bg-[#e6e7ee] rounded flex items-center justify-center">
                                                        <svg
                                                            className="w-4 h-4 text-gray-600"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium text-gray-900 mb-0">
                                                    {product?.title || `Product ${index + 1}`}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveFromComparison(productId)
                                                }
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
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
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mx-5">
                                <button
                                    onClick={handleCompare}
                                    disabled={comparisonList.length < 2}
                                    className="flex-1 btn btn-primary !px-5 !rounded-md bg-gradient-to-r from-[#1c1c1c] via-[#2e2e2e] to-[#434343] !text-white disabled:cursor-not-allowed transition-colors disabled:bg-none disabled:bg-gray-300 disabled:!text-gray-600"
                                >
                                    Compare{" "}
                                    {comparisonList.length > 0 &&
                                        `(${comparisonList.length})`}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="btn btn-primary !text-2xl !px-5 !rounded-md"
                                    title="Close and scroll to top"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FloatingComparison;
