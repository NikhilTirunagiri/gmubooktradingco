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
              GMUBookTrading.com
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
                  <a className={`${isDarkBackground ? (isActiveLink("/careers") ? 'text-white' : 'text-white/80') : (isActiveLink("/careers") ? 'text-[var(--color-primary-violet)]' : 'text-[var(--color-primary-violet)]/80')} hover:text-${isDarkBackground ? 'white' : '[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="/careers">
                   About 
                    <span className={`absolute bottom-0 left-0 ${isActiveLink("/careers") ? 'w-full' : 'w-0'} h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full`}></span>
                  </a>
                </>
              ) : (
                <>
                  <a className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="#home">
                    About  
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="#home">
                    Contact Us  
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  
                </>
              )}
              <a className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="mailto:contact@thecollegetech.com?subject=Inquiry%20from%20TheCollegeTech%20Website">
                Terms & Conditions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            <a href="mailto:contact@thecollegetech.com?subject=Get%20Started%20-%20TheCollegeTech%20Services" className="mathco-button-primary flex min-w-[60px] sm:min-w-[70px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Marketplace</span>
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
                <a 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="/careers"
                >
                 About 
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
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="/careers"
                >
                 Contact Us 
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              </>
            )}
            <a 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
              href="mailto:contact@thecollegetech.com?subject=Inquiry%20from%20TheCollegeTech%20Website"
            >
              Terms & Conditions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}




