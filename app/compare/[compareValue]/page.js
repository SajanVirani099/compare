"use client";
import RadarChart from "@/components/radarChart/radarChart";
import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { IoShareSocialOutline } from "react-icons/io5";
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
import Footer from "@/components/Footer";

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
  const [selectedProductForSpecs, setSelectedProductForSpecs] = useState(null);
  const radarSectionRef = useRef(null);
  const productSliderRef = useRef(null);
  const mostPopularSectionRef = useRef(null);
  const headerSectionRef = useRef(null);
  const footerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  // Normalize API response structure
  const comparisonResponse = resultProduct?.data || resultProduct || {};
  const comparedProducts =
    comparisonResponse?.comparedProducts || comparisonResponse?.data?.comparedProducts || [];

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
  
  // Feature scores for the selected product (used for Key Specs view)
  const selectedProductFeatureScores = useMemo(() => {
    if (!selectedProductForSpecs?.featureData) return [];
    const featureData = selectedProductForSpecs.featureData || [];

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
        const icon = feature?.icon || feature?.featureId?.icon;

        const numericScore = score || 0;
        // Normalize: API may send 0–100, but UI expects 0–10
        const normalizedScore =
          numericScore > 10 ? Math.round(numericScore / 10) : numericScore;

        // Get icon component
        const apiIcon = icon ? `${imageUrl}${icon}` : null;
        const iconComponent = apiIcon 
          ? <img src={apiIcon} alt={name} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          : getFeatureIcon(name, 20);

        return {
          name,
          score: normalizedScore,
          icon: iconComponent,
          iconUrl: apiIcon,
        };
      })
      .filter((item) => item.name);
  }, [selectedProductForSpecs]);

  // Feature scores for the primary product (used for single-product view - fallback)
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
        const icon = feature?.icon || feature?.featureId?.icon;

        const numericScore = score || 0;
        // Normalize: API may send 0–100, but UI expects 0–10
        const normalizedScore =
          numericScore > 10 ? Math.round(numericScore / 10) : numericScore;

        // Get icon component
        const apiIcon = icon ? `${imageUrl}${icon}` : null;
        const iconComponent = apiIcon 
          ? <img src={apiIcon} alt={name} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          : getFeatureIcon(name, 20);

        return {
          name,
          score: normalizedScore,
          icon: iconComponent,
          iconUrl: apiIcon,
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
      // Set default selected product for Key Specs
      setSelectedProductForSpecs(limitedProducts[0]);
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

  // Slider scroll handler
  const scrollSlider = (direction) => {
    if (!productSliderRef.current) return;
    const container = productSliderRef.current;
    const cardWidth = container.offsetWidth;
    const scrollAmount = cardWidth;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Check scroll position for slider navigation
  useEffect(() => {
    const checkScroll = () => {
      if (!productSliderRef.current) return;
      const container = productSliderRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
      );
    };

    const container = productSliderRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
      };
    }
  }, [limitedProducts]);

  // Track scroll to show/hide sticky icons and make header sticky
  useEffect(() => {
    const handleScroll = () => {
      // Handle header sticky - check if header is stuck
      if (headerSectionRef.current) {
        const headerRect = headerSectionRef.current.getBoundingClientRect();
        const navbarHeight = 95;
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Header is stuck when its top position is at or below navbar height
        const isStuck = headerRect.top <= navbarHeight;
        setIsHeaderSticky(isStuck);
      }

      // Handle sticky icons visibility
      if (radarSectionRef.current && mostPopularSectionRef.current && footerRef.current) {
        const radarRect = radarSectionRef.current.getBoundingClientRect();
        const mostPopularRect = mostPopularSectionRef.current.getBoundingClientRect();
        const footerRect = footerRef.current.getBoundingClientRect();
        
        // Check if MostPopularComparison section is in view or scrolled past
        const isMostPopularVisible = mostPopularRect.top < window.innerHeight && mostPopularRect.bottom > 0;
        
        // Check if footer is in view or scrolled past
        const isFooterVisible = footerRect.top < window.innerHeight;
        
        // Show sticky icons when radar section is scrolled past AND MostPopularComparison is not visible AND footer is not visible
        const shouldShow = radarRect.bottom < 100 && !isMostPopularVisible && !isFooterVisible;
        setShowStickyIcons(shouldShow);
      } else if (radarSectionRef.current && footerRef.current) {
        const radarRect = radarSectionRef.current.getBoundingClientRect();
        const footerRect = footerRef.current.getBoundingClientRect();
        const isFooterVisible = footerRect.top < window.innerHeight;
        // Show sticky icons when radar section is scrolled past AND footer is not visible
        setShowStickyIcons(radarRect.bottom < 100 && !isFooterVisible);
      } else if (radarSectionRef.current) {
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-0 pt-4 sm:pt-6">
          <div 
            ref={headerSectionRef}
            className={`rounded-2xl bg-[#E6E7EE] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] py-4 sm:py-6 md:py-8 transition-all duration-200 mb-4 sm:mb-6 ${
              isHeaderSticky ? 'fixed z-[9999]' : 'sticky z-[9999]'
            }`}
            style={isHeaderSticky ? {
              position: 'fixed',
              top: '75px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 2rem)',
              maxWidth: '1280px',
              paddingLeft: '1rem',
              paddingRight: '1rem'
            } : {
              position: 'sticky',
              top: '95px',
            }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#d1d9e6] px-4 sm:px-6 md:px-6">
              <p className="text-xs sm:text-sm break-words text-[#616161]">
                <Link href="/" className="hover:text-[#434343]">Home</Link> &gt; {comparisonCategory || "smartphone"} &gt;{" "}
                <span className="text-[#434343]">
                  {productNames.length > 0 ? productNames.join(" vs ") : "Product Comparison"}
                </span>
              </p>
              <button
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center flex-shrink-0"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: productNames.join(" vs ") || "Product Comparison",
                      url: window.location.href,
                    });
                  }
                }}
                aria-label="Share"
              >
                <IoShareSocialOutline className="w-5 h-5 sm:w-6 sm:h-6 text-[#434343]" />
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#434343] mb-4 sm:mb-6 px-4 sm:px-6 md:px-6">
              {productNames.length > 0 ? productNames.join(" vs ") : "Product Comparison"}
            </h1>

            {/* Decorative Line */}
            <div className="h-px bg-[#d1d9e6] mb-4 sm:mb-6"></div>

            {/* TABS - Neumorphic Style (Up Theme) */}
            <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-6">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-xl whitespace-nowrap text-xs sm:text-sm md:text-base font-medium transition-all my-2 ${
                    selectedTab === index
                      ? "bg-[#E6E7EE] text-[#434343] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] font-semibold"
                      : "bg-[#E6E7EE] text-[#616161] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                  }`}
                  onClick={() => setSelectedTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>

          
          </div>
          {/* Spacer to prevent content jump when header becomes fixed */}
          {isHeaderSticky && (
            <div className="h-[1px] mb-4 sm:mb-6" style={{ height: headerSectionRef.current?.offsetHeight || 'auto' }}></div>
          )}
        </div>

        <div className="max-w-[1280px] mx-auto mt-4 px-4 sm:px-6 md:px-0">
          {limitedProducts?.length === 1 ? (
            /* Single Product View - First Image Wireframe */
            (() => {
              const product = limitedProducts[0];
              const productName = getProductName(product, 1);
              const productImage = product?.thumbnail 
                ? `${imageUrl}${product.thumbnail}` 
                : `/compare-item-1.jpg`;
              const productScore = product?.scoreValue || 0;
              const storage = product?.storage || product?.internalStorage || null;
              const ram = product?.ram || product?.memory || null;
              const configuration = storage && ram 
                ? `${ram} + ${storage}` 
                : storage || ram || "1GB + 16GB";

              return (
                <div className="max-w-[600px] mx-auto">
                  {/* Variant Selector - Neumorphic Up Theme */}
                  <div className="mb-4 sm:mb-6">
                    <div className="px-4 py-3 rounded-xl bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] text-sm sm:text-base text-[#434343] font-medium">
                      {configuration}
                    </div>
                  </div>

                  {/* Phone Image Container - Neumorphic Up/Down Theme */}
                  <div className="relative w-full flex items-center justify-center bg-[#E6E7EE] rounded-2xl shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] p-6 sm:p-8 min-h-[300px] sm:min-h-[400px]">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                        className="max-h-[300px] sm:max-h-[400px] w-auto object-contain"
                      />
                    ) : (
                      <div className="text-[#616161] text-center">
                        <CiMobile1 size={120} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No image available</p>
                      </div>
                    )}
                    
                    {/* Expand Popup Indicator - Top Right with "9" */}
                    <button
                      className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center group"
                      onClick={() => {
                        // Handle expand popup - could open a modal or navigate
                        console.log("Expand popup clicked");
                      }}
                      aria-label="Expand popup"
                    >
                      <span className="text-sm sm:text-base font-bold text-[#434343]">9</span>
                      <span className="absolute -right-16 sm:-right-20 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#616161] whitespace-nowrap">
                        Expand popup
                      </span>
                    </button>
                  </div>

                 
                </div>
              );
            })()
          ) : (
            /* Multiple Products View - Third/Fourth Image Wireframe */
            <div className="relative">
              {/* Mobile Slider View */}
              <div className="relative sm:hidden">
                {/* Left Navigation Arrow */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollSlider('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-[#E6E7EE] rounded-full shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] transition-all"
                    aria-label="Previous product"
                  >
                    <svg className="w-5 h-5 text-[#434343]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Slider Container */}
                <div
                  ref={productSliderRef}
                  className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-2 px-2"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {limitedProducts?.map((product, index) => {
                    const color = productColors[index] || productColors[0];
                    const productName = getProductName(product, index + 1);
                    const productImage = product?.thumbnail 
                      ? `${imageUrl}${product.thumbnail}` 
                      : `/compare-item-${index + 1}.jpg`;
                    const productPrice = product?.price || product?.amazonPrice || null;
                    const productScore = product?.scoreValue || 75;
                    const storage = product?.storage || product?.internalStorage || null;
                    const ram = product?.ram || product?.memory || null;
                    const configuration = storage && ram 
                      ? `${ram} + ${storage}` 
                      : storage || ram || "";

                    return (
                      <div
                        key={product?._id || index}
                        className="flex-shrink-0 w-full snap-center px-2"
                      >
                        <div className="relative flex flex-col px-4 py-6 bg-[#E6E7EE] rounded-2xl shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]">
                          {/* Product Name and Variant */}
                          <div className="mb-3">
                            <p className="font-bold text-lg text-center mb-2 break-words px-2 text-[#434343]">
                              {productName}
                            </p>
                            <p className="text-sm text-center text-[#616161]">{configuration}</p>
                          </div>

                          {/* Product Image Container - Neumorphic */}
                          <div className="relative mt-4 w-full flex items-center justify-center min-h-[200px] bg-[#E6E7EE] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] p-4">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={productName}
                                className="h-[200px] w-full object-contain object-top"
                              />
                            ) : (
                              <CiMobile1 size={120} className="opacity-30" />
                            )}
                            
                            {/* Score Badge - Top Right */}
                            <div className="absolute top-2 right-2">
                              <div className="relative w-12 h-12 flex items-center justify-center">
                                <div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: `conic-gradient(${color} ${productScore}%, #e5e7eb ${productScore}%)`,
                                  }}
                                />
                                <div className="absolute inset-[2px] rounded-full bg-[#E6E7EE] flex flex-col items-center justify-center shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]">
                                  <span className="text-xs font-bold text-[#434343] leading-none">
                                    {productScore}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price Button - Bottom */}
                          {productPrice && (
                            <div className="mt-4 flex justify-center">
                              <button className="px-6 py-2.5 rounded-xl bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all text-sm font-semibold text-[#434343]">
                                ₹ {productPrice.toLocaleString()}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* VS Badge between products */}
                        {index < (limitedProducts?.length || 0) - 1 && (
                          <div className="flex justify-center items-center py-3">
                            <div className="w-12 h-12 rounded-full bg-[#E6E7EE] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] flex items-center justify-center">
                              <span className="font-bold text-[#434343] text-sm">VS</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right Navigation Arrow */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollSlider('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-[#E6E7EE] rounded-full shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] transition-all"
                    aria-label="Next product"
                  >
                    <svg className="w-5 h-5 text-[#434343]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Desktop Grid View */}
              <div className={`hidden sm:grid relative w-full mx-auto ${
                limitedProducts?.length === 2 
                  ? "grid-cols-2 gap-4 sm:gap-6" 
                  : "grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              }`}>
                {limitedProducts?.map((product, index) => {
                  const color = productColors[index] || productColors[0];
                  const productName = getProductName(product, index + 1);
                  const productImage = product?.thumbnail 
                    ? `${imageUrl}${product.thumbnail}` 
                    : `/compare-item-${index + 1}.jpg`;
                  const productPrice = product?.price || product?.amazonPrice || null;
                  const productScore = product?.scoreValue || 75;
                  const storage = product?.storage || product?.internalStorage || null;
                  const ram = product?.ram || product?.memory || null;
                  const configuration = storage && ram 
                    ? `${ram} + ${storage}` 
                    : storage || ram || "";

                  return (
                    <React.Fragment key={product?._id || index}>
                      <div className="relative flex flex-col px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-[#E6E7EE] rounded-2xl shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]">
                        {/* Product Name and Variant */}
                        <div className="mb-3">
                          <p className="font-bold text-base sm:text-lg md:text-xl text-center mb-2 break-words px-2 text-[#434343]">
                            {productName}
                          </p>
                          <p className="text-xs sm:text-sm text-center text-[#616161]">{configuration}</p>
                        </div>

                        {/* Product Image Container - Neumorphic */}
                        <div className="relative mt-2 sm:mt-4 w-full flex-1 flex items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px] bg-[#E6E7EE] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] p-4">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={productName}
                              className="h-[200px] sm:h-[250px] md:h-[300px] w-full object-contain object-top"
                            />
                          ) : (
                            <CiMobile1 size={120} className="opacity-30" />
                          )}
                          
                          {/* Score Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: `conic-gradient(${color} ${productScore}%, #e5e7eb ${productScore}%)`,
                                }}
                              />
                              <div className="absolute inset-[2px] rounded-full bg-[#E6E7EE] flex flex-col items-center justify-center shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]">
                                <span className="text-xs sm:text-sm font-bold text-[#434343] leading-none">
                                  {productScore}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price Button - Bottom */}
                        {productPrice && (
                          <div className="mt-4 sm:mt-6 flex justify-center">
                            <button className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-xl bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all text-xs sm:text-sm font-semibold text-[#434343]">
                              ₹ {productPrice.toLocaleString()}
                            </button>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
                
                {/* Desktop VS Badge - Centered between products (only for 2 products) */}
                {limitedProducts?.length === 2 && (
                  <div className="hidden sm:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E6E7EE] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] flex items-center justify-center">
                      <span className="font-bold text-[#434343] text-sm sm:text-base">VS</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Title Section - 0 Level Header */}
          <div className="mt-6 sm:mt-8 md:mt-10 text-center mx-auto px-4 sm:px-6 md:px-0">
            <p className="text-[#616161] text-[10px] sm:text-xs font-bold tracking-[0.5px] sm:tracking-[1px] mb-2 uppercase">
              {limitedProducts?.length > 0 ? `${limitedProducts.length * 100} FACTS IN COMPARISON` : "250 FACTS IN COMPARISON"}
            </p>
            <h1 className="text-[#434343] text-lg sm:text-xl md:text-2xl lg:text-[40px] leading-[1.2] sm:leading-[1.1] m-0 font-bold break-words px-2">
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
         

          <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-0 bg-[#E6E7EE] border-[#d1d9e6] rounded-xl shadow-soft">
            {/* Product Selection Buttons - Neumorphic Theme (Rounded Square) */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 md:px-6 lg:px-10 pb-4 sm:pb-5 overflow-x-auto scrollbar-hide pt-6 border-b-[2px] border-[#d1d9e6]">
              {limitedProducts && limitedProducts.length > 0 ? (
                limitedProducts.map((prod, idx) => {
                  const productName = getProductName(prod, idx + 1);
                  const isActive = comparisonItem === productName || (comparisonItem === "" && idx === 0);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setComparisonItem(productName);
                        setSelectedProductForSpecs(prod);
                      }}
                      className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#E6E7EE] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] text-[#434343] font-semibold"
                          : "bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] text-[#616161] hover:text-[#434343] hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                      }`}
                    >
                      {productName}
                    </button>
                  );
                })
              ) : (
                <>
                  <button
                    onClick={() => {
                      setComparisonItem("Product 1");
                      if (limitedProducts && limitedProducts.length > 0) {
                        setSelectedProductForSpecs(limitedProducts[0]);
                      }
                    }}
                    className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all ${
                      comparisonItem === "Product 1" || comparisonItem === ""
                        ? "bg-[#E6E7EE] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] text-[#434343] font-semibold"
                        : "bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] text-[#616161] hover:text-[#434343] hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                    }`}
                  >
                    Product 1
                  </button>
                  <button
                    onClick={() => {
                      setComparisonItem("Product 2");
                      if (limitedProducts && limitedProducts.length > 1) {
                        setSelectedProductForSpecs(limitedProducts[1]);
                      }
                    }}
                    className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all ${
                      comparisonItem === "Product 2"
                        ? "bg-[#E6E7EE] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] text-[#434343] font-semibold"
                        : "bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] text-[#616161] hover:text-[#434343] hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                    }`}
                  >
                    Product 2
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 px-2 sm:px-4 md:px-6 lg:px-10">
              <div className="relative pl-0 lg:pl-0 min-w-0" ref={radarSectionRef}>
                <RadarChart 
                  products={selectedProductForSpecs ? [selectedProductForSpecs] : limitedProducts}
                  productNames={selectedProductForSpecs ? [getProductName(selectedProductForSpecs)] : productNames}
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

              
              </div>

              <div className="mt-4 lg:mt-0">
                {/* Key Specs Section - Always Show for 1, 2, or 3 products */}
                {selectedProductForSpecs && (() => {
                  const product = selectedProductForSpecs;
                  
                  // Get key specs from featureData with icons from API
                  const keySpecsList = (() => {
                    if (!product?.featureData) return [];
                    
                    const specs = [];
                    product.featureData.forEach((feature) => {
                      const featureName = feature?.featureName || feature?.featureId?.featureName || "";
                      const icon = feature?.icon || feature?.featureId?.icon;
                      const subfeatures = feature?.subfeatures || [];
                      
                      // Get first important subfeature for each feature
                      const firstSubfeature = subfeatures.find(sf => sf?.name && (sf?.details || sf?.unit || sf?.isTrueFalse));
                      if (firstSubfeature) {
                        const value = firstSubfeature?.details || 
                                     (firstSubfeature?.isTrueFalse === "true" || firstSubfeature?.isTrueFalse === true ? "Yes" : 
                                      firstSubfeature?.isTrueFalse === "false" || firstSubfeature?.isTrueFalse === false ? "No" : 
                                      `${firstSubfeature?.unit || ""} ${firstSubfeature?.unitsymbol || ""}`.trim()) || "N/A";
                        
                        specs.push({
                          label: firstSubfeature.name,
                          value: value,
                          icon: icon ? `${imageUrl}${icon}` : null,
                          featureName: featureName
                        });
                      }
                    });
                    
                    return specs.slice(0, 8); // Limit to 8 key specs
                  })();

                  return (
                    <div>
                      {/* Product Selection Buttons - Neumorphic Up Theme (Above Header) */}
                      {/* {limitedProducts.length > 1 && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                          {limitedProducts.map((prod, idx) => {
                            const isSelected = selectedProductForSpecs?._id === prod._id;
                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedProductForSpecs(prod)}
                                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all ${
                                  isSelected
                                    ? "bg-[#E6E7EE] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] text-[#434343] font-semibold"
                                    : "bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] text-[#616161] hover:text-[#434343] hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
                                }`}
                              >
                                {getProductName(prod, idx + 1)}
                              </button>
                            );
                          })}
                        </div>
                      )} */}
                      
                      {/* Section Header - 0 Level (Completely Flat - No Shadows, No Background) */}
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#434343] mb-4 sm:mb-5 md:mb-6">
                        Key Specs
                      </h3>
                      {/* Content - Neumorphic Theme (Up and Down) */}
                      <div className="bg-[#E6E7EE] rounded-2xl shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] p-3 sm:p-4 md:p-5 lg:p-6">
                        
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                          {keySpecsList.length > 0 ? (
                            keySpecsList.map((spec, idx) => (
                              <div
                                key={idx}
                                className="p-3 sm:p-3.5 md:p-4 rounded-xl bg-[#E6E7EE] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] transition-all duration-200"
                              >
                                <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                                  {/* Icon - Top (Neumorphic Up Theme) */}
                                  {spec.icon ? (
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center p-1.5 sm:p-2 flex-shrink-0 hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] transition-all duration-200">
                                      <img
                                        src={spec.icon}
                                        alt={spec.label}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center flex-shrink-0 hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] transition-all duration-200">
                                      <span className="text-sm sm:text-base font-bold text-[#616161]">
                                        {spec.label.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                  {/* Label - Below Icon */}
                                  <p className="text-xs sm:text-sm md:text-base font-medium text-[#616161] leading-tight">
                                    {spec.label}
                                  </p>
                                  {/* Value - Below Label */}
                                  <p className="text-xs sm:text-sm md:text-base font-bold text-[#434343] break-words line-clamp-2 leading-tight">
                                    {spec.value}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-8 text-[#616161]">
                              <p className="text-sm">No specifications available</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom Info Section - Zero Level Headers - 3 Columns with Dividers */}
                        <div className="mt-5 sm:mt-6 md:mt-7 pt-4 sm:pt-5 border-t-2 border-[#d1d9e6]">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#d1d9e6]">
                            {/* {product?.marketStatus && ( */}
                              <div className="sm:pr-4 md:pr-6">
                                <p className="text-xs sm:text-sm font-medium text-[#616161] mb-1.5 sm:mb-2">Market status</p>
                                <p className="text-sm sm:text-base md:text-lg font-bold text-[#434343]">{product.marketStatus}</p>
                              </div>
                            {/* )} */}
                            {/* {product?.releaseDate && ( */}
                              <div className="pt-4 sm:pt-0 sm:px-4 md:px-6">
                                <p className="text-xs sm:text-sm font-medium text-[#616161] mb-1.5 sm:mb-2">Released date</p>
                                <p className="text-sm sm:text-base md:text-lg font-bold text-[#434343]">{product.releaseDate}</p>
                              </div>
                            {/* )} */}
                            {/* {product?.officialWebsite && ( */}
                              <div className="pt-4 sm:pt-0 sm:pl-4 md:pl-6">
                                <p className="text-xs sm:text-sm font-medium text-[#616161] mb-1.5 sm:mb-2">Official website</p>
                                <a
                                  href={product.officialWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm sm:text-base md:text-lg font-bold text-[#434343] hover:underline"
                                >
                                  Visit website
                                </a>
                              </div>
                            {/* )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

        
        </div>

        <MostPopularComparison popularComparison={popularComparisonList} />


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

        <div ref={mostPopularSectionRef}>
          <MostPopularComparison popularComparison={popularComparisonList} />
        </div>

        <div className="max-w-[700px] mx-auto mt-4 px-4 sm:px-6 md:px-0 h-[150px] sm:h-[180px] md:h-[200px] border border-gray-500 mb-12 sm:mb-16 md:mb-20">
          Ad
        </div>

        {/* Best Smartphones Carousel */}
        {bestSmartphoneProducts && bestSmartphoneProducts.length > 0 && (
          <BestSmartphones products={bestSmartphoneProducts} />
        )}
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default ComparePage;
