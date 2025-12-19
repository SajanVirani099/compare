"use client";

import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { suggetionSend } from "../redux/slice/productSlice";

const SuggestProduct = () => {
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [source, setSource] = useState("");

    const handleSubmit = () => {
        const data = {
            name,
            source,
        };
        dispatch(suggetionSend(data));
    };

    return (
        <>
            <div className="pb-14 mb-5 navigationContainer">
                <Navbar />

                <div className="header w-100 mt-14 partnershipMain w-1176 mx-auto">
                    <div className="m-auto">
                        <h1 className="text-white title font-bold">
                            Suggest Product
                        </h1>
                    </div>
                </div>
            </div>
            <div className="partnershipContentMain my-16 suggestForm mx-auto px-2 ">
                <h2 className=" text-lg">
                    We work hard to have all the latest products but sometimes
                    we miss something. If you notice a missing product please
                    let us know, we will do our best to include it.
                </h2>
            </div>
            <div className="suggestForm w-1176 m-auto">
                <form>
                    <div class="grid gap-6 mb-6 ">
                        <div>
                            <label
                                for="first_name"
                                class="block mb-2 text-sm text-lg	 text-gray-900 dark:text-white"
                            >
                                Product Name &nbsp; (*Required)
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-9/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder=""
                                required
                                value={name}
                            />
                        </div>
                        <div>
                            <label
                                for="last_name"
                                class="block mb-2 text-sm text-lg	 text-gray-900 dark:text-white"
                            >
                                Source &nbsp;(optional)
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-9/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder=""
                                value={source}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-lg	 rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-14"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default SuggestProduct;
