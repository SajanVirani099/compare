"use client"; // If using Next.js App Router

import React, { useMemo, useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
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
import { TbVs } from "react-icons/tb";
import { imageUrl } from "@/components/utils/config";

// Register required components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

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

const RadarChart = ({ products = [], productNames = [], productColors = ["#434343", "#3F51B5", "#10B981"] }) => {
    // Track window size for responsive font sizing
    const [fontSize, setFontSize] = useState(10);
    const [padding, setPadding] = useState(10);

    useEffect(() => {
        const updateSize = () => {
            if (typeof window !== "undefined") {
                const width = window.innerWidth;
                if (width < 640) {
                    setFontSize(8);
                    setPadding(8);
                } else if (width < 768) {
                    setFontSize(9);
                    setPadding(9);
                } else if (width < 1024) {
                    setFontSize(10);
                    setPadding(10);
                } else {
                    setFontSize(11);
                    setPadding(10);
                }
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Process API data to create radar chart
    const chartData = useMemo(() => {
        // Return empty chart if no products from API
        if (!products || products.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Get all unique feature names from all products (from API only)
        const allFeatureNames = new Set();
        products.forEach((product) => {
            const featureData = product?.featureData || [];
            featureData.forEach((feature) => {
                const featureName = feature?.featureName || feature?.featureId?.featureName || "";
                if (featureName) {
                    allFeatureNames.add(featureName);
                }
            });
        });

        // Convert Set to Array - use all features from API (no hardcoded limit)
        const labels = Array.from(allFeatureNames);

        // Create datasets for each product (from API)
        const datasets = products.map((product, index) => {
            const featureData = product?.featureData || [];
            // Get product name from API response or fallback to productNames prop
            const productName = productNames[index] || 
                               product?.title || 
                               product?.name || 
                               product?.uniqueTitle || 
                               `Product ${index + 1}`;
            const color = productColors[index] || productColors[0];

            // Map each label to its scoreValue from API
            const data = labels.map((label) => {
                const feature = featureData.find(
                    (f) => {
                        const fName = f?.featureName || f?.featureId?.featureName || "";
                        return fName === label;
                    }
                );
                // Get scoreValue from API response only
                const scoreValue = feature?.scoreValue || feature?.featureId?.scoreValue || 0;
                return scoreValue;
            });

            return {
                label: productName,
                data: data,
                backgroundColor: `${color}50`, // Add transparency
                borderColor: color,
                borderWidth: 2,
                pointBackgroundColor: "#fff",
                pointBorderColor: color,
                pointRadius: 4,
                pointHoverRadius: 6,
            };
        });

        return {
            labels: labels,
            datasets: datasets,
        };
    }, [products, productNames, productColors]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                min: 0,
                angleLines: {
                    color: "rgba(200, 200, 200, 0.5)", // Soft grid lines
                },
                grid: {
                    color: "rgba(200, 200, 200, 0.5)",
                    circular: true,
                },
                pointLabels: {
                    display: true,
                    font: {
                        size: fontSize,
                    },
                    color: "#616161", // Dark label color
                    padding: padding,
                },
                ticks: {
                    display: false, // Hides the 10, 20, 30... labels
                    stepSize: 20,
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Hide legend if not needed
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                titleFont: {
                    size: 14,
                },
                bodyFont: {
                    size: 12,
                },
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.r}%`;
                    }
                }
            },
        },
    }), [fontSize, padding]);

    // Get features from first product for the features display (MUST be before early returns)
    const activeProduct = products && products.length > 0 ? products[0] : null;
    const featureData = activeProduct?.featureData || [];
    
    // Process features with icons and scores (MUST be before early returns - React Hooks rule)
    const features = useMemo(() => {
      if (!featureData || featureData.length === 0) return [];
      
      return featureData.map((feature, idx) => {
        const featureName = feature?.featureName || feature?.featureId?.featureName || `Feature ${idx + 1}`;
        const score = feature?.scoreValue ?? feature?.featureId?.scoreValue ?? 0;
        const icon = feature?.icon || feature?.featureId?.icon;
        const apiIcon = icon ? imageUrl + icon : null;
        
        // Normalize score: API may send 0-100, but UI expects 0-10
        const normalizedScore = score > 10 ? Math.round(score / 10) : score;
        const finalScore = Math.max(0, Math.min(10, normalizedScore));
        
        return {
          name: featureName,
          score: finalScore,
          iconUrl: apiIcon,
          rawScore: score
        };
      }).filter(f => f.name);
    }, [featureData]);

    // Don't render chart if no data from API
    if (!chartData.labels || chartData.labels.length === 0 || !chartData.datasets || chartData.datasets.length === 0) {
        return (
            <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex items-center justify-center p-2 sm:p-4">
                <div className="text-gray-500 text-sm">No data available</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Radar Chart */}
            <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-full h-full relative">
                    <Radar data={chartData} options={options} />
                </div>
            </div>

            {/* Features Row Below Radar Chart - Horizontal Scrollable Circular Progress Indicators */}
            {features.length > 0 && (
                <div className="mt-4 sm:mt-6 w-full max-w-full overflow-hidden">
                    <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                        {features.map((feature, idx) => {
                            const progress = feature.score;
                            const percent = (progress / 10) * 100;
                            const color = progress >= 8 ? "#24B200" : "#F29A1F";
                            
                            return (
                                <div
                                    key={`feature-${idx}`}
                                    className="flex flex-col items-center flex-shrink-0"
                                >
                                    {/* Circular Progress Indicator - Neumorphic Up Theme */}
                                    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#E6E7EE] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]">
                                        {/* Score Circle Background - Outer Ring (Progress Ring) */}
                                        <div
                                            className="absolute inset-[2px] rounded-full"
                                            style={{
                                                background: `conic-gradient(${color} ${percent}%, #e5e7eb ${percent}%)`,
                                            }}
                                        />
                                        {/* Inner Circle with Icon and Number - Neumorphic Down Theme */}
                                        <div className="absolute inset-[4px] rounded-full bg-[#E6E7EE] flex flex-col items-center justify-center shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] p-1.5" style={{zIndex: 99}}>
                                            {/* Icon - Ensure it's visible with proper sizing */}
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center mb-1 flex-shrink-0" style={{ minHeight: '24px', minWidth: '24px' }}>
                                                {feature?.iconUrl ? (
                                                    <img 
                                                        src={feature.iconUrl} 
                                                        alt={feature.name} 
                                                        className="w-full h-full object-contain"
                                                        style={{ width: '100%', height: '100%', display: 'block' }}
                                                       
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#434343]" style={{ color: '#434343' }}>
                                                        {getFeatureIcon(feature?.name || 'Feature', 20)}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Score Number - Make it more visible */}
                                            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#434343] leading-tight">
                                                {feature?.score || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Total Points - Centered Below Features */}
                    <div className="mt-3 text-center">
                        <p className="text-sm sm:text-base text-[#616161] font-medium">
                            {activeProduct?.scoreValue || 0} point{(activeProduct?.scoreValue || 0) !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RadarChart;
