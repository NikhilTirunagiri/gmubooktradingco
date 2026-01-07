"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  isDarkBackground?: boolean;
  variant?: "fixed-top" | "island";
  currentPath?: string;
}

export default function Navbar({ isDarkBackground = true, variant = "fixed-top", currentPath = "/" }: NavbarProps) {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show nav when at top of page
      if (currentScrollY === 0) {
        setIsNavVisible(true);
      }
      // Hide nav when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsProductsDropdownOpen(false);
      setIsServicesDropdownOpen(false);
    }
  }, [isMobileMenuOpen]);

  const isActiveLink = (path: string) => {
    if (path === "/careers") {
      return currentPath === "/careers";
    }
    return false;
  };

  const navStyle = variant === "island" 
    ? { 
        position: 'fixed' as const, 
        top: '16px', 
        left: '16px', 
        right: '16px', 
        zIndex: 10000,
        transform: isNavVisible ? 'translateY(0)' : 'translateY(-120%)'
      }
    : { 
        position: 'fixed' as const, 
        top: '0px', 
        left: '0px', 
        right: '0px', 
        zIndex: 10000,
        transform: isNavVisible ? 'translateY(0)' : 'translateY(-120%)'
      };

  const navClassName = variant === "island"
    ? "glass-nav rounded-2xl transition-transform duration-300 ease-in-out py-2.5 px-4 sm:py-2.5 sm:px-5"
    : "glass-nav transition-transform duration-300 ease-in-out py-2.5 px-4 sm:py-5 sm:px-9";

  const HomeLink = variant === "island" ? Link : "a";
  const homeLinkProps = variant === "island" ? { href: "/" } : { href: "#home" };

  return (
    <>
      {/* Fixed Navigation */}
      <div 
        className={navClassName}
        style={navStyle}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-2">  
            <HomeLink 
              {...homeLinkProps}
              className={`${isDarkBackground ? 'text-white' : 'text-[var(--color-primary-violet)]'} text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] mathco-h3 flex items-center transition-colors duration-300`}
            >
              TheCollegeTech.
            </HomeLink>
          </div>
          <div className="flex flex-1 justify-end gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-9">
              {variant === "island" ? (
                <>
                  <Link className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="/">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsServicesDropdownOpen(true)}
                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                  >
                    <button className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300 flex items-center gap-1`}>
                      Services
                      <svg className={`w-4 h-4 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isServicesDropdownOpen && (
                      <div className={`absolute top-full right-0 pt-2 w-[500px] ${isDarkBackground ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'} rounded-lg shadow-2xl border ${isDarkBackground ? 'border-white/10' : 'border-[var(--color-primary-violet)]/10'} p-6 z-50`} onMouseEnter={() => setIsServicesDropdownOpen(true)} onMouseLeave={() => setIsServicesDropdownOpen(false)} style={{ marginTop: '0px', paddingTop: '16px' }}>
                        <div className="grid grid-cols-2 gap-6">
                          <Link 
                            href="/services/for-companies"
                            className="group block"
                            onClick={() => setIsServicesDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              For Companies
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Tailored technology solutions and services designed for businesses
                            </div>
                          </Link>
                          <Link 
                            href="/services/for-educational-institution"
                            className="group block"
                            onClick={() => setIsServicesDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              For Educational Institution
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Comprehensive solutions for schools, colleges, and universities
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsProductsDropdownOpen(true)}
                    onMouseLeave={() => setIsProductsDropdownOpen(false)}
                  >
                    <button className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300 flex items-center gap-1`}>
                      Products
                      <svg className={`w-4 h-4 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isProductsDropdownOpen && (
                      <div className={`absolute top-full right-0 pt-2 w-[500px] ${isDarkBackground ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'} rounded-lg shadow-2xl border ${isDarkBackground ? 'border-white/10' : 'border-[var(--color-primary-violet)]/10'} p-6 z-50`} onMouseEnter={() => setIsProductsDropdownOpen(true)} onMouseLeave={() => setIsProductsDropdownOpen(false)} style={{ marginTop: '0px', paddingTop: '16px' }}>
                        <div className="grid grid-cols-2 gap-6">
                          <Link 
                            href="/vidya"
                            className="group block"
                            onClick={() => setIsProductsDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              Vidya
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Learning Management System for educational institutions
                            </div>
                          </Link>
                          <Link 
                            href="/placeeasy"
                            className="group block"
                            onClick={() => setIsProductsDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              Placeeasy
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Placement management platform for colleges and students
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <a className={`${isDarkBackground ? (isActiveLink("/careers") ? 'text-white' : 'text-white/80') : (isActiveLink("/careers") ? 'text-[var(--color-primary-violet)]' : 'text-[var(--color-primary-violet)]/80')} hover:text-${isDarkBackground ? 'white' : '[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="/careers">
                    Careers
                    <span className={`absolute bottom-0 left-0 ${isActiveLink("/careers") ? 'w-full' : 'w-0'} h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full`}></span>
                  </a>
                </>
              ) : (
                <>
                  <a className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="#home">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsServicesDropdownOpen(true)}
                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                  >
                    <button className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300 flex items-center gap-1`}>
                      Services
                      <svg className={`w-4 h-4 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isServicesDropdownOpen && (
                      <div className={`absolute top-full right-0 pt-2 w-[500px] ${isDarkBackground ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'} rounded-lg shadow-2xl border ${isDarkBackground ? 'border-white/10' : 'border-[var(--color-primary-violet)]/10'} p-6 z-50`} onMouseEnter={() => setIsServicesDropdownOpen(true)} onMouseLeave={() => setIsServicesDropdownOpen(false)} style={{ marginTop: '0px', paddingTop: '16px' }}>
                        <div className="grid grid-cols-2 gap-6">
                          <Link 
                            href="/services/for-companies"
                            className="group block"
                            onClick={() => setIsServicesDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              For Companies
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Tailored technology solutions and services designed for businesses
                            </div>
                          </Link>
                          <Link 
                            href="/services/for-educational-institution"
                            className="group block"
                            onClick={() => setIsServicesDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              For Educational Institution
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Comprehensive solutions for schools, colleges, and universities
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsProductsDropdownOpen(true)}
                    onMouseLeave={() => setIsProductsDropdownOpen(false)}
                  >
                    <button className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300 flex items-center gap-1`}>
                      Products
                      <svg className={`w-4 h-4 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isProductsDropdownOpen && (
                      <div className={`absolute top-full right-0 pt-2 w-[500px] ${isDarkBackground ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'} rounded-lg shadow-2xl border ${isDarkBackground ? 'border-white/10' : 'border-[var(--color-primary-violet)]/10'} p-6 z-50`} onMouseEnter={() => setIsProductsDropdownOpen(true)} onMouseLeave={() => setIsProductsDropdownOpen(false)} style={{ marginTop: '0px', paddingTop: '16px' }}>
                        <div className="grid grid-cols-2 gap-6">
                          <Link 
                            href="/vidya"
                            className="group block"
                            onClick={() => setIsProductsDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              Vidya
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Learning Management System for educational institutions
                            </div>
                          </Link>
                          <Link 
                            href="/placeeasy"
                            className="group block"
                            onClick={() => setIsProductsDropdownOpen(false)}
                          >
                            <div className={`font-bold text-base mb-1 ${isDarkBackground ? 'text-white group-hover:text-white/90' : 'text-[var(--color-primary-violet)] group-hover:text-[var(--color-primary-violet)]/90'} transition-colors duration-300`}>
                              Placeeasy
                            </div>
                            <div className={`text-sm ${isDarkBackground ? 'text-white/60' : 'text-[var(--color-primary-violet)]/60'} leading-relaxed`}>
                              Placement management platform for colleges and students
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <a className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="/careers">
                    Careers
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </>
              )}
              <a className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="mailto:contact@thecollegetech.com?subject=Inquiry%20from%20TheCollegeTech%20Website">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            <a href="mailto:contact@thecollegetech.com?subject=Get%20Started%20-%20TheCollegeTech%20Services" className="mathco-button-primary flex min-w-[60px] sm:min-w-[70px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Get Started</span>
            </a>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-50"
              aria-label="Toggle mobile menu"
            >
              <span className={`w-6 h-0.5 ${isDarkBackground ? 'bg-white' : 'bg-[var(--color-primary-violet)]'} transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 ${isDarkBackground ? 'bg-white' : 'bg-[var(--color-primary-violet)]'} transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 ${isDarkBackground ? 'bg-white' : 'bg-[var(--color-primary-violet)]'} transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 w-64 h-full bg-white/40 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col p-6 pt-20">
            {variant === "island" ? (
              <>
                <Link 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="/"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <div className="border-b border-[var(--color-primary-violet)]/20">
                  <button 
                    onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                    className="text-[var(--color-primary-violet)] text-lg font-medium py-3 w-full text-left flex items-center justify-between relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]"
                  >
                    Services
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {isServicesDropdownOpen && (
                    <div className="pl-4 pb-2">
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsServicesDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/services/for-companies"
                      >
                        For Companies
                      </Link>
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsServicesDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/services/for-educational-institution"
                      >
                        For Educational Institution
                      </Link>
                    </div>
                  )}
                </div>
                <div className="border-b border-[var(--color-primary-violet)]/20">
                  <button 
                    onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                    className="text-[var(--color-primary-violet)] text-lg font-medium py-3 w-full text-left flex items-center justify-between relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]"
                  >
                    Products
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {isProductsDropdownOpen && (
                    <div className="pl-4 pb-2">
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsProductsDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/vidya"
                      >
                        Vidya
                      </Link>
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsProductsDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/placeeasy"
                      >
                        Placeeasy
                      </Link>
                    </div>
                  )}
                </div>
                <a 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="/careers"
                >
                  Careers
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              </>
            ) : (
              <>
                <a 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="#home"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <div className="border-b border-[var(--color-primary-violet)]/20">
                  <button 
                    onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                    className="text-[var(--color-primary-violet)] text-lg font-medium py-3 w-full text-left flex items-center justify-between relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]"
                  >
                    Services
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {isServicesDropdownOpen && (
                    <div className="pl-4 pb-2">
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsServicesDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/services/for-companies"
                      >
                        For Companies
                      </Link>
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsServicesDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/services/for-educational-institution"
                      >
                        For Educational Institution
                      </Link>
                    </div>
                  )}
                </div>
                <div className="border-b border-[var(--color-primary-violet)]/20">
                  <button 
                    onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                    className="text-[var(--color-primary-violet)] text-lg font-medium py-3 w-full text-left flex items-center justify-between relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]"
                  >
                    Products
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {isProductsDropdownOpen && (
                    <div className="pl-4 pb-2">
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsProductsDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/vidya"
                      >
                        Vidya
                      </Link>
                      <Link 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsProductsDropdownOpen(false);
                        }}
                        className="text-[var(--color-primary-violet)]/80 text-base font-medium py-2 block hover:text-[var(--color-primary-violet)] transition-colors duration-300" 
                        href="/placeeasy"
                      >
                        Placeeasy
                      </Link>
                    </div>
                  )}
                </div>
                <a 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="/careers"
                >
                  Careers
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              </>
            )}
            <a 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
              href="mailto:contact@thecollegetech.com?subject=Inquiry%20from%20TheCollegeTech%20Website"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

