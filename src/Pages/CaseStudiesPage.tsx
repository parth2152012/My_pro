import React from 'react';
import startupImage from '../assets/startup_sec_enhance.jpg';
import cloudImage from '../assets/cloud_sec_enhance.jpg';
import costImage from '../assets/cost.jpg';
import { Footer } from './Footer';
import { motion } from 'framer-motion';

const caseStudies = [
  {
    id: 1,
    title: "Startup Security Enhancement",
    description: "Implemented AI-driven monitoring and instant alerts to reduce breach response time by 50%.",
    image: startupImage,
  },
  {
    id: 2,
    title: "Enterprise Cloud Protection",
    description: "Deployed scalable SOC solutions for cloud environments, improving security posture and compliance.",
    image: cloudImage,
  },
  {
    id: 3,
    title: "Cost Reduction with AI SOC",
    description: "Reduced operational costs by 30% while maintaining high security standards using AI automation.",
    image: costImage,
  },
];

export const CaseStudiesPage: React.FC = () => {
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
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.section
      className="relative min-h-screen bg-base-100 text-base-content p-8 overflow-hidden"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Purple blob background */}
      <div className="absolute top-[200px] right-[-100px] w-[300px] h-[300px] bg-purple-700 rounded-full opacity-20 blur-2xl pointer-events-none transform rotate-12"></div>
      <div className="absolute bottom-[100px] left-[-150px] w-[250px] h-[250px] bg-purple-600 rounded-full opacity-15 blur-2xl pointer-events-none transform -rotate-45"></div>
      <motion.h1
        className="relative text-4xl font-bold mb-8 text-center z-10"
        variants={itemVariants}
      >
        Case Studies
      </motion.h1>
      <motion.div
        className="relative flex flex-col gap-12 max-w-7xl mx-auto z-10"
        variants={containerVariants}
      >
        {caseStudies.map(({ id, title, description, image }, index) => (
          <motion.div
            key={id}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center gap-8 bg-base-100 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 p-6`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={image}
              alt={title}
              className="w-full md:w-1/2 h-48 md:h-auto object-cover rounded-lg"
              variants={itemVariants}
            />
            <motion.div
              className="w-full md:w-1/2 text-center md:text-left"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-4">{title}</h2>
              <p className="text-gray-700">{description}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <Footer />
    </motion.section>
  );
};
