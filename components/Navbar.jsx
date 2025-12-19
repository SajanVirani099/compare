/* eslint-disable @next/next/no-img-element */
"use client";

import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAndSubCategories } from "../app/redux/slice/categorySlice";
import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/utils/firebase";

import logo from "@/assets/images/versus.svg";
import MoreOptionsIcon from "@/assets/icons/MoreOptionsIcon";
import CategoryDropdown from "./CategoryDropdown";
import CategoryIcon2 from "@/assets/icons/CategoryIcon2";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import GraphicsChipIcon from "@/assets/icons/GraphicsChipIcon";
import HeadPhoneIcon from "@/assets/icons/HeadPhoneIcon";
import MainSearching from "./MainSearching";

const Navbar = () => {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchPhase, setSearchPhase] = useState("closed"); // 'opening' | 'open' | 'closing' | 'closed'
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const { category } = useSelector((state) => state.category);

  useEffect(() => {
    const handleScroll = () => {
      const opacity = Math.min(window.scrollY / 50, 1);
      setScrollOpacity(opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(getCategoriesAndSubCategories());
  }, [dispatch]);

  // Manage body scroll lock and opening/closing animation phases
  useEffect(() => {
    if (!isSearchOpen) return;
    setSearchPhase("opening");
    document.body.classList.add("stop-scrolling");
    const id = setTimeout(() => setSearchPhase("open"), 20);
    return () => clearTimeout(id);
  }, [isSearchOpen]);

  const closeSearch = () => {
    setSearchPhase("closing");
    setTimeout(() => {
      setIsSearchOpen(false);
      setSearchPhase("closed");
      document.body.classList.remove("stop-scrolling");
    }, 300);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  };

  return (
    <div
      className="navigationContainer fixed top-0 bg-gradient-to-r from-[#1c1c1c] via-[#2e2e2e] to-[#434343] w-full"
      style={{ zIndex: 9999 }}
    >
      <div className="navigation">
        <div className="flex items-center justify-between w-full px-4 py-2">
          {/* Left: Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="block lg:hidden">
              <button onClick={() => setIsDrawerOpen((prev) => !prev)}>
                <MoreOptionsIcon />
              </button>
            </div>
            <Link href="/" className="logoContainer flex items-center">
              <Image src={logo} className="h-8 w-auto" alt="logo" />
            </Link>
          </div>

          {/* Center: Links */}
          <div className="hidden lg:flex items-center gap-8">
            <CategoryDropdown categories={category} />
            <Link
              href="/"
              className="navMenuTitle text-white hover:text-gray-300"
            >
              Smartphones
            </Link>
            <Link
              href="/"
              className="navMenuTitle text-white hover:text-gray-300"
            >
              Graphic Cards
            </Link>
            <Link
              href="/"
              className="navMenuTitle text-white hover:text-gray-300"
            >
              CPUs
            </Link>
          </div>

          {/* Right: Search + Google Login */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Open Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <span className="text-sm">Search</span>
            </button>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-3 py-2 px-6 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google Logo"
                className="w-6 h-6"
              />
              <span className="text-gray-700 font-semibold text-sm">
                Sign in with Google
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Transition.Root show={isDrawerOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 lg:hidden"
          onClose={setIsDrawerOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300 sm:duration-400"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200 sm:duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-[#161616] shadow-xl">
                      <div className="flex-1 px-4 py-6 sm:px-6">
                        <ul className="space-y-6">
                          <li>
                            <Link
                              href="/en/categories"
                              className="flex items-center text-white"
                            >
                              <CategoryIcon2 className="mr-3" />
                              Categories
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/en/phone"
                              className="flex items-center text-white"
                            >
                              <PhoneIcon className="mr-3" />
                              Smartphones
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/en/graphics_card"
                              className="flex items-center text-white"
                            >
                              <GraphicsChipIcon className="mr-3" />
                              Graphic Cards
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/en/wireless_earbud"
                              className="flex items-center text-white"
                            >
                              <HeadPhoneIcon className="mr-3" />
                              Wireless Earbuds
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/en/cpu"
                              className="flex items-center text-white"
                            >
                              <GraphicsChipIcon className="mr-3" />
                              CPUs
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleGoogleLogin}
                              className="mx-auto flex items-center gap-3 py-2 px-6 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition mt-4 "
                            >
                              <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google Logo"
                                className="w-6 h-6"
                              />
                              <span className="text-gray-700 font-semibold text-sm">
                                Sign in with Google
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Full-screen Search Overlay (custom CSS for scaleX spread) */}
      {isSearchOpen && (
        <div className={`searchOverlay ${searchPhase === "opening" ? "isOpening" : ""} ${searchPhase === "open" ? "isOpen" : ""} ${searchPhase === "closing" ? "isClosing" : ""}`}>
          <div className="searchContentWrapper px-4 sm:px-6 lg:px-8">
            <div className="header">
              <button
                className="close"
                onClick={closeSearch}
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
            <MainSearching />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
