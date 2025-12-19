import Link from "next/link";
import React from "react";

const LandingPage = () => {
    return (
        <div className="landingPage mt-[50px]">
            <div>
                <div className="landingPageTitle text-3xl md:text-4xl lg:text-5xl xl:text-8xl font-bold text-center">
                    <h1>Compare Everything</h1>
                </div>
            </div>
            <div className="landingPageSubTitle text-center text-base md:text-lg lg:text-xl xl:text-2xl mt-6">
                <span className="">Smartphones</span>,
                <span className="">&nbsp;cities</span>,
                <span className=""> graphics cards</span>
                &nbsp;and
                <span className="">&nbsp;much more</span>
            </div>
        </div>
    );
};

export default LandingPage;
