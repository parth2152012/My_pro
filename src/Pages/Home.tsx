
import { useEffect, useState, useMemo } from "react";
import bgImg from "../assets/6-BG-Ice-Cube-Data-Centre.png"; // adjust path

export const Home = () => {
    const words = useMemo(() => ["Center", "Platform", "Application"], []);
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;

        if (typing) {
            if (displayed.length < words[index].length) {
                timeout = setTimeout(() => {
                    setDisplayed(words[index].slice(0, displayed.length + 1));
                }, 100);
            } else {
                timeout = setTimeout(() => setTyping(false), 1200);
            }
        } else {
            if (displayed.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayed(displayed.slice(0, -1));
                }, 60);
            } else {
                setTyping(true);
                setIndex((index + 1) % words.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayed, typing, index, words]);

    return (
        <>
        <section
            id="homeSection"
            style={{ backgroundImage: `url(${bgImg})` }}
            className="min-h-screen flex flex-col justify-center bg-center sm:bg-right bg-cover bg-no-repeat text-center sm:text-left px-4 sm:px-8 md:px-12 lg:px-20 relative overflow-hidden"
        >
            {/* Purple Blob Background */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
                <h1
                    className="
        font-bold font-mono text-white pt-24 mx-auto sm:mx-0
        text-4xl sm:text-5xl md:text-6xl lg:text-8xl
        max-w-[90%] sm:max-w-[600px] leading-tight
      "
                >
                    AI Powered{" "}
                    <span className="comos-color">
                        Security Operating
                        <br />
                        <span
                            className="border-r-4 border-white pr-2 inline-block"
                            style={{ animation: "blink 0.7s infinite" }}
                        >
                            {displayed}
                        </span>
                    </span>
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center sm:justify-start items-center">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="px-4 py-3 bg-base-200 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 w-full sm:w-auto"
                    />
                    <a
                        href="/join-waitlist"
                        className="btn comos-bg rounded-xl px-6 py-3 text-white hover:scale-105 transition-transform"
                    >
                        Join Waitlist
                    </a>
                </div>
            </section>
        </>

    );
};
