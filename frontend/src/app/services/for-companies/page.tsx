"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForCompanies() {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Sections with dark backgrounds (SVG/gradient backgrounds)
    const darkSections = ['companies-hero', 'features-section'];
    
    // Initial check - determine which section is at the navbar position
    const checkInitialSection = () => {
      // Navbar is fixed at top: 16px, so check what's behind the navbar center (around 45px from top)
      const navbarCenterY = 45;
      const sections = document.querySelectorAll('#companies-hero, #overview, #features-section, #contact-section');
      let closestSectionId: string | null = null;
      let maxCoverage = 0;
      
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const rect = htmlSection.getBoundingClientRect();
        if (rect.top <= navbarCenterY && rect.bottom >= navbarCenterY) {
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
        setIsDarkBackground(false);
      }
    };

    checkInitialSection();
    const timeoutId = setTimeout(() => {
      checkInitialSection();
    }, 100);
    
    const observerOptions = {
      root: null,
      rootMargin: '-60px 0px 0px 0px',
      threshold: [0, 0.1, 0.5, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (!hasScrolledRef.current && window.scrollY < 50) {
        return;
      }
      
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
      
      if (mostVisibleSectionId && maxIntersection > 0.1) {
        setIsDarkBackground(darkSections.includes(mostVisibleSectionId));
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const observerTimeoutId = setTimeout(() => {
      const sections = document.querySelectorAll('#companies-hero, #overview, #features-section, #contact-section');
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
      <Navbar isDarkBackground={isDarkBackground} variant="island" currentPath="/services/for-companies" />
        
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
                <div id="companies-hero" className="mathco-hero-bg flex min-h-[60vh] sm:min-h-[70vh] flex-col gap-6 sm:gap-8 items-start justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 @[480px]:rounded-xl relative overflow-hidden">
                  
                  <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-w-2xl">
                    <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight">
                      Stop Hiring Based on Resumes. Start Hiring Based on Proof.
                    </h1>
                    <p className="text-[var(--color-primary-white)]/80 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl">
                      You visit campuses, review 200 similar resumes, hire based on interviews, then discover skill gaps after they join. We have a better way: candidates build real projects, we audit the work, you interview only proven talent.
                    </p>
                    <a href="#process-flow" className="flex items-center gap-2 text-[var(--color-primary-white)] cursor-pointer hover:gap-3 transition-all duration-300 mb-6 sm:mb-8 group">
                      <span className="text-sm sm:text-base font-medium">See how it works</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="group-hover:translate-x-1 transition-transform duration-300">
                        <path d="M3.33333 8H12.6667M12.6667 8L8 3.33334M12.6667 8L8 12.6667"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overview Section */}
            <div id="overview" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container">
              <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto">
                <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                  The Campus Hiring Problem Nobody Talks About
                </h1>
                <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                  Traditional campus recruitment wastes your time and money. You spend weeks screening resumes, conducting interviews, making offers—only to discover half your hires lack the skills they claimed. Here's how we solve this.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {/* Feature 1 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">End-to-End Hiring Service</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Tell us your requirements, we handle everything else. Role-specific projects, candidate vetting, technical audits, final shortlist delivery. You interview only the top 10-20% who've already proven they can do the work.
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
                
                {/* Feature 2 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">College-Specific Shortlisting</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Already have preferred colleges? We run project-based assessments at those institutions, audit all submissions, and deliver a curated list of top performers. You save weeks of screening time.
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
                
                {/* Feature 3 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">Project-Based Assessments</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Resumes say "Python expert." Projects show actual capability. We create role-specific challenges, candidates build solutions and record demos, our team audits the work. You see proof before the interview.
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

            {/* Process Flow Section */}
            <div id="process-flow" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container">
              <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto">
                <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                  Our Process: From Role Definition to Vetted Candidates
                </h1>
                <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                  Four simple steps. No resume screening. No unqualified interviews. Just proven talent delivered to you.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {/* Step 1 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg font-bold">Create Role</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      You provide role requirements or project specifications
                    </p>
                  </div>
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform translate-x-full -translate-y-1/2 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-primary-violet)]/40">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg font-bold">Students Build</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Students work on hackathon-style projects tailored to your role
                    </p>
                  </div>
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform translate-x-full -translate-y-1/2 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-primary-violet)]/40">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg font-bold">Demo Submitted</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Students record demos showcasing their solutions and capabilities
                    </p>
                  </div>
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform translate-x-full -translate-y-1/2 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-primary-violet)]/40">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg font-bold">Top Talent Shortlisted</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      We audit submissions and shortlist the best candidates for your role
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section with Dark Background */}
            <div id="features-section" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container" style={{ backgroundImage: 'url(/bg-svg-1.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
              <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto">
                <h1 className="text-white mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                  Why Companies Choose Project-Based Hiring
                </h1>
                <p className="text-white/80 mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                  Because resumes lie, interviews are rushed, and skill gaps cost money. Projects reveal true capability. Here's what makes our approach different.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {/* Feature Card 1 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <h3 className="mathco-h3 text-lg sm:text-xl mb-4" style={{ color: 'var(--color-neutral-light)' }}>Role-Based Project Design</h3>
                    <p className="mathco-body-sm text-sm" style={{ color: 'var(--color-white)' }}>
                      You provide the role requirements or project specifications, and we create hackathon-style challenges tailored to your needs. These projects accurately assess candidates&apos; skills for the specific position.
                    </p>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <h3 className="mathco-h3 text-lg sm:text-xl mb-4" style={{ color: 'var(--color-neutral-light)' }}>Student Participation & Demo Recording</h3>
                    <p className="mathco-body-sm text-sm" style={{ color: 'var(--color-white)' }}>
                      Students from colleges you specify participate in these hackathon-style projects. They work on the challenges and record demos showcasing their solutions, providing you with tangible evidence of their capabilities.
                    </p>
                  </div>
                </div>

                {/* Feature Card 3 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <h3 className="mathco-h3 text-lg sm:text-xl mb-4" style={{ color: 'var(--color-neutral-light)' }}>Comprehensive Submission Audit</h3>
                    <p className="mathco-body-sm text-sm" style={{ color: 'var(--color-white)' }}>
                      Our expert team audits all project submissions and demo recordings. We evaluate code quality, problem-solving approach, technical skills, and presentation abilities to identify the most qualified candidates.
                    </p>
                  </div>
                </div>

                {/* Feature Card 4 */}
                <div className="p-6 sm:p-8 group hover:scale-105 transition-transform duration-300 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)', color: 'rgba(247, 247, 250, 1)' }}>
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <div className="flex flex-col h-full">
                    <h3 className="mathco-h3 text-lg sm:text-xl mb-4" style={{ color: 'var(--color-neutral-light)' }}>Best Candidate Shortlisting</h3>
                    <p className="mathco-body-sm text-sm" style={{ color: 'var(--color-white)' }}>
                      After thorough evaluation, we shortlist the best candidates for your role. You receive a curated list of top talent with detailed assessments, making your final hiring decisions easier and more informed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div id="contact-section" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container">
              <div className="glass-card rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto text-center">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                    See Real Project Samples from Actual Candidates
                  </h1>
                  <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                    Let us show you project submissions from previous hiring drives. You'll immediately see the quality difference between this and traditional resume screening. Most clients say "This is exactly what we need."
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center items-center">
                  <a href="mailto:contact@thecollegetech.com?subject=Inquiry%20about%20Services%20for%20Companies&body=Hi,%0A%0AI%20would%20like%20to%20learn%20more%20about%20your%20services%20for%20companies%20and%20how%20they%20can%20benefit%20our%20business." className="mathco-button-primary flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Start smart hiring</span>
                  </a>
                  <a href="https://calendly.com/nikhiltirunagiri/30min" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-[var(--color-primary-violet)] text-[var(--color-primary-violet)] hover:bg-[var(--color-primary-violet)] hover:text-white transition-all duration-300 flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">See how it works</span>
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

