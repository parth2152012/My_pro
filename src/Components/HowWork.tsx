import { motion } from "framer-motion";

export const Work = () => {
    const items = [
        {
            title: "Continuous Monitoring",
            text: "Real-time scans of your apps & infrastructure to catch issues early.",
        },
        {
            title: "Threat Detection & Alerts",
            text: "AI watches what humans miss, alerting you to potential threats.",
        },
        {
            title: "Clear Reports",
            text: "Understandable, founder-friendly dashboards and reports.",
        },
        {
            title: "Fast Setup",
            text: "Connect GitHub, AWS, or cloud in minutes.",
        },
    ];

    // parent animation
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.3 },
        },
    } as const;


    // item animation
    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    } as const;


    return (
        <section className="text-base-content py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    className="space-y-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }}
                >
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className={`flex flex-col md:flex-row items-center ${idx % 2 === 0
                                ? "md:flex-row"
                                : "md:flex-row-reverse"
                                } gap-8`}
                        >
                            <div
                                className={`w-full h-48 md:w-1/2 px-6 py-6 rounded-2xl shadow-lg text-left ${idx % 2 === 0
                                    ? "md:text-left work-bg"
                                    : "md:text-right work-bg-black"
                                    }`}
                            >
                                <h3 className="text-2xl font-semibold text-white mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-300">{item.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
