import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL, imageUrl } from "../utils/config";
import ImageWithShimmer from "../ImageWithShimmer";

// Helper function to extract subfeature value from product
const getSubfeatureValue = (product, featureName, subfeatureName) => {
  if (!product?.featureData) return null;
  
  const feature = product.featureData.find(
    f => {
      const fName = f?.featureName || f?.featureId?.featureName || "";
      return fName.toLowerCase().includes(featureName.toLowerCase());
    }
  );
  
  if (!feature) return null;
  
  const subfeatures = feature?.subfeatures || [];
  const subfeature = subfeatures.find(
    sf => {
      const sfName = sf?.name || "";
      return sfName.toLowerCase().includes(subfeatureName.toLowerCase());
    }
  );
  
  if (!subfeature) return null;
  
  // Return formatted value
  const details = subfeature?.details || "";
  const unit = subfeature?.unit || "";
  const unitSymbol = subfeature?.unitsymbol || "";
  const isTrueFalse = subfeature?.isTrueFalse;
  
  if (isTrueFalse === "true" || isTrueFalse === true) {
    return "Yes";
  } else if (isTrueFalse === "false" || isTrueFalse === false) {
    return "No";
  } else if (details) {
    return details;
  } else if (unit) {
    return `${unit}${unitSymbol ? ` ${unitSymbol}` : ""}`;
  }
  
  return null;
};

// CircularScore component matching quick-compare
const CircularScore = React.memo(({ value = 0 }) => {
  const [progressPercent, setProgressPercent] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let rafId;
    let isCancelled = false;
    let startTimestamp = null;

    const fullSweepDurationMs = 800;
    const settleDurationMs = 500;
    const counterDurationMs = 1200;

    const animate = (timestamp) => {
      if (isCancelled) return;
      if (startTimestamp === null) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

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
      className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full p-[4px] sm:p-[5px] md:p-[6px]"
      style={{
        background: `conic-gradient(#F98A1A 0 ${progressPercent}%, #e5e7eb ${progressPercent}% 100%)`,
        zIndex: 2,
      }}
    >
      <div className="h-full w-full rounded-full bg-[#e6e7ee] shadow-inset flex flex-col items-center justify-center leading-tight">
        <span className="text-[10px] sm:text-[12px] md:text-[14px] font-extrabold">{displayCount}</span>
        <span className="text-[4px] sm:text-[6px] md:text-[8px] font-semibold">Points</span>
      </div>
    </div>
  );
});
CircularScore.displayName = "CircularScore";

