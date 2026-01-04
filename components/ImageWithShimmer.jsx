"use client";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "./utils/SkeletonColor";

const ImageWithShimmer = ({
  src,
  alt,
  className = "",
  height,
  width,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Extract height from className if provided (e.g., h-72, min-h-60)
  const getHeightValue = () => {
    if (height) return typeof height === 'number' ? `${height}px` : height;
    if (className.includes('h-72')) return '288px';
    if (className.includes('h-60') || className.includes('min-h-60')) return '240px';
    if (className.includes('h-16')) return '64px';
    if (className.includes('h-8')) return '32px';
    return '240px';
  };

  const skeletonHeight = getHeightValue();

  return (
    <div className={`relative w-full`} style={{ minHeight: skeletonHeight }}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton
            height="100%"
            width="100%"
            className={className}
            style={{ borderRadius: "15px" }}
            baseColor={colors.baseColor}
            highlightColor={colors.highlightColor}
          />
        </div>
      )}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? "opacity-0 absolute" : "opacity-100 transition-opacity duration-300"}`}
          height={height}
          width={width}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      ) : (
        <div
          className={`${className} flex items-center justify-center bg-gray-200`}
          style={{ minHeight: skeletonHeight }}
        >
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      )}
    </div>
  );
};

export default ImageWithShimmer;

