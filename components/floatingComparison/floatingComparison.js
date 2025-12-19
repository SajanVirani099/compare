"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/config";

const FloatingComparison = ({ category }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { subCategoryProducts } = useSelector((state) => state.product);

    const [isFull, setIsFull] = useState(false);
    const [comparisonList, setComparisonList] = useState([]);

    const fetchComparisonList = () => {
        if (typeof window !== "undefined") {
            const storedList = localStorage.getItem("comparisonList");
            if (storedList) {
                setComparisonList(JSON.parse(storedList));
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

    const getProduct = (id) => {
        return subCategoryProducts.find((item) => item._id === id);
    };

    const removeItemFromComparisonList = (id) => {
        const updatedList = comparisonList.filter((itemId) => itemId !== id);
        localStorage.setItem("comparisonList", JSON.stringify(updatedList));
        setComparisonList(updatedList);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("comparisonList");
        }
    }, [pathname]);

    const handleCompare = () => {
        if (comparisonList.length >= 2 && comparisonList.length <= 4) {
            const selectedProducts = comparisonList
                .map((id) => getProduct(id))
                .filter(Boolean);

            const urlPart = selectedProducts
                .map((product) =>
                    product.title.toLowerCase().replace(/\s+/g, "-")
                )
                .join("-vs-");

            if (typeof window !== "undefined") {
                localStorage.setItem("comparisonCategory", category);
            }

            router.push(`/compare/${urlPart}`);
        }
    };

    if (comparisonList.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-72 flex flex-col items-end z-[9999]">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-[310px] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full rounded-br-none px-4 py-2 shadow-lg"
            >
                <div className="flex justify-between items-center">
                    <span className="font-semibold">
                        <span className="font-bold text-lg">vs</span>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        {comparisonList.length}{" "}
                        {comparisonList.length > 1 ? "items" : "item"} selected
                    </span>
                    <button
                        className="text-white"
                        onClick={() => setIsFull(!isFull)}
                    >
                        {isFull ? <FaChevronDown /> : <FaChevronUp />}
                    </button>
                </div>
            </motion.div>

            {isFull && (
                <div className="bg-white text-black rounded-b-2xl shadow-lg w-72 divide-y">
                    <div
                        className={`${
                            comparisonList.length > 4
                                ? "max-h-[220px] overflow-y-auto"
                                : "max-h-full"
                        } px-3`}
                    >
                        {comparisonList.map((itemId, index) => {
                            const product = getProduct(itemId);
                            if (!product) return null;

                            const name = product.title || "Unknown Product";
                            const thumbnailUrl = product.thumbnail
                                ? `${BASE_URL}${product.thumbnail}`
                                : "/placeholder.png";

                            return (
                                <li
                                    key={index}
                                    className="flex justify-between items-center border-b p-2 last:border-none"
                                >
                                    <div className="flex items-center gap-6">
                                        <img
                                            src={thumbnailUrl}
                                            alt={name}
                                            className="h-8 w-auto"
                                        />
                                        <span className="text-sm">
                                            {name.length > 25
                                                ? name.slice(0, 25) + "..."
                                                : name}
                                        </span>
                                    </div>
                                    <button
                                        className="text-gray-500 text-xl"
                                        onClick={() =>
                                            removeItemFromComparisonList(itemId)
                                        }
                                    >
                                        <MdClose />
                                    </button>
                                </li>
                            );
                        })}
                    </div>

                    <div className="pl-6 pr-4 py-2 flex justify-between items-center">
                        <button
                            className="text-sm font-semibold px-8 py-1.5 bg-[#3c59fc] text-white rounded-full"
                            onClick={handleCompare}
                        >
                            Compare
                        </button>

                        <button
                            className="relative px-2 py-2 bg-[#3c59fc] text-white rounded-full shadow-lg hover:bg-blue-600"
                            onClick={() => {}}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="white"
                                className="size-3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingComparison;
