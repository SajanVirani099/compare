import React, { useState } from "react";
import Image from "next/image";
import { BASE_URL } from "@/components/utils/config";
import Link from "next/link";

const MobileCategoryList = ({ categories }) => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="block md:hidden p-4 space-y-4 overflow-x-scroll h-60">
            {categories.map((cat) => (
                <div
                    key={cat._id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200"
                >
                    <button
                        onClick={() => toggleExpand(cat._id)}
                        className="w-full flex items-center justify-between px-4 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-gray-300 bg-gray-50">
                                <img
                                    src={BASE_URL + cat.sIcon}
                                    alt={cat.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                                {cat.name}
                            </span>
                        </div>
                        <span className="text-gray-500">
                            {expandedId === cat._id ? "▲" : "▼"}
                        </span>
                    </button>

                    {expandedId === cat._id && cat.subCategory?.length > 0 && (
                        <ul className="px-6 pb-3 space-y-2 text-sm text-gray-600">
                            {cat.subCategory.map((sub) => (
                                <li
                                    key={sub._id}
                                    className="pl-2 border-l-2 border-gray-300"
                                >
                                    <Link href={`/${sub.uniqueName}`}>
                                        • {sub.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MobileCategoryList;
