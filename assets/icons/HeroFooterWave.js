import React from "react";

const HeroFooterWave = () => {
    return (
        <svg
            width="100vw"
            height="100px"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
        >
            <path
                d="M0 50 C50 110, 110 110, 200 50 S300 0, 400 90 L400 100 L0 100 Z"
                fill="white"
            ></path>
        </svg>
    );
};

export default HeroFooterWave;
