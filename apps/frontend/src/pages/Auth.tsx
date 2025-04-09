import React, { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import { conf } from '../conf/config';

function Auth() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password && formData.confirmPassword) {
      try {
        await axios.post(`${conf.BackendUrl}/signup`, formData);
        const signInRes = await axios.post(`${conf.BackendUrl}/signin`, formData);
        login(signInRes.data.token, signInRes.data.userId);
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      }
    } else if (formData.email && formData.password) {
      try {
        const signInRes = await axios.post(`${conf.BackendUrl}/signin`, formData, {
          withCredentials: true
        })
        login(signInRes.data.token, signInRes.data.userId);
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('All feilds are required');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        <header className="p-6">
          <Link to="/" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </header>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <Activity className="w-8 h-8 text-emerald-400" />
              <h1 className="text-2xl font-bold">DeUptime</h1>
            </div>

            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-400 mb-8">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Start monitoring your applications in minutes'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg transition-colors font-semibold"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
          alt="Network Monitoring"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Auth;