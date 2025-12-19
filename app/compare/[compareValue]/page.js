"use client";
import ComparisonSummary from "@/components/comparisonSummary/comparisonSummary";
import RadarChart from "@/components/radarChart/radarChart";
import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { TbVs } from "react-icons/tb";
import BestComparison from "@/components/bestComparison/bestComparison";
import { getResultProduct } from "@/app/redux/slice/blogSlice";
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

const icons = [
  {
    icon: <AiOutlineMobile />,
    tooltip: "Design",
    item1points: "80",
    item2points: "33",
  },
  {
    icon: <AiOutlinePicture />,
    tooltip: "Display",
    item1points: "90",
    item2points: "48",
  },
  {
    icon: <GiProcessor />,
    tooltip: "Performance",
    item1points: "60",
    item2points: "97",
  },
  {
    icon: <AiOutlineCamera />,
    tooltip: "Cameras",
    item1points: "75",
    item2points: "88",
  },
  {
    icon: <PiDevices />,
    tooltip: "Operating System",
    item1points: "87",
    item2points: "73",
  },
  {
    icon: <IoBatteryFullOutline />,
    tooltip: "Battery",
    item1points: "25",
    item2points: "67",
  },
  {
    icon: <SlMusicToneAlt />,
    tooltip: "Audio",
    item1points: "55",
    item2points: "52",
  },
  {
    icon: <CiCirclePlus />,
    tooltip: "Features",
    item1points: "85",
    item2points: "25",
  },
];

