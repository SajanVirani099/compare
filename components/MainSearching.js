import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getSearchProducts } from "../app/redux/slice/blogSlice";
import { useRouter } from "next/navigation";

const MainSearching = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchInputs, setSearchInputs] = useState([""]);
  console.log("🚀 ~ MainSearching ~ searchInputs:", searchInputs);
  const [showDropdown, setShowDropdown] = useState({});
  const [resultsByIndex, setResultsByIndex] = useState({});
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
      filteredInputs.length < 4 &&
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

  const handleDropdownClick = (index, selectedValue) => {
    setSearchInputs((prev) => {
      const updatedInputs = [...prev];
      updatedInputs[index] = selectedValue || "";

      // Keep a trailing empty field if we still have room for more entries
      if (
        updatedInputs.length < 4 &&
        updatedInputs[updatedInputs.length - 1] !== ""
      ) {
        updatedInputs.push("");
      }

      return updatedInputs;
    });

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
  };


  const handleOpenSearch = () => {
    if (searchInputs.some((input) => input !== "")) {
      router.push(`/compare/smartphone`);
    }
  };

  return (
    <div className="mainSearching mt-12 flex gap-4 items-center">
      <div className="flex flex-col gap-1 items-center">
        {searchInputs.map((_, index) => (
          <>
            {searchInputs.length > 1 && (
              <div className="border h-6 w-[0.5px]"></div>
            )}
            {searchInputs.length > 1 && index !== searchInputs.length - 1 && (
              <p className="text-xs leading-none text-white">vs</p>
            )}
          </>
        ))}
      </div>

      <div className="searchingSec !m-0 flex flex-col gap-1">
        {searchInputs.map((searchInput, index) => (
          <div key={index} className="relative w-full flex items-center gap-2">
            <div className="w-full relative">
              <input
                type="text"
                autoComplete="off"
                className="searchBox mr-2 cursor relative !rounded-xl !shadow-inset !bg-[#e6e7ee] text-black w-full py-1.5 pl-4"
                placeholder="Type here to compare"
                tabIndex="1"
                name={`search${index}`}
                value={searchInput}
                aria-label={`Search Input ${index + 1}`}
                onChange={(e) => handleInputChange(index, e.target.value)}
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
                      handleDropdownClick(index, item?.title);
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
                className="btn btn-primary !text-lg px-4 py-2 me-3 ml-2"
                onClick={handleOpenSearch}
              >
                Compare
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainSearching;
