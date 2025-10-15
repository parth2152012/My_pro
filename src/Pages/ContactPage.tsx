import React, { useState } from "react";
import { motion } from "framer-motion";

export const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            const res = await fetch("https://formspree.io/f/xqaylkqd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("✅ Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("❌ Something went wrong. Please try again later.");
            }
        } catch (err) {
            console.error(err);
            setStatus("❌ Network error. Please check your connection.");
        }
    };

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
            id="contact"
            className="min-h-screen flex flex-col items-center justify-center text-base-content text-center px-6 relative overflow-hidden bg-gradient-to-br from-base-200 via-purple-900/20 to-base-200"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            {/* Purple Blob Background */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
            <motion.h1
                className="text-5xl font-bold comos-color"
                variants={itemVariants}
            >
                Contact Us
            </motion.h1>
            <motion.p
                className="py-6 text-lg text-secondary"
                variants={itemVariants}
            >
                We'd love to hear from you! Reach out to us for any inquiries or support.
            </motion.p>

            <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-lg"
                variants={containerVariants}
            >
                <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-left text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="input input-bordered w-full"
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </motion.div>
                <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-left text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="input input-bordered w-full"
                        id="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </motion.div>
                <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-left text-sm font-bold mb-2" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        id="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </motion.div>
                <motion.button
                    className="btn btn-primary w-full"
                    type="submit"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Send Message
                </motion.button>
            </motion.form>

            {status && (
                <motion.p
                    className="mt-4 text-sm text-secondary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {status}
                </motion.p>
            )}
        </motion.div>
    );
};
