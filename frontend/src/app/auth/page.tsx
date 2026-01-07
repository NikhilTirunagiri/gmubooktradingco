"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    if (isLogin) {
      console.log("Login:", { email: formData.email, password: formData.password });
    } else {
      console.log("Sign Up:", formData);
    }
  };

  return (
    <>
      <Navbar isDarkBackground={true} variant="fixed-top" />

      {/* Main content with layout container */}
      <div
        className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
        style={{ fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}
      >
        <div 
          className="@[480px]:p-4 flex flex-col mb-[0px] text-left"
          style={{
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '0',
            paddingRight: '0',
            backgroundClip: 'unset',
            WebkitBackgroundClip: 'unset',
            color: 'rgba(247, 247, 250, 1)',
            verticalAlign: 'bottom'
          }}
        >
          <div className="@container">
            <div className="mathco-hero-bg flex flex-col gap-6 sm:gap-8 items-center justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 relative overflow-hidden" style={{ paddingTop: '129px', paddingBottom: '129px', marginTop: '0px', marginBottom: '0px', minHeight: '100vh' }}>
              
              {/* Auth Card */}
              <div className=" flex flex-col gap-6 relative z-10 w-full max-w-md" style={{ marginTop: '8px', marginBottom: '8px' }}>
                
                <div className="p-8">
                  {/* Header */}
                  <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-4xl font-medium leading-tight">
                      {isLogin ? "Welcome Back" : "Join GMUBookTrade"}
                    </h1>
                    <p className="text-[var(--color-primary-white)]/70 text-sm sm:text-base">
                      {isLogin 
                        ? "Sign in to access your account" 
                        : "Create an account to start buy/sell books"}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {!isLogin && (
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-[var(--color-primary-white)] text-sm font-medium">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[var(--color-primary-white)] text-sm font-medium">
                        GMU Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                        placeholder="your.email@gmu.edu"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="password" className="text-[var(--color-primary-white)] text-sm font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                        placeholder="Enter your password"
                      />
                    </div>

                    {!isLogin && (
                      <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-[var(--color-primary-white)] text-sm font-medium">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                          placeholder="Confirm your password"
                        />
                      </div>
                    )}

                    {isLogin && (
                      <div className="flex justify-end">
                        <Link 
                          href="#" 
                          className=" text-sm hover:underline transition-all"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-2"
                    >
                      {isLogin ? "Sign In" : "Create Account"}
                    </button>
                  </form>


                  {/* Toggle Login/Signup */}
                  <div className="text-center mt-6">
                    <p className="text-black text-sm">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[var(--color-primary-blue)] font-medium hover:underline transition-all"
                      >
                        {isLogin ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </div>
                </div>

                {/* Info Note */}
                <div className="text-center">
                  <p className="text-black/60 text-xs max-w-md mx-auto">
                    By continuing, you agree to our{" "}
                    <Link href="/tandc" className="text-[var(--color-primary-blue)] hover:underline">
                      Terms & Conditions
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacypolicy" className="text-[var(--color-primary-blue)] hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
