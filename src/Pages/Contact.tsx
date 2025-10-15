 import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpLeft } from "react-icons/fi";

export const Contact: React.FC = () => {
    return (
        <><section
            id="usecase"
            className="flex flex-col max-w-screen text-base-content bg-contain text-center items-center"
        >
            <h2 className="text-4xl font-bold text-white mt-10 mb-4">Use Cases</h2>
            <div className="divider w-1/2 h-[1px] mx-auto mb-10 comos-bg-gradient"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-20">
                <Link
                    to="/caseStudies"
                    className="group card w-full md:w-64 work-bg text-left p-6 transition-all duration-300 hover:text-black"
                >
                    <FiArrowUpLeft className="absolute bottom-2 right-2 w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                    <h2 className="text-2xl text-white transition-colors duration-300 group-hover:text-purple-600">
                        <span className="font-bold group-hover:text-purple-600">For Startups:</span>{" "}
                        Secure early, win investor trust
                    </h2>
                </Link>

                <Link
                    to="/caseStudies"
                    className="group card w-full md:w-64 work-bg text-left p-6 transition-all duration-300 hover:text-black"
                >
                    <FiArrowUpLeft className="absolute bottom-2 right-2 w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                    <h2 className="text-2xl text-white transition-colors duration-300 group-hover:text-purple-600">
                        <span className="font-bold group-hover:text-purple-600">For Founders:</span> Peace of mind, no security headaches
                    </h2>
                </Link>
                <Link
                    to="/caseStudies"
                    className="group card w-full md:w-64 work-bg text-left p-6 transition-all duration-300 hover:text-black"
                >
                    <FiArrowUpLeft className="absolute bottom-2 right-2 w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                    <h2 className="text-2xl text-white transition-colors duration-300 group-hover:text-purple-600">
                        <span className="font-bold group-hover:text-purple-600">For Dev Teams:</span> Automate security checks before launch
                    </h2>
                </Link>
            </div>
            <Link to="/caseStudies" className="mb-20 btn comos-bg px-6 rounded-lg text-white max-w-fit">Read More<FiArrowUpLeft className="h-4 w-4" /></Link>
        </section><section
            id="toContact"
            className="w-full h-72 b-footer-gradient flex flex-col md:flex-row items-center justify-between py-10 px-4 sm:px-8 md:px-12 lg:px-20"
        >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white w-full md:w-96 mb-6 text-center md:text-left"> READY FOR WHAT’S COMING <span className="comos-color">NEXT?</span></h2>
                <Link
                    to={"/contactPage"}
                    className="btn comos-bg px-6 rounded-lg text-white max-w-fit"
                >
                    Contact Us!
                </Link>
            </section></>
    );
}
