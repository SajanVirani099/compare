"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
// import { categories } from "@/components/utils/mockData";
import Footer from "@/components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoriesAndSubCategories,
  clearError,
} from "../redux/slice/categorySlice";
import SimpleHeader from "@/components/SimpleHeader";
import Navbar from "@/components/Navbar";

const splitIntoColumns = (array, columns) => {
  const cols = Array.from({ length: columns }, () => []);
  array.forEach((item, index) => {
    cols[index % columns].push(item);
  });
  return cols;
};

const Categories = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    category,
    isLoading,
    error: reduxError,
  } = useSelector((state) => state.category);
  const [error, setError] = useState(null);

  // Use useCallback to prevent function recreation on every render
  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      await dispatch(getCategoriesAndSubCategories()).unwrap();
    } catch (err) {
      setError("Failed to load categories. Using fallback data.");
      console.error("Error fetching categories:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if categories are not already loaded
    if (!category || category.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, category]);

  // Use categories from API if available, otherwise fallback to mockData
  const displayCategories = category?.length > 0 ? category : category;
  console.log("🚀 ~ Categories ~ category:", category);

  const columns = 4;
  const categoryColumns = displayCategories
    ? splitIntoColumns(displayCategories, columns)
    : [];

  const handleCategoryClick = (categoryName) => {
    // Navigate to category page or handle category selection
    console.log("Category clicked:", categoryName);
    // You can add navigation logic here
    // router.push(`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleRefresh = useCallback(() => {
    dispatch(clearError());
    fetchCategories();
  }, [dispatch, fetchCategories]);

  const getCategoryIcon = (categoryName) => {
    // Map category names to appropriate icons
    const iconMap = {
      "Mobile Devices": "/icons/1 (2).png", // VR headset icon
      "Computer Components": "/icons/CPU.webp",
      "Entertainment": "/icons/1 (2).png", // VR headset for entertainment
      "Transportation": "/icons/walker.webp",
      "Wearables": "/icons/smart-watch.webp",
      "Computers & Accessories": "/icons/laptop.webp",
      "App & Software": "/icons/code.webp",
      "Home & Garden": "/icons/flower.webp",
      "Photo & Video": "/icons/camera.png", // Camera icon
      "education": "/icons/earth.webp",
      "Travel": "/icons/earth.webp",
      "Sports": "/icons/walker.webp",
      "Vehicle": "/icons/walker.webp",
    };
    return iconMap[categoryName] || "/icons/home.webp";
  };

  const getCategoryColor = (categoryName) => {
    // Map specific categories to colors that match the image
    const colorMap = {
      "Mobile Devices": "bg-blue-100 text-blue-600",
      "Computer Components": "bg-yellow-100 text-yellow-600",
      Entertainment: "bg-gray-100 text-gray-600",
      Transportation: "bg-blue-100 text-blue-600",
      Wearables: "bg-blue-100 text-blue-600",
      "Computers & Accessories": "bg-blue-100 text-blue-600",
      "Apps & Software": "bg-gray-100 text-gray-600",
      "Home & Garden": "bg-red-100 text-red-600",
      "Photo & Video": "bg-blue-100 text-blue-600",
      Education: "bg-gray-100 text-gray-600",
    };
    return colorMap[categoryName] || "bg-gray-100 text-gray-600";
  };

  // Loading skeleton component
  const CategorySkeleton = () => (
    <div className="border border-[#d1d9e6] rounded-xl mx-2 sm:mx-5 bg-[#e6e7ee] shadow-inset p-6 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4"></div>
        <div className="h-6 bg-gray-300 rounded w-32"></div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-gray-300 rounded w-24"></div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 mt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-900 text-sm">Categories</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="flex justify-center gap-4 px-4 mt-4">
          <div className="hidden md:flex w-full h-[300px] border-2 border-dashed border-gray-400 items-center justify-center">
            Ad Box
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Categories</h1>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#E6E7EE]">
        <Navbar />

        <div className="flex justify-center gap-4 px-4 mt-20">
          <div className="hidden md:flex w-full h-[300px] border-2 border-dashed border-gray-400 items-center justify-center">
            Ad Box
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto pb-8 pt-4 border-[2px] border-[#d1d9e6] my-10 shadow-inset">
          <ol className="flex items-center space-x-2 border-b-[2px] border-[#d1d9e6] pb-4 px-4 sm:px-6 lg:px-8 ">
            <li>
              <a href="/" className="text-gray-500 hover:text-gray-700 font-medium text-lg">
                Home
              </a>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium text-lg">Categories</span>
            </li>
          </ol>
          <div className="flex justify-between items-center mt-4 mb-16  px-4 sm:px-6 lg:px-8 ">
            {/* <h1 className="text-4xl font-bold text-gray-900">Categories</h1> */}
          </div>

          {/* Categories Grid Layout (4 columns like the image) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6  px-4 sm:px-6 lg:px-8 ">
            {categoryColumns.slice(0, 23).map(
              (columns, colIndex) => (
                console.log(columns, "-----"),
                (
                  <div key={colIndex}>
                    {columns.map((category, index) => (
                      <div
                        key={index}
                        className="border-[2px] border-[#d1d9e6] rounded-xl bg-[#e6e7ee] hover:shadow-soft transition-all duration-200 mb-14 cursor-pointer !relative"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        {/* Category Header */}
                        <div className="flex items-center bg-[#E6E7EE] p-6 shadow-inset overflow-hidden !rounded-s-xl !rounded-e-xl !rounded-ee-none !rounded-bl-none justify-end">
                          <div
                            className={`!w-24 !h-24 flex items-center justify-center mr-4 shadow-inset rounded-full p-3 absolute -top-10 left-6 bg-[#E6E7EE]`}
                            style={{zIndex: 0}}
                          >
                            <img 
                              src={getCategoryIcon(category.name)} 
                              alt={category.name}
                              className="w-16 h-16 object-contain"
                            />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mt-10">
                            {category.name}
                          </h3>
                        </div>

                        {/* Subcategories List */}
                        {category.subCategory &&
                          category.subCategory.length > 0 && (
                            <div className="">
                              {category.subCategory.map(
                                (subCategory, subIndex) => (
                                  <div
                                    key={subIndex}
                                    className="text-sm text-gray-600 border-b-[#d1d5db] border-b last:border-b-0 btn btn-primary transition-all duration-200 m-3"
                                  >
                                    <span className="flex items-center">
                                      {subCategory.name}
                                      {subCategory.name === "Keyboards" && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          NEW
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                        {/* No subcategories message */}
                        {(!category.subCategory ||
                          category.subCategory.length === 0) && (
                          <div className="text-sm text-gray-400 italic  px-6 py-6">
                            No subcategories available
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )
            )}
          </div>

          {/* Empty state */}
          {displayCategories.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <img 
                  src="/icons/home.webp" 
                  alt="No categories"
                  className="w-16 h-16 opacity-50"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500">
                There are no categories available at the moment.
              </p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Categories;
