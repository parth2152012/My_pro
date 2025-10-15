import React from 'react';
import { Footer } from './Footer';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const BlogPage: React.FC = () => {
    const posts = [
        {
            title: 'Why Every Startup Needs a SOC from Day One',
            category: 'Security',
            date: 'October 25, 2023',
            excerpt: 'Investors are looking for more than just a great idea; they want to see that you\'re protecting their investment. Learn how early-stage security builds trust and accelerates growth.'
        },
        {
            title: 'The True Cost of a Data Breach (It\'s More Than You Think)',
            category: 'Cybersecurity',
            date: 'October 18, 2023',
            excerpt: 'Beyond the immediate financial hit, a data breach can destroy customer trust and brand reputation. We break down the hidden costs and how to avoid them.'
        },
        {
            title: 'AI in Cybersecurity: Hype vs. Reality',
            category: 'Technology',
            date: 'October 10, 2023',
            excerpt: 'Artificial intelligence is a powerful tool, but it\'s not magic. Understand what AI can and can\'t do for your security stack.'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            <main className="flex-grow">
                <motion.section
                    className="py-20 px-4 sm:px-6 lg:px-8 text-center"
                    variants={itemVariants}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold comos-color mb-4"
                        variants={itemVariants}
                    >
                        Insights & Articles
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300"
                        variants={itemVariants}
                    >
                        Your source for the latest in cybersecurity, technology, and startup growth.
                    </motion.p>
                </motion.section>

                <motion.section
                    className="py-16 px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                >
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={index}
                                className="work-bg-black p-6 rounded-xl shadow-lg flex flex-col group"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-sm text-primary mb-2">{post.category}</p>
                                <h3 className="text-xl font-semibold text-white mb-3 flex-grow">{post.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{post.date}</p>
                                <a href="#" className="text-white font-semibold inline-flex items-center mt-auto group-hover:text-primary transition-colors">
                                    Read More <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </main>
            <Footer />
        </motion.div>
    );
};
