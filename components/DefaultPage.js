"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Accordion from "./common/Accordion";
import { getCategoriesAndSubCategories } from "@/app/redux/slice/categorySlice";
import { Centerwarning } from "./utils/toast";

const accordionItems = [
  {
    title: "Privacy",
    content: (
      <p>
        We value your privacy. Your data is stored securely and is never shared
        with third parties without your consent. Learn more about how we protect
        your information in our Privacy Policy.
      </p>
    ),
  },
  {
    title: "Terms",
    content: (
      <p>
        By using this site, you agree to our terms of service. Please read them
        carefully to understand your rights and responsibilities while using our
        platform.
      </p>
    ),
  },
  {
    title: "Cookies",
    content: (
      <p>
        We use cookies to enhance your experience. Cookies help us remember your
        preferences and improve site functionality. You can manage your cookie
        settings at any time.
      </p>
    ),
  },
];

const DefaultPage = () => {
  const { category } = useSelector((state) => state.category);
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minCategoriesSelected, setMinCategoriesSelected] = useState(false);

  useEffect(() => {
    dispatch(getCategoriesAndSubCategories());
  }, []);

const handleToggleCategory = (name) => {
  setSelectedCategories((prev) => {
    if (prev.includes(name)) {
      const newSelection = prev.filter((cat) => cat !== name);
      setMinCategoriesSelected(newSelection.length >= 3);
      return newSelection;
    }

    if (prev.length > 3) {
      Centerwarning("You can select a maximum of 3 categories only.");
      return prev;
    }

    const newSelection = [...prev, name];
    setMinCategoriesSelected(newSelection.length >= 3);
    return newSelection;
  });
};

  const handleProceed = () => {
    if (selectedCategories.length < 1) {
      Centerwarning("Select any one category then you will be processed.");
      return;
    }

    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
    localStorage.setItem("hasVisitedHomePage", "true");
    window.location.reload();
  };

  return (
    <div className="flex justify-center gap-4 px-4 mb-20 mt-10 max-w-[1280px] mx-auto">
      <div>
        <div className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset p-5 pb-12 md:pb-16">
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-center border-b border-gray-400 pb-3">
            Choose some favourite category <br /> you might compare
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-16 ">
            {category.map((item, index) => {
              const isSelected = selectedCategories.includes(item?.name);
              return (
                <button
                  key={index}
                  onClick={() => handleToggleCategory(item?.name)}
                  className={`btn ${isSelected ? "btn-primary-focus" : "focus"}`}
                >
                  {item?.name}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center mt-8">
            <div className="">
              <button
                className={
                  !minCategoriesSelected ? "opacity-50 compare-button !px-12" : "compare-button !px-12"
                }
                onClick={() => handleProceed()}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="mt-12">
          <Accordion items={accordionItems} />
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
