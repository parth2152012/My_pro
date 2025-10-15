import React from 'react';

export const GrowthPlanPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-purple-900/20 to-base-200 text-base-content relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>

      <div className="relative z-10">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="comos-color">Growth Plan</span> ($499/mo)
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Enterprise-level security for growing startups
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn comos-bg px-8 py-3 rounded-xl text-white hover:scale-105 transition-transform">
                Get Started
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
                  <p className="text-3xl font-bold mb-2">$499 / month</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 comos-color">Limits</h3>
                  <p className="text-lg mb-2">5-10 Apps</p>
                  <p className="text-lg">10-100 Users</p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 comos-color">Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Startup features included</li>
                  <li>• Dark web monitoring for leaked emails/domains</li>
                  <li>• AI Co-SOC analyst (ask in plain English, get summarized threat reports)</li>
                  <li>• Red Team Mode (safe attack simulations for your apps 1 time per month)</li>
                  <li>• Multi-app dashboards, integrations (GitHub, Notion, Jira, Trello)</li>
                  <li>• Priority support + setup assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Scale Safely
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Enterprise-level security with zero overhead
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn comos-bg px-8 py-3 rounded-xl text-white hover:scale-105 transition-transform">
                Get Started
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
