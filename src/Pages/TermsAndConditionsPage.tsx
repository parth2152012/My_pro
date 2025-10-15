import React from 'react';
import { Footer } from './Footer';
import { motion } from 'framer-motion';

export const TermsAndConditionsPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
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
      <div className="absolute top-[100px] right-[-100px] w-[300px] h-[300px] bg-purple-700 rounded-full opacity-20 blur-2xl pointer-events-none transform rotate-12"></div>
      <div className="absolute bottom-[200px] left-[-150px] w-[250px] h-[250px] bg-purple-600 rounded-full opacity-15 blur-2xl pointer-events-none transform -rotate-45"></div>
      <div className="relative max-w-4xl mx-auto z-10">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          variants={itemVariants}
        >
          Terms and Conditions
        </motion.h1>
        <motion.p
          className="text-sm text-gray-600 mb-8"
          variants={itemVariants}
        >
          Last updated: October 2023
        </motion.p>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
        >
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using COMOS (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on COMOS's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display;</li>
              <li>attempt to reverse engineer any software contained on the COMOS website;</li>
              <li>remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">3. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              COMOS provides AI-powered Security Operations Center services designed to enhance cybersecurity for businesses. Our services include real-time monitoring, threat detection, and automated response capabilities.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed">
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">5. Data Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall COMOS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on COMOS's website, even if COMOS or a COMOS authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction], and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at contact@comos.com.
            </p>
            <Footer />
          </motion.section>
        </motion.div>
      </div>
    </motion.section>
  );
};
