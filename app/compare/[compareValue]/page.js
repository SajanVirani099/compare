"use client";
import ComparisonSummary from "@/components/comparisonSummary/comparisonSummary";
import RadarChart from "@/components/radarChart/radarChart";
import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDropdown } from "react-icons/io";
import { CiMobile1 } from "react-icons/ci";
import {
  AiOutlineCamera,
  AiOutlineMobile,
  AiOutlinePicture,
} from "react-icons/ai";
import { GiProcessor } from "react-icons/gi";
import { PiDevices } from "react-icons/pi";
import { IoBatteryFullOutline } from "react-icons/io5";
import { SlMusicToneAlt } from "react-icons/sl";
import { CiCirclePlus } from "react-icons/ci";
import { Tooltip } from "antd";
import MostPopularComparison from "@/components/mostPopularComparison/mostPopularComparison";
import PriceComparison from "@/components/priceComparison/priceComparison";
import UserReviews from "@/components/userReviews/userReviews";
import FeatureSection from "@/components/featureSection/featureSection";
import KeySpecs from "@/components/keySpecs/keySpecs";
import { TbVs } from "react-icons/tb";
import BestComparison from "@/components/bestComparison/bestComparison";
import BestSmartphones from "@/components/bestSmartphones/bestSmartphones";
import { getResultProduct, getPopularComparison } from "@/app/redux/slice/blogSlice";
import Navbar from "@/components/Navbar";
import { BASE_URL, imageUrl } from "@/components/utils/config";

// Colors for different products
const productColors = ["#434343", "#3F51B5", "#10B981"];

const tabs = ["OVERVIEW", "PRICES", "REVIEWS", "SPECS"];

const getProductName = (item, idx = 1) =>
  item?.title ||
  item?.name ||
  item?.uniqueTitle ||
  `Product ${idx}`;

// Helper function to map feature name to icon component
const getFeatureIcon = (featureName, size = 28) => {
  const normalizedName = featureName?.toLowerCase() || "";
  
  if (normalizedName.includes("design")) return <AiOutlineMobile size={size} />;
  if (normalizedName.includes("display")) return <AiOutlinePicture size={size} />;
  if (normalizedName.includes("performance")) return <GiProcessor size={size} />;
  if (normalizedName.includes("camera")) return <AiOutlineCamera size={size} />;
  if (normalizedName.includes("operating") || normalizedName.includes("os")) return <PiDevices size={size} />;
  if (normalizedName.includes("battery") || normalizedName.includes("bettery")) return <IoBatteryFullOutline size={size} />;
  if (normalizedName.includes("audio") || normalizedName.includes("sound")) return <SlMusicToneAlt size={size} />;
  if (normalizedName.includes("storage") || normalizedName.includes("memory")) return <CiCirclePlus size={size} />;
  if (normalizedName.includes("feature")) return <CiCirclePlus size={size} />;
  if (normalizedName.includes("miscellaneous")) return <TbVs size={size} />;
  
  // Default icon
  return <CiCirclePlus size={size} />;
};

