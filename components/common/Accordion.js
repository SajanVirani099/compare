import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft p-0 w-full max-w-full mx-auto mt-6 md:mt-8">
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-400 last:border-b-0">
          <button
            className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-gray-700 focus:outline-none"
            onClick={() => handleToggle(index)}
            aria-expanded={openIndex === index}
            aria-controls={`accordion-content-${index}`}
          >
            <span>{item.title}</span>
            <span className="text-xl">
              <FiPlus
                className={`w-5 h-5 transition-transform duration-300 transform ${
                  openIndex === index ? "rotate-45" : ""
                }`}
              />
            </span>
          </button>
          <div
            id={`accordion-content-${index}`}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-full" : "max-h-0"
            }`}
            style={{
              maxHeight: openIndex === index ? 500 : 0,
            }}
          >
            <div className="px-6 pb-5 pt-2 text-gray-600">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
