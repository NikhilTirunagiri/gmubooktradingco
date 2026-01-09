"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  isDarkBackground?: boolean;
  variant?: "fixed-top" | "island";
  currentPath?: string;
}

export default function MPNavbar({ isDarkBackground = true, variant = "fixed-top", currentPath = "/" }: NavbarProps) {
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
    : "glass-nav border border-b-1! border-gray-200! transition-transform duration-300 ease-in-out py-2.5 px-4 sm:py-5 sm:px-9 bg-white! ";

  const HomeLink = Link;
  const homeLinkProps = { href: "/marketplace" };

  return (
    <>
      {/* Fixed Navigation */}
      <div 
        className={navClassName}
        style={navStyle}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className="flex items-center gap-2">  
            <HomeLink 
              {...homeLinkProps}
              className={`${isDarkBackground ? 'text-white' : 'text-[var(--color-primary-violet)]'} text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] mathco-h4 flex items-center transition-colors duration-300`}
            >
              GMUBookTrade | Marketplace
            </HomeLink>
          </div>
          <div className="flex flex-1 justify-end gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-9">
              {variant === "island" ? (
                <>
                  <Link className={`${isDarkBackground ? (isActiveLink("/about") ? 'text-white' : 'text-white/80') : (isActiveLink("/about") ? 'text-[var(--color-primary-violet)]' : 'text-[var(--color-primary-violet)]/80')} hover:text-${isDarkBackground ? 'white' : '[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="/about">
                   About 
                    <span className={`absolute bottom-0 left-0 ${isActiveLink("/about") ? 'w-full' : 'w-0'} h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full`}></span>
                  </Link>
                </>
              ) : (
                <>
                  <Link className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="/mytrades">
                    My Trades 
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  
                </>
              )}
              <Link className={`${isDarkBackground ? 'text-white/80 hover:text-white' : 'text-[var(--color-primary-violet)]/80 hover:text-[var(--color-primary-violet)]'} text-sm font-medium leading-normal relative group transition-colors duration-300`} href="/createlisting">
                Sell a Book
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <Link href="/messages" className="mathco-button-primary flex w-8 h-8 sm:w-10 sm:h-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="sm:w-5 sm:h-5">
                <path d="M216,48H40A16,16,0,0,0,24,64V224a15.85,15.85,0,0,0,9.24,14.5A16.13,16.13,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H82.5a16,16,0,0,0-10.3,3.75l-.12.11L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,1,1,0,16H96A8,8,0,0,1,88,144Z"></path>
              </svg>
            </Link>            
            <Link href="/profile" className="mathco-button-primary flex w-8 h-8 sm:w-10 sm:h-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="sm:w-5 sm:h-5">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </Link>
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
              </>
            ) : (
              <>
                <Link 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="/about"
                >
                  My Trades
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-primary-violet)] text-lg font-medium py-3 border-b border-[var(--color-primary-violet)]/20 relative group transition-colors duration-300 hover:text-[var(--color-primary-violet)]" 
                  href="/contact"
                >
                 Sell a book 
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}




