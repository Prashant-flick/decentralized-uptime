import { Activity, Shield, Globe2, Zap, Server, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import React from 'react';

function LandingPage() {
  const navigate = useNavigate();
  const { islogin, logout } = useAuth();

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(islogin?'/dashboard':'/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold">DeUptime</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          </div>
          {
            !islogin ?
            (<button 
              onClick={handleLogin}
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg transition-colors"
            >
              Get Started
            </button>)
            :
            (<button 
              onClick={logout}
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg transition-colors"
            >
              SignOut
            </button>)
          }
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Decentralized Uptime Monitoring for the Web3 Era
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Monitor your applications' uptime through a network of decentralized nodes.
            No single point of failure. Real-time alerts. Global coverage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleLogin}
              className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Monitoring
            </button>
            <button className="border border-white hover:border-emerald-400 hover:text-emerald-400 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose DeUptime?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl">
              <Shield className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Decentralized Security</h3>
              <p className="text-gray-400">No central point of failure. Your monitoring is distributed across multiple nodes worldwide.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <Globe2 className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
              <p className="text-gray-400">Monitor from multiple geographic locations simultaneously for true global perspective.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <Zap className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
              <p className="text-gray-400">Instant notifications when issues are detected, with detailed diagnostics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How DeUptime Works</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg">
                  <Server className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">1. Deploy Nodes</h3>
                  <p className="text-gray-400">Our decentralized network of nodes is ready to monitor your applications 24/7.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2. Monitor Performance</h3>
                  <p className="text-gray-400">Get real-time metrics and uptime statistics from multiple geographic locations.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">3. Stay Informed</h3>
                  <p className="text-gray-400">Receive instant alerts and detailed reports about your application's health.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                alt="Network Monitoring Dashboard"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the future of uptime monitoring. Start securing your applications with DeUptime today.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white text-emerald-900 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-bold">DeUptime</span>
            </div>
            <div className="text-gray-400">
              © 2025 DeUptime. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;