const ComparePage = ({ params }) => {
  const dispatch = useDispatch();
  const { resultProduct, popularComparison } = useSelector(
    (state) => state.blog || {}
  );
  const [selectedTab, setSelectedTab] = useState(0);
  const [comparisonCategory, setComparisonCategory] = useState("");
  const [comparisonItem, setComparisonItem] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [activeScrollFeature, setActiveScrollFeature] = useState("");
  const [showStickyIcons, setShowStickyIcons] = useState(false);
  const [numOfComparisons, setNumOfComparisons] = useState(0);
  const radarSectionRef = useRef(null);

  // Normalize API response structure
  const comparisonResponse = resultProduct?.data || resultProduct || {};
  const comparedProducts =
    comparisonResponse?.comparedProducts || comparisonResponse?.data?.comparedProducts || [];
  console.log("🚀 ~ ComparePage ~ comparedProducts:", comparedProducts)

  // Normalize popular comparison data: array of { left, right }
  const popularComparisonList =
    comparisonResponse?.popularComparison ||
    popularComparison?.data ||
    popularComparison ||
    [];

  // Flatten unique products from popularComparisonList for BestSmartphones
  const bestSmartphoneProducts = useMemo(() => {
    if (!Array.isArray(popularComparisonList)) return [];

    const map = new Map();
    popularComparisonList.forEach((pair) => {
      const left = pair?.left;
      const right = pair?.right;

      if (left && left._id && !map.has(left._id)) {
        map.set(left._id, left);
      }
      if (right && right._id && !map.has(right._id)) {
        map.set(right._id, right);
      }
    });

    return Array.from(map.values());
  }, [popularComparisonList]);

  // Limit products to max 3
  const limitedProducts = useMemo(() => {
    return (Array.isArray(comparedProducts) ? comparedProducts : []).slice(0, 3);
  }, [comparedProducts]);
  
  // Feature scores for the primary product (used for single-product view)
  const primaryFeatureScores = useMemo(() => {
    if (!limitedProducts || limitedProducts.length === 0) return [];
    const firstProduct = limitedProducts[0];
    const featureData = firstProduct?.featureData || [];

    return featureData
      .map((feature, idx) => {
        const name =
          feature?.featureName ||
          feature?.featureId?.featureName ||
          `Feature ${idx + 1}`;
        const score =
          feature?.scoreValue ??
          feature?.featureId?.scoreValue ??
          0;

        const numericScore = score || 0;
        // Normalize: API may send 0–100, but UI expects 0–10
        const normalizedScore =
          numericScore > 10 ? Math.round(numericScore / 10) : numericScore;

        return {
          name,
          score: normalizedScore,
        };
      })
      .filter((item) => item.name);
  }, [limitedProducts]);
  
  const productNames = limitedProducts.map((item, idx) =>
    getProductName(item, idx + 1)
  );
  const activeCompareIndex = Math.max(0, productNames.findIndex((n) => n === comparisonItem));

  // Refs for each FeatureSection
  const sectionRefs = useRef({});
  
  // Generate icons, featureSections, and titleToTooltip from API data
  const { icons, featureSections, titleToTooltip } = useMemo(() => {
    if (!limitedProducts || limitedProducts.length === 0) {
      // Fallback to default values
      return {
        icons: [],
        featureSections: [],
        titleToTooltip: {}
      };
    }

    // Get featureData from first product (or combine unique features from all products)
    const firstProduct = limitedProducts[0];
    const featureData = firstProduct?.featureData || [];
    
    if (featureData.length === 0) {
      return {
        icons: [],
        featureSections: [],
        titleToTooltip: {}
      };
    }

    // Create featureSections and icons arrays
    const sections = [];
    const iconArray = [];
    const tooltipMap = {};

    featureData.forEach((feature, index) => {
      const featureName = feature?.featureName || feature?.featureId?.featureName || "";
      if (!featureName) return;

      // Get icon from API if available, otherwise use fallback icon component
      const apiIcon = feature?.icon || feature?.featureId?.icon;
      
      // Create icon component - use API icon if available, otherwise use fallback
      const iconComponent = apiIcon 
        ? <img src={`${imageUrl}${apiIcon}`} alt={featureName} style={{fill: '#fff'}} className="w-7 h-7 object-contain" />
        : getFeatureIcon(featureName, 28);
      const iconSmallComponent = apiIcon
        ? <img src={`${imageUrl}${apiIcon}`} alt={featureName} style={{fill: '#fff'}} className="w-5 h-5 object-contain" />
        : getFeatureIcon(featureName);

      // Build points object for icons (scoreValue for each product)
      const pointsObj = {};
      limitedProducts.forEach((product, prodIdx) => {
        const productFeature = product?.featureData?.find(
          f => {
            const fName = f?.featureName || f?.featureId?.featureName;
            return fName === featureName;
          }
        );
        const scoreValue = productFeature?.scoreValue || productFeature?.featureId?.scoreValue || 0;
        pointsObj[`item${prodIdx + 1}points`] = String(scoreValue);
      });

      // Process subfeatures for this feature
      const subfeaturesData = [];
      
      // Get all unique subfeature names from all products for this feature
      const allSubfeatureNames = new Set();
      limitedProducts.forEach((product) => {
        const productFeature = product?.featureData?.find(
          f => {
            const fName = f?.featureName || f?.featureId?.featureName;
            return fName === featureName;
          }
        );
        const subfeatures = productFeature?.subfeatures || [];
        subfeatures.forEach((subfeature) => {
          const subfeatureName = subfeature?.name || "";
          if (subfeatureName) {
            allSubfeatureNames.add(subfeatureName);
          }
        });
      });

      // For each unique subfeature, collect data from all products
      allSubfeatureNames.forEach((subfeatureName) => {
        const subfeatureValues = [];
        
        limitedProducts.forEach((product, prodIdx) => {
          const productFeature = product?.featureData?.find(
            f => {
              const fName = f?.featureName || f?.featureId?.featureName;
              return fName === featureName;
            }
          );
          const subfeature = productFeature?.subfeatures?.find(
            sf => sf?.name === subfeatureName
          );
          
          if (subfeature) {
            const unit = subfeature?.unit || "";
            const unitSymbol = subfeature?.unitsymbol || "";
            const details = subfeature?.details || "";
            const description = subfeature?.description || "";
            const scorevalue = subfeature?.scorevalue || 0;
            const isTrueFalse = subfeature?.isTrueFalse || "";
            const type = subfeature?.type;
            
            // Format the value display
            let displayValue = "";
            let numericValue = 0;
            
            if (isTrueFalse === "true" || isTrueFalse === true) {
              displayValue = "Yes";
              numericValue = 100; // Show full bar for "Yes"
            } else if (isTrueFalse === "false" || isTrueFalse === false) {
              displayValue = "No";
              numericValue = 0;
            } else if (details) {
              displayValue = details;
              // Try to extract numeric value from details if it's a number
              const numMatch = details.match(/[\d.]+/);
              numericValue = numMatch ? parseFloat(numMatch[0]) : (scorevalue || 0);
            } else if (unit) {
              displayValue = `${unit}${unitSymbol ? ` ${unitSymbol}` : ""}`;
              // Use unit as numeric value, or scorevalue if available
              numericValue = parseFloat(unit) || scorevalue || 0;
            } else {
              displayValue = "N/A";
              numericValue = 0;
            }
            
            // If scorevalue is available and numericValue is 0, use scorevalue
            if (numericValue === 0 && scorevalue > 0) {
              numericValue = scorevalue;
            }
            
            subfeatureValues.push({
              productIndex: prodIdx,
              displayValue: displayValue,
              scorevalue: numericValue, // Use numericValue instead of scorevalue
              description: description || details || "",
              unit: unit,
              unitSymbol: unitSymbol,
              details: details,
              isTrueFalse: isTrueFalse,
              type: type,
              isNumeric: !!(unit && !isNaN(parseFloat(unit))) || !!(details && details.match(/[\d.]+/))
            });
          } else {
            // Subfeature not found for this product
            subfeatureValues.push({
              productIndex: prodIdx,
              displayValue: "N/A",
              scorevalue: 0,
              description: "",
              unknown: false,
              na: true
            });
          }
        });

        // Create FeatureCard data structure - support up to 3 products
        if (subfeatureValues.length >= 1) {
          const value1 = subfeatureValues[0]?.scorevalue || 0;
          const value2 = subfeatureValues[1]?.scorevalue || 0;
          const value3 = subfeatureValues[2]?.scorevalue || 0;
          const param1 = subfeatureValues[0]?.displayValue || "Unknown";
          const param2 = subfeatureValues[1]?.displayValue || "N/A";
          const param3 = subfeatureValues[2]?.displayValue || "N/A";
          
          // Get description from any available product
          const description = subfeatureValues.find(sv => sv?.description)?.description || 
                             subfeatureValues[0]?.description || "";
          
          // Check if all are unknown
          const allUnknown = subfeatureValues.every(sv => sv?.unknown);
          // Check if all are N/A (not applicable)
          const allNA = subfeatureValues.every(sv => sv?.na);
          
          // Check if this is a numeric comparison (has numeric values)
          const hasNumericValues = subfeatureValues.some(sv => sv?.isNumeric && sv?.scorevalue > 0);
          
          // Check if this is an IP rating or similar text-only value (starts with IP, or is pure text without numbers)
          const isIPRating = param1 && param1.toString().toUpperCase().startsWith('IP');
          const isTextOnly = param1 && !param1.toString().match(/[\d.]+/) && !isIPRating;
          
          // Calculate percentage for range bars
          let percent1 = 0, percent2 = 0, percent3 = 0;
          
          if (hasNumericValues) {
            // For numeric values (weight, thickness, etc.), calculate percentage based on max value
            const maxValue = Math.max(value1, value2, value3, 1); // Avoid division by zero
            percent1 = maxValue > 0 ? Math.round((value1 / maxValue) * 100) : 0;
            percent2 = maxValue > 0 ? Math.round((value2 / maxValue) * 100) : 0;
            percent3 = maxValue > 0 ? Math.round((value3 / maxValue) * 100) : 0;
          } else if (isTextOnly && param1 !== "N/A" && param1 !== "Unknown") {
            // For text values like "Waterproof", "Yes", show full bars
            percent1 = param1 !== "N/A" && param1 !== "Unknown" ? 100 : 0;
            percent2 = param2 !== "N/A" && param2 !== "Unknown" ? 100 : 0;
            percent3 = param3 !== "N/A" && param3 !== "Unknown" ? 100 : 0;
          } else if (isIPRating) {
            // For IP ratings, show no bars (0%) - just display the text
            percent1 = 0;
            percent2 = 0;
            percent3 = 0;
          } else {
            // Default: use scorevalue if available
            percent1 = value1 > 0 ? 100 : 0;
            percent2 = value2 > 0 ? 100 : 0;
            percent3 = value3 > 0 ? 100 : 0;
          }
          
          subfeaturesData.push({
            title: subfeatureName,
            param1: param1,
            param2: param2,
            param3: param3,
            value1: percent1,
            value2: percent2,
            value3: percent3,
            text: description,
            unknown: allUnknown,
            na: allNA
          });
        }
      });

      // Add to icon array
      iconArray.push({
        icon: iconSmallComponent,
        tooltip: featureName,
        isApiIcon: !!apiIcon, // Store flag to know if it's an API icon
        ...pointsObj
      });

      // Add to feature sections with subfeatures
      sections.push({
        title: featureName,
        icon: iconComponent,
        isApiIcon: !!apiIcon, // Store flag to know if it's an API icon
        background: index % 2 === 1, // Alternate backgrounds
        subfeatures: subfeaturesData, // Add subfeatures data
        // Overall score for this feature (for single-product specs view)
        score: Number(pointsObj.item1points) || 0,
      });

      // Add to tooltip map
      tooltipMap[featureName] = featureName;
    });

    return {
      icons: iconArray,
      featureSections: sections,
      titleToTooltip: tooltipMap
    };
  }, [limitedProducts]);

  // Ratings rows for 2–3 products view (one row per feature, scores per product)
  const ratingRows = useMemo(() => {
    if (!icons || icons.length === 0 || !limitedProducts || limitedProducts.length < 2) {
      return [];
    }

    const productCount = Math.min(3, limitedProducts.length);

    return icons.map((icon) => {
      const scores = Array.from({ length: productCount }).map((_, idx) => {
        const raw = Number(icon[`item${idx + 1}points`] || 0);
        const numeric = Number.isNaN(raw) ? 0 : raw;
        return numeric > 10 ? Math.round(numeric / 10) : numeric;
      });

      return {
        name: icon.tooltip,
        scores,
      };
    });
  }, [icons, limitedProducts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const numOfComparisons = localStorage.getItem("comparisonList");

      if (numOfComparisons) {
        setNumOfComparisons(numOfComparisons.length);
      }

      const comparisonCategory = localStorage.getItem("comparisonCategory");

      if (comparisonCategory) {
        setComparisonCategory(comparisonCategory);
      }
    }
  }, []);

  useEffect(() => {
    if (!params?.compareValue) return;
    dispatch(getResultProduct(params?.compareValue));
  }, [dispatch, params?.compareValue]);

  // Fetch popular comparison when products are loaded
  useEffect(() => {
    if (limitedProducts && limitedProducts.length > 0) {
      // Get subCategory name from first product's API response
      const firstProduct = limitedProducts[0];
      const subCategoryName =
        firstProduct?.subCategory?.uniqueName ||
        firstProduct?.subCategory?.name ||
        firstProduct?.subcategory?.uniqueName ||
        firstProduct?.subcategory?.name ||
        firstProduct?.subCategoryUniqueName ||
        firstProduct?.subCategoryName ||
        firstProduct?.subcategoryUniqueName ||
        firstProduct?.subcategoryName;

      if (subCategoryName) {
        dispatch(getPopularComparison(subCategoryName));
      }
    }
  }, [dispatch, limitedProducts]);

  // Set initial comparisonItem when resultProduct loads
  useEffect(() => {
    if (limitedProducts && limitedProducts.length > 0) {
      const firstName = getProductName(limitedProducts[0], 1);
      setComparisonItem(firstName);
    }
  }, [limitedProducts]);

  const handleSelectFeature = (feature) => {
    if (selectedFeature === feature) {
      setSelectedFeature("");
      return;
    }
    setSelectedFeature(feature);
  };

  // Scroll to section when icon is clicked
  const scrollToSection = useCallback((title) => {
    const ref = sectionRefs.current[title];
    if (ref) {
      const offset = 150; // Account for fixed header
      const elementPosition = ref.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, []);

  // Track scroll to show/hide sticky icons
  useEffect(() => {
    const handleScroll = () => {
      if (radarSectionRef.current) {
        const rect = radarSectionRef.current.getBoundingClientRect();
        // Show sticky icons when radar section is scrolled past
        setShowStickyIcons(rect.bottom < 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Intersection Observer to detect visible sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is in upper portion of viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionTitle = entry.target.getAttribute("data-section-title");
          if (sectionTitle) {
            const tooltip = titleToTooltip[sectionTitle] || sectionTitle;
            setActiveScrollFeature(tooltip);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all feature sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [limitedProducts, titleToTooltip]); // Re-run when data loads

  return (
    <div className="min-h-screen bg-[#E6E7EE]">
      <Navbar />
      <div className="mx-auto mt-[95px] sm:mt-[95px] md:mt-[95px]">
        {/* TABS */}
        <div className="w-full">
          <div className="shadow-lg w-full fixed top-[60px] z-[9999] bg-[#E6E7EE]">
            <div className="flex gap-4 sm:gap-6 md:gap-8 max-w-[1240px] mx-auto px-4 sm:px-10 md:px-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`text-[10px] sm:text-xs font-medium py-2 sm:py-2.5 cursor-pointer whitespace-nowrap ${
                    selectedTab === index
                      ? "text-[#434343] border-b-2 border-[#434343]"
                      : "text-[#616161]"
                  } hover:text-[#434343]`}
                  onClick={() => setSelectedTab(index)}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[700px] mx-auto mt-4 px-4 sm:px-6 md:px-0 h-[60px] sm:h-[80px] md:h-[90px] border border-gray-500">
          Ad
        </div>

        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto mt-4 px-4 sm:px-6 md:px-0">
          <p className="text-xs sm:text-sm break-words">
            <Link href="/">Home</Link> &gt; {comparisonCategory} comparison &gt;{" "}
            <span className="text-gray-600">
              {productNames.join(" vs ")}
            </span>
          </p>
        </div>

        {/* API data preview */}
        {limitedProducts?.length > 0 && (
          <div className="max-w-[1280px] mx-auto mt-4 sm:mt-6 px-4 sm:px-6 md:px-4">
            <div className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset p-3 sm:p-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3">Comparison data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {limitedProducts.map((item, idx) => (
                  <div
                    key={item?._id || item?.id || idx}
                    className="p-2.5 sm:p-3 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {item?.thumbnail && (
                        <img
                          src={BASE_URL + item.thumbnail}
                          alt={item?.title || item?.name || `Product ${idx + 1}`}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm truncate">
                          {item?.title || item?.name || `Product ${idx + 1}`}
                        </p>
                        {item?.brand && (
                          <p className="text-[10px] sm:text-xs text-gray-600 truncate">{item.brand}</p>
                        )}
                      </div>
                    </div>
                    {item?.price && (
                      <p className="text-xs sm:text-sm text-gray-700 mt-2">
                        Price: {item.price}
                      </p>
                    )}
                    {item?.displaySize && (
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
                        Display: {item.displaySize}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[1280px] mx-auto mt-4 px-4 sm:px-6 md:px-0">
          {/* Dynamic Product Grid */}
          <div className={`relative w-full md:w-[90%] mx-auto grid ${
            limitedProducts?.length === 1 
              ? "grid-cols-1 max-w-[400px]" 
              : limitedProducts?.length === 2 
                ? "grid-cols-1 sm:grid-cols-2" 
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          } ${
            limitedProducts?.length > 1 ? "md:divide-x md:divide-gray-400" : ""
          } gap-4 sm:gap-6 md:gap-0`}>
            {limitedProducts?.map((product, index) => {
              const color = productColors[index] || productColors[0];
              const productName = getProductName(product, index + 1);
              const productImage = product?.thumbnail 
                ? `${imageUrl}${product.thumbnail}` 
                : `/compare-item-${index + 1}.jpg`;
              const productPrice = product?.price || product?.amazonPrice || null;
              const productScore = product?.scoreValue || 75;

              return (
                <React.Fragment key={product?._id || index}>
                  <div className="relative px-2 sm:px-3 md:px-4 py-3 sm:py-4 border-b sm:border-b-0 md:border-b-0 border-gray-300 md:border-0 last:border-b-0">
                    <div className="flex gap-2 sm:gap-3 items-start sm:items-center flex-col sm:flex-row">
                      <div
                        className="inline-flex items-center justify-center rounded-full text-xs font-bold bg-white flex-shrink-0"
                        style={{
                          background: `conic-gradient(${color} ${productScore}%, #e5e7eb ${productScore}%)`,
                        }}
                      >
                        <span className="text-gray-600 bg-white rounded-full flex flex-col items-center justify-center m-0.5 sm:m-1 py-1 sm:py-1.5 px-0.5 sm:px-1">
                          <span className="text-sm sm:text-base leading-[1rem]">{productScore}</span>
                          <span className="text-[8px] sm:text-[10px] leading-[0.5rem]">Points</span>
                        </span>
                      </div>
                      <p className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl break-words">
                        {productName}
                      </p>
                    </div>

                    <div className="relative mt-3 sm:mt-4 w-full sm:w-[90%] md:w-[85%] mx-auto">
                      {/* Product Image */}
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full object-contain object-top"
                      />

                      {/* Fading Effect */}
                      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 md:h-24 bg-gradient-to-t from-white to-transparent"></div>
                    </div>

                    {/* Price & Amazon Logo */}
                    {productPrice && (
                      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 flex flex-col items-end">
                        <div 
                          className="rounded-full inline-flex mb-1 sm:mb-2 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 uppercase text-white text-[10px] sm:text-xs md:text-sm lg:text-base"
                          style={{ backgroundColor: color }}
                        >
                          New
                        </div>
                        <div 
                          className="flex items-center gap-1.5 sm:gap-2 md:gap-3 pl-2 sm:pl-3 pr-2 sm:pr-3 md:pr-4 py-0.5 sm:py-1 w-fit border-2 sm:border-[3px] rounded-full bg-white"
                          style={{ borderColor: color }}
                        >
                          <div className="flex items-center sm:items-start gap-0.5 sm:gap-1 text-gray-700 italic">
                            <span className="font-bold text-xs sm:text-sm md:text-base sm:mt-[2px]">₹</span>
                            <span className="font-bold text-sm sm:text-base md:text-xl lg:text-2xl">
                              {productPrice}
                            </span>
                          </div>
                          <span>
                            <img src={"/amazon.png"} className="w-[30px] sm:w-[40px] md:w-[50px] mt-1 sm:mt-2 mr-1 sm:mr-2 md:mr-4" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VS Badge - show between products on mobile */}
                  {index < (limitedProducts?.length || 0) - 1 && (
                    <>
                      {/* Mobile VS Badge */}
                      <div className="sm:hidden flex justify-center items-center py-2">
                        <div className="bg-white border-2 border-gray-400 rounded-full px-3 py-1 font-bold text-gray-600 text-sm">
                          vs
                        </div>
                      </div>
                      {/* Desktop VS Badge */}
                      <div 
                        className="hidden sm:block absolute bg-white border-2 border-gray-400 rounded-full px-2.5 py-1 font-bold text-gray-600 z-10"
                        style={{
                          left: `${((index + 1) / (limitedProducts?.length || 1)) * 100}%`,
                          top: '55%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        vs
                      </div>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Title Section */}
          <div className="mt-6 sm:mt-8 md:mt-10 text-center mx-auto px-4 sm:px-6 md:px-0">
            <p className="text-[#616161] text-[10px] sm:text-xs font-bold tracking-[0.5px] sm:tracking-[1px] mb-2 uppercase">
              {limitedProducts?.length > 0 ? `${limitedProducts.length * 100} FACTS IN COMPARISON` : "250 FACTS IN COMPARISON"}
            </p>
            <h1 className="text-black text-lg sm:text-xl md:text-2xl lg:text-[40px] leading-[1.2] sm:leading-[1.1] m-0 font-bold break-words px-2">
              {productNames.length > 0 ? (
                productNames.map((name, idx) => (
                  <React.Fragment key={idx}>
                    <span className="inline-block">{name}</span>
                    {idx < productNames.length - 1 && (
                      <span className="border-b border-black mx-1 sm:mx-2 pb-1 inline-block">vs</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <>
                  Product 1{" "}
                  <span className="border-b border-black mx-1 sm:mx-2 pb-1">vs</span>
                  {" "}Product 2
                </>
              )}
            </h1>
          </div>
        </div>

        <div className="bg-[#f6f7fb] mt-4 sm:mt-6 py-6 sm:py-8 md:py-10 flex relative">
          <div className="border border-gray-500 w-[120px] lg:w-[160px] absolute top-5 left-2 sm:left-10 lg:left-40 h-[400px] sm:h-[500px] lg:h-[600px] hidden lg:block">
            Ad
          </div>

          <div className="max-w-[1280px] w-full lg:w-[55%] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-16 px-2 sm:px-4 md:px-6 lg:px-10 border-b border-gray-400 overflow-x-auto scrollbar-hide">
              {productNames.length > 0 ? (
                productNames.map((name, index) => {
                  const isActive = comparisonItem === name;
                  return (
                    <div
                      key={index}
                      className={`py-2 cursor-pointer whitespace-nowrap transition-all duration-200 text-sm sm:text-base ${
                        isActive
                          ? "border-b-2 font-semibold"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      style={{
                        borderColor: isActive ? productColors[index] : 'transparent',
                        color: isActive ? productColors[index] : undefined
                      }}
                      onClick={() => setComparisonItem(name)}
                    >
                      {name}
                    </div>
                  );
                })
              ) : (
                <>
                  <div
                    className={`py-2 cursor-pointer transition-all duration-200 text-sm sm:text-base ${
                      comparisonItem === "Product 1"
                        ? "border-b-2 border-[#434343] font-semibold text-[#434343]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setComparisonItem("Product 1")}
                  >
                    Product 1
                  </div>
                  <div
                    className={`py-2 cursor-pointer transition-all duration-200 text-sm sm:text-base ${
                      comparisonItem === "Product 2"
                        ? "border-b-2 border-[#3F51B5] font-semibold text-[#3F51B5]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setComparisonItem("Product 2")}
                  >
                    Product 2
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="relative pl-0 lg:pl-0" ref={radarSectionRef}>
                <RadarChart 
                  products={limitedProducts}
                  productNames={productNames}
                  productColors={productColors}
                />

                {/* Sticky Icons Sidebar - Only visible when scrolling past radar chart */}
                <div className={`hidden lg:flex flex-col gap-2 fixed left-2 xl:left-4 2xl:left-8 -bottom-20 -translate-y-1/2 z-[100] transition-all duration-300 ${
                  showStickyIcons ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                }`}>
                  {icons.map((icon, index) => {
                    const isActive = activeScrollFeature === icon.tooltip || selectedFeature === icon.tooltip;
                    // Find corresponding section title
                    const sectionTitle = Object.keys(titleToTooltip).find(
                      key => titleToTooltip[key] === icon.tooltip
                    );
                    
                    return (
                      <div
                        key={index}
                        className={`group relative flex items-center cursor-pointer transition-all duration-200 ${
                          isActive ? "z-10" : ""
                        }`}
                        onClick={() => {
                          if (sectionTitle) {
                            scrollToSection(sectionTitle);
                          }
                          handleSelectFeature(icon.tooltip);
                        }}
                      >
                        {/* Icon container */}
                        <div
                          className={`border p-2 sm:p-2.5 rounded-lg shadow-lg text-lg sm:text-xl flex items-center justify-center transition-all duration-200 ${
                            isActive
                              ? "bg-[#434343] text-white border-[#434343] rounded-r-none"
                              : "bg-white border-gray-200 text-gray-600 group-hover:border-[#434343] group-hover:text-[#434343]"
                          }`}
                        >
                          {icon.isApiIcon && isActive ? (
                            <div style={{ filter: 'invert(1)' }}>
                          {icon.icon}
                            </div>
                          ) : (
                            icon.icon
                          )}
                        </div>
                        
                        {/* Expandable label - shows on hover or when active */}
                        <div
                          className={`absolute left-full ml-0 overflow-hidden transition-all duration-200 whitespace-nowrap ${
                            isActive 
                              ? " opacity-100" 
                              : "max-w-0 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <span
                            className={`inline-block px-2 sm:px-3 py-[8px] sm:py-[10px] rounded-r-lg text-xs sm:text-sm font-medium border-y border-r transition-all duration-200 ${
                              isActive
                                ? "bg-[#434343] text-white border-[#434343]"
                                : "bg-white text-gray-700 border-gray-200 group-hover:border-[#434343] group-hover:text-[#434343]"
                            }`}
                          >
                            {icon.tooltip}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Original horizontal icons for mobile/tablet */}
                <div className="flex justify-center flex-wrap sm:flex-nowrap flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 lg:mt-0 lg:static lg:hidden px-2 sm:px-0">
                  {icons.map((icon, index) => {
                    const isActive = selectedFeature === icon.tooltip || activeScrollFeature === icon.tooltip;
                    return (
                    <div
                      key={index}
                      className={`border p-1.5 sm:p-2 rounded-md shadow-xl text-base sm:text-lg lg:text-xl cursor-pointer transition-all duration-200 ${
                          isActive
                          ? "bg-[#434343] text-white border-[#434343]"
                          : "bg-white border-gray-200 text-gray-600"
                      }`}
                      onClick={() => handleSelectFeature(icon.tooltip)}
                    >
                        {icon.isApiIcon && isActive ? (
                          <div style={{ filter: 'invert(1)' }}>
                      {icon.icon}
                    </div>
                        ) : (
                          icon.icon
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center divide-x absolute bottom-0 left-[25%]">
                  {productNames.length > 0 ? (
                    productNames.map((name, index) => (
                      <div key={index} className="flex flex-col items-center px-2 sm:px-3 md:px-4">
                        <span 
                          className="text-xl sm:text-2xl font-bold"
                          style={{ color: productColors[index] }}
                        >
                          {limitedProducts?.[index]?.scoreValue || icons?.find((icon) => icon.tooltip === selectedFeature)?.[`item${index + 1}points`] || (75 + index * 10)}
                        </span>
                        <span className="font-light text-[#616161] text-xs sm:text-sm">Points</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex flex-col items-center px-2 sm:px-3 md:px-4">
                        <span className="text-[#434343] text-xl sm:text-2xl font-bold">
                          {icons?.find((icon) => icon.tooltip === selectedFeature)
                            ?.item1points || 75}
                        </span>
                        <span className="font-light text-[#616161] text-xs sm:text-sm">Points</span>
                      </div>
                      <div className="flex flex-col items-center px-2 sm:px-3 md:px-4">
                        <span className="text-[#3F51B5] text-xl sm:text-2xl font-bold">
                          {icons?.find((icon) => icon.tooltip === selectedFeature)
                            ?.item2points || 85}
                        </span>
                        <span className="font-light text-[#616161] text-xs sm:text-sm">Points</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 lg:mt-0">
                {/* Right side content beside radar chart */}
                {limitedProducts?.length === 1 && primaryFeatureScores.length > 0 ? (
                  /* Single-product feature review UI (circles) */
                  <div className="bg-[#E6E7EE] rounded-xl shadow-md px-4 py-4 sm:px-5 sm:py-5">
                    <h3 className="font-bold text-sm sm:text-base mb-3 text-[#434343]">
                      {productNames[0]} Review
                    </h3>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {primaryFeatureScores.map((item, idx) => {
                        const progress = Math.max(0, Math.min(10, item.score));
                        const percent = (progress / 10) * 100;
                        const color =
                          progress >= 8 ? "#24B200" : "#F29A1F";
                        return (
                          <div
                            key={`${item.name}-${idx}`}
                            className="flex flex-col items-center min-w-[70px]"
                          >
                            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: `conic-gradient(${color} ${percent}%, #e5e7eb ${percent}%)`,
                                }}
                              />
                              <div className="absolute inset-0 m-auto flex flex-col items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full">
                                <p className="text-lg font-bold text-[#434343]">
                                  {item?.score}
                                </p>
                              </div>
                            </div>
                            <span className="mt-1 text-[10px] sm:text-xs text-[#616161] text-center leading-tight">
                              {item?.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : limitedProducts?.length >= 2 && ratingRows.length > 0 ? (
                  /* Ratings table view for 2–3 products */
                  <div className="bg-[#E6E7EE] rounded-2xl shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] overflow-hidden px-2 sm:px-3 py-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[#434343] mb-2 px-1">
                      Ratings
                    </h3>
                    {/* Header row */}
                    <div
                      className="grid text-[10px] sm:text-xs font-semibold text-[#434343] border-b border-[#d1d9e6] bg-[#E6E7EE]"
                      style={{
                        gridTemplateColumns: `1.8fr repeat(${Math.min(
                          3,
                          limitedProducts.length
                        )}, minmax(0, 1.4fr))`,
                      }}
                    >
                      <div className="px-2 py-1.5 border-r border-[#d1d9e6]">
                        Rating
                      </div>
                      {limitedProducts.slice(0, 3).map((_, idx) => (
                        <div
                          key={idx}
                          className="px-2 py-1.5 text-center border-r last:border-r-0 border-[#d1d9e6] truncate"
                        >
                          {productNames[idx] || `Product ${idx + 1}`}
                        </div>
                      ))}
                    </div>

                    {/* Rating rows */}
                    <div className="divide-y divide-[#d1d9e6]">
                      {ratingRows.map((row, rowIdx) => (
                        <div
                          key={`${row.name}-${rowIdx}`}
                          className="grid text-[10px] sm:text-xs text-[#222222] bg-[#E6E7EE]"
                          style={{
                            gridTemplateColumns: `1.8fr repeat(${row.scores.length}, minmax(0, 1.4fr))`,
                          }}
                        >
                          <div className="px-2 py-1.5 border-r border-[#d1d9e6] text-[#d02626] font-medium truncate">
                            {row.name}
                          </div>
                          {row.scores.map((score, idx) => {
                            const clamped = Math.max(0, Math.min(10, score));
                            const percent = (clamped / 10) * 100;
                            const color = clamped >= 8 ? "#24B200" : "#F29A1F";
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-center px-2 py-1.5"
                              >
                                {clamped > 0 ? (
                                  <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full">
                                    <div
                                      className="absolute inset-0 rounded-full"
                                      style={{
                                        background: `conic-gradient(${color} ${percent}%, #e5e7eb ${percent}%)`,
                                      }}
                                    />
                                    <div className="absolute inset-[3px] rounded-full bg-white flex items-center justify-center">
                                      <span className="text-[10px] sm:text-xs font-bold text-[#434343] leading-none">
                                        {clamped}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[#999999]">-</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Fallback: keep comparison summary if no ratings data */
                  <>
                    {productNames.length > 0 ? (
                      <ComparisonSummary
                        comparisonItem1={comparisonItem || productNames[0]}
                        comparisonItem2={
                          productNames.filter(
                            (name) => name !== comparisonItem
                          )[0] ||
                          productNames[1] ||
                          "Product 2"
                        }
                        selectedFeature={selectedFeature}
                      />
                    ) : (
                      <ComparisonSummary
                        comparisonItem1={"Product 1"}
                        comparisonItem2={"Product 2"}
                        selectedFeature={selectedFeature}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border border-gray-500 w-[120px] lg:w-[160px] absolute top-5 right-2 sm:right-10 lg:right-40 h-[400px] sm:h-[500px] lg:h-[600px] hidden lg:block">
            Ad
          </div>
        </div>

        <MostPopularComparison popularComparison={popularComparisonList} />

        {/* Key Specs - Only show when there's one product */}
        {limitedProducts?.length === 1 && (
          <KeySpecs product={limitedProducts[0]} />
        )}

        <PriceComparison />

        <UserReviews
          products={limitedProducts || []}
          colors={productColors}
          activeIndex={activeCompareIndex}
          onChangeActiveIndex={(idx) => {
            const next = productNames[idx];
            if (next) setComparisonItem(next);
          }}
        />

        {featureSections.map((section, index) => (
          <div
            key={section.title}
            ref={(el) => {
              sectionRefs.current[section.title] = el;
            }}
            data-section-title={section.title}
          >
            <FeatureSection
              icon={section.icon}
              title={section.title}
              background={section.background}
              subfeatures={section.subfeatures}
              productNames={productNames}
              isSingleProduct={limitedProducts?.length === 1}
              score={section.score}
            />
          </div>
        ))}

        <PriceComparison />

        <div className="max-w-[700px] mx-auto mt-4 px-4 sm:px-6 md:px-0 h-[150px] sm:h-[180px] md:h-[200px] border border-gray-500 mb-12 sm:mb-16 md:mb-20">
          Ad
        </div>

        {/* Best Smartphones Carousel */}
        {bestSmartphoneProducts && bestSmartphoneProducts.length > 0 && (
          <BestSmartphones products={bestSmartphoneProducts} />
        )}
      </div>
    </div>
  );
};

export default ComparePage;
