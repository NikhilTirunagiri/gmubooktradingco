"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { login, signup } = useAuth();
  const router = useRouter();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setError("");
      setSuccessMessage("");
      setIsLogin(true);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        // Validate email domain
        if (!formData.email.toLowerCase().endsWith("@gmu.edu")) {
          setError("Only GMU email addresses (@gmu.edu) are allowed");
          setLoading(false);
          return;
        }

        await login(formData.email, formData.password);
        setSuccessMessage("Login successful! Redirecting...");
        // Redirect to marketplace or home after successful login
        setTimeout(() => {
          onClose();
          router.push("/marketplace");
        }, 1000);
      } else {
        // Validate email domain
        if (!formData.email.toLowerCase().endsWith("@gmu.edu")) {
          setError("Only GMU email addresses (@gmu.edu) are allowed");
          setLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 12) {
          setError("Password must be at least 12 characters long");
          setLoading(false);
          return;
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        await signup(formData.email, formData.password, formData.name);
        // Store email in localStorage for verification page
        localStorage.setItem("signup_email", formData.email);
        setSuccessMessage(
          "Account created successfully! Please check your email to verify your account before logging in."
        );
        // Clear form and switch to login after a delay
        setTimeout(() => {
          setFormData({
            name: "",
            email: formData.email, // Keep email for convenience
            password: "",
            confirmPassword: "",
          });
          setIsLogin(true);
          setSuccessMessage("");
        }, 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-[var(--color-primary-violet)] text-3xl sm:text-4xl font-medium leading-tight">
              {isLogin ? "Welcome Back" : "Join GMUBookTrade"}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {isLogin 
                ? "Sign in to access your account" 
                : "Create an account to start buy/sell books"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-gray-700 text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-gray-700 text-sm font-medium">
                GMU Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                placeholder="your.email@gmu.edu"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lightblue)] focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Link 
                  href="#" 
                  className="text-[var(--color-primary-blue)] text-sm hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-6">
            <p className="text-gray-700 text-sm">
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

          {/* Info Note */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-xs max-w-md mx-auto">
              By continuing, you agree to our{" "}
              <Link href="/tandc" className="text-[var(--color-primary-blue)] hover:underline" onClick={onClose}>
                Terms & Conditions
              </Link>
              {" "}and{" "}
              <Link href="/privacypolicy" className="text-[var(--color-primary-blue)] hover:underline" onClick={onClose}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
