import React from "react";
import FeatureCard from "../featureCard/featureCard";

const data = [
    {
        title: "Weight",
        param1: "199 g",
        param2: "8.1 g",
        value1: 50,
        value2: 75,
        text: "We consider a lower weight better because lighter devices are more comfortable to carry. A lower weight is also an advantage for home appliances, as it makes transportation easier, and for many other types of products.",
    },
    {
        title: "Thickness",
        param1: "8.2 mm",
        param2: "8.1 mm",
        value1: 50,
        value2: 75,
        text: "The thickness (or depth) of the product.",
    },
    {
        title: "width",
        param1: "77 mm",
        param2: "76.3 mm",
        value1: 50,
        value2: 75,
        text: "The width represents the horizontal dimension of the product.",
    },
    {
        title: "height",
        param1: "163.3 mm",
        param2: "165.7 mm",
        value1: 50,
        value2: 75,
        text: "The height represents the vertical dimension of the product.",
    },
    {
        title: "water resistance",
        param1: "Water resistance",
        param2: "Water resistance",
        value1: 50,
        value2: 75,
        text: "The level of water resistance that the device has.",
    },
    {
        title: "Ingress Protection (IP) rating",
        param1: "IP64",
        param2: "IP64",
        value1: 50,
        value2: 75,
        text: "The first number of the IP rating refers to protection against dust, while the second number refers to protection against liquid. E.g. a first number of 6 denotes that it is completely dustproof, and a second number of 7 denotes that the device can withstand full immersion in water.",
    },
    {
        title: "Volume",
        param1: "105.63 cm3",
        param2: "102.41 cm3",
        value1: 50,
        value2: 75,
        text: "Volume is the quantity of three-dimensional space enclosed by the product's chassis or, in simpler terms, the space the product occupies.",
    },
    {
        title: "Lowest potential operating temperature",
        unknown: true,
        text: "The minimum temperature at which the device can perform to the optimal level.",
    },
    {
        title: "Maximum operating temperature",
        unknown: true,
        text: "The maximum temperature at which the device can perform to the optimal level.",
    },
    {
        title: "can be folded",
        na: true,
        text: "It can be folded into a more compact form.",
    },
    {
        title: "Has a physical QWERTY keyboard",
        na: true,
        text: "Text messaging is much faster due to a hardware keyboard.",
    },
    {
        title: "French Repairability Index",
        unknown: true,
        text: "This is a score from 0–10 which informs consumers on how easy it is to repair a device. It is designed to reduce e-waste and planned obsolescence. The score is calculated from various criteria such as ease of disassembly and availability of spare parts.",
    },
];

