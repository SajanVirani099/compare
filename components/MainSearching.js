import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getSearchProducts } from "../app/redux/slice/blogSlice";
import { useRouter } from "next/navigation";

const MainSearching = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchInputs, setSearchInputs] = useState([""]);
  const [showDropdown, setShowDropdown] = useState({});
  const [resultsByIndex, setResultsByIndex] = useState({});
  const [selectedProducts, setSelectedProducts] = useState({}); // Store selected product objects by index
  const debounceTimersRef = useRef({});

  const handleInputChange = (index, value) => {
    const updatedInputs = [...searchInputs];
    updatedInputs[index] = value;

    // Remove empty fields except the last one
    let filteredInputs = updatedInputs.filter(
      (input, i) => input !== "" || i === updatedInputs.length - 1
    );

    // Ensure there's always an empty field at the end, but limit total fields to 4
    if (
      filteredInputs.length < 3 &&
      filteredInputs[filteredInputs.length - 1] !== ""
    ) {
      filteredInputs.push("");
    }

    setSearchInputs(filteredInputs);
    setShowDropdown((prev) => ({ ...prev, [index]: !!value }));

    // Debounced fetch suggestions for this field
    if (debounceTimersRef.current[index]) {
      clearTimeout(debounceTimersRef.current[index]);
    }
    debounceTimersRef.current[index] = setTimeout(async () => {
      if (!value || value.trim().length < 2) {
        setResultsByIndex((prev) => ({ ...prev, [index]: [] }));
        return;
      }
      try {
        const action = await dispatch(getSearchProducts(value));
        const data = action?.payload?.data || [];
        setResultsByIndex((prev) => ({
          ...prev,
          [index]: Array.isArray(data) ? data : [],
        }));
      } catch (e) {
        setResultsByIndex((prev) => ({ ...prev, [index]: [] }));
      }
    }, 250);
  };

  const handleDropdownClick = (index, selectedValue, productData) => {
    setSearchInputs((prev) => {
      const updatedInputs = [...prev];
      updatedInputs[index] = selectedValue || "";

      // Keep a trailing empty field if we still have room for more entries
      if (
        updatedInputs.length < 3 &&
        updatedInputs[updatedInputs.length - 1] !== ""
      ) {
        updatedInputs.push("");
      }

      return updatedInputs;
    });

    // Store the selected product data
    if (productData) {
      setSelectedProducts((prev) => ({
        ...prev,
        [index]: productData,
      }));
    } else {
      // Clear product data if value is cleared
      setSelectedProducts((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }

    // Hide dropdown for this field and clear its suggestions
    setShowDropdown((prev) => ({ ...prev, [index]: false }));
    setResultsByIndex((prev) => ({ ...prev, [index]: [] }));
  };

  const removeSearchInput = (index) => {
    const updatedInputs = searchInputs.filter((_, i) => i !== index);
    setSearchInputs(updatedInputs);
    const updatedDropdown = { ...showDropdown };
    delete updatedDropdown[index];
    setShowDropdown(updatedDropdown);
    
    // Remove product data for this index and reindex remaining products
    setSelectedProducts((prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          updated[key] = prev[key];
        } else if (keyNum > index) {
          updated[keyNum - 1] = prev[key];
        }
      });
      return updated;
    });
  };


  // Check if button should be disabled (no products selected)
  const hasSelectedProducts = Object.values(selectedProducts).some(
    (product) => product && product.uniqueTitle
  );

  const handleOpenSearch = () => {
    // Get all selected products (non-empty inputs)
    const selectedProductList = Object.values(selectedProducts).filter(
      (product) => product && product.uniqueTitle
    );

    // Check if at least 1 product is selected
    if (selectedProductList.length === 0) {
      return; // Button should be disabled, but just in case
    }

    // Build compare URL using uniqueTitle (like handleCompare in quick-compare)
    const compareValues = selectedProductList.map((product) => {
      const label = product?.uniqueTitle || product?.title || "";
      return encodeURIComponent(label);
    });

    if (compareValues.length > 0) {
      const compareUrl = `/compare/${compareValues.join(",")}`;
      router.push(compareUrl);
    }
  };

  return (
    <div className="mainSearching mt-12 flex gap-4 items-center">
      <div className="flex flex-col gap-1 items-center">
        {searchInputs.map((_, index) => (
          <>
            {searchInputs.length > 1 && (
              <div className="border h-6 w-[0.5px] border-[#F98A1A]"></div>
            )}
            {searchInputs.length > 1 && index !== searchInputs.length - 1 && (
              <div className="bg-white text-[#F98A1A] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-center">
              <span className="m-0 -mt-1">vs</span>
            </div>
            )}
          </>
        ))}
      </div>

      <div className="searchingSec !m-0 flex flex-col gap-4">
        {searchInputs.map((searchInput, index) => (
          <div key={index} className="relative w-full flex items-center gap-2">
            <div className="w-full relative">
              <input
                type="text"
                autoComplete="off"
                className="searchBox mr-2 cursor relative !rounded-xl !shadow-inset !bg-[#e6e7ee] text-black w-full py-1.5 pl-4 focus:outline-[#F98A1A]"
                placeholder="Type here to compare"
                tabIndex="1"
                name={`search${index}`}
                value={searchInput}
                aria-label={`Search Input ${index + 1}`}
                onChange={(e) => {
                  handleInputChange(index, e.target.value);
                  // Clear product data when input is manually changed
                  if (!e.target.value) {
                    setSelectedProducts((prev) => {
                      const updated = { ...prev };
                      delete updated[index];
                      return updated;
                    });
                  }
                }}
                onFocus={() =>
                  setShowDropdown({
                    ...showDropdown,
                    [index]: !!searchInputs[index],
                  })
                }
                onBlur={() =>
                  setTimeout(
                    () => setShowDropdown({ ...showDropdown, [index]: false }),
                    200
                  )
                }
              />
              {searchInputs.length > 1 && index !== searchInputs.length - 1 && (
                <button
                  type="button"
                  className="removeBtn absolute right-4 top-1.5"
                  onClick={() => removeSearchInput(index)}
                >
                  ✖
                </button>
              )}
            </div>

            {showDropdown[index] && resultsByIndex[index]?.length > 0 && (
              <div
                className="dropdown absolute top-full left-0 bg-white border rounded w-[calc(100%-16px)] mt-1 h-60 overflow-y-auto shadow-lg"
                style={{ zIndex: 2000 }}
              >
                {(resultsByIndex[index] || []).map((item, idx) => (
                  <div
                    key={item?._id || idx}
                    className="dropdownItem p-2 hover:bg-gray-200 cursor-pointer text-black"
                    onMouseDown={(e) => {
                      // Use onMouseDown so selection happens before the input blurs
                      e.preventDefault();
                      handleDropdownClick(index, item?.title, item);
                    }}
                  >
                    {item?.title}
                  </div>
                ))}
              </div>
            )}

            {index === searchInputs.length - 1 && (
              <button
                type="submit"
                disabled={!hasSelectedProducts}
                className="group btn btn-primary !shadow-none !bg-[#F98A1A] text-white !text-base sm:!text-lg px-3 sm:px-4 py-1.5 sm:py-2 me-3 ml-2 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-[#F98A1A]/50 active:scale-95 hover:bg-[#e67a0f] focus:outline-none focus:ring-2 focus:ring-[#F98A1A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:bg-[#F98A1A]"
                onClick={handleOpenSearch}
              >
                <span className="inline-flex items-center gap-2">
                  <span>Compare</span>
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainSearching;
