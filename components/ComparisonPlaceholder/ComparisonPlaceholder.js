import React from "react";

const ComparisonPlaceholder = ({ showVsSeparator = true }) => {
  return (
    <>
      {/* VS Separator - appears before placeholder */}
      {showVsSeparator && (
        <div className="hidden sm:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none z-[100]">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-1 h-8 bg-[#d1d9e6]"></div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e7e8e7] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center border border-[#e7e8e7]">
              <span className="font-bold text-[#d1d9e6] text-sm sm:text-base">
                VS
              </span>
            </div>
            <div className="w-1 h-8 bg-[#d1d9e6]"></div>
          </div>
        </div>
      )}

      {/* Placeholder Container */}
      <div className="relative flex flex-col pacity-40 pointer-events-none">
        {/* Name Area Placeholder */}
        <div className="flex items-center gap-2 mb-3">
          {/* Score Placeholder */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#D3D3D3] border-6 border-[#e7e8e7] flex-shrink-0 animate-pulse"></div>

          {/* Name Placeholder */}
          <div className="h-6 sm:h-7 md:h-8 bg-[#D3D3D3] rounded-sm flex-grow animate-pulse"></div>
        </div>

        {/* Price Placeholder */}
        <div className="h-8 sm:h-9 md:h-10 bg-[#D3D3D3] rounded-lg mb-3 animate-pulse"></div>

        {/* Image Placeholder */}
        <div className="relative mt-2 sm:mt-4 w-full flex-1 flex items-center justify-center min-h-[220px] sm:min-h-[250px] md:min-h-[280px] lg:min-h-[320px] bg-[#D3D3D3] rounded-xl p-4 animate-pulse"></div>
      </div>
    </>
  );
};

export default ComparisonPlaceholder;
