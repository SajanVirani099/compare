"use client";

import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { settingGet } from "../redux/slice/settingSlice";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";

const ParntnerShip = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(settingGet());
    }, [dispatch]);

    const { setting } = useSelector((state) => state.setting);
    const [data, setData] = useState();
    useEffect(() => {
        setData(setting.aboutUs);
    }, [setting]);

    return (
        <>
            <div className="pb-14 mb-5 navigationContainer">
                <Navbar />
                <div className="header w-100 mt-14 partnershipMain w-1176 mx-auto">
                    <div className="m-auto">
                        <h1 className="text-white title font-bold">About Us</h1>
                    </div>
                </div>
            </div>
            <div className="partnershipContentMain mt-36 w-1176 mx-auto px-2 ">
                {data?.map((item, index) => (
                    <div key={index}>
                        <div className="partnerContentTitle mt-3 text-4xl font-bold mb-10">
                            {item.title}
                        </div>
                        <hr />
                        <div className="partnershipContent text-xl mb-20">
                            {item.content}
                        </div>
                    </div>
                ))}
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default ParntnerShip;
