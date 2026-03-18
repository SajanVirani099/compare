"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { filters } from "@/components/utils/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhoneFilters from "@/components/filterSections/phoneFilters";
import CategoryPageHeader from "@/components/categoryPageHeader/categoryPageHeader";
import ProductCard from "@/components/productCard/productCard";
import FloatingComparison from "@/components/floatingComparison/floatingComparison";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategoryWiseProducts } from "../redux/slice/productSlice";

const SmartphoneComparison = ({ params }) => {
  const { category } = params;
  const dispatch = useDispatch();
  const { subCategoryProducts, filteredProducts } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    if (category) dispatch(getSubCategoryWiseProducts(category));
  }, [dispatch, category]);

  return (
    <div className="bg-[#e6e7ee] min-h-screen">
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-6">
        <nav className="mt-4 sm:mt-20">
          <p className="text-gray-600 text-sm sm:text-base">
            <Link href="/" className="hover:text-[#F98A1A] transition-colors">
              HOME
            </Link>
            <span className="mx-2">/</span>
            {category && (
              <>
                <span className="text-gray-800 capitalize">{category}</span>
              </>
            )}
          </p>
        </nav>

        {/* <CategoryPageHeader
                filters={filters}
                title={`${category} comparison`}
                breadcrumb={`${category} comparison`}
            /> */}

        <div className="flex pt-6 pb-10">
          {/* Filters sidebar controls which products are shown via Redux */}
          <PhoneFilters />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 ml-6 w-[80%] mb-10 h-fit">
            {(filteredProducts?.length
              ? filteredProducts
              : subCategoryProducts
            )?.map((phone, index) => (
              <ProductCard key={index} phone={phone} category="phone" />
            ))}
          </div>
        </div>
        <FloatingComparison category="Smartphone" />
      </div>
      <Footer />
    </div>
  );
};

export default SmartphoneComparison;
