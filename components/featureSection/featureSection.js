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

const FeatureSection = ({ icon, title, background = false }) => {
    const [showAll, setShowAll] = React.useState(false);

    return (
        <div
            className={`${background ? "pt-5 pb-20" : "py-20"} ${
                background ? "bg-[#f6f7fb]" : ""
            }`}
        >
            <div className="max-w-[1280px] w-[95%] md:w-[75%] lg:w-[55%] mx-auto">
                <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-end">
                    <p className="flex gap-2 items-center text-center">
                        {icon}
                        <span className="font-bold text-3xl">{title}</span>
                    </p>
                    {background && (
                        <div className="max-w-[700px] w-full mt-4 h-[90px] border border-gray-500">
                            Ad
                        </div>
                    )}
                </div>

                <div
                    className={`relative ${
                        showAll ? "h-auto" : "h-[530px]"
                    } mt-6 overflow-hidden`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 h-full">
                        {data?.map((item, index) => (
                            <FeatureCard
                                key={index}
                                title={item.title}
                                param1={item.param1}
                                param2={item.param2}
                                value1={item.value1}
                                value2={item.value2}
                                text={item.text}
                                unknown={item?.unknown}
                                na={item?.na}
                            />
                        ))}
                    </div>

                    {!showAll && (
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                    )}
                </div>

                {!showAll && (
                    <p
                        className="uppercase cursor-pointer font-bold text-sm tracking-wide mt-6 text-[#434343] text-center mt-8"
                        onClick={() => setShowAll(true)}
                    >
                        + show more +
                    </p>
                )}
            </div>
        </div>
    );
};

export default FeatureSection;
