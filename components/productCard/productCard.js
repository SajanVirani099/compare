import zIndex from "@mui/material/styles/zIndex";
import React, { useState } from "react";
import { FaBatteryFull, FaMemory, FaPlus } from "react-icons/fa";
import { LuMoveHorizontal } from "react-icons/lu";
import { MdGridOn } from "react-icons/md";
import { BASE_URL } from "../utils/config";

const ProductCard = ({ index, phone, category }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToComparison = () => {
    if (typeof window !== "undefined") {
      const existingComparisonList = localStorage.getItem("comparisonList");

      let updatedList;
      if (!existingComparisonList) {
        updatedList = [phone._id];
      } else if (JSON.parse(existingComparisonList).length >= 4) {
        return;
      } else {
        updatedList = JSON.parse(existingComparisonList);
        if (!updatedList.includes(phone._id)) {
          updatedList.push(phone._id);
        }
      }

      localStorage.setItem("comparisonList", JSON.stringify(updatedList));

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("comparisonListUpdated"));
    }
  };

  return (
    <div
      key={index}
      className="flex gap-4 bg-white py-5 px-6 rounded-lg border border-gray-300 relative w-full"
    >
      {/* Points Badge */}
      <div
        className="absolute top-2 left-2 flex items-center justify-center rounded-full text-xs font-bold bg-white"
        style={{
          background: `conic-gradient(#434343 ${phone.scoreValue}%, #e5e7eb ${phone.scoreValue}%)`,
        }}
      >
        <span className="text-black bg-white rounded-full flex flex-col items-center justify-center m-1 py-1.5 px-1">
          <span className="text-base leading-[1rem]">{phone.scoreValue}</span>
          <span className="text-[10px] leading-[0.5rem]">Points</span>
        </span>
      </div>

      {/* Phone Image */}
      <img
        src={BASE_URL + phone.thumbnail}
        alt={phone.title}
        className="min-w-[25%] min-h-full object-cover rounded-md"
      />

      {/* Phone Details */}
      <div className="flex flex-col justify-between w-full">
        <h3 className="font-bold text-black text-lg">{phone.title}</h3>
        {category == "phone" && (
          <div className="grid grid-cols-2 text-sm mt-2 gap-2 text-gray-500">
            <div className="flex items-center gap-3 py-1 px-2">
              <div className="bg-[#43434310] p-2 rounded-full">
                <LuMoveHorizontal className="text-black text-md" />
              </div>
              <span className="text-gray-500 text-xs">
                {phone.screenSize || "6.5”"}
              </span>
            </div>
            <div className="flex items-center gap-3 py-1 px-2">
              <div className="bg-[#43434310] p-2 rounded-full">
                <FaMemory className="text-black text-md" />
              </div>
              <span className="text-gray-500 text-xs">
                {phone.ram || "6GB"}
              </span>
            </div>
            <div className="flex items-center gap-3 py-1 px-2">
              <div className="bg-[#43434310] p-2 rounded-full">
                <MdGridOn className="text-black text-md" />
              </div>
              <span className="text-gray-500 text-xs">
                {phone.ppi || "262 ppi"}
              </span>
            </div>
            <div className="flex items-center gap-3 py-1 px-2">
              <div className="bg-[#43434310] p-2 rounded-full">
                <FaBatteryFull className="text-black text-md" />
              </div>
              <span className="text-gray-500 text-xs">
                {phone.battery || "5000 mAh"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Tooltip */}
        <div
          className={`absolute w-[150px] top-5 -translate-y-1/2 right-8 shadow-lg bg-white text-[#161616] text-sm font-semibold px-3 py-1 rounded-lg transition-all duration-300 ease-in-out ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          }`}
          style={{ zIndex: "100" }}
        >
          Add to comparison
        </div>
        {/* Plus Button */}
        <button
          className="add-product-btn relative  transition"
          style={{ zIndex: "101" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleAddToComparison}
        >
          <svg
            class="plusIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
          >
            <g mask="url(#mask0_21_345)">
              <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
