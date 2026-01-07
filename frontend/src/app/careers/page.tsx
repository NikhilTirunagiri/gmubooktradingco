"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Careers() {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Sections with dark backgrounds (SVG/gradient backgrounds)
    const darkSections = ['careers-hero', 'open-positions'];
    
    // Initial check - determine which section is at the navbar position
    const checkInitialSection = () => {
      // Navbar is fixed at top: 16px, so check what's behind the navbar center (around 45px from top)
      const navbarCenterY = 45; // 16px top + ~29px (half of navbar height ~58px)
      const sections = document.querySelectorAll('#careers-hero, #why-join-us, #open-positions, #contact-section');
      let closestSectionId: string | null = null;
      let maxCoverage = 0;
      
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const rect = htmlSection.getBoundingClientRect();
        // Check if navbar center position is within this section
        if (rect.top <= navbarCenterY && rect.bottom >= navbarCenterY) {
          // Calculate how much of the section covers the navbar area
          const sectionTop = Math.max(rect.top, navbarCenterY - 30);
          const sectionBottom = Math.min(rect.bottom, navbarCenterY + 30);
          const coverage = sectionBottom - sectionTop;
          
          if (coverage > maxCoverage && htmlSection.id) {
            maxCoverage = coverage;
            closestSectionId = htmlSection.id;
          }
        }
      });
      
      if (closestSectionId) {
        setIsDarkBackground(darkSections.includes(closestSectionId));
      } else {
        // If no section found at navbar position (likely white background), default to light background (dark text)
        setIsDarkBackground(false);
      }
    };

    // Run initial check immediately and also after a short delay to ensure DOM is ready
    checkInitialSection();
    const timeoutId = setTimeout(() => {
      checkInitialSection();
    }, 100);
    
    const observerOptions = {
      root: null,
      rootMargin: '-60px 0px 0px 0px', // Navbar is at ~60px from top when accounting for position
      threshold: [0, 0.1, 0.5, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Only allow observer to change colors after user has scrolled past the top
      // This prevents initial load from setting white text
      if (!hasScrolledRef.current && window.scrollY < 50) {
        return;
      }
      
      // Find the section that has the most intersection at the navbar position
      let maxIntersection = 0;
      let mostVisibleSectionId: string | null = null;
      
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxIntersection) {
          const target = entry.target as HTMLElement;
          if (target && target.id) {
            maxIntersection = entry.intersectionRatio;
            mostVisibleSectionId = target.id;
          }
        }
      });
      
      // Only update if we found a section with significant intersection
      if (mostVisibleSectionId && maxIntersection > 0.1) {
        setIsDarkBackground(darkSections.includes(mostVisibleSectionId));
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Delay observer start slightly to let initial check run first
    const observerTimeoutId = setTimeout(() => {
      const sections = document.querySelectorAll('#careers-hero, #why-join-us, #open-positions, #contact-section');
      sections.forEach(section => observer.observe(section));
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(observerTimeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar isDarkBackground={isDarkBackground} variant="island" currentPath="/careers" />
        
        {/* Main content with layout container */}
        <div
          className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
          style={{ fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}
        >
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5 pt-16 sm:pt-18">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div id="careers-hero" className="mathco-hero-bg flex min-h-[60vh] sm:min-h-[70vh] flex-col gap-6 sm:gap-8 items-start justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 @[480px]:rounded-xl relative overflow-hidden">
                  
                  <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-w-2xl">
                    <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight">
                      Build Technology That Actually Changes Lives
                    </h1>
                    <p className="text-[var(--color-primary-white)]/80 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl">
                      Most tech jobs let you build features. Here, you build solutions that help thousands of students get jobs, help colleges transform their operations, and help companies hire better. Real impact, real problems, real results.
                    </p>
                    <a href="#open-positions" className="flex items-center gap-2 text-[var(--color-primary-white)] cursor-pointer hover:gap-3 transition-all duration-300 mb-6 sm:mb-8 group">
                      <span className="text-sm sm:text-base font-medium">View open positions</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="group-hover:translate-x-1 transition-transform duration-300">
                        <path d="M3.33333 8H12.6667M12.6667 8L8 3.33334M12.6667 8L8 12.6667"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Why Join Us Section */}
            <div id="why-join-us" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container">
              <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto">
                <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                  Why People Join TheCollegeTech
                </h1>
                <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                  Work on products used by 20+ institutions and 50+ companies. Solve real problems for education in India. Ship features that thousands of students, faculty, and recruiters use daily. Plus, a team that actually cares about what we're building.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {/* Card 1 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">Meaningful Impact</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Work on products that directly impact millions of students and educators across India&apos;s education system.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="w-6 h-6 text-[var(--color-teal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Card 2 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">Innovation Culture</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Be part of a culture that encourages creativity, experimentation, and pushing the boundaries of what&apos;s possible.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="w-6 h-6 text-[var(--color-teal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Card 3 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">Growth Opportunities</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Rapidly growing company with endless opportunities for career advancement and skill development.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="w-6 h-6 text-[var(--color-teal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Positions Section */}
            <div id="open-positions" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container" style={{ backgroundImage: 'url(/bg-svg-1.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
              <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto">
                <h1 className="text-white mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                  Open Positions
                </h1>
                <p className="text-white/80 mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                  Explore our current openings and find the perfect role for your skills and passion.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {/* Position 1 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  {/* Top-left dot */}
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Bottom-left dot */}
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  {/* Top-right dot */}
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  {/* Bottom-right dot */}
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="mathco-h3 text-lg sm:text-xl pr-4" style={{ color: 'var(--color-neutral-light)' }}>Full Stack Developer</h3>
                      <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">3 Months Contract</span>
                    </div>
                    <p className="mathco-body-sm text-sm mb-4" style={{ color: 'var(--color-white)' }}>
                      Lead development of our educational platforms using modern technologies like React, Node.js, and cloud services.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>React</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Node.js</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>AWS</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Python</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>SQL</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Git</span>
                    </div>
                    <div className="mt-auto">
                      <a href="https://forms.gle/mf1s6r8uWtxRFVK86" target="_blank" rel="noopener noreferrer" className="mathco-button-primary w-full text-center py-3 rounded-lg text-sm font-medium block">
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>

                {/* Position 2 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  {/* Top-left dot */}
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Bottom-left dot */}
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  {/* Top-right dot */}
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  {/* Bottom-right dot */}
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="mathco-h3 text-lg sm:text-xl pr-4" style={{ color: 'var(--color-neutral-light)' }}>UI/UX Designer</h3>
                      <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">3 Months Contract</span>
                    </div>
                    <p className="mathco-body-sm text-sm mb-4" style={{ color: 'var(--color-white)' }}>
                      Create beautiful, intuitive user experiences for our educational platforms that delight students and educators.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Figma</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>User Research</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Prototyping</span>
                    </div>
                    <div className="mt-auto">
                      <a href="https://forms.gle/xhfHrPaU28Ze5Z9r6" target="_blank" rel="noopener noreferrer" className="mathco-button-primary w-full text-center py-3 rounded-lg text-sm font-medium block">
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>

                {/* Position 3 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  {/* Top-left dot */}
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Bottom-left dot */}
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  {/* Top-right dot */}
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  {/* Bottom-right dot */}
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="mathco-h3 text-lg sm:text-xl pr-4" style={{ color: 'var(--color-neutral-light)' }}>Product Manager</h3>
                      <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">3 Months Contract</span>
                    </div>
                    <p className="mathco-body-sm text-sm mb-4" style={{ color: 'var(--color-white)' }}>
                      Drive product strategy and execution for our educational technology solutions, working closely with engineering and design teams.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Product Strategy</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>User Research</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Agile</span>
                    </div>
                    <div className="mt-auto">
                      <a href="mailto:contact@thecollegetech.com?subject=Application%20for%20Product%20Manager" className="mathco-button-primary w-full text-center py-3 rounded-lg text-sm font-medium block">
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>

                {/* Position 4 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  {/* Top-left dot */}
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Bottom-left dot */}
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  {/* Top-right dot */}
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  {/* Bottom-right dot */}
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="mathco-h3 text-lg sm:text-xl pr-4" style={{ color: 'var(--color-neutral-light)' }}>Sales Representative</h3>
                      <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">3 Months Contract</span>
                    </div>
                    <p className="mathco-body-sm text-sm mb-4" style={{ color: 'var(--color-white)' }}>
                      Build relationships with educational institutions and drive adoption of our innovative technology solutions.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>B2B Sales</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Education</span>
                      <span className="bg-[var(--color-primary-violet)]/10 px-2 py-1 rounded text-xs" style={{ color: 'rgba(255, 255, 255, 1)' }}>Relationship Building</span>
                    </div>
                    <div className="mt-auto">
                      <a href="mailto:contact@thecollegetech.com?subject=Application%20for%20Sales%20Representative" className="mathco-button-primary w-full text-center py-3 rounded-lg text-sm font-medium block">
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div id="contact-section" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container">
              <div className="glass-card rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto text-center">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                    Don&apos;t See Your Role?
                  </h1>
                  <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                    We&apos;re always looking for talented individuals who are passionate about transforming education. Send us your resume and let&apos;s discuss how you can contribute to our mission.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center items-center">
                  <a href="mailto:contact@thecollegetech.com?subject=General%20Application%20-%20TheCollegeTech" className="mathco-button-primary flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Send Resume</span>
                  </a>
                  <a href="https://calendly.com/nikhiltirunagiri/30min" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-[var(--color-primary-violet)] text-[var(--color-primary-violet)] hover:bg-[var(--color-primary-violet)] hover:text-white transition-all duration-300 flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Schedule Chat</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        </div>
        <Footer />
    </>
  );
} 