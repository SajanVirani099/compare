import React from "react";
import {
    sortByOptions,
    mobileBrands,
    designSpecs,
    filters,
    phones,
} from "@/components/utils/mockData";
import { Range } from "react-range";
import {
    IoSearchOutline,
    IoChevronDownOutline,
    IoChevronUpOutline,
} from "react-icons/io5";
import { useDispatch } from "react-redux";
import { getFilterWiseProducts } from "@/app/redux/slice/productSlice";

const PhoneFilters = () => {
    const dispatch = useDispatch();
    const [values, setValues] = React.useState([9030, 180617]);
    const [selectedBrands, setSelectedBrands] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedSection, setExpandedSection] = React.useState("Weight");
    const [designValues, setDesignValues] = React.useState({
        weight: [8.2, 696],
        thickness: [5.4, 19.9],
        width: [54.8, 92.9],
        height: [109.7, 183.5],
        waterResistance: [], // For checkboxes
    });

    // Call filter-wise products API whenever price range changes
    React.useEffect(() => {
        const payload = {
            priceMin: values[0],
            priceMax: values[1],
        };
        dispatch(getFilterWiseProducts(payload));
    }, [values, dispatch]);

    // Filter brands based on search query
    const filteredBrands = mobileBrands.filter((brand) =>
        brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-[30%] h-screen bg-[#e6e7ee] border border-[#d1d9e6] p-4 rounded-xl shadow-inset sticky top-16 overflow-y-auto md:block hidden">
            {/* Sort By */}
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                SORT BY:
            </h2>
            <select className="w-full p-2.5 rounded-lg bg-[#e6e7ee] border border-[#d1d9e6] text-gray-800 shadow-soft focus:outline-none">
                {sortByOptions.map((item) => (
                    <option key={item.id}>{item.name}</option>
                ))}
            </select>

            {/* Price Range */}
            <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Price
                    </h2>
                    <span className="text-gray-500 cursor-help">?</span>
                </div>
                <div className="bg-[#e6e7ee] border border-[#d1d9e6] px-4 py-4 rounded-xl shadow-soft">
                    <div className="flex items-end h-28 mb-6 gap-[2px]">
                        {[35, 45, 65, 50, 40, 30, 25, 20, 15, 10, 5].map(
                            (height, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-[#b8b9be] rounded-t"
                                    style={{ height: `${height}%` }}
                                />
                            )
                        )}
                    </div>

                    <div className="relative -mt-4 mb-6">
                        <Range
                            step={1}
                            min={9030}
                            max={180617}
                            values={values}
                            onChange={(values) => setValues(values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="h-[2px] w-full bg-gray-300"
                                    style={{
                                        ...props.style,
                                    }}
                                >
                                    <div
                                        className="h-[2px] bg-[#434343] absolute"
                                        style={{
                                            left: `${
                                                ((values[0] - 9030) /
                                                    (180617 - 9030)) *
                                                100
                                            }%`,
                                            width: `${
                                                ((values[1] - values[0]) /
                                                    (180617 - 9030)) *
                                                100
                                            }%`,
                                        }}
                                    />
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    className="h-5 w-5 rounded-full bg-white border-2 border-[#434343] shadow-md focus:outline-none"
                                    style={{
                                        ...props.style,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-between text-sm text-gray-700 px-1 mb-3">
                        <span>{values[0].toLocaleString("en-IN")} ₹</span>
                        <span>{values[1].toLocaleString("en-IN")}+ ₹</span>
                    </div>
                    
                    <select className="w-full p-2 rounded-lg bg-[#e6e7ee] border border-[#d1d9e6] text-gray-800 text-sm shadow-soft focus:outline-none">
                        <option>INR • ₹</option>
                    </select>
                </div>
            </div>

            {/* Brand Filter Section */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    Brand
                </h2>
                {/* Search Input */}
                <div className="relative mb-3">
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#434343] text-xl" />
                    <input
                        type="text"
                        placeholder="Search brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#e6e7ee] border border-[#d1d9e6] text-gray-800 outline-none placeholder-gray-500 shadow-soft"
                    />
                </div>

                {/* Brands List */}
                <div className="bg-[#e6e7ee] border border-[#d1d9e6] rounded-lg max-h-[300px] overflow-y-auto shadow-soft">
                    {filteredBrands.map((brand) => (
                        <label
                            key={brand}
                            className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-[#d1d9e6]/30 border-b border-[#d1d9e6] last:border-b-0"
                        >
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedBrands([
                                            ...selectedBrands,
                                            brand,
                                        ]);
                                    } else {
                                        setSelectedBrands(
                                            selectedBrands.filter(
                                                (b) => b !== brand
                                            )
                                        );
                                    }
                                }}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-800">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Design Section */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    DESIGN
                </h2>
                    <div className="bg-[#e6e7ee] border border-[#d1d9e6] rounded-lg overflow-hidden shadow-soft">
                    {designSpecs.map((spec) => (
                        <div
                            key={spec.id}
                            className="border-b border-[#d1d9e6] last:border-b-0"
                        >
                            <button
                                className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#d1d9e6]/30 transition-colors"
                                onClick={() =>
                                    setExpandedSection(
                                        expandedSection === spec.label
                                            ? null
                                            : spec.label
                                    )
                                }
                            >
                                <span className="text-gray-800">
                                    {spec.label}
                                </span>
                                {expandedSection === spec.label ? (
                                    <IoChevronUpOutline className="text-gray-500" />
                                ) : (
                                    <IoChevronDownOutline className="text-gray-500" />
                                )}
                            </button>

                            {expandedSection === spec.label && (
                                <div className="px-4 pb-4">
                                    {spec.type === "checkbox" ? (
                                        <div className="space-y-2">
                                            {spec.options.map((option) => (
                                                <label
                                                    key={option}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={designValues.waterResistance.includes(
                                                            option
                                                        )}
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                setDesignValues(
                                                                    {
                                                                        ...designValues,
                                                                        waterResistance:
                                                                            [
                                                                                ...designValues.waterResistance,
                                                                                option,
                                                                            ],
                                                                    }
                                                                );
                                                            } else {
                                                                setDesignValues(
                                                                    {
                                                                        ...designValues,
                                                                        waterResistance:
                                                                            designValues.waterResistance.filter(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item !==
                                                                                    option
                                                                            ),
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-gray-700">
                                                        {option}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : spec.min !== undefined ? (
                                        <div className="mt-4">
                                            <Range
                                                step={0.1}
                                                min={spec.min}
                                                max={spec.max}
                                                values={designValues[spec.id]}
                                                onChange={(values) =>
                                                    setDesignValues({
                                                        ...designValues,
                                                        [spec.id]: values,
                                                    })
                                                }
                                                renderTrack={({
                                                    props,
                                                    children,
                                                }) => (
                                                    <div
                                                        {...props}
                                                        className="h-[2px] w-full bg-gray-200"
                                                    >
                                                        <div
                                                            className="h-[2px] bg-[#434343] absolute"
                                                            style={{
                                                                left: `${
                                                                    ((designValues[
                                                                        spec.id
                                                                    ][0] -
                                                                        spec.min) /
                                                                        (spec.max -
                                                                            spec.min)) *
                                                                    100
                                                                }%`,
                                                                width: `${
                                                                    ((designValues[
                                                                        spec.id
                                                                    ][1] -
                                                                        designValues[
                                                                            spec
                                                                                .id
                                                                        ][0]) /
                                                                        (spec.max -
                                                                            spec.min)) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                        {children}
                                                    </div>
                                                )}
                                                renderThumb={({ props }) => (
                                                    <div
                                                        {...props}
                                                        className="h-6 w-6 rounded-full bg-white border-2 border-[#434343] shadow-md focus:outline-none"
                                                        style={{
                                                            ...props.style,
                                                            transform:
                                                                "translate(-50%, -50%)",
                                                        }}
                                                    />
                                                )}
                                            />
                                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                                <span>
                                                    {designValues[spec.id][0]}{" "}
                                                    {spec.unit}
                                                </span>
                                                <span>
                                                    {designValues[spec.id][1]}{" "}
                                                    {spec.unit}
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PhoneFilters;
