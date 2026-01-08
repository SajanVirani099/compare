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

// Register required components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

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

    // Don't render chart if no data from API
    if (!chartData.labels || chartData.labels.length === 0 || !chartData.datasets || chartData.datasets.length === 0) {
        return (
            <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex items-center justify-center p-2 sm:p-4">
                <div className="text-gray-500 text-sm">No data available</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-full h-full relative">
                <Radar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default RadarChart;
