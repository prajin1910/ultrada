import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleStartLearning = () => {
    navigate("/register");
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 24L24 30L30 24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  <path
                    d="M24 18V30"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-neutral-900">
                IntelliAssess
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
              >
                About
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSignIn}
                className="hidden sm:block text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-neutral-50 to-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                  Smart Feedback,
                  <span className="gradient-text"> Smarter Learning</span>
                </h1>
                <p className="mt-6 text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0">
                  Transform your educational journey with AI-powered assessments
                  and personalized feedback. Designed for students, educators,
                  and institutions.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={handleStartLearning}
                    className="btn-primary px-8 py-3 rounded-lg text-base font-semibold text-white"
                  >
                    Start Learning Today
                  </button>
                  <button className="px-8 py-3 rounded-lg border-2 border-neutral-300 bg-white text-neutral-700 font-semibold hover:border-primary-300 hover:bg-primary-50 transition-all">
                    Watch Demo
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4"></div>
              </div>

              {/* Hero Visual */}
              <div className="hidden lg:flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Dashboard Preview */}
                  <div className="bg-white rounded-2xl shadow-elegant p-6 border border-neutral-200">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 rounded bg-neutral-200"></div>
                        <div className="h-6 w-6 rounded-full bg-primary-500"></div>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-3">
                        <div className="h-2 w-full rounded-full bg-neutral-100">
                          <div className="h-2 w-4/5 rounded-full bg-primary-500"></div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-neutral-100">
                          <div className="h-2 w-3/5 rounded-full bg-secondary-500"></div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-neutral-100">
                          <div className="h-2 w-2/3 rounded-full bg-accent-500"></div>
                        </div>
                      </div>

                      {/* Chart Area */}
                      <div className="h-20 w-full rounded bg-gradient-to-r from-primary-50 to-secondary-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                Three simple steps to transform your learning experience with
                personalized AI feedback.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="feature-card rounded-2xl bg-neutral-50 p-8 text-center border border-neutral-200">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                  <svg
                    className="h-8 w-8"
                    fill="#3B82F6"
                    stroke="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold text-neutral-900">
                  Take Smart Assessments
                </h3>
                <p className="text-neutral-600">
                  Engage with adaptive assessments that adjust to your learning
                  level and provide meaningful challenges.
                </p>
              </div>

              {/* Step 2 */}
              <div className="feature-card rounded-2xl bg-neutral-50 p-8 text-center border border-neutral-200">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
                  <svg
                    className="h-8 w-8"
                    fill="#3B82F6"
                    stroke="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold text-neutral-900">
                  Get AI-Powered Insights
                </h3>
                <p className="text-neutral-600">
                  Receive detailed, personalized feedback powered by advanced AI
                  algorithms to understand your strengths and areas for
                  improvement.
                </p>
              </div>

              {/* Step 3 */}
              <div className="feature-card rounded-2xl bg-neutral-50 p-8 text-center border border-neutral-200">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold text-neutral-900">
                  Accelerate Learning
                </h3>
                <p className="text-neutral-600">
                  Apply targeted recommendations and track your progress to
                  achieve your learning goals faster than ever before.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-neutral-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                Powerful Features
              </h2>
              <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                Everything you need to transform your learning experience with
                cutting-edge technology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="feature-card bg-white rounded-2xl p-8 border border-neutral-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  Adaptive Testing
                </h3>
                <p className="text-neutral-600">
                  Questions adapt to your skill level in real-time for optimal
                  learning efficiency.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="feature-card bg-white rounded-2xl p-8 border border-neutral-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  Progress Analytics
                </h3>
                <p className="text-neutral-600">
                  Detailed insights and visualizations to track your learning
                  journey.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="feature-card bg-white rounded-2xl p-8 border border-neutral-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  Personalized Learning
                </h3>
                <p className="text-neutral-600">
                  AI-driven recommendations tailored to your unique learning
                  style.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="feature-card bg-white rounded-2xl p-8 border border-neutral-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  Collaborative Learning
                </h3>
                <p className="text-neutral-600">
                  Connect with peers and educators for enhanced learning
                  experiences.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="feature-card bg-white rounded-2xl p-8 border border-neutral-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  Instant Feedback
                </h3>
                <p className="text-neutral-600">
                  Get immediate, actionable feedback to accelerate your
                  improvement.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="feature-card bg-white rounded-2xl p-8 border border-neutral-200">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  Secure & Private
                </h3>
                <p className="text-neutral-600">
                  Your data is protected with enterprise-grade security
                  measures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 24L24 30L30 24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                      />
                      <path
                        d="M24 18V30"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-bold">IntelliAssess</span>
                </div>
                <p className="text-neutral-400 text-sm">
                  Empowering learners with AI-driven assessments and
                  personalized feedback for accelerated growth.
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#features"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#api"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#about"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#careers"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#blog"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#help"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#community"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Community
                    </a>
                  </li>
                  <li>
                    <a
                      href="#status"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      System Status
                    </a>
                  </li>
                  <li>
                    <a
                      href="#privacy"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-neutral-400">
                © 2024 IntelliAssess. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a
                  href="#twitter"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#linkedin"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#github"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
