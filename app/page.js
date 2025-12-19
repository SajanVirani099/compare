"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SimpleHeader from "../components/SimpleHeader";
import LandingPage from "../components/LandingPage";
import MainSearching from "../components/MainSearching";
import BlogSection from "../components/BlogSection";
import Footer from "../components/Footer";
import { settingGet } from "./redux/slice/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import HeroFooterWave from "@/assets/icons/HeroFooterWave";
import HeroFooterWave2 from "@/assets/icons/HeroFooterWave2";
import HeroFooterWave3 from "@/assets/icons/HeroFooterWave3";
import MobileCategoryList from "@/components/filterSections/mobileCategoryList/MobileCategoryList";
import DefaultPage from "@/components/DefaultPage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../components/utils/SkeletonColor";

export default function Home() {
  const { category } = useSelector((state) => state.category);
  const [dark, setDark] = useState(false);
  const [showDefaultPage, setShowDefaultPage] = useState(true);
  const [storageChange, setStorageChange] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem("hasVisitedHomePage");
      if (!hasVisited) {
        // First visit
        setShowDefaultPage(true);
        // localStorage.setItem("hasVisitedHomePage", "true");
      } else {
        setShowDefaultPage(false);
      }
    } catch (_) {
      // Fallback: show default page if localStorage is unavailable
      setShowDefaultPage(true);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setStorageChange(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggle = () => {
    setDark(!dark);
  };

  if (!isInitialized) {
    return (
      <>
        <SimpleHeader />
        <div className="pt-5 md:pt-[90px]">
          <div className="flex justify-center gap-4 px-4 mb-16">
            <div className="hidden md:flex w-full h-[300px] border-2 border-dashed border-gray-400 items-center justify-center">
              Ad Box
            </div>
          </div>
          <div className="flex justify-center gap-4 px-4 mb-20 mt-10">
            <div className="w-full max-w-4xl">
              <Skeleton
                height={50}
                className="mb-4"
                style={{ borderRadius: "8px" }}
                baseColor={colors.baseColor}
                highlightColor={colors.highlightColor}
              />
              <div className="flex flex-wrap gap-4">
                {Array(6).fill(0).map((_, index) => (
                  <Skeleton
                    key={index}
                    height={40}
                    width={120}
                    style={{ borderRadius: "8px" }}
                    baseColor={colors.baseColor}
                    highlightColor={colors.highlightColor}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Skeleton
                  height={40}
                  width={120}
                  style={{ borderRadius: "8px" }}
                  baseColor={colors.baseColor}
                  highlightColor={colors.highlightColor}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showDefaultPage ? (
        <>
          <SimpleHeader />
          <div className="pt-5 md:pt-[90px]">
            <div className="flex justify-center gap-4 px-4 mb-16">
              <div className="hidden md:flex w-full h-[300px] border-2 border-dashed border-gray-400 items-center justify-center">
                Ad Box
              </div>
            </div>
            <DefaultPage />
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <div className="pt-5 md:pt-[90px]">
            <BlogSection />
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

{
  /* <div className="homepage pt-5 md:pt-[90px] h-screen relative z-[1]">
                <LandingPage />
                <MainSearching />
                <MobileCategoryList categories={category} />
                <div className="h-[90px] absolute bottom-[-2px] left-0 right-0 text-gray-700/90 z-[4] pointer-events-none">
                    <HeroFooterWave />
                </div>
                <div className="h-[90px] absolute bottom-0 left-0 right-0 text-gray-500/50 z-[3] pointer-events-none">
                    <HeroFooterWave2 />
                </div>
                <div className="h-[90px] absolute bottom-0 left-0 right-0 text-gray-400/30 z-[2] pointer-events-none">
                    <HeroFooterWave3 />
                </div>
            </div> */
}
