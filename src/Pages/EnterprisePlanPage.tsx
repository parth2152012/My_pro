import React from 'react';

export const EnterprisePlanPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-purple-900/20 to-base-200 text-base-content relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>

      <div className="relative z-10">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="comos-color">Enterprise Plan</span> ($1k - $5k/mo)
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Custom enterprise solutions for large organizations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn comos-bg px-8 py-3 rounded-xl text-white hover:scale-105 transition-transform">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-base-100 p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-white">Plan Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 comos-color">Pricing</h3>
                  <p className="text-3xl font-bold mb-2">$1k - $5k / month</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 comos-color">Limits</h3>
                  <p className="text-lg mb-2">10+ Apps</p>
                  <p className="text-lg">As required</p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 comos-color">Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Growth features included</li>
                  <li>• Custom integrations (any API, any tool)</li>
                  <li>• Dedicated support team + account manager</li>
                  <li>• Advanced features as required (e.g., custom AI models, on-prem deployment)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Enterprise Security Solutions
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Tailored security for your organization's unique needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn comos-bg px-8 py-3 rounded-xl text-white hover:scale-105 transition-transform">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