const ComparePage = ({ params }) => {
    const dispatch = useDispatch();
  const { resultProduct } = useSelector((state) => state.blog || {});
  const [selectedTab, setSelectedTab] = useState(0);
  const [comparisonCategory, setComparisonCategory] = useState("");
  const [comparisonItem, setComparisonItem] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [activeScrollFeature, setActiveScrollFeature] = useState("");
  const [showStickyIcons, setShowStickyIcons] = useState(false);
  const [numOfComparisons, setNumOfComparisons] = useState(0);
  const radarSectionRef = useRef(null);
  const productNames = (resultProduct || []).map((item, idx) =>
    getProductName(item, idx + 1)
  );
  const activeCompareIndex = Math.max(0, productNames.findIndex((n) => n === comparisonItem));

  // Refs for each FeatureSection
  const sectionRefs = useRef({});
  
  // Map section titles to icon tooltips (handle case differences)
  const titleToTooltip = {
    "Design": "Design",
    "Display": "Display",
    "Performance": "Performance",
    "Cameras": "Cameras",
    "Operating system": "Operating System",
    "Battery": "Battery",
    "Audio": "Audio",
    "Features": "Features",
    "Miscellaneous": "Miscellaneous"
  };

  // Feature sections configuration
  const featureSections = [
    { title: "Design", icon: <AiOutlineMobile size={28} />, background: false },
    { title: "Display", icon: <AiOutlinePicture size={28} />, background: true },
    { title: "Performance", icon: <GiProcessor size={28} />, background: false },
    { title: "Cameras", icon: <AiOutlineCamera size={28} />, background: true },
    { title: "Operating system", icon: <PiDevices size={28} />, background: false },
    { title: "Battery", icon: <IoBatteryFullOutline size={28} />, background: true },
    { title: "Audio", icon: <SlMusicToneAlt size={28} />, background: false },
    { title: "Features", icon: <CiCirclePlus size={28} />, background: true },
    { title: "Miscellaneous", icon: <TbVs size={28} />, background: false },
  ];

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

  // Set initial comparisonItem when resultProduct loads
  useEffect(() => {
    if (resultProduct && resultProduct.length > 0) {
      const firstName = getProductName(resultProduct[0], 1);
      setComparisonItem(firstName);
    }
  }, [resultProduct]);

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
  }, [resultProduct]); // Re-run when data loads

  return (
    <div className="min-h-screen bg-[#E6E7EE]">
      <Navbar />
      <div className="mx-auto mt-[95px] bg-white">
        {/* TABS */}
        <div className="w-full bg-white">
          <div className="shadow-lg bg-white w-full fixed top-[60px] z-[9999]">
            <div className="flex gap-8 max-w-[1280px] mx-auto">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`text-xs font-medium py-2 cursor-pointer ${
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

        <div className="max-w-[700px] mx-auto mt-4 h-[90px] border border-gray-500">
          Ad
        </div>

        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto mt-4">
          <p className="text-sm">
            <Link href="/">Home</Link> &gt; {comparisonCategory} comparison &gt;{" "}
            <span className="text-gray-600">
              {productNames.join(" vs ")}
            </span>
          </p>
        </div>

        {/* API data preview */}
        {resultProduct?.length > 0 && (
          <div className="max-w-[1280px] mx-auto mt-6 px-4">
            <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Comparison data</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resultProduct.map((item, idx) => (
                  <div
                    key={item?._id || item?.id || idx}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {item?.thumbnail && (
                        <img
                          src={BASE_URL + item.thumbnail}
                          alt={item?.title || item?.name || `Product ${idx + 1}`}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-sm">
                          {item?.title || item?.name || `Product ${idx + 1}`}
                        </p>
                        {item?.brand && (
                          <p className="text-xs text-gray-600">{item.brand}</p>
                        )}
                      </div>
                    </div>
                    {item?.price && (
                      <p className="text-sm text-gray-700 mt-2">
                        Price: {item.price}
                      </p>
                    )}
                    {item?.displaySize && (
                      <p className="text-xs text-gray-600 mt-1">
                        Display: {item.displaySize}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white max-w-[1280px] mx-auto mt-4">
          {/* Dynamic Product Grid */}
          <div className={`relative md:w-[90%] mx-auto grid ${
            resultProduct?.length === 1 
              ? "grid-cols-1 max-w-[400px]" 
              : resultProduct?.length === 2 
                ? "grid-cols-2" 
                : "grid-cols-3"
          } divide-x divide-gray-400`}>
            {resultProduct?.map((product, index) => {
              const color = productColors[index] || productColors[0];
              const productName = getProductName(product, index + 1);
              const productImage = product?.thumbnail 
                ? `${imageUrl}${product.thumbnail}` 
                : `/compare-item-${index + 1}.jpg`;
              const productPrice = product?.price || product?.amazonPrice || null;
              const productScore = product?.scoreValue || 75;

              return (
                <React.Fragment key={product?._id || index}>
                  <div className="relative md:px-4 py-4">
                    <div className="flex gap-2 items-start md:items-center flex-col md:flex-row">
                      <div
                        className="inline-flex items-center justify-center rounded-full text-xs font-bold bg-white"
                        style={{
                          background: `conic-gradient(${color} ${productScore}%, #e5e7eb ${productScore}%)`,
                        }}
                      >
                        <span className="text-gray-600 bg-white rounded-full flex flex-col items-center justify-center m-1 py-1.5 px-1">
                          <span className="text-base leading-[1rem]">{productScore}</span>
                          <span className="text-[10px] leading-[0.5rem]">Points</span>
                        </span>
                      </div>
                      <p className="font-bold text-lg md:text-2xl">
                        {productName}
                      </p>
                    </div>

                    <div className="relative mt-4 w-[85%] mx-auto">
                      {/* Product Image */}
                      <img
                        src={productImage}
                        alt={productName}
                        className="md:h-[350px] w-full object-contain object-top"
                      />

                      {/* Fading Effect */}
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                    </div>

                    {/* Price & Amazon Logo */}
                    {productPrice && (
                      <div className="absolute bottom-4 right-4 flex flex-col items-end">
                        <div 
                          className="rounded-full inline-flex mb-2 px-4 py-1 uppercase text-white md:text-base text-xs"
                          style={{ backgroundColor: color }}
                        >
                          New
                        </div>
                        <div 
                          className="flex items-center gap-3 pl-3 pr-4 py-1 w-fit border-[3px] rounded-full bg-white"
                          style={{ borderColor: color }}
                        >
                          <div className="flex items-center md:items-start gap-1 text-gray-700 italic">
                            <span className="font-bold md:mt-[2px]">₹</span>
                            <span className="font-bold text-base md:text-2xl">
                              {productPrice}
                            </span>
                          </div>
                          <span>
                            <img src={"/amazon.png"} className="w-[50px] mt-2 mr-4" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VS Badge - show between products */}
                  {index < (resultProduct?.length || 0) - 1 && (
                    <div 
                      className="absolute bg-white border-2 border-gray-400 rounded-full px-2.5 py-1 font-bold text-gray-600 z-10"
                      style={{
                        left: `${((index + 1) / (resultProduct?.length || 1)) * 100}%`,
                        top: '55%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      vs
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Title Section */}
          <div className="mt-10 text-center mx-auto">
            <p className="text-[#616161] text-xs font-bold tracking-[1px] mb-2 uppercase">
              {resultProduct?.length > 0 ? `${resultProduct.length * 100} FACTS IN COMPARISON` : "250 FACTS IN COMPARISON"}
            </p>
            <h1 className="text-black text-xl md:text-[40px] leading-[1.1] m-0 font-bold">
              {productNames.length > 0 ? (
                productNames.map((name, idx) => (
                  <React.Fragment key={idx}>
                    {name}
                    {idx < productNames.length - 1 && (
                      <span className="border-b border-black mx-2 pb-1">vs</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <>
                  Product 1{" "}
                  <span className="border-b border-black mx-2 pb-1">vs</span>
                  Product 2
                </>
              )}
            </h1>
          </div>
        </div>

        <div className="bg-[#f6f7fb] mt-6 py-10 flex relative">
          <div className="border border-gray-500 w-[160px] absolute top-5 left-40 h-[600px] hidden md:block">
            Ad
          </div>

          <div className="max-w-[1280px] md:w-[55%] mx-auto">
            <div className="flex gap-8 md:gap-16 px-10 border-b border-gray-400 overflow-x-auto">
              {productNames.length > 0 ? (
                productNames.map((name, index) => {
                  const isActive = comparisonItem === name;
                  return (
                    <div
                      key={index}
                      className={`py-2 cursor-pointer whitespace-nowrap transition-all duration-200 ${
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
                    className={`py-2 cursor-pointer transition-all duration-200 ${
                      comparisonItem === "Product 1"
                        ? "border-b-2 border-[#434343] font-semibold text-[#434343]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setComparisonItem("Product 1")}
                  >
                    Product 1
                  </div>
                  <div
                    className={`py-2 cursor-pointer transition-all duration-200 ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative pl-10 md:pl-0" ref={radarSectionRef}>
                <RadarChart />

                {/* Sticky Icons Sidebar - Only visible when scrolling past radar chart */}
                <div className={`hidden md:flex flex-col gap-2 fixed left-4 xl:left-8 -bottom-20 -translate-y-1/2 z-[100] transition-all duration-300 ${
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
                          className={`border p-2.5 rounded-lg shadow-lg text-xl flex items-center justify-center transition-all duration-200 ${
                            isActive
                              ? "bg-[#434343] text-white border-[#434343] rounded-r-none"
                              : "bg-white border-gray-200 text-gray-600 group-hover:border-[#434343] group-hover:text-[#434343]"
                          }`}
                        >
                          {icon.icon}
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
                            className={`inline-block px-3 py-[10px] rounded-r-lg text-sm font-medium border-y border-r transition-all duration-200 ${
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
                <div className="flex justify-center flex-col md:flex-row gap-3 absolute left-0 top-1 md:static md:hidden">
                  {icons.map((icon, index) => (
                    <div
                      key={index}
                      className={`border p-2 rounded-md shadow-xl text-xl cursor-pointer transition-all duration-200 ${
                        selectedFeature === icon.tooltip || activeScrollFeature === icon.tooltip
                          ? "bg-[#434343] text-white border-[#434343]"
                          : "bg-white border-gray-200 text-gray-600"
                      }`}
                      onClick={() => handleSelectFeature(icon.tooltip)}
                    >
                      {icon.icon}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center divide-x mt-6">
                  {productNames.length > 0 ? (
                    productNames.map((name, index) => (
                      <div key={index} className="flex flex-col items-center px-4">
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: productColors[index] }}
                        >
                          {resultProduct?.[index]?.scoreValue || icons?.find((icon) => icon.tooltip === selectedFeature)?.[`item${index + 1}points`] || (75 + index * 10)}
                        </span>
                        <span className="font-light text-[#616161]">Points</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[#434343] text-2xl font-bold">
                          {icons?.find((icon) => icon.tooltip === selectedFeature)
                            ?.item1points || 75}
                        </span>
                        <span className="font-light text-[#616161]">Points</span>
                      </div>
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[#3F51B5] text-2xl font-bold">
                          {icons?.find((icon) => icon.tooltip === selectedFeature)
                            ?.item2points || 85}
                        </span>
                        <span className="font-light text-[#616161]">Points</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                {/* Dynamic ComparisonSummary based on selected item */}
                {productNames.length > 0 ? (
                  <ComparisonSummary
                    comparisonItem1={comparisonItem || productNames[0]}
                    comparisonItem2={productNames.filter(name => name !== comparisonItem)[0] || productNames[1] || "Product 2"}
                    selectedFeature={selectedFeature}
                  />
                ) : (
                  <ComparisonSummary
                    comparisonItem1={"Product 1"}
                    comparisonItem2={"Product 2"}
                    selectedFeature={selectedFeature}
                  />
                )}
                <div className="cursor-pointer mt-4 ml-4 text-[#434343] flex gap-2 items-center">
                  <IoIosArrowDropdown color="#434343" size={16} />
                  <p className="hover:underline">
                    Scroll down for more details
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-500 w-[160px] absolute top-5 right-40 h-[600px] hidden md:block">
            Ad
          </div>
        </div>

        <MostPopularComparison />

        <PriceComparison />

        <UserReviews
          products={resultProduct || []}
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
            />
          </div>
        ))}

        <PriceComparison />

        <div className="max-w-[700px] mx-auto mt-4 h-[200px] border border-gray-500 mb-20">
          Ad
        </div>

        <BestComparison />
      </div>
    </div>
  );
};

export default ComparePage;
