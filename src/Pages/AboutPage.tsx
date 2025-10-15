import { Footer } from "./Footer";
import { motion } from "framer-motion";

export const AboutPage: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 },
        },
    };

    return (
        <motion.section
            id="about"
            className="min-h-screen flex flex-col items-center justify-center text-base-content text-center pt-10 px-4 sm:px-6"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            <motion.div
                className="flex flex-col md:flex-row items-start text-left justify-between max-w-4xl mx-auto"
                variants={containerVariants}
            >
                <motion.div
                    className="flex flex-col items-start text-left max-w-lg pt-10 md:pt-20"
                    variants={itemVariants}
                >
                    <motion.p variants={itemVariants}>
                        Many companies struggle online because they focus only on sales and don't use digital tools the right way. We change that by combining smart technology with marketing that works.
                    </motion.p>
                    <motion.p
                        className="krakenColor pt-10"
                        variants={itemVariants}
                    >
                        We exist to change that.
                    </motion.p>
                    <motion.p
                        className="pt-10"
                        variants={itemVariants}
                    >
                        At Kraken Tec, we believe technology should be an advantage not a barrier. Our goal is simple: to support every business and help them grow into a strong, recognizable brand. With Kraken Tec, you get a complete solution all in one place.
                    </motion.p>
                    <motion.h2
                        className="krakenColor text-2xl pt-10"
                        variants={itemVariants}
                    >
                        Our Mission
                    </motion.h2>
                    <motion.p
                        className="pt-10"
                        variants={itemVariants}
                    >
                        To empower businesses with simple, modern, and scalable technology delivering high-quality digital solutions that help them stand out, reach more people, and grow with confidence.
                    </motion.p>
                </motion.div>
            </motion.div>
            <Footer />
        </motion.section>
    );
}
