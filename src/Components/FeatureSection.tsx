//import React from "react";

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  // Each card will take the full width on mobile, but 1/3 of the width on medium screens and up.
  // The `flex-1` and `min-w-0` ensure the cards grow and shrink correctly within the flex container.
  <div className="w-full p-4 sm:w-1/2 lg:w-1/3 flex">
    <div className="card bg-base-200 shadow-xl h-full w-full">
      <figure>
        {/* Using a placeholder image */}
        <img
          src="https://via.placeholder.com/400x250"
          alt={`Placeholder for ${title}`}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export const FeatureSection = () => {
  return (
    <section id="features" className="container mx-auto p-4 py-12 md:py-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Our Awesome Features</h1>
        <p className="text-lg text-base-content/70">
          Built to be responsive and beautiful on any device.
        </p>
      </div>

      {/*
        - `flex` creates a flex container.
        - `flex-col` stacks items vertically (mobile-first).
        - `md:flex-row` changes the direction to horizontal on medium screens (768px) and up.
        - `flex-wrap` allows items to wrap if needed.
        - `-m-4` is a negative margin to counteract the padding on the cards for perfect alignment.
      */}
      <div className="flex flex-wrap -m-4">
        <FeatureCard title="Feature One" description="Description for the first amazing feature. It's designed to be flexible and useful." />
        <FeatureCard title="Feature Two" description="Description for the second cool feature. It adapts to your needs and screen size." />
        <FeatureCard title="Feature Three" description="Description for the third fantastic feature. Experience seamless browsing everywhere." />
      </div>
    </section>
  );
};