const ProductCard = ({ index, phone, category }) => {
  const router = useRouter();
  const [isInComparison, setIsInComparison] = useState(false);

  // Extract product specifications from API
  const productSpecs = useMemo(() => {
    if (!phone) return {};
    
    return {
      screenSize: getSubfeatureValue(phone, "display", "screen size") || 
                  getSubfeatureValue(phone, "display", "display size") ||
                  getSubfeatureValue(phone, "design", "screen size") ||
                  phone.screenSize || null,
      ram: getSubfeatureValue(phone, "performance", "ram") ||
           getSubfeatureValue(phone, "memory", "ram") ||
           getSubfeatureValue(phone, "storage", "ram") ||
           phone.ram || null,
      ppi: getSubfeatureValue(phone, "display", "ppi") ||
           getSubfeatureValue(phone, "display", "pixel density") ||
           phone.ppi || null,
      battery: getSubfeatureValue(phone, "battery", "capacity") ||
               getSubfeatureValue(phone, "battery", "battery") ||
               phone.battery || null,
      price: phone.price || null,
      scoreValue: phone.scoreValue || 0,
      title: phone.title || phone.name || "Product",
      thumbnail: phone.thumbnail || ""
    };
  }, [phone]);

  // Check if product is in comparison list
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkComparisonList = () => {
        const existingComparisonList = localStorage.getItem("comparisonList");
        const productId = phone?._id || phone?.id;
        if (existingComparisonList && productId) {
          const list = JSON.parse(existingComparisonList);
          setIsInComparison(list.includes(productId));
        }
      };
      checkComparisonList();
      window.addEventListener("comparisonListUpdated", checkComparisonList);
      return () => {
        window.removeEventListener("comparisonListUpdated", checkComparisonList);
      };
    }
  }, [phone]);

  const handleAddToComparison = () => {
    if (typeof window !== "undefined") {
      const existingComparisonList = localStorage.getItem("comparisonList");

      let updatedList;
      const productId = phone?._id || phone?.id;
      if (!productId) return;
      
      if (!existingComparisonList) {
        updatedList = [productId];
      } else if (JSON.parse(existingComparisonList).length >= 3) {
        return;
      } else {
        updatedList = JSON.parse(existingComparisonList);
        if (updatedList.includes(productId)) {
          updatedList = updatedList.filter(id => id !== productId);
        } else {
          updatedList.push(productId);
        }
      }

      localStorage.setItem("comparisonList", JSON.stringify(updatedList));
      setIsInComparison(updatedList.includes(productId));

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("comparisonListUpdated"));
    }
  };

  return (
    <div
      key={index}
      className="relative bg-[#e6e7ee] border border-[#d1d9e6] rounded-xl shadow-inset p-4 md:p-5 md:pt-16 w-full h-fit flex gap-4 md:gap-6"
    >
      {/* Add/Remove Button - Top Right Corner of Card */}
      <div className="absolute !top-8 !right-top-8 md:!top-8 md:!right-8 z-10">
        <button
          className="add-btn no-checkmark relative"
          onClick={handleAddToComparison}
        >
          <input
            checked={isInComparison}
            type="checkbox"
            readOnly
          />
          <span className="!absolute !-top-[10px] !-left-2 sm:!-top-[12px] sm:!-left-3 md:!-top-[15px] md:!-left-4 pointer-events-none">
            {isInComparison ? (
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

      {/* Phone Image Container with Overlay Badges - Left Side */}
      <div className="relative w-[120px] md:w-[150px] lg:w-[180px] h-[120px] md:h-[150px] lg:h-[180px] flex-shrink-0 flex items-center justify-center bg-[#e6e7ee] rounded-xl shadow-inset overflow-hidden p-2 md:p-3">
        {productSpecs.thumbnail ? (
          <ImageWithShimmer
            src={BASE_URL + productSpecs.thumbnail}
            alt={productSpecs.title}
            height={180}
            width={150}
            className="object-contain max-w-full max-h-full w-auto h-auto"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
        
        {/* Points Badge - Overlay on Image */}
      </div>
        <div className="absolute top-2 left-2 sm:top-2 sm:left-2 md:top-3 md:left-3 z-10">
          <CircularScore value={productSpecs.scoreValue || 0} />
        </div>

      {/* Phone Details - Right Side */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 
          className="font-semibold text-gray-900 text-base md:text-lg mb-2 hover:text-[#F98A1A] transition-all duration-300 cursor-pointer"
          onClick={() => phone?.uniqueTitle && router.push(`/compare/${phone.uniqueTitle}`)}
        >
          {productSpecs.title}
        </h3>
        
        {/* Price */}
        {productSpecs.price && (
          <p className="text-blue-600 font-semibold text-sm md:text-base mb-3">
            {typeof productSpecs.price === 'number' 
              ? `₹${productSpecs.price.toLocaleString("en-IN")}`
              : productSpecs.price
            }
          </p>
        )}

        {/* FeatureData from API - Same as quick-compare */}
        {phone?.featureData && phone.featureData.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 text-gray-600 mt-2 border-t-[2px] border-[#d1d9e6] pt-3">
            {phone.featureData
              .slice(0, 4)
              .map((feature, idx) => (
                <div
                  key={feature._id || feature?.featureId?._id || idx}
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
                  ) : feature?.icon ? (
                    <img
                      src={`${imageUrl}${feature.icon}`}
                      alt={
                        feature.featureName ||
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
                  <span className="text-sm truncate text-gray-800">
                    {feature?.featureId?.unit ||
                      feature?.featureId?.featureName ||
                      feature?.featureName ||
                      feature?.unit ||
                      "N/A"}
                  </span>
                </div>
              ))}
          </div>
        ) : category == "phone" ? (
          /* Fallback to extracted specs if no featureData */
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            {productSpecs.screenSize && (
              <div className="text-sm text-gray-800">
                {productSpecs.screenSize}
              </div>
            )}
            {productSpecs.ram && (
              <div className="text-sm text-gray-800">
                {productSpecs.ram}
              </div>
            )}
            {productSpecs.ppi && (
              <div className="text-sm text-gray-800">
                {productSpecs.ppi}
              </div>
            )}
            {productSpecs.battery && (
              <div className="text-sm text-gray-800">
                {productSpecs.battery}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
