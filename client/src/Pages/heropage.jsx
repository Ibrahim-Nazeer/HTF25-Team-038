import React, { useState, useEffect, useRef } from 'react';
import { Code, Video, MessageSquare, Users, Play, Shield, Clock, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // ADD THIS LINE

export  function HeroPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({
    languages: 0,
    uptime: 0,
    companies: 0,
    interviews: 0
  });
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      languages: 50,
      uptime: 99.9,
      companies: 500,
      interviews: 10000
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        languages: Math.floor(targets.languages * progress),
        uptime: (targets.uptime * progress).toFixed(1),
        companies: Math.floor(targets.companies * progress),
        interviews: Math.floor(targets.interviews * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats({
          languages: targets.languages,
          uptime: targets.uptime,
          companies: targets.companies,
          interviews: targets.interviews
        });
      }
    }, stepDuration);
  };

  const features = [
    { id: 'live-editor', icon: Code, title: "Live Code Editor", desc: "Real-time collaboration with multi-language support" },
    { id: 'integrated-video', icon: Video, title: "Integrated Video", desc: "Seamless video & chat communication" },
    { id: 'role-dashboards', icon: Users, title: "Role-Based Dashboards", desc: "Tailored experiences for candidates & interviewers" },
    { id: 'session-replay', icon: Archive, title: "Session Replay", desc: "Review and analyze interviews anytime" }
  ];

  const capabilities = [
    { icon: Shield, text: "Secure Sessions" },
    { icon: Clock, text: "Auto-Save History" },
    { icon: Play, text: "Hidden Test Cases" },
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden scroll-smooth">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeSync
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          {/* Features dropdown linking to specific feature cards */}
          <div className="relative group">
            <button className="inline-flex items-center hover:text-purple-400 transition font-medium">
              Features
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <div className="absolute left-0 mt-2 w-56 bg-slate-900/95 border border-white/10 rounded-md shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transform transition-all duration-150 pointer-events-none group-hover:pointer-events-auto">
              <a href="#live-editor" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/5">Live Code Editor</a>
              <a href="#role-dashboards" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/5">Role-Based Dashboards</a>
              <a href="#session-replay" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/5">Session Replay</a>
            </div>
          </div>
          <a href="#demo" className="hover:text-purple-400 transition">Demo</a>
          <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
        </div>
        <button 
          className="bg-black text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer"
          onClick={() => navigate('/login')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> Coding Interviews</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            A next-generation platform for real-time collaboration between candidates and interviewers. 
            Live coding, integrated video, and intelligent assessment tools—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button 
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/login')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(249, 115, 22, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              Start Free Trial
            </button>
            <button 
              className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Watch Demo
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  id={feature.id}
                  key={index}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-white/10 hover:border-purple-500/50 hover:scale-105 ${
                    activeFeature === index ? 'ring-2 ring-purple-500 bg-white/10' : ''
                  }`}
                >
                  <Icon className={`w-12 h-12 mb-4 ${activeFeature === index ? 'text-purple-400' : 'text-gray-400'} transition-colors`} />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Capabilities Bar */}
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <div className="flex flex-wrap justify-center gap-8">
              {capabilities.map((cap, index) => {
                const Icon = cap.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-purple-400" />
                    <span className="font-medium">{cap.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Code Editor Preview */}
        <div className={`mt-16 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">
            <div className="bg-slate-900/90 px-6 py-3 flex items-center space-x-2 border-b border-purple-500/30">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400 ml-4">main.py</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-gray-500">1</div>
              <div className="text-gray-500">2</div>
              <div className="text-gray-500">3</div>
              <div className="text-gray-500">4</div>
              <div className="text-gray-500">5</div>
              <div className="absolute top-16 left-16 right-6">
                <div className="text-purple-400">def <span className="text-blue-400">two_sum</span>(<span className="text-orange-400">nums, target</span>):</div>
                <div className="ml-4 text-gray-300">seen = {}</div>
                <div className="ml-4 text-purple-400">for <span className="text-orange-400">i, num</span> in <span className="text-blue-400">enumerate</span>(nums):</div>
                <div className="ml-8 text-purple-400">if <span className="text-orange-400">target - num</span> in seen:</div>
                <div className="ml-12 text-purple-400">return <span className="text-gray-300">[seen[target - num], i]</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="relative z-10 container mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Trusted by Teams Worldwide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {stats.languages}+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Programming Languages</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {stats.uptime}%
            </div>
            <div className="text-gray-400 text-sm md:text-base">Platform Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {stats.companies}+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Companies Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {stats.interviews >= 1000 ? `${(stats.interviews / 1000).toFixed(0)}K` : stats.interviews}+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Interviews Conducted</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CodeSync
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming the coding interview experience with real-time collaboration and intelligent assessment tools.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-purple-400 transition">Features</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-purple-400 transition">Demo</a></li>
                <li><a href="#integrations" className="text-gray-400 hover:text-purple-400 transition">Integrations</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-white mb-4">CodeSynax</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-gray-400 hover:text-purple-400 transition">About Us</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-purple-400 transition">Contact</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#docs" className="text-gray-400 hover:text-purple-400 transition">Documentation</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-purple-400 transition">Support</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-purple-400 transition">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-purple-400 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 CodeSync. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#twitter" className="text-gray-400 hover:text-purple-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#linkedin" className="text-gray-400 hover:text-purple-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://github.com/Ibrahim-Nazeer/HTF25-Team-038" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default HeroPage;