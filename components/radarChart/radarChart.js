"use client"; // If using Next.js App Router

import React from "react";
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

const RadarChart = () => {
    const labels = [
        { text: "DESIGN", href: "/design" },
        { text: "DISPLAY", href: "/display" },
        { text: "PERFORMANCE", href: "/performance" },
        { text: "CAMERAS", href: "/cameras" },
        { text: "OPERATING SYSTEM", href: "/os" },
        { text: "BATTERY", href: "/battery" },
        { text: "AUDIO", href: "/audio" },
        { text: "FEATURES", href: "/features" },
    ];

    const data = {
        labels: labels.map((l) => l.text),
        datasets: [
            {
                label: "Vivo Y29s",
                data: [80, 90, 70, 85, 95, 60, 75, 90],
                backgroundColor: "#43434350",
                borderColor: "#434343",
                borderWidth: 1,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#434343",
                pointRadius: 4,
            },
            {
                label: "Vivo Y39 5G",
                data: [70, 95, 60, 75, 85, 75, 65, 95],
                backgroundColor: "#3F51B550",
                borderColor: "#3F51B5",
                borderWidth: 1,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#3F51B5",
                pointRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                beginAtZero: true,
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
                        size: 11,
                    },
                    color: "#616161", // Dark label color
                },
                ticks: {
                    display: false, // Hides the 10, 20, 30... labels
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Hide legend if not needed
            },
        },
    };

    return <Radar data={data} options={options} />;
};

export default RadarChart;
