//import React from "react";

export const AboutSection = () => {
  return (
    <section id="about" className="bg-base-200">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Flex container for the two-column layout */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Column 1: Image */}
          {/* Takes full width on mobile, and half width on medium screens and up */}
          <div className="w-full md:w-1/2">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Team working together"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Column 2: Text Content */}
          {/* Also takes full width on mobile, and half width on medium screens and up */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About COMOS</h2>
            <p className="text-base-content/80 mb-4">We are a passionate team dedicated to creating beautiful, functional, and responsive web experiences. Our mission is to build tools that work seamlessly on any device, providing an intuitive and engaging user journey from start to finish.</p>
            <p className="text-base-content/80">This layout is a perfect example of mobile-first design. It stacks vertically on small screens and transitions to a two-column format on larger ones, ensuring readability and a great look everywhere.</p>
          </div>
        </div>
      </div>
    </section>
  );
};