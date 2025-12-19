"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { Box, Collapse, Slider, Switch } from "@mui/material";
import Navbar from "@/components/Navbar";
import { getFilter, subcategoryProducts } from "@/app/redux/slice/productSlice";
import { BASE_URL, imageUrl } from "@/components/utils/config";

function valuetext(value) {
    return `${value}°C`;
}

const ProductPage = () => {
    const subCategoryProducts = useSelector(
        (state) => state.product.subCategoryProducts
    );

    const { company, priceRange, filterSubfeatures } = useSelector(
        (state) => state.product
    );
    const pathname = usePathname();
    const [productId, setProductId] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [openSliders, setOpenSliders] = useState({
        weight: false,
        thickness: false,
        width: false,
        height: false,
    });
    const dispatch = useDispatch();
    const options = [
        "Release date",
        "Versus score",
        "Popularity",
        "Price (low to high)",
        "Price (high to low)",
        "User rating",
        "Screen size",
        "Battery power",
    ];
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const currencies = [
        { code: "USD", symbol: "US$" },
        { code: "EUR", symbol: "€" },
        { code: "JPY", symbol: "¥" },
        { code: "GBP", symbol: "£" },
        { code: "RUB", symbol: "₽" },
        { code: "AUD", symbol: "A$" },
        { code: "CAD", symbol: "C$" },
        { code: "CHF", symbol: "CHF" },
        { code: "CNY", symbol: "元" },
        { code: "SEK", symbol: "kr" },
        { code: "TRY", symbol: "₺" },
        { code: "BRL", symbol: "R$" },
        { code: "IDR", symbol: "Rp" },
        { code: "INR", symbol: "₹" },
    ];

    const [selectedCurrency, setSelectedCurrency] = useState(
        currencies[0].code
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [weight, setWeight] = useState([47, 696]);
    const [thickness, setThickness] = useState([2, 31]);
    const [width, setWidth] = useState([42, 254]);
    const [height, setHeight] = useState([67, 221]);

    const brands = [
        "360 N7",
        "Acer",
        "AGM",
        "Alcatel",
        "Allview",
        "Amazon",
        "Apple",
        "Asus",
        "BlackBerry",
        "Google",
        "HTC",
        "Huawei",
        "LG",
        "Motorola",
        "Nokia",
        "OnePlus",
        "Oppo",
        "Samsung",
        "Sony",
        "Xiaomi",
    ];

    useEffect(() => {
        const category = localStorage.getItem("cat");
        setSubCategory(category);
    }, [subCategory]);

    const filteredBrands = brands.filter((brand) =>
        brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectBrand = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter((item) => item !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    useEffect(() => {
        const pathParts = pathname.split("/");
        const id = pathParts[pathParts.length - 1];
        if (id) {
            setProductId(id);
        }
    }, [pathname]);

    useEffect(() => {
        if (productId) {
            dispatch(subcategoryProducts(productId));
            dispatch(getFilter(productId));
        }
    }, [productId, dispatch]);

    const handleChangeWeight = (event, newValue) => {
        setWeight(newValue);
    };

    const handleChangeThickness = (event, newValue) => {
        setThickness(newValue);
    };
    const handleChangeWidth = (event, newValue) => {
        setWidth(newValue);
    };

    const handleChangeHeight = (event, newValue) => {
        setHeight(newValue);
    };
    const toggleOpen = (slider) => {
        setOpenSliders((prev) => ({
            ...prev,
            [slider]: !prev[slider],
        }));
    };
    return (
        <>
            <div className="pb-14 mb-5 navigationContainer">
                <Navbar />
                <div className="header w-100 mt-14 partnershipMain w-1176 mx-auto">
                    <div className="m-auto">
                        <h1 className="text-white title font-bold">
                            {subCategory} comparison
                        </h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mx-auto md:max-w-7xl">
                <div className="rounded-xl hidden md:block border border-right border-gray-300 p-3">
                    <label htmlFor="sort" className="font-bold text-sm">
                        SORT BY
                    </label>
                    <select
                        value={selectedOption}
                        onChange={(e) => {
                            setSelectedOption(e.target.value);
                        }}
                        className="bg-white w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:border-blue-500 shadow-md"
                    >
                        {options.map((option, index) => (
                            <option
                                key={index}
                                value={option}
                                className="px-4 py-2"
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="mt-3 p-4 bg-white rounded-lg shadow-lg">
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Search brand..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute right-2 top-2 h-6 w-6 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3.5a7.5 7.5 0 016.65 13.15z"
                                />
                            </svg>
                        </div>
                        <div className="h-48 overflow-y-auto border border-gray-300 rounded w-full mt-3">
                            {company?.length > 0 ? (
                                company?.map((brand) => (
                                    <label
                                        key={brand}
                                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(
                                                brand
                                            )}
                                            onChange={() => {
                                                handleSelectBrand(brand);
                                            }}
                                            className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            {brand}
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-2">
                                    No brands found
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-lg mt-3">
                        <h3 className="text-sm font-bold text-black mb-4">
                            DESIGN
                        </h3>
                        <ul>
                            {filterSubfeatures?.length > 0 ? (
                                <>
                                    {filterSubfeatures.map((subfeature) => (
                                        <li
                                            key={subfeature}
                                            className="design-menu-item"
                                            // onClick={() => handleSelectSubfeature(subfeature)}
                                        >
                                            <Box className="mb-4 px-3 py-2 rounded-lg">
                                                <div
                                                    className={`flex justify-between items-center cursor-pointer`}
                                                >
                                                    <h4 className="text-sm font-semibold">
                                                        {
                                                            subfeature?.featureName
                                                        }
                                                    </h4>
                                                </div>
                                                {subfeature?.subfeatures?.map(
                                                    (data) => {
                                                        return (
                                                            <>
                                                                <Slider
                                                                    getAriaLabel={() =>
                                                                        "Weight range"
                                                                    }
                                                                    value={
                                                                        weight
                                                                    }
                                                                    onChange={
                                                                        handleChangeWeight
                                                                    }
                                                                    valueLabelDisplay="auto"
                                                                    getAriaValueText={
                                                                        valuetext
                                                                    }
                                                                    min={
                                                                        data?.minValue
                                                                    }
                                                                    max={
                                                                        data?.maxValue
                                                                    }
                                                                />
                                                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                                                    <span>
                                                                        {
                                                                            data?.minValue
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            data?.maxValue
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </Box>
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <p>No subfeatures found</p>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="mx-6 md:mx-0 col-span-3 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subCategoryProducts?.map((product) => (
                        <div key={product._id} className="product-card mt-3">
                            <div className="product-info flex items-center">
                                <img
                                    src={`${imageUrl}${product.thumbnail}`}
                                    alt={product.title}
                                    height={100}
                                    width={150}
                                    style={{ height: "150px", width: "200px" }}
                                />
                                <div className="ml-4">
                                    <h2 className="font-bold text-left">
                                        {product.title}
                                    </h2>
                                    {/* <p>Score: {product.scoreValue}</p>
                  <p>Price: ${product.price}</p> */}
                                    <div className="features grid grid-cols-2 mt-12">
                                        {product.subfeatureData.map(
                                            (feature) => (
                                                <div
                                                    key={feature._id}
                                                    className="feature"
                                                >
                                                    <img
                                                        src={`${imageUrl}${feature.icon}`}
                                                        alt={feature.name}
                                                    />
                                                    <span className="text-features text-xs font-medium">
                                                        {feature.name}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .product-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }
                .product-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    text-align: center;
                }

                .features {
                    // display: flex;
                    // flex-wrap: wrap;
                    // justify-content: center;
                    gap: 10px;
                }
                .feature {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .feature img {
                    width: 20px;
                    height: 20px;
                }
            `}</style>
        </>
    );
};

export default ProductPage;
