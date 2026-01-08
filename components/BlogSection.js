/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { blogGet } from "../app/redux/slice/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, imageUrl } from "./utils/config";
import Skeleton from "react-loading-skeleton";
import { colors } from "./utils/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { subcategoryProducts } from "../app/redux/slice/productSlice";
import ImageWithShimmer from "./ImageWithShimmer";

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
      className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full p-[4px] sm:p-[5px] md:p-[6px]"
      style={{
        background: `conic-gradient(#F98A1A 0 ${progressPercent}%, #e5e7eb ${progressPercent}% 100%)`,
        zIndex: 2,
      }}
    >
      <div className="h-full w-full rounded-full bg-[#e6e7ee] shadow-inset flex flex-col items-center justify-center leading-tight">
        <span className="text-sm sm:text-base md:text-lg font-extrabold">{displayCount}</span>
        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold">Points</span>
      </div>
    </div>
  );
});
CircularScore.displayName = "CircularScore";

// Utility to split blog array into N columns
const splitIntoColumns = (array, columns) => {
  const cols = Array.from({ length: columns }, () => []);
  array.forEach((item, index) => {
    cols[index % columns].push(item);
  });
  return cols;
};

const BlogSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { category } = useSelector((state) => state.category);
  const { subCategoryProducts } = useSelector((state) => state.product);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([null, null, null, null, null]);
  const [isFirstProductLoaded, setIsFirstProductLoaded] = useState(false);
  const [isLoadingRandomProduct, setIsLoadingRandomProduct] = useState(false);

  useEffect(() => {
    dispatch(blogGet());
  }, [dispatch]);

  // Sync selected products from quick-compare page (localStorage)
  useEffect(() => {
    const loadComparisonProducts = () => {
      try {
        const productsRaw = localStorage.getItem("comparisonProducts");
        if (productsRaw) {
          const products = JSON.parse(productsRaw);
          if (products && products.length > 0) {
            // Update first 3 slots (0, 1, 2) with products from comparison list
            setSelectedProducts((prevProducts) => {
              const newSelectedProducts = [...prevProducts];
              products.slice(0, 3).forEach((product, index) => {
                newSelectedProducts[index] = product;
              });
              // Clear remaining slots if fewer than 3 products
              for (let i = products.length; i < 3; i++) {
                newSelectedProducts[i] = null;
              }
              return newSelectedProducts;
            });
            
            // If first product is loaded from comparison, mark it as loaded
            if (products.length > 0 && products[0]) {
              setIsFirstProductLoaded(true);
            }
          } else {
            // If no products in comparison list, clear first 3 slots
            setSelectedProducts((prevProducts) => {
              const newSelectedProducts = [...prevProducts];
              for (let i = 0; i < 3; i++) {
                newSelectedProducts[i] = null;
              }
              return newSelectedProducts;
            });
            setIsFirstProductLoaded(false);
          }
        }
      } catch (error) {
        console.error("Error loading comparison products:", error);
      }
    };

    // Load on mount
    loadComparisonProducts();

    // Listen for updates from quick-compare page
    const handleComparisonUpdate = () => {
      loadComparisonProducts();
    };

    window.addEventListener("comparisonListUpdated", handleComparisonUpdate);
    
    // Also listen to storage events (for cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === "comparisonProducts") {
        loadComparisonProducts();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("comparisonListUpdated", handleComparisonUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array - we want this to run once and listen to events

  // Auto-populate first box with random product from selected categories (only if no comparison products exist)
  useEffect(() => {
    // Check if we already have products from comparison list
    const productsRaw = localStorage.getItem("comparisonProducts");
    const hasComparisonProducts = productsRaw && JSON.parse(productsRaw).length > 0;
    
    if (hasComparisonProducts) {
      // Don't load random product if we have comparison products
      return;
    }

    if (!isFirstProductLoaded && !isLoadingRandomProduct && category && category.length > 0) {
      try {
        const raw = localStorage.getItem("selectedCategories");
        const picked = raw ? JSON.parse(raw) : [];
        if (!picked || picked.length < 3) return;

        // Randomly pick one category from the selected categories
        const availableCategories = category.filter((c) => picked.includes(c.name));
        if (availableCategories.length === 0) return;

        const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        
        if (!randomCategory || !randomCategory.subCategory || randomCategory.subCategory.length === 0) {
          return;
        }

        // Randomly pick a subcategory from the randomly selected category
        const randomSub = randomCategory.subCategory[Math.floor(Math.random() * randomCategory.subCategory.length)];
        
        console.log('Randomly selected category:', randomCategory.name);
        console.log('Randomly selected subcategory:', randomSub.name);
        
        setIsLoadingRandomProduct(true);
        
        // Fetch products for the random subcategory
        dispatch(subcategoryProducts(randomSub.uniqueName)).then((action) => {
          if (action.payload && action.payload.data && action.payload.data.length > 0) {
            // Randomly select a product from the fetched products
            const randomProduct = action.payload.data[Math.floor(Math.random() * action.payload.data.length)];
            if (randomProduct) {
              const newSelectedProducts = [...selectedProducts];
              newSelectedProducts[0] = randomProduct;
              setSelectedProducts(newSelectedProducts);
              setIsFirstProductLoaded(true);
              console.log('Randomly selected product:', randomProduct.title);
            }
          } else {
            console.log('No products found for subcategory:', randomSub.name);
          }
        }).catch((error) => {
          console.error("Error fetching products for subcategory:", error);
        }).finally(() => {
          setIsLoadingRandomProduct(false);
        });
      } catch (e) {
        console.error("Error loading random product:", e);
        setIsLoadingRandomProduct(false);
      }
    }
  }, [category, dispatch, isFirstProductLoaded, isLoadingRandomProduct, selectedProducts]);

  const { blog, isSkeleton } = useSelector((state) => state.blog);
  const skeletonArray = Array(12).fill(null);

  const columns = 4;
  const blogColumns = blog ? splitIntoColumns(blog, columns) : [];

  const handleBlogClick = (item) => {
    const { uniqueTitle } = item;
    router.push("/blog/" + uniqueTitle);
  };


  const handlePlusClick = (index) => {
    // Don't allow clicking on the first box if it's auto-populated
    if (index === 0 && isFirstProductLoaded) {
      return;
    }
    setSelectedBoxIndex(index);
    // setIsDialogOpen(true);
    router.push(`/quick-compare`);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedProduct(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setSelectedProduct(null);
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedProduct(null);
    console.log('Dispatching subcategoryProducts with:', subCategory.uniqueName);
    dispatch(subcategoryProducts(subCategory.uniqueName));
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleConfirmSelection = () => {
    if (selectedProduct && selectedBoxIndex !== null) {
      const newSelectedProducts = [...selectedProducts];
      newSelectedProducts[selectedBoxIndex] = selectedProduct;
      setSelectedProducts(newSelectedProducts);
      setIsDialogOpen(false);
    }
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    const removedProduct = newSelectedProducts[index];
    newSelectedProducts[index] = null;
    setSelectedProducts(newSelectedProducts);
    
    // Also remove from localStorage comparison list if it exists
    if (removedProduct && removedProduct._id) {
      try {
        const comparisonListRaw = localStorage.getItem("comparisonList");
        const comparisonProductsRaw = localStorage.getItem("comparisonProducts");
        
        if (comparisonListRaw) {
          const comparisonList = JSON.parse(comparisonListRaw);
          const updatedList = comparisonList.filter(id => id !== removedProduct._id);
          localStorage.setItem("comparisonList", JSON.stringify(updatedList));
        }
        
        if (comparisonProductsRaw) {
          const comparisonProducts = JSON.parse(comparisonProductsRaw);
          const updatedProducts = comparisonProducts.filter(p => p._id !== removedProduct._id);
          localStorage.setItem("comparisonProducts", JSON.stringify(updatedProducts));
        }
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event("comparisonListUpdated"));
      } catch (error) {
        console.error("Error removing product from localStorage:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-16">
        <div className="hidden md:flex w-full h-[300px] border-2 border-dashed border-gray-400 items-center justify-center">
          Ad Box
        </div>
      </div>
      <div className="mt-5 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft">
        <div className="border-b-2 border-gray-300 rounded-t-xl flex items-center justify-between p-3">
          <h3 className="text-[20px] font-bold">Quick Compare</h3>
          {/* <button
            className="btn btn-primary !text-lg px-4 py-2 me-3"
            onClick={() => router.push("/quick-compare")}
          >
            See all
          </button> */}
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-5">
            {/* Product Slot 1 */}
            <div 
              className={`border border-[#d1d9e6] rounded-xl mx-2 sm:mx-5 bg-[#e6e7ee] shadow-inset w-full sm:w-[45%] md:w-[30%] max-w-[400px] flex items-center justify-center relative ${isFirstProductLoaded ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !selectedProducts[0] && !isFirstProductLoaded && handlePlusClick(0)}
            >
              {selectedProducts[0] ? (
                <div className="w-full flex items-center justify-center relative">
                  <div className="p-4 mt-20 w-full">
                    <ImageWithShimmer
                      src={`${imageUrl}${selectedProducts[0].thumbnail}`}
                      alt={selectedProducts[0].title}
                      height={240}
                      width={150}
                      className="object-contain w-full min-h-60 max-h-60 rounded-tl-[15px] rounded-tr-[15px]"
                    />
                    <h2 className="text-lg font-semibold my-3 hover:text-[#F98A1A] cursor-pointer transition-all" onClick={() => router.push(`/compare/${selectedProducts[0]?.uniqueTitle}`)}>
                      {selectedProducts[0].title || "Product Name"}
                    </h2>

                    {selectedProducts[0]?.featureData && selectedProducts[0].featureData.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 text-gray-600 mt-2 border-t-[2px] border-[#d1d9e6] pt-3">
                        {selectedProducts[0].featureData.slice(0, 4).map((feature, index) => {
                          const featureName = feature?.featureName || feature?.featureId?.featureName || "";
                          const featureIcon = feature?.icon || feature?.featureId?.icon;
                          const featureUnit = feature?.unit || feature?.featureId?.unit;
                          
                          return (
                            <div key={feature._id || feature.featureId?._id || index} className="flex items-center gap-2">
                              {/* Feature icon from API */}
                              {featureIcon ? (
                                <img
                                  src={`${imageUrl}${featureIcon}`}
                                  alt={featureName || "Feature"}
                                  className="w-5 h-5 object-contain flex-shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0"></div>
                              )}
                              <span className="text-sm truncate">
                                {featureUnit || featureName || "N/A"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 z-10">
                    <CircularScore value={58} />
                  </div>
                  {isFirstProductLoaded && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
                      Random
                    </div>
                  )}
                </div>
              ) : isLoadingRandomProduct ? (
                <div className="text-center text-sm text-gray-500 px-4 py-20">
                  Loading random product...
                </div>
              ) : (
                <div className="text-[35px] py-20">+</div>
              )}
            </div>
            
            {/* VS Badge 1 - Horizontal lines on mobile, vertical on desktop */}
            <div className="relative bg-[#e6e7ee] shadow-inset rounded-full px-2.5 py-2 font-bold text-gray-600 
              before:content-[''] before:absolute before:h-[2px] before:w-[80px] before:bg-gray-300 before:left-[-90px] before:top-1/2 before:-translate-y-1/2
              after:content-[''] after:absolute after:h-[2px] after:w-[80px] after:bg-gray-300 after:right-[-90px] after:top-[50%] md:after:top-[122%] after:-translate-y-1/2
              sm:before:h-[150px] sm:before:w-[2px] sm:before:left-1/2 sm:before:top-[-160px] sm:before:-translate-x-1/2 sm:before:translate-y-0
              sm:after:h-[150px] sm:after:w-[2px] sm:after:left-1/2 sm:after:bottom-[-160px] sm:after:-translate-x-1/2 sm:after:translate-y-0">
              VS
            </div>
            
            {/* Product Slot 2 */}
            <div 
              className="border border-[#d1d9e6] rounded-xl mx-2 sm:mx-5 bg-[#e6e7ee] shadow-inset w-full sm:w-[45%] md:w-[30%] max-w-[400px] flex items-center justify-center relative cursor-pointer h-[-webkit-fill-available]"
              onClick={() => !selectedProducts[1] && handlePlusClick(1)}
            >
              {selectedProducts[1] ? (
                <div className="w-full flex items-center justify-center relative">
                  <div className="p-4 mt-20 w-full">
                    <ImageWithShimmer
                      src={`${imageUrl}${selectedProducts[1].thumbnail}`}
                      alt={selectedProducts[1].title}
                      height={240}
                      width={150}
                      className="object-contain w-full min-h-60 max-h-60 rounded-tl-[15px] rounded-tr-[15px]"
                    />
                     <h2 className="text-lg font-semibold my-3 hover:text-[#F98A1A] cursor-pointer transition-all" onClick={() => router.push(`/compare/${selectedProducts[1]?.uniqueTitle}`)}>
                      {selectedProducts[1].title || "Product Name"}
                    </h2>

                    {selectedProducts[1]?.featureData && selectedProducts[1].featureData.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 text-gray-600 mt-2 border-t-[2px] border-[#d1d9e6] pt-3">
                        {selectedProducts[1].featureData.slice(0, 4).map((feature, index) => {
                          const featureName = feature?.featureName || feature?.featureId?.featureName || "";
                          const featureIcon = feature?.icon || feature?.featureId?.icon;
                          const featureUnit = feature?.unit || feature?.featureId?.unit;
                          
                          return (
                            <div key={feature._id || feature.featureId?._id || index} className="flex items-center gap-2">
                              {/* Feature icon from API */}
                              {featureIcon ? (
                                <img
                                  src={`${imageUrl}${featureIcon}`}
                                  alt={featureName || "Feature"}
                                  className="w-5 h-5 object-contain flex-shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0"></div>
                              )}
                              <span className="text-sm truncate">
                                {featureUnit || featureName || "N/A"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 z-10">
                    <CircularScore value={58} />
                  </div>
                </div>
              ) : (
                <div className="text-[35px] py-20">+</div>
              )}
            </div>
            
            {/* VS Badge 2 - Horizontal lines on mobile, vertical on desktop */}
            <div className="relative bg-[#e6e7ee] shadow-inset rounded-full px-2.5 py-2 font-bold text-gray-600 
              before:content-[''] before:absolute before:h-[2px] before:w-[80px] before:bg-gray-300 before:left-[-90px] before:top-1/2 before:-translate-y-1/2
              after:content-[''] after:absolute after:h-[2px] after:w-[80px] after:bg-gray-300 after:right-[-90px] after:top-[50%] md:after:top-[122%] after:-translate-y-1/2
              sm:before:h-[150px] sm:before:w-[2px] sm:before:left-1/2 sm:before:top-[-160px] sm:before:-translate-x-1/2 sm:before:translate-y-0
              sm:after:h-[150px] sm:after:w-[2px] sm:after:left-1/2 sm:after:bottom-[-160px] sm:after:-translate-x-1/2 sm:after:translate-y-0">
              VS
            </div>
            
            {/* Product Slot 3 */}
            <div 
              className="border border-[#d1d9e6] rounded-xl mx-2 sm:mx-5 bg-[#e6e7ee] shadow-inset w-full sm:w-[30%] max-w-[400px] flex items-center justify-center relative cursor-pointer h-[-webkit-fill-available]"
              onClick={() => !selectedProducts[2] && handlePlusClick(2)}
            >
              {selectedProducts[2] ? (
                <div className="w-full flex items-center justify-center relative">
                  <div className="p-4 mt-20 w-full">
                    <ImageWithShimmer
                      src={`${imageUrl}${selectedProducts[2].thumbnail}`}
                      alt={selectedProducts[2].title}
                      height={240}
                      width={150}
                      className="object-contain w-full min-h-60 max-h-60 rounded-tl-[15px] rounded-tr-[15px]"
                    />
                     <h2 className="text-lg font-semibold my-3 hover:text-[#F98A1A] cursor-pointer transition-all" onClick={() => router.push(`/compare/${selectedProducts[2]?.uniqueTitle}`)}>
                      {selectedProducts[2].title || "Product Name"}
                    </h2>

                    {selectedProducts[2]?.featureData && selectedProducts[2].featureData.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 text-gray-600 mt-2 border-t-[2px] border-[#d1d9e6] pt-3">
                        {selectedProducts[2].featureData.slice(0, 4).map((feature, index) => {
                          const featureName = feature?.featureName || feature?.featureId?.featureName || "";
                          const featureIcon = feature?.icon || feature?.featureId?.icon;
                          const featureUnit = feature?.unit || feature?.featureId?.unit;
                          
                          return (
                            <div key={feature._id || feature.featureId?._id || index} className="flex items-center gap-2">
                              {/* Feature icon from API */}
                              {featureIcon ? (
                                <img
                                  src={`${imageUrl}${featureIcon}`}
                                  alt={featureName || "Feature"}
                                  className="w-5 h-5 object-contain flex-shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-5 h-5 bg-gray-300 rounded flex-shrink-0"></div>
                              )}
                              <span className="text-sm truncate">
                                {featureUnit || featureName || "N/A"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 z-10">
                    <CircularScore value={58} />
                  </div>
                </div>
              ) : (
                <div className="text-[35px] py-20">+</div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center my-6 sm:mt-10">
            <button className="compare-button px-6 py-2 text-sm sm:text-base"  onClick={() => router.push("/quick-compare")}>
              More Compare
            </button>
          </div>
        </div>
      </div>

      {/* Product Selection Dialog */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Select Product for Comparison
                  </Dialog.Title>

                  <div className="space-y-4">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => {
                          const cat = category.find(c => c._id === e.target.value);
                          handleCategorySelect(cat);
                        }}
                        value={selectedCategory?._id || ""}
                      >
                        <option value="">Select a category</option>
                        {category.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory Selection */}
                    {selectedCategory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            const subCat = selectedCategory.subCategory?.find(
                              sc => sc._id === e.target.value
                            );
                            handleSubCategorySelect(subCat);
                          }}
                          value={selectedSubCategory?._id || ""}
                        >
                          <option value="">Select a subcategory</option>
                          {selectedCategory.subCategory?.map((subCat) => (
                            <option key={subCat._id} value={subCat._id}>
                              {subCat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Product Selection */}
                    {selectedSubCategory && subCategoryProducts && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product
                        </label>
                        <div className="text-xs text-gray-500 mb-2">
                          Found {subCategoryProducts.length} products
                        </div>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            const product = subCategoryProducts.find(
                              p => p._id === e.target.value
                            );
                            handleProductSelect(product);
                          }}
                          value={selectedProduct?._id || ""}
                        >
                          <option value="">Select a product</option>
                          {subCategoryProducts.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Selected Product Preview */}
                    {selectedProduct && (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <ImageWithShimmer
                            src={imageUrl + selectedProduct.thumbnail}
                            alt={selectedProduct.title}
                            height={64}
                            width={64}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{selectedProduct.title}</h4>
                            <p className="text-sm text-gray-500">{selectedProduct.brand || 'Unknown Brand'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleConfirmSelection}
                      disabled={!selectedProduct}
                    >
                      Confirm Selection
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="my-8 border-1 border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft">
        <div className="border-b-2 border-gray-300 rounded-t-xl rounded-tr-xl flex items-center justify-between p-3">
          <h3 className="text-[20px] font-bold">Categories</h3>
          <button 
            className="btn btn-primary !text-sm px-2 !py-1 me-3"
            onClick={() => router.push("/categories")}
          >
            See all
          </button>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {category.map((item, index) => {
              return (
                <button
                  key={index}
                  className="btn focus shadow-soft"
                  onClick={() => router.push("/categories")}
                >
                  {item?.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="hidden md:flex h-[150px] mt-4 border-2 border-dashed border-gray-700 items-center justify-center">
        Ad Box
      </div>
      <div className="flex justify-center gap-4 mb-20 mt-10">
        {/* Left Ad Box */}
        {/* <div className="hidden md:flex w-[150px] h-[600px] border-2 border-dashed border-gray-700 items-center justify-center">
          Ad Box
        </div> */}

        {/* Main Blog Section */}
        <div className="flex-1 relative">
          {isSkeleton ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="grid gap-4">
                  {skeletonArray
                    .slice(colIndex * 3, (colIndex + 1) * 3)
                    .map((_, i) => (
                      <div key={i}>
                        <Skeleton
                          height={150}
                          style={{ borderRadius: "8px" }}
                          baseColor={colors.baseColor}
                          highlightColor={colors.highlightColor}
                        />
                        <Skeleton
                          height={20}
                          className="mt-2"
                          style={{ borderRadius: "8px" }}
                          baseColor={colors.baseColor}
                          highlightColor={colors.highlightColor}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {blogColumns?.slice(0, 23).map((column, colIndex) => (
                  <div key={colIndex}>
                    {column.map((item, i) => (
                      <div
                        key={i}
                        className="cursor-pointer border-1 border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft p-4 mb-6"
                      >
                        <ImageWithShimmer
                          className="h-auto max-w-full rounded-xl"
                          alt={item.title}
                          src={imageUrl + item.thumbnail}
                          onClick={() => handleBlogClick(item)}
                        />
                        <div className="my-4 mb-[25px] text-[16px] font-medium">
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="Masonry__fadeToWhiteMask___rTGCf"></div>
        </div>

        {/* Right Ad Box */}
        {/* <div className="hidden md:flex w-[150px] h-[600px] border-2 border-dashed border-gray-700 items-center justify-center">
          Ad Box
        </div> */}
      </div>
    </div>
  );
};

export default BlogSection;
