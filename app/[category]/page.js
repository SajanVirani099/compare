"use client";
import React, { useEffect } from "react";
import { FaMemory, FaBatteryFull } from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { LuMoveHorizontal } from "react-icons/lu";
import { useRouter } from "next/navigation";
import {
    sortByOptions,
    mobileBrands,
    designSpecs,
    filters,
    phones,
} from "@/components/utils/mockData";
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
        <div>
            <CategoryPageHeader
                filters={filters}
                title={`${category} comparison`}
                breadcrumb={`${category} comparison`}
            />

            <div className="flex pt-3">
                <PhoneFilters />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 ml-6 w-[80%] mb-10">
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
        </div>
    );
};

export default SmartphoneComparison;