const FeatureSection = ({
    icon,
    title,
    background = false,
    subfeatures = [],
    productNames = [],
    isSingleProduct = false,
    score = 0,
}) => {
    const [showAll, setShowAll] = React.useState(false);

    // Use subfeatures from API if available, otherwise use default data
    const displayData = subfeatures && subfeatures.length > 0 ? subfeatures : data;

    // Normalized score 0–10 for single-product spec view
    const numericScore = Number(score) || 0;
    const sectionScore = Math.max(0, Math.min(10, numericScore));
    const percent = (sectionScore / 10) * 100;
    const circleColor = sectionScore >= 8 ? "#24B200" : "#F29A1F";

    // Single-product table-style layout
    if (isSingleProduct) {
        return (
            <div
                className={`${background ? "pt-5 pb-10 sm:pb-20" : "py-10 sm:py-20"} ${
                    background ? "bg-[#f6f7fb]" : ""
                }`}
            >
                <div className="max-w-[1280px] w-[95%] md:w-[75%] lg:w-[55%] mx-auto px-2 sm:px-0">
                    {/* Section Header - 0 Level (Flat) */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-end mb-3 sm:mb-4">
                        <p className="flex gap-2 items-center text-center">
                            {icon}
                            <span className="font-bold text-xl sm:text-2xl md:text-3xl text-[#434343]">{title}</span>
                        </p>
                    </div>
                    {/* Content - Neumorphic Theme */}
                    <div className="rounded-2xl bg-[#E6E7EE] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] overflow-hidden">
                        <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 border-b border-[#d1d9e6]">
                            <span className="text-xs sm:text-sm font-semibold text-[#434343]">
                                Full specifications
                            </span>
                            <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(${circleColor} ${percent}%, #e5e7eb ${percent}%)`,
                                    }}
                                />
                                <div className="absolute inset-[3px] sm:inset-[4px] rounded-full bg-[#E6E7EE] flex items-center justify-center shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]">
                                    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-[#434343]">
                                        {sectionScore}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
                            {displayData?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl mb-2 sm:mb-2.5 bg-[#E6E7EE] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                                >
                                    <span className="text-xs sm:text-sm text-[#555555] mr-2 sm:mr-4 flex-1 min-w-0">
                                        <span className="block truncate">{item.title}</span>
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-[#222222] text-right ml-2 sm:ml-4 flex-shrink-0">
                                        {item.param1 || "N/A"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Multi-product comparison table layout (2–3 products)
    const productCount = Math.min(3, productNames?.length || 0);

    return (
        <div
            className={`${background ? "pt-5 pb-10 sm:pb-20" : "py-10 sm:py-20"} ${
                background ? "bg-[#f6f7fb]" : ""
            }`}
        >
            <div className="max-w-[1280px] w-[95%] md:w-[75%] lg:w-[55%] mx-auto px-2 sm:px-0">
                {/* Section Header - 0 Level (Flat) */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-end mb-3 sm:mb-4">
                    <p className="flex gap-2 items-center text-center">
                        {icon}
                        <span className="font-bold text-xl sm:text-2xl md:text-3xl text-[#434343]">{title}</span>
                    </p>
                    {background && (
                        <div className="hidden md:block max-w-[700px] w-full mt-4 h-[90px] border border-gray-500">
                            Ad
                        </div>
                    )}
                </div>
                {/* Content - Neumorphic Theme */}
                {/* Mobile: Horizontal scrollable table */}
                <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-2 px-2">
                    <div className="rounded-2xl bg-[#E6E7EE] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] overflow-hidden min-w-[600px]">
                        {/* Header row with product names */}
                        <div
                            className="grid text-xs font-semibold text-[#434343] border-b border-[#d1d9e6] bg-[#E6E7EE]"
                            style={{
                                gridTemplateColumns: `180px repeat(${Math.max(
                                    productCount,
                                    2
                                )}, minmax(120px, 1fr))`,
                            }}
                        >
                            <div className="px-3 py-2.5 border-r border-[#d1d9e6]">
                                Specification
                            </div>
                            {Array.from({ length: Math.max(productCount, 2) }).map(
                                (_, idx) => (
                                    <div
                                        key={idx}
                                        className="px-3 py-2.5 text-center border-r last:border-r-0 border-[#d1d9e6] truncate"
                                    >
                                        {productNames[idx] || `Product ${idx + 1}`}
                                    </div>
                                )
                    )}
                </div>

                        {/* Spec rows */}
                        <div className="divide-y divide-[#d1d9e6]">
                            {displayData?.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid text-xs text-[#222222] bg-[#E6E7EE]"
                                    style={{
                                        gridTemplateColumns: `180px repeat(${Math.max(
                                            productCount,
                                            2
                                        )}, minmax(120px, 1fr))`,
                                    }}
                                >
                                    <div className="px-3 py-2.5 border-r border-[#d1d9e6] text-[#d02626] font-medium">
                                        {item.title}
                                    </div>
                                    <div className="px-3 py-2.5 border-r border-[#d1d9e6] text-[#333333] text-center">
                                        {item.param1 || "-"}
                                    </div>
                                    <div className="px-3 py-2.5 border-r border-[#d1d9e6] text-[#333333] text-center">
                                        {item.param2 || "-"}
                                    </div>
                                    {Math.max(productCount, 2) > 2 && (
                                        <div className="px-3 py-2.5 text-[#333333] text-center">
                                            {item.param3 || "-"}
                                        </div>
                                    )}
                                </div>
                        ))}
                        </div>
                    </div>
                    </div>

                {/* Desktop: Normal table */}
                <div className="hidden sm:block rounded-2xl bg-[#E6E7EE] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] overflow-hidden">
                    {/* Header row with product names */}
                    <div
                        className="grid text-xs sm:text-sm font-semibold text-[#434343] border-b border-[#d1d9e6] bg-[#E6E7EE]"
                        style={{
                            gridTemplateColumns: `2fr repeat(${Math.max(
                                productCount,
                                2
                            )}, minmax(0, 1.5fr))`,
                        }}
                    >
                        <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-r border-[#d1d9e6]">
                            Specification
                        </div>
                        {Array.from({ length: Math.max(productCount, 2) }).map(
                            (_, idx) => (
                                <div
                                    key={idx}
                                    className="px-3 sm:px-4 py-2 sm:py-2.5 text-center border-r last:border-r-0 border-[#d1d9e6] truncate"
                                >
                                    {productNames[idx] || `Product ${idx + 1}`}
                                </div>
                            )
                    )}
                </div>

                    {/* Spec rows */}
                    <div className="divide-y divide-[#d1d9e6]">
                        {displayData?.map((item, index) => (
                            <div
                                key={index}
                                className="grid text-xs sm:text-sm text-[#222222] bg-[#E6E7EE]"
                                style={{
                                    gridTemplateColumns: `2fr repeat(${Math.max(
                                        productCount,
                                        2
                                    )}, minmax(0, 1.5fr))`,
                                }}
                            >
                                <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-r border-[#d1d9e6] text-[#d02626] font-medium truncate">
                                    {item.title}
                                </div>
                                <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-r border-[#d1d9e6] text-[#333333] truncate text-center">
                                    {item.param1 || "-"}
                                </div>
                                <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-r border-[#d1d9e6] text-[#333333] truncate text-center">
                                    {item.param2 || "-"}
                                </div>
                                {Math.max(productCount, 2) > 2 && (
                                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-[#333333] truncate text-center">
                                        {item.param3 || "-"}
                                    </div>
                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
