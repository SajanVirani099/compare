"use client";
import React, { useEffect } from "react";
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
    const { subCategoryProducts } = useSelector((state) => state.product);

    useEffect(() => {
        if (category) dispatch(getSubCategoryWiseProducts(category));
    }, [dispatch, category]);

    return (
        <div className="bg-[#e6e7ee] min-h-screen">
            <Navbar />
            <CategoryPageHeader
                filters={filters}
                title={`${category} comparison`}
                breadcrumb={`${category} comparison`}
            />

            <div className="flex pt-6 pb-10 max-w-[1280px] mx-auto px-4">
                <PhoneFilters />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 ml-6 w-[80%] mb-10 h-fit">
                    {subCategoryProducts && subCategoryProducts.map((phone, index) => (
                        <ProductCard
                            key={index}
                            phone={phone}
                            category="phone"
                        />
                    ))}
                </div>
            </div>
            <FloatingComparison category="Smartphone" />
            <Footer />
        </div>
    );
};

export default SmartphoneComparison;
