import React from "react";
import { Work } from "../Components/HowWork.tsx";
import starBg from "../assets/star_bg.png";
import smart from "../assets/smart.png";
import ndc from "../assets/ndc.png";
import idc from "../assets/idc.jpg";


export const About: React.FC = () => {
    return (
        <section
            id="about"
            style={{
                backgroundImage: `url(${starBg})`,
            }}
            className="flex flex-col w-full text-base-content bg-contain bg-no-repeat text-center items-center px-4 sm:px-6 md:px-10 lg:px-20 py-16 overflow-hidden overflow-x-hidden relative overflow-hidden bg-gradient-to-br from-base-200 via-purple-900/20 to-base-200"
        >
            {/* Purple Blob Background */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
            {/* Intro */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center max-w-3xl pt-10 leading-relaxed text-white">
                <span className="comos-color">COMOS</span> is an AI-powered Security
                Operations Center designed for businesses of all sizes — from startups
                to enterprises.
            </div>

            {/* Features */}
            <div className="flex flex-col gap-12 pt-16 w-full max-w-7xl">
                {/* Block 1: Image Left, Card Right */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <img
                        src={smart}
                        alt="Smarter SOC"
                        className="h-auto w-full md:w-1/2 rounded-2xl"
                    />
                    <div className="comos-bg flex flex-col justify-center text-center text-2xl sm:text-3xl font-semibold h-auto md:h-[400px] w-full md:w-1/2 text-white p-8 rounded-2xl">
                        Smarter, faster, cheaper than traditional SOC.
                    </div>
                </div>

                {/* Block 2: Image Left, Text Right */}
                <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-8">
                    <img
                        src={ndc}
                        alt="AI monitoring"
                        className="h-auto w-full md:w-1/2 rounded-2xl"
                    />
                    <div className="comos-bg flex flex-col justify-center text-center text-2xl sm:text-3xl font-semibold h-auto md:h-[400px] w-full md:w-1/2 text-white p-8 rounded-2xl">
                        Bringing SOC to startups with AI-driven monitoring, instant alerts,
                        and affordable pricing.
                    </div>
                </div>

                {/* Block 3: Image Left, Card Right */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <img
                        src={idc}
                        alt="Accessible security"
                        className="h-auto w-full md:w-1/2 rounded-2xl"
                    />
                    <div className="comos-bg flex flex-col justify-center text-center text-2xl sm:text-3xl font-semibold h-auto md:h-[400px] w-full md:w-1/2 text-white p-8 rounded-2xl">
                        Making AI-powered security accessible from day one.
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <section className="mt-24 w-full max-w-6xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">
                    How <span className="comos-color">COMOS</span> Works
                </h2>
                <div className="flex flex-col items-center gap-8 mb-20">
                    <Work />
                </div>
            </section>
        </section>
    );
};
