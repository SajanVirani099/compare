import React, { useEffect, useMemo, useState } from "react";

const getName = (item, idx = 1) =>
  item?.title || item?.name || item?.uniqueTitle || `Product ${idx}`;

const UserReviews = ({
  products = [],
  colors = ["#434343", "#3F51B5", "#10B981"],
  activeIndex,
  onChangeActiveIndex,
}) => {
  const productList = useMemo(() => (Array.isArray(products) ? products : []), [products]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isControlled = typeof activeIndex === "number";
  const currentIndex = isControlled ? activeIndex : selectedIndex;

  useEffect(() => {
    // Reset to first product whenever compare products change
    if (!isControlled) setSelectedIndex(0);
    if (isControlled && typeof onChangeActiveIndex === "function") onChangeActiveIndex(0);
  }, [productList.length]);

  const safeSelectedIndex = Math.min(currentIndex, Math.max(productList.length - 1, 0));
  const selectedProduct = productList[safeSelectedIndex];

  return (
    <div className="bg-[#f6f7fb] mt-6 py-10">
      <div className="max-w-[1280px] w-[95%] md:w-[75%] lg:w-[55%] mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">
          <span className="border-b border-black">Use</span>r reviews
        </h2>

        <div className="mt-10">
          {/* Tabs (dynamic based on API response) */}
          <div className="flex gap-6 text-[18px] text-[#616161] border-b border-gray-300 overflow-x-auto">
            {(productList.length ? productList : [{}, {}]).slice(0, 3).map((item, idx) => {
              const isActive = safeSelectedIndex === idx;
              const name = getName(item, idx + 1);
              const color = colors[idx] || colors[0];

              return (
                <div
                  key={item?._id || item?.id || item?.uniqueTitle || `${idx}-${name}`}
                  className={`pb-2 text-center cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    isActive ? "border-b-2 font-semibold" : "hover:text-gray-900"
                  }`}
                  style={{
                    borderColor: isActive ? color : "transparent",
                    color: isActive ? color : undefined,
                  }}
                  onClick={() => {
                    if (typeof onChangeActiveIndex === "function") onChangeActiveIndex(idx);
                    if (!isControlled) setSelectedIndex(idx);
                  }}
                >
                  {name}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg flex flex-col items-center justify-center pt-12 pb-8 mt-6">
            <p className="text-[20px] font-bold">No reviews yet</p>
            <p className="text-[#616161] text-base mb-8 mt-6 text-center px-4">
              Be the first. Use your experience to help others in the community make a decision.
            </p>
            <button className="text-sm font-semibold rounded-full bg-[#434343] text-white px-8 py-1.5 hover:bg-white hover:text-[#434343] hover:border border-[#434343]">
              Write a review{selectedProduct ? ` for ${getName(selectedProduct, safeSelectedIndex + 1)}` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviews;
