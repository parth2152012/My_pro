import React from "react";
import starBg from "../assets/star_bg.png";
import smart from "../assets/smart.png";
import ndc from "../assets/ndc.png";
import idc from "../assets/idc.jpg";
import { motion } from "framer-motion";


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
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={smart}
                        alt="Smarter SOC"
                        className="h-auto w-full md:w-1/2 rounded-2xl"
                    />
                    <motion.div className="comos-bg flex flex-col justify-center text-center text-2xl sm:text-3xl font-semibold h-auto md:h-[400px] w-full md:w-1/2 text-white p-8 rounded-2xl">
                        Smarter, faster, cheaper than traditional SOC.
                    </motion.div>
                </motion.div>

                {/* Block 2: Image Left, Text Right */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row-reverse justify-between items-center gap-8">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={ndc}
                        alt="AI monitoring"
                        className="h-auto w-full md:w-1/2 rounded-2xl"
                    />
                    <motion.div className="comos-bg flex flex-col justify-center text-center text-2xl sm:text-3xl font-semibold h-auto md:h-[400px] w-full md:w-1/2 text-white p-8 rounded-2xl">
                        Bringing SOC to startups with AI-driven monitoring, instant alerts,
                        and affordable pricing.
                    </motion.div>
                </motion.div>

                {/* Block 3: Image Left, Card Right */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={idc}
                        alt="Accessible security"
                        className="h-auto w-full md:w-1/2 rounded-2xl"
                    />
                    <motion.div className="comos-bg flex flex-col justify-center text-center text-2xl sm:text-3xl font-semibold h-auto md:h-[400px] w-full md:w-1/2 text-white p-8 rounded-2xl">
                        Making AI-powered security accessible from day one.
                    </motion.div>
                </motion.div>
            </div>

            {/* How It Works Section */}
            {/* The "How It Works" section was removed as the 'Work' component is not defined. You can re-add this section once the component is created and imported correctly. */}
        </section>
    );
};
