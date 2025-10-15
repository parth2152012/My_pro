import React, { useState } from 'react';

export const JoinWaitlistPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Waitlist submission:', formData);
    alert('Thank you for joining the waitlist!');
    setFormData({ fullName: '', email: '', companyName: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <form onSubmit={handleSubmit} className="">
              <div className="mb-8">
                <label className="block text-white mb-3">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-black text-white border-b border-gray-700 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block text-white mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full bg-black text-white border-b border-gray-700 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block text-white mb-3">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                  className="w-full bg-black text-white border-b border-gray-700 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block text-white mb-3">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="I want to try this Product"
                  className="w-full bg-black text-white border-b border-gray-700 focus:outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline w-full px-8 py-3 rounded-xl text-white hover:scale-105 transition-transform"
              >
                Join Waitlist
              </button>
            </form>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Join Waitlist
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300">
              to get early access to COMOS and experience next-gen AI-powered security before anyone else.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
