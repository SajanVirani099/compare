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
        waterResistance: "", // For radios
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
    const filteredBrands = mobileBrands?.filter((brand) =>
        brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-[30%] h-screen bg-[#e6e7ee] border border-[#d1d9e6] p-4 rounded-xl shadow-inset sticky top-16 overflow-y-auto md:block hidden custom-scrollbar">
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #dadadaff;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #bcbcbcff;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #c0c0c0;
                }
            `}} />
            {/* Sort By */}
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                SORT BY:
            </h2>
            <select className="w-full p-2.5 rounded-lg bg-[#e6e7ee] border border-[#d1d9e6] text-gray-800 shadow-soft focus:outline-none">
                {sortByOptions?.map((item) => (
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
                                    className="h-[6px] w-full bg-[#1b2234] rounded-full"
                                    style={{
                                        ...props.style,
                                    }}
                                >
                                    <div
                                        className="h-full bg-[#e6e7ee] absolute rounded-full shadow-inset"
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
                            renderThumb={({ props, index }) => {
                                const { key, ...restProps } = props;
                                return (
                                <div
                                    key={key}
                                    {...restProps}
                                    className="h-5 w-5 rounded-full bg-[#e6e7ee] flex items-center justify-center focus:outline-none"
                                    style={{
                                        ...restProps.style,
                                        boxShadow: "3px 3px 6px #c8c9cc, -3px -3px 6px #ffffff",
                                    }}
                                >
                                    <div className="absolute -top-10 bg-[#e6e7ee] px-3 py-1.5 rounded-xl text-xs text-[#20293a] shadow-inset whitespace-nowrap font-medium">
                                        {values[index].toFixed(2)}
                                    </div>
                                </div>
                            )}}
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
                <div className="bg-[#e6e7ee] border border-[#d1d9e6] rounded-lg max-h-[300px] overflow-y-auto shadow-soft custom-scrollbar">
                    {filteredBrands?.map((brand) => (
                        <div
                            key={brand}
                            className="form-check px-4 py-2.5 hover:bg-[#d1d9e6]/30 border-b border-[#d1d9e6] last:border-b-0"
                        >
                            <input
                                type="checkbox"
                                id={`brand-${brand.replace(/\s+/g, '-')}`}
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
                            />
                            <label
                                className="form-check-label text-gray-800 w-full"
                                htmlFor={`brand-${brand.replace(/\s+/g, '-')}`}
                            >
                                {brand}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Design Section */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    DESIGN
                </h2>
                    <div className="bg-[#e6e7ee] border border-[#d1d9e6] rounded-lg overflow-hidden shadow-soft">
                    {designSpecs?.map((spec) => (
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
                                        <div className="space-y-3 pt-1">
                                            {spec.options.map((option) => (
                                                <div
                                                    key={option}
                                                    className="form-check"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox-${spec.id}-${option.replace(/\s+/g, '-')}`}
                                                        checked={Array.isArray(designValues[spec.id]) && designValues[spec.id].includes(option)}
                                                        onChange={(e) => {
                                                            const currentValues = Array.isArray(designValues[spec.id]) ? designValues[spec.id] : [];
                                                            if (e.target.checked) {
                                                                setDesignValues({
                                                                    ...designValues,
                                                                    [spec.id]: [...currentValues, option],
                                                                });
                                                            } else {
                                                                setDesignValues({
                                                                    ...designValues,
                                                                    [spec.id]: currentValues.filter((item) => item !== option),
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label text-gray-700 font-medium"
                                                        htmlFor={`checkbox-${spec.id}-${option.replace(/\s+/g, '-')}`}
                                                    >
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    ) : spec.type === "radio" ? (
                                        <div className="space-y-3 pt-1">
                                            {spec.options.map((option) => (
                                                <div
                                                    key={option}
                                                    className="form-check"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`radio-${spec.id}`}
                                                        id={`radio-${spec.id}-${option}`}
                                                        checked={designValues[spec.id] === option}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setDesignValues({
                                                                    ...designValues,
                                                                    [spec.id]: option
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label text-gray-700 font-medium"
                                                        htmlFor={`radio-${spec.id}-${option}`}
                                                    >
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    ) : spec.min !== undefined ? (
                                        <div className="mt-12 px-2">
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
                                                        className="h-[6px] w-full bg-[#1b2234] rounded-full"
                                                        style={{ ...props.style }}
                                                    >
                                                        <div
                                                            className="h-full bg-[#e6e7ee] absolute rounded-full shadow-inset"
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
                                                renderThumb={({ props, index }) => {
                                                    const { key, ...restProps } = props;
                                                    return (
                                                    <div
                                                        key={key}
                                                        {...restProps}
                                                        className="h-5 w-5 rounded-full bg-[#e6e7ee] flex items-center justify-center focus:outline-none"
                                                        style={{
                                                            ...restProps.style,
                                                            boxShadow: "3px 3px 6px #c8c9cc, -3px -3px 6px #ffffff",
                                                        }}
                                                    >
                                                        <div className="absolute -top-10 bg-[#e6e7ee] px-2 py-1.5 rounded-xl text-xs text-[#20293a] shadow-inset whitespace-nowrap font-medium">
                                                            {designValues[spec.id][index].toFixed(2)}
                                                        </div>
                                                    </div>
                                                )}}
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
