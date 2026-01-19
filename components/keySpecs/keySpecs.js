"use client";
import React, { useMemo } from "react";
import { imageUrl } from "../utils/config";

// Helper function to format subfeature value
const formatSubfeatureValue = (subfeature) => {
  if (!subfeature) return null;
  
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

const KeySpecs = ({ product }) => {
  // Dynamically extract all features and their subfeatures from API
  const featuresWithSubfeatures = useMemo(() => {
    if (!product?.featureData || product.featureData.length === 0) return [];

    return product.featureData
      .map((feature) => {
        const featureName = feature?.featureName || feature?.featureId?.featureName || "";
        if (!featureName) return null;

        const subfeatures = feature?.subfeatures || [];
        const icon = feature?.icon || feature?.featureId?.icon;
        const iconUrl = icon ? `${imageUrl}${icon}` : null;

        // Get key subfeatures (first few important ones)
        const keySubfeatures = subfeatures
          .map((subfeature) => {
            const subfeatureName = subfeature?.name || "";
            const value = formatSubfeatureValue(subfeature);
            
            if (!subfeatureName || !value) return null;
            
            return {
              name: subfeatureName,
              value: value,
            };
          })
          .filter(Boolean)
          .slice(0, 3); // Limit to first 3 subfeatures per feature

        return {
          featureName: featureName,
          icon: iconUrl,
          subfeatures: keySubfeatures,
          hasSubfeatures: keySubfeatures.length > 0
        };
      })
      .filter(f => f && f.hasSubfeatures); // Only show features with subfeatures
  }, [product]);

  if (featuresWithSubfeatures.length === 0) return null;

  // Extract all subfeatures with their feature info
  // Group by feature name and combine subfeature values
  const allSpecs = featuresWithSubfeatures.map((feature) => {
    // Combine all subfeature values for this feature
    const values = feature.subfeatures.map(sf => sf.value).filter(Boolean);
    const combinedValue = values.length > 0 
      ? values.join(values.length > 1 ? " + " : "")
      : null;
    
    if (!combinedValue) return null;
    
    return {
      label: feature.featureName, // Use feature name as label
      value: combinedValue,
      icon: feature.icon,
      featureName: feature.featureName,
    };
  }).filter(Boolean);

  // Separate market status and release date for bottom row
  const marketStatus = allSpecs.find(spec => 
    spec.label.toLowerCase().includes("status") || 
    spec.label.toLowerCase().includes("market")
  );
  const releaseDate = allSpecs.find(spec => 
    spec.label.toLowerCase().includes("release") || 
    spec.label.toLowerCase().includes("date")
  );

  // Filter out market status and release date from main grid
  const mainSpecs = allSpecs.filter(spec => 
    spec !== marketStatus && spec !== releaseDate
  ).slice(0, 9); // Limit to 9 main specs for 3x3 grid

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-0 mt-8 mb-12">
      <div className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Key Specs</h2>
        
        {/* Main Specs Grid - 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {mainSpecs.map((spec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft hover:shadow-lg transition-all"
            >
              {spec.icon ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#e6e7ee] shadow-inset flex items-center justify-center p-1.5">
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
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#e6e7ee] shadow-inset flex items-center justify-center">
                  <span className="text-xs font-bold text-[#616161]">
                    {spec.label.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#616161] mb-1">{spec.label}</p>
                <p className="text-base font-bold text-gray-900">
                  {spec.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row - Market Status and Release Date */}
        {(marketStatus || releaseDate) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-[#d1d9e6]">
            {marketStatus && (
              <div className="flex items-start gap-3 p-4 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft hover:shadow-lg transition-all">
                {marketStatus.icon && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#e6e7ee] shadow-inset flex items-center justify-center p-1.5">
                    <img
                      src={marketStatus.icon}
                      alt={marketStatus.label}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#616161] mb-1">{marketStatus.label}</p>
                  <p className="text-base font-bold text-gray-900">
                    {marketStatus.value}
                  </p>
                </div>
              </div>
            )}
            {releaseDate && (
              <div className="flex items-start gap-3 p-4 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft hover:shadow-lg transition-all">
                {releaseDate.icon && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#e6e7ee] shadow-inset flex items-center justify-center p-1.5">
                    <img
                      src={releaseDate.icon}
                      alt={releaseDate.label}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#616161] mb-1">{releaseDate.label}</p>
                  <p className="text-base font-bold text-gray-900">
                    {releaseDate.value}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KeySpecs;
