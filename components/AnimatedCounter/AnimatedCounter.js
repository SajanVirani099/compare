"use client";
import React, { useState, useEffect, useRef } from "react";

const AnimatedCounter = ({ end, duration = 2000, icon: Icon, label }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className="text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center mb-4">
        {Icon && <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" />}
      </div>
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2">
        {count.toLocaleString()}
      </div>
      <div className="text-lg sm:text-xl text-gray-700">{label}</div>
    </div>
  );
};

export default AnimatedCounter;
