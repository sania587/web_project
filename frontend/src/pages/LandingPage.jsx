import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  FaDumbbell, 
  FaAppleAlt, 
  FaChartLine, 
  FaUsers, 
  FaStar, 
  FaArrowRight,
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaYoutube
} from "react-icons/fa";

const LandingPage = () => {
  const { theme, isDark } = useTheme();
  const [animatedStats, setAnimatedStats] = useState({ users: 0, trainers: 0, plans: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Animate stats on mount
  useEffect(() => {
    setIsVisible(true);
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        users: Math.floor(500 * progress),
        trainers: Math.floor(50 * progress),
        plans: Math.floor(100 * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: FaDumbbell,
      title: "Custom Workouts",
      description: "Personalized workout plans designed by expert trainers to match your fitness goals."
    },
    {
      icon: FaAppleAlt,
      title: "Nutrition Plans",
      description: "Get customized diet plans that complement your training and boost your results."
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your fitness journey with detailed analytics and progress tracking."
    },
    {
      icon: FaUsers,
      title: "Expert Trainers",
      description: "Connect with certified trainers who will guide you every step of the way."
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Lost 25 kg in 4 months",
      avatar: "AH",
      rating: 5,
      quote: "FitHum completely transformed my life! The personalized workouts and amazing trainers kept me motivated every single day."
    },
    {
      name: "Fatima Khan",
      role: "Gained strength & confidence",
      avatar: "FK",
      rating: 5,
      quote: "The best fitness platform I've ever used. The progress tracking feature helped me stay accountable and achieve my goals."
    },
    {
      name: "Bilal Malik",
      role: "Marathon Ready",
      avatar: "BM",
      rating: 5,
      quote: "From beginner to marathon runner in 6 months! The trainers at FitHum created the perfect plan for my fitness journey."
    }
  ];

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/gym-img.jpg)' }}
        />
        
        {/* Dark base overlay for text contrast */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        />
        
        {/* Theme-aware Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              ${theme.colors.primary}80 0%, 
              ${theme.colors.secondary}60 50%, 
              ${theme.colors.primary}70 100%)`,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Floating Animated Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-72 h-72 rounded-full opacity-20 animate-pulse"
            style={{ 
              background: `radial-gradient(circle, ${theme.colors.primary} 0%, transparent 70%)`,
              top: '10%',
              left: '5%',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-96 h-96 rounded-full opacity-15 animate-pulse"
            style={{ 
              background: `radial-gradient(circle, ${theme.colors.secondary} 0%, transparent 70%)`,
              bottom: '10%',
              right: '5%',
              animation: 'float 8s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute w-48 h-48 rounded-full opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${theme.colors.accent || theme.colors.primary} 0%, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />
        </div>

        {/* Hero Content */}
        <div 
          className={`relative z-10 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
        

          <h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            style={{ 
              color: '#ffffff',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}
          >
            Transform Your Body,
            <br />
            <span 
              style={{ 
                color: '#FFD700',
                textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.3)'
              }}
            >
              Transform Your Life
            </span>
          </h1>

          <p 
            className="text-l italic md:text-2xl mb-10 max-w-2xl mx-auto px-6 py-4 rounded-lg backdrop-blur-xs"
            style={{ 
              color: '#ffffff',
              backgroundColor: 'rgba(0,0,0,0.3)',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            Your journey to fitness starts here. Join thousands who have already 
            unlocked their potential with FitHum.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <button 
                className="group px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                  color: '#ffffff',
                  boxShadow: `0 10px 40px ${theme.colors.primary}50`
                }}
              >
                Get Started Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div 
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { value: animatedStats.users, suffix: '+', label: 'Active Users' },
              { value: animatedStats.trainers, suffix: '+', label: 'Expert Trainers' },
              { value: animatedStats.plans, suffix: '+', label: 'Workout Plans' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center px-6 py-4 rounded-2xl backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div 
                  className="text-4xl md:text-5xl font-extrabold"
                  style={{ color: theme.colors.secondary }}
                >
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm md:text-base font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div 
            className="w-8 h-12 rounded-full border-2 flex items-start justify-center p-2"
            style={{ borderColor: 'rgba(255,255,255,0.5)' }}
          >
            <div 
              className="w-2 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: theme.colors.secondary }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-24 px-4"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Why Choose{' '}
              <span style={{ color: theme.colors.primary }}>FitHum</span>?
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: theme.colors.textSecondary }}
            >
              Everything you need to achieve your fitness goals, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: isDark ? theme.colors.surfaceHover : theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px ${theme.colors.primary}20`;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.secondary}20 100%)`
                  }}
                >
                  <feature.icon 
                    className="text-3xl"
                    style={{ color: theme.colors.primary }}
                  />
                </div>
                <h3 
                  className="text-xl font-bold mb-3"
                  style={{ color: theme.colors.text }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="py-24 px-4"
        style={{ 
          background: `linear-gradient(180deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Success Stories
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: theme.colors.textSecondary }}
            >
              See what our members have achieved with FitHum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl transition-all duration-300 hover:translate-y-[-8px] flex flex-col"
                style={{
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className="text-lg"
                      style={{ color: '#FBBF24' }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p 
                  className="mb-6 leading-relaxed italic flex-1"
                  style={{ color: theme.colors.textSecondary }}
                >
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div 
                      className="font-bold"
                      style={{ color: theme.colors.text }}
                    >
                      {testimonial.name}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: theme.colors.primary }}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-24 px-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-96 h-96 rounded-full"
            style={{ 
              background: 'radial-gradient(circle, white 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)'
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
            style={{ 
              background: 'radial-gradient(circle, white 0%, transparent 70%)',
              transform: 'translate(50%, 50%)'
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Join FitHum today and get access to personalized workouts, expert trainers, 
            and a supportive community. Your transformation awaits!
          </p>
          <Link to="/signup">
            <button 
              className="group px-10 py-5 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: '#ffffff',
                color: theme.colors.primary,
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
              }}
            >
              Join Now — It's Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-16 px-4"
        style={{ 
          backgroundColor: isDark ? theme.colors.surface : theme.colors.background,
          borderTop: `1px solid ${theme.colors.border}`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/fithum_logo_.png" alt="FitHum" className="h-10" />
                <span 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.text }}
                >
                  FitHum
                </span>
              </div>
              <p 
                className="text-sm mb-6"
                style={{ color: theme.colors.textSecondary }}
              >
                Your ultimate fitness companion. Transform your body, transform your life.
              </p>
              {/* Social Icons */}
              <div className="flex gap-4">
                {[FaInstagram, FaTwitter, FaFacebookF, FaYoutube].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `${theme.colors.primary}15`,
                      color: theme.colors.primary
                    }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 
                className="font-bold mb-4"
                style={{ color: theme.colors.text }}
              >
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['Home', 'About Us', 'Features', 'Pricing'].map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#"
                      className="transition-colors duration-200 hover:underline"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 
                className="font-bold mb-4"
                style={{ color: theme.colors.text }}
              >
                Support
              </h4>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'FAQs', 'Community'].map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#"
                      className="transition-colors duration-200 hover:underline"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 
                className="font-bold mb-4"
                style={{ color: theme.colors.text }}
              >
                Legal
              </h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#"
                      className="transition-colors duration-200 hover:underline"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div 
            className="pt-8 text-center text-sm"
            style={{ 
              borderTop: `1px solid ${theme.colors.border}`,
              color: theme.colors.textSecondary
            }}
          >
            © 2024 FitHum. All rights reserved. Made with ❤️ for fitness enthusiasts.
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
