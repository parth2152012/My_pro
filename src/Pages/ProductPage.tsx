import React from 'react';
import { Link } from 'react-router-dom';

export const ProductPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-purple-900/20 to-base-200 text-base-content relative overflow-hidden">
      {/* Purple Blob Background */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="comos-color">COMOS</span> Product
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              AI-powered Security Operations Center designed for modern businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn comos-bg px-8 py-3 rounded-xl text-white hover:scale-105 transition-transform">
                Start Free Trial
              </button>
              <button className="btn btn-outline px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
              Powerful Features for Modern Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">AI-Driven Monitoring</h3>
                <p className="text-gray-300">Continuous threat detection using advanced AI algorithms that learn from your environment.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Instant Alerts</h3>
                <p className="text-gray-300">Real-time notifications for critical security events, ensuring immediate response capabilities.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Cloud Integration</h3>
                <p className="text-gray-300">Seamless integration with AWS, Azure, GCP, and other cloud platforms for comprehensive coverage.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Compliance Automation</h3>
                <p className="text-gray-300">Automated compliance checks and reporting for industry standards and regulations.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Scalable Architecture</h3>
                <p className="text-gray-300">Built to grow with your business, from startups to enterprise-level deployments.</p>
              </div>
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Expert Support</h3>
                <p className="text-gray-300">24/7 access to security experts and comprehensive documentation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
              Why Choose COMOS?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-white">Reduce Security Costs by 60%</h3>
                <p className="text-gray-300 mb-6">
                  Traditional SOCs are expensive and complex. COMOS delivers enterprise-grade security at a fraction of the cost, making it accessible for businesses of all sizes.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li>• No expensive hardware requirements</li>
                  <li>• Automated threat response reduces manual work</li>
                  <li>• Pay-as-you-grow pricing model</li>
                </ul>
              </div>
              <div className="bg-base-100 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">60%</div>
                  <div className="text-gray-300">Cost Reduction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {/* Free Trial */}
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Free Trial</h3>
                <div className="text-3xl font-bold mb-2 comos-color">14 Days</div>
                <p className="text-gray-300 mb-4">1 App • 1-2 Users</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>• Log monitoring</li>
                  <li>• AI alerts</li>
                  <li>• Slack/Discord notifications</li>
                  <li>• Basic dashboard</li>
                </ul>
                <Link to="/free-trial" className="btn comos-bg w-full px-4 py-2 rounded-xl text-white hover:scale-105 transition-transform">
                  Start Free
                </Link>
              </div>
              {/* Indie */}
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Indie</h3>
                <div className="text-3xl font-bold mb-2 comos-color">$49/mo</div>
                <p className="text-gray-300 mb-4">1 App • 1–2 Users</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>• Log monitoring</li>
                  <li>• AI alerts</li>
                  <li>• Slack/Discord notifications</li>
                  <li>• Basic dashboard</li>
                </ul>
                <Link to="/indie-plan" className="btn comos-bg w-full px-4 py-2 rounded-xl text-white hover:scale-105 transition-transform">
                  Get Started
                </Link>
              </div>
              {/* Startup */}
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Startup</h3>
                <div className="text-3xl font-bold mb-2 comos-color">$199/mo</div>
                <p className="text-gray-300 mb-4">3 Apps • 2–10 Users</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>• Indie features</li>
                  <li>• Incident playbooks</li>
                  <li>• Phishing simulation</li>
                  <li>• Compliance helper</li>
                </ul>
                <Link to="/startup-plan" className="btn comos-bg w-full px-4 py-2 rounded-xl text-white hover:scale-105 transition-transform">
                  Get Started
                </Link>
              </div>
              {/* Growth */}
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Growth</h3>
                <div className="text-3xl font-bold mb-2 comos-color">$499/mo</div>
                <p className="text-gray-300 mb-4">5-10 Apps • 10-100 Users</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>• Startup features</li>
                  <li>• Dark web monitoring</li>
                  <li>• AI analyst</li>
                  <li>• Red team mode</li>
                  <li>• Multi-app dashboard</li>
                  <li>• Priority support</li>
                </ul>
                <Link to="/growth-plan" className="btn comos-bg w-full px-4 py-2 rounded-xl text-white hover:scale-105 transition-transform">
                  Get Started
                </Link>
              </div>
              {/* Enterprise */}
              <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Enterprise</h3>
                <div className="text-3xl font-bold mb-2 comos-color">$1k - $5k/mo</div>
                <p className="text-gray-300 mb-4">10+ Apps • As required</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>• Growth features</li>
                  <li>• Custom integrations</li>
                  <li>• Dedicated support</li>
                  <li>• Advanced features as required</li>
                </ul>
                <Link to="/contactPage" className="btn comos-bg w-full px-4 py-2 rounded-xl text-white hover:scale-105 transition-transform">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
              How COMOS Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Connect</h3>
                <p className="text-gray-300">Integrate your cloud environments and applications in minutes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Monitor</h3>
                <p className="text-gray-300">AI continuously analyzes your security posture and threats</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Respond</h3>
                <p className="text-gray-300">Automated responses and alerts keep your business secure</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Secure Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses already protected by COMOS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn comos-bg px-8 py-3 rounded-xl text-white hover:scale-105 transition-transform">
                Start Your Free Trial
              </button>
              <button className="btn btn-outline px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
