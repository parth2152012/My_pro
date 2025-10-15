import React, { useEffect, useRef, useState } from "react";
import chart from "../assets/Chart&Axis.svg";
import Mchart from "../assets/MainChart.svg";
import { motion } from "framer-motion";

export const Services: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            id="services"
            className="flex flex-col text-base-content text-center items-center py-16 px-4 sm:px-6 md:px-10 lg:px-20"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl items-center">
                {/* Tech Services */}
                <motion.div
                    className="w-full flex flex-col items-center md:items-start text-center md:text-left"
                    animate={isMobile ? {
                        y: isInView ? 0 : 50,
                        opacity: isInView ? 1 : 0,
                    } : {
                        x: isInView ? 0 : -50,
                        opacity: isInView ? 1 : 0,
                    }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
                        Downtime from an attack costs startups{" "}
                        <span className="comos-color">$8,000 to $74,000</span> per hour.
                    </p>

                    <img
                        src={chart}
                        alt="Attack cost chart"
                        className="pt-12 sm:pt-24 md:pt-40 lg:pt-60 w-full max-w-md mx-auto md:mx-0"
                    />

                    <p className="text-sm sm:text-base text-center md:text-left mt-4 opacity-80">
                        Estimated % of breaches involving cloud-hosted data
                    </p>
                </motion.div>

                {/* Marketing Services */}
                <motion.div
                    className="w-full flex flex-col items-center md:items-end text-center md:text-left"
                    animate={isMobile ? {
                        y: isInView ? 0 : 50,
                        opacity: isInView ? 1 : 0,
                    } : {
                        x: isInView ? 0 : 50,
                        opacity: isInView ? 1 : 0,
                    }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src={Mchart}
                        alt="Cloud breach statistics"
                        className="w-72 sm:w-80 md:w-96 mb-10"
                    />
                    <p className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug text-left">
                        2025 is projected to be the worst year yet for cloud breaches with{" "}
                        <span className="comos-color">nearly half</span> of all data breaches involving{" "}
                        <span className="comos-color">cloud environments.</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
