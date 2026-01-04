"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAndSubCategories } from "../redux/slice/categorySlice";
import { subcategoryProducts } from "../redux/slice/productSlice"; // Assuming this is the action for fetching subcategory products
import { imageUrl } from "@/components/utils/config";
import Navbar from "@/components/Navbar";
import { Centerwarning } from "@/components/utils/toast";
import ImageWithShimmer from "@/components/ImageWithShimmer";

// Animated circular score badge used in product cards
const CircularScore = React.memo(({ value = 58 }) => {
  const [progressPercent, setProgressPercent] = useState(0); // 0-100 for border fill
  const [displayCount, setDisplayCount] = useState(0); // counter for points text

  useEffect(() => {
    let rafId;
    let isCancelled = false;
    let startTimestamp = null;

    const fullSweepDurationMs = 800; // first go 0 -> 100%
    const settleDurationMs = 500; // then 100% -> value%
    const counterDurationMs = 1200; // 0 -> value

    const animate = (timestamp) => {
      if (isCancelled) return;
      if (startTimestamp === null) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      // Border animation
      if (elapsed <= fullSweepDurationMs) {
        const p = Math.min(1, elapsed / fullSweepDurationMs) * 100;
        setProgressPercent(p);
      } else if (elapsed <= fullSweepDurationMs + settleDurationMs) {
        const afterFull = elapsed - fullSweepDurationMs;
        const t = Math.min(1, afterFull / settleDurationMs);
        const p = 100 - t * (100 - value);
        setProgressPercent(p);
      } else {
        setProgressPercent(value);
      }

      // Counter animation
      if (elapsed <= counterDurationMs) {
        const t = Math.min(1, elapsed / counterDurationMs);
        setDisplayCount(Math.round(t * value));
      } else {
        setDisplayCount(value);
      }

      if (
        elapsed <
        Math.max(fullSweepDurationMs + settleDurationMs, counterDurationMs)
      ) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    rafId = window.requestAnimationFrame(animate);
    return () => {
      isCancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [value]);

  return (
    <div
      className="relative h-14 w-14 rounded-full p-[6px]"
      style={{
        background: `conic-gradient(#F98A1A 0 ${progressPercent}%, #e5e7eb ${progressPercent}% 100%)`,
        zIndex: 2,
      }}
    >
      <div className="h-full w-full rounded-full bg-[#e6e7ee] shadow-inset flex flex-col items-center justify-center leading-tight">
        <span className="text-lg font-extrabold">{displayCount}</span>
        <span className="text-[10px] font-semibold">Points</span>
      </div>
    </div>
  );
});
CircularScore.displayName = "CircularScore";

const QuickCompare = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { category } = useSelector((state) => state.category);
  const subCategoryProductss = useSelector(
    (state) => state.product.subCategoryProducts
  );
  const isProductSkeleton = useSelector((state) => state.product.isSkeleton);
  console.log(
    "🚀 ~ QuickCompare ~ subCategoryProductss:",
    subCategoryProductss
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [comparisonList, setComparisonList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState([]); // Store product details

  useEffect(() => {
    dispatch(getCategoriesAndSubCategories());
    // Load comparison list from localStorage
    try {
      const existingRaw = localStorage.getItem("comparisonList");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      setComparisonList(existing);

      // Load product details if stored
      const productsRaw = localStorage.getItem("comparisonProducts");
      if (productsRaw) {
        const products = JSON.parse(productsRaw);
        setComparisonProducts(products);
      }
    } catch (error) {
      console.error("Error loading comparison list:", error);
      setComparisonList([]);
    }
  }, [dispatch]);

  // Listen for comparison list updates from other components
  useEffect(() => {
    const handleComparisonUpdate = () => {
      try {
        const existingRaw = localStorage.getItem("comparisonList");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        setComparisonList(existing);

        const productsRaw = localStorage.getItem("comparisonProducts");
        if (productsRaw) {
          const products = JSON.parse(productsRaw);
          setComparisonProducts(products);
        }
      } catch (error) {
        console.error("Error updating comparison list:", error);
      }
    };

    window.addEventListener("comparisonListUpdated", handleComparisonUpdate);
    return () => {
      window.removeEventListener(
        "comparisonListUpdated",
        handleComparisonUpdate
      );
    };
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // Reset subcategory when a new category is selected
    // Reset products if needed by dispatching an action to clear subCategoryProducts
  };

  const handleSubCategorySelect = (subCat) => {
    setSelectedSubCategory(subCat);
    dispatch(subcategoryProducts(subCat?.uniqueName)); // Fetch products for the selected subcategory
  };

  // Prefill: Set default random selections for category, subcategory, and product
  useEffect(() => {
    if (prefilled) return;
    if (!category || category.length === 0) return;

    try {
      // First try to use localStorage data if available
      const raw = localStorage.getItem("selectedCategories");
      const picked = raw ? JSON.parse(raw) : [];

      let chosenCategory = null;

      if (picked && picked.length > 0) {
        // find first available category from picked that exists and has subcategories
        chosenCategory = category.find((c) => picked.includes(c.name));
      }

      // If no valid category from localStorage, pick a random one
      if (
        !chosenCategory ||
        !chosenCategory.subCategory ||
        chosenCategory.subCategory.length === 0
      ) {
        // Filter categories that have subcategories
        const categoriesWithSubs = category.filter(
          (c) => c.subCategory && c.subCategory.length > 0
        );
        if (categoriesWithSubs.length === 0) return;

        // Randomly select a category
        chosenCategory =
          categoriesWithSubs[
            Math.floor(Math.random() * categoriesWithSubs.length)
          ];
      }

      // randomly pick a subcategory
      const randomSub =
        chosenCategory.subCategory[
          Math.floor(Math.random() * chosenCategory.subCategory.length)
        ];

      setSelectedCategory(chosenCategory);
      setSelectedSubCategory(randomSub);
      dispatch(subcategoryProducts(randomSub?.uniqueName));
      setPrefilled(true);
    } catch (e) {
      // ignore
    }
  }, [category, dispatch, prefilled]);

  // When products load, place one random product in comparisonList if empty
  useEffect(() => {
    if (!selectedSubCategory) return;
    if (!subCategoryProductss || subCategoryProductss.length === 0) return;
    if (comparisonList.length > 0) return;

    const randomProduct =
      subCategoryProductss[
        Math.floor(Math.random() * subCategoryProductss.length)
      ];
    if (randomProduct && randomProduct._id) {
      const updated = [randomProduct._id];
      setComparisonList(updated);
      setComparisonProducts([randomProduct]);

      try {
        localStorage.setItem("comparisonList", JSON.stringify(updated));
        localStorage.setItem(
          "comparisonProducts",
          JSON.stringify([randomProduct])
        );
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }

      // notify floating bar if present
      window.dispatchEvent(new Event("comparisonListUpdated"));
    }
  }, [selectedSubCategory, subCategoryProductss, comparisonList.length]);

  // Update comparison products when subCategoryProductss or comparisonList changes
  useEffect(() => {
    if (!subCategoryProductss || subCategoryProductss.length === 0) return;
    if (comparisonList.length === 0) return;

    // Update product details for products in comparison list
    setComparisonProducts((prevProducts) => {
      const updatedProducts = comparisonList
        .map((id) => {
          // First try to find in current products
          const currentProduct = subCategoryProductss.find((p) => p._id === id);
          if (currentProduct) return currentProduct;

          // Otherwise, try to find in previously stored products
          const storedProduct = prevProducts.find((p) => p._id === id);
          return storedProduct || null;
        })
        .filter(Boolean);

      // Only update if we have changes
      const hasChanges =
        updatedProducts.length !== prevProducts.length ||
        updatedProducts.some(
          (p, idx) => !prevProducts[idx] || prevProducts[idx]._id !== p._id
        );

      if (hasChanges && updatedProducts.length > 0) {
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
  }, [subCategoryProductss, comparisonList]);

  const handleAddToComparison = (id) => {
    // allow up to 3 items total
    if (comparisonList.includes(id)) return;
    if (comparisonList.length >= 3) {
      Centerwarning("You can select a maximum of 3 products.");
      return;
    }

    // Find the product details
    const product = subCategoryProductss.find((p) => p._id === id);

    const updated = [...comparisonList, id];
    setComparisonList(updated);

    // Store product details along with IDs
    const updatedProducts = product
      ? [...comparisonProducts.filter((p) => p._id !== id), product]
      : comparisonProducts;
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

  const findProductById = (id) => {
    return (
      subCategoryProductss.find((p) => p._id === id) ||
      comparisonProducts.find((p) => p._id === id)
    );
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
      Centerwarning("Please select at least 2 products to compare.");
      return;
    }
    // Build compare URL using titles (prefer uniqueTitle if available)
    const compareValues = comparisonList.map((id, idx) => {
      const product = findProductById(id);
      const label = product?.uniqueTitle;
      return encodeURIComponent(label);
    });

    const compareUrl = `/compare/${compareValues.join(",")}`;
    router.push(compareUrl);
  };

  return (
    <div className="min-h-screen bg-[#E6E7EE]">
      <Navbar />
      <div className="p-5 md:px-0 md:pt-[90px]">
        <div className="flex justify-center gap-4 px-4 mb-16">
          <div className="hidden md:flex w-full h-[300px] border-2 border-dashed border-gray-400 items-center justify-center">
            Ad Box
          </div>
        </div>
        <div className="max-w-7xl mx-auto pb-8 pt-4 border-[2px] border-[#d1d9e6] my-10 shadow-inset">
          <ol className="flex items-center space-x-2 border-b-[2px] border-[#d1d9e6] pb-4 px-4 sm:px-6 lg:px-8 ">
            <li>
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 font-medium text-lg"
              >
                Home
              </a>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium text-lg">
                Quick Compare
              </span>
            </li>
          </ol>
          <div className="">
            {/* Category Selection */}
            <div className="border-b-[2px] border-[#d1d9e6]">
              <div
                className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {category?.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 btn whitespace-nowrap flex-shrink-0 ${
                      selectedCategory?._id === cat._id
                        ? "btn-primary-focus"
                        : "btn-primary"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories Display */}
            {selectedCategory && (
              <div className="border-b-[2px] border-[#d1d9e6]">
                {selectedCategory.subCategory.length > 0 ? (
                  <div
                    className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {selectedCategory.subCategory.map((subCat) => (
                      <button
                        key={subCat._id}
                        onClick={() => handleSubCategorySelect(subCat)}
                        className={`px-4 py-2 rounded-lg btn whitespace-nowrap flex-shrink-0 ${
                          selectedSubCategory?._id === subCat._id
                            ? "btn-primary-focus"
                            : "btn-primary"
                        }`}
                      >
                        {subCat.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 p-5">
                    No subcategories available.
                  </p>
                )}
              </div>
            )}

            {/* Products Display */}
            {isProductSkeleton ? (
              <div className="pt-6">
                <div className="px-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset w-full relative overflow-hidden"
                      >
                        <div className="p-4 animate-pulse">
                          <div className="w-full h-72 bg-gray-300/60 rounded-md" />
                          <div className="h-5 bg-gray-300/60 rounded mt-4 w-3/4" />
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="h-4 bg-gray-300/60 rounded" />
                            <div className="h-4 bg-gray-300/60 rounded" />
                            <div className="h-4 bg-gray-300/60 rounded" />
                            <div className="h-4 bg-gray-300/60 rounded" />
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <div className="h-14 w-14 rounded-full p-[6px] bg-gray-300/60" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectedSubCategory && subCategoryProductss?.length > 0 ? (
              <div className="pt-6">
                <div className="px-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {subCategoryProductss.map((product) => (
                      <React.Fragment key={product._id}>
                        <div className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset w-full flex items-center justify-center relative">
                          <div className="p-4 mt-14">
                            <ImageWithShimmer
                              src={`${imageUrl}${product.thumbnail}`}
                              alt={product.title}
                              height={288}
                              width={150}
                              className="object-cover w-full h-72 rounded-tl-[15px] rounded-tr-[15px]"
                            />
                            <h2
                              className="text-lg font-semibold my-3 hover:text-[#F98A1A] transition-all duration-300 cursor-pointer"
                              onClick={() =>
                                router.push(`/compare/${product?.uniqueTitle}`)
                              }
                            >
                              {" "}
                              {product.title || "Product Name"}
                            </h2>

                            {product?.featureData &&
                            product.featureData.length > 0 ? (
                              <div className="grid grid-cols-2 gap-3 text-gray-600 mt-2 border-t-[2px] border-[#d1d9e6] pt-3">
                                {product.featureData
                                  .slice(0, 4)
                                  .map((feature, index) => (
                                    <div
                                      key={feature._id || index}
                                      className="flex items-center gap-2"
                                    >
                                      {/* Feature icon from API */}
                                      {feature?.featureId?.icon ? (
                                        <img
                                          src={`${imageUrl}${feature.featureId.icon}`}
                                          alt={
                                            feature.featureId.featureName ||
                                            "Feature"
                                          }
                                          className="w-5 h-5 object-contain flex-shrink-0"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0"></div>
                                      )}
                                      <span className="text-sm truncate">
                                        {feature?.featureId?.unit ||
                                          feature?.featureId?.featureName ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            ) : null}
                          </div>
                          <div className="absolute top-9 right-10">
                            <button
                              className="add-btn no-checkmark relative"
                              // style={{ zIndex: "101" }}
                              onClick={() =>
                                comparisonList.includes(product._id)
                                  ? handleRemoveFromComparison(product._id)
                                  : handleAddToComparison(product._id)
                              }
                            >
                              <input
                                checked={comparisonList.includes(product._id)}
                                type="checkbox"
                                readOnly
                              />
                              {/* <div className="checkmark"></div> */}
                              <span className="!absolute !-top-[15px] !-left-4 pointer-events-none">
                                {comparisonList.includes(product._id) ? (
                                  <svg
                                    className="plusIcon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    height={30}
                                    width={30}
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M18.3 5.71a1 1 0 010 1.41L13.41 12l4.89 4.88a1 1 0 11-1.42 1.42L12 13.41l-4.88 4.89a1 1 0 11-1.42-1.42L10.59 12 5.7 7.12A1 1 0 117.12 5.7L12 10.59l4.88-4.89a1 1 0 011.42 0z"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="plusIcon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 30 30"
                                    height={30}
                                    width={30}
                                  >
                                    <g mask="url(#mask0_21_345)">
                                      <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                                    </g>
                                  </svg>
                                )}
                              </span>
                            </button>
                          </div>
                          <div className="absolute top-3 left-3">
                            <CircularScore value={58} />
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Comparison Dropdown */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-2 left-0 right-0 z-[9999]">
          <div className="mx-auto max-w-7xl px-2">
            <div className="bg-[#e6e7ee] rounded-xl shadow-lg border border-gray-200 w-full shadow-inset mt-4">
              {/* Header */}
              <div
                className="bg-[#F98A1A] text-white px-4 py-3 rounded-t-xl rounded-bl-xl cursor-pointer flex items-center justify-between shadow-soft"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    vs
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
                      // Find the product details from current products or stored products
                      const product =
                        subCategoryProductss.find((p) => p._id === productId) ||
                        comparisonProducts.find((p) => p._id === productId);

                      console.log("product", product);

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
                              <ImageWithShimmer
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
                        // Scroll to top of products section
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
      )}
    </div>
  );
};

export default QuickCompare;
