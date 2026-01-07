 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function Home() {
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  useEffect(() => {
    // Sections with dark backgrounds (SVG/gradient backgrounds)
    const darkSections = ['home', 'testimonials'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px 0px 0px',
      threshold: 0.5
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setIsDarkBackground(darkSections.includes(sectionId));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = document.querySelectorAll('#home, #services, #products, #testimonials');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);




  return (
    <>
      <Navbar isDarkBackground={isDarkBackground} variant="fixed-top" />
        
        {/* Main content with layout container */}
        <div
          className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
          style={{ fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}
        >
          <div 
            className="@[480px]:p-4 flex flex-col mb-[42px] text-left"
            style={{
              paddingTop: '0px',
              paddingBottom: '40px',
              paddingLeft: '0',
              paddingRight: '0',
              backgroundClip: 'unset',
              WebkitBackgroundClip: 'unset',
              color: 'rgba(247, 247, 250, 1)',
              verticalAlign: 'bottom'
            }}
          >
            <div className="@container">
              <div id="home" className="mathco-hero-bg flex  flex-col gap-6 sm:gap-8 items-start justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 relative overflow-hidden " style={{ paddingTop: '129px', paddingBottom: '129px', marginTop: '0px', marginBottom: '0px', minHeight: '100vh' }}>
                
                <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-w-3xl justify-center items-start mx-auto" style={{ marginTop: '8px', marginBottom: '8px', boxSizing: 'content-box', borderLeft: '0.1px solid rgba(255, 255, 255, 1)', borderRight: '0.1px solid rgba(255, 255, 255, 1)', minHeight: '60vh', paddingLeft: '2rem', paddingRight: '2rem' }}>
                  {/* Top-left dot */}
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Bottom-left dot */}
                  <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
                  {/* Top-right dot */}
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
                  {/* Bottom-right dot */}
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
                  <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-5xl lg:text-7xl font-medium leading-[1.1] tracking-tight flex flex-col justify-start items-start">
                    An exclusive place for GMU students to buy, sell, trade used books.
                  </h1>
                  <p className="text-[var(--color-primary-white)]/80 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl">
                	Forgot about inflated prices.                     
			</p>

                  <a href="https://calendly.com/nikhiltirunagiri/30min?month=2025-12" className="flex items-center gap-2 text-[var(--color-primary-violet)] cursor-pointer hover:gap-3 transition-all duration-300 mb-6 sm:mb-8">
                    <span className="text-sm sm:text-base font-medium text-white">See how it works</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3.33333 8H12.6667M12.6667 8L8 3.33334M12.6667 8L8 12.6667"/>
                    </svg>
                  </a>
                </div>
                
                {/* Latest Updates Card - Commented Out */}
                {/* 
                <div className="hidden lg:block absolute bottom-8 right-8 glass-card rounded-2xl p-6 max-w-xs z-10">
                  <div className="text-[var(--color-primary-violet)] text-xs font-semibold uppercase tracking-wider mb-2">
                    LATEST UPDATES
                  </div>
                  <div className="text-[var(--color-primary-violet)] text-base font-medium">
                    Top 50 Educational Technology Innovations
                  </div>
                  <div className="w-12 h-px bg-[var(--color-primary-violet)]/30 mt-4"></div>
                </div>
                */}
              </div>
            </div>
          </div>
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5 pt-16 sm:pt-18">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
            <div id="services" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container">
              <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto">
                <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                  Three Problems. One Solution. Real Impact.
                </h1>
                <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                  Colleges waste months coordinating placements manually. Students struggle to showcase real skills. Companies hire based on resumes, then discover skill gaps. We solve all three.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {/* Card 1 */}
                <div className="glass-card rounded-2xl flex flex-col gap-4 p-4 sm:p-6 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-6 sm:h-6">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">For Educational Institutions</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Cut placement coordination time by 60%. We automate the process, bring companies to your campus, and track everything in one dashboard. No more email chaos or Excel nightmares.
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
                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">For Companies</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      Stop wasting time on unqualified candidates. We shortlist talent through real project work, not resumes. See what candidates can actually build before you interview them.
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
                      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-base sm:text-lg">Bridge Between Institutions & Companies</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm text-sm">
                      20+ institutions trust us. 50+ companies hire through us. 300+ students placed in 2024. We're the bridge that actually works—connecting verified talent with real opportunities.
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
            {/* Trusted by Leading Institutions Section - Commented Out */}
          </div>
          </div>
        </div>
        
        {/* Testimonials Section - Full Width */}
        <div id="testimonials" className="flex flex-col gap-8 sm:gap-10 py-12 sm:py-16" style={{ backgroundImage: 'url(/bg-svg-2.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
          <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-white mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
              Trusted by Leading Institutions Across India
            </h1>
            <p className="text-white mathco-body max-w-3xl mx-auto text-sm sm:text-base">
              Real results from placement officers, faculty, and companies who've experienced the difference our platform makes in campus recruitment and learning management.
            </p>
          </div>
          <div className="max-w-4xl mx-auto px-4">
            <div className="p-6 sm:p-8 relative" style={{ backgroundColor: 'transparent', borderLeft: '0.5px solid rgba(255, 255, 255, 1)', borderRight: '0.5px solid rgba(255, 255, 255, 1)' }}>
              {/* Top-left dot */}
              <div style={{ position: 'absolute', top: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, -50%)' }}></div>
              {/* Bottom-left dot */}
              <div style={{ position: 'absolute', bottom: '0', left: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(-50%, 50%)' }}></div>
              {/* Top-right dot */}
              <div style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, -50%)' }}></div>
              {/* Bottom-right dot */}
              <div style={{ position: 'absolute', bottom: '0', right: '0', width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translate(50%, 50%)' }}></div>
              <div className="pt-6 sm:pt-8">
                <p className="text-white mathco-body text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                  We've tried other placement platforms before. TheCollegeTech is different—they don't just give you software, they actually help you get companies. The automation saves our team hours every single day, and the company partnerships have transformed our placement outcomes. This platform has real potential to change how campus recruitment works in India.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    DR
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white mathco-h3 text-sm sm:text-base">Dr. Sita Devi Bharatula</div>
                    <div className="text-white/80 mathco-body-sm text-xs sm:text-sm">Amrita Vishwa Vidyapeetham, Chennai</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/30"></div>
            </div> */}
          </div>
        </div>
        
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5 pt-16 sm:pt-18">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
            <div id="products" className="flex flex-col gap-8 sm:gap-12 px-4 py-12 sm:py-16 @container">
              <div className="flex flex-col gap-4 sm:gap-6 text-center max-w-4xl mx-auto">
                <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                  Complete Solutions That Work Together
                </h1>
                <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                  Most EdTech companies force you to use multiple disconnected tools. We built an integrated ecosystem where placement management, learning, and talent acquisition work seamlessly together.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                {/* Product 1 - Placeeasy */}
                <div className="glass-card rounded-2xl overflow-hidden group">
                  <div className="relative">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBLIjPNHNzslWJS_qBJX82ZnrL7yyKIyxAMQnirtgkNtQMbdMfTVVaHzlIBRUrsTifbkom9n4itTllHmjC44vNcOS3oG2oJvTN5lXLuHLffu1f2wWfLQJZIKT5s4Kgk806iALYP5yZwqVM-MmKZr_4WEeBCeAUZJAgd9XTTMkMiQWBrP4cBiDndzK-_SX5en5Yw9KTH8s6NOLD8u6YjjrXZqd6ooBgRtSnJsZklgpSS0Lblp0k0ZVHz7cZvNKjKBWRJph23b1Uo0id')` }}
                    ></div>
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Placement Platform
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg sm:text-xl mb-3">Placeeasy</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm mb-2 text-sm font-semibold">
                      Stop managing placements in spreadsheets and email.
                    </p>
                    <p className="text-[var(--color-primary-violet)]/60 mathco-body-sm mb-4 text-xs">
                      Complete automation from company outreach to offer letters. Track applications, schedule interviews, and generate reports—all from one dashboard. Includes our network of 50+ hiring companies.
                    </p>
                    <Link href="/placeeasy" className="flex items-center justify-between group-hover:text-[var(--color-primary-violet)] transition-colors duration-300">
                      <span className="text-[var(--color-black)] text-xs sm:text-sm font-medium">See how it works</span>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-teal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg viewBox="0 0 24 24" fill="black">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
                
                {/* Product 2 - Vidya LMS */}
                <div className="glass-card rounded-2xl overflow-hidden group">
                  <div className="relative">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMeaxNcWO766h-HYrSKsq2WTKKLNC1kh-rqBW03EOb7o-VS6nLV6iNdwqUWw9lv_zLnWvRhQgwLYHadrSPxCIv6SPHNCtiCGXA6WyqeY_H8UeRbr9ru86xsNERY53noBSCn5iIOt-DopS9Ko6_GVJ-yzkpZiZ_lEZHfFmyTYy9l0PCAaet-hz8U5R4YB_HRMmUUMZfDd-FnCGjoJ-QMFpcf9COea7_bEf_WG9ss06RzsLkGAzDOEVI62AsI554c46BXAjgcm5nIi8d')` }}
                    ></div>
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                       Learning Management System
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg sm:text-xl mb-3">Vidya LMS</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm mb-2 text-sm font-semibold">
                      Learning management that faculty actually enjoy using.
                    </p>
                    <p className="text-[var(--color-primary-violet)]/60 mathco-body-sm mb-4 text-xs">
                      Course management, assignments, assessments, and analytics without the complexity. Built specifically for how Indian institutions actually teach, not copied from Western universities.
                    </p>
                    <Link href="/vidya" className="flex items-center justify-between group-hover:text-[var(--color-primary-violet)] transition-colors duration-300">
                      <span className="text-[var(--color-black)] text-xs sm:text-sm font-medium">See how it works</span>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-teal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg viewBox="0 0 24 24" fill="black">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
                
                {/* Product 3 - IT Services */}
                <div className="glass-card rounded-2xl overflow-hidden group">
                  <div className="relative">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZYkGTzwMejnXKfmpamJytFQK2oXwIYLYm_TsIX_b1tL3e9jE7u3kGiunOzWjmjnDWzDwYUoagcbRtVfOr4AMIv33WWqBaAhhGv2Jviu0kM5vYG-Mp4mHDw_TzXXvdzXbZTmqva6UDQE7fDWd2ck-Rm5wHYKB6D3gvXu7HQh1yggw0xmqU4DE7RruZtm3TsUq2XKxzZrGdS3ctx-y54CszX-qjEg0dx6GuHEiN7jWYGTqizAAbFC4CQwZyLXUkbMdx_q3sMeZQbNZJ')` }}
                    ></div>
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Talent Acquisition
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg sm:text-xl mb-3">Talent Acquisition</h3>
                    <p className="text-[var(--color-primary-violet)]/80 mathco-body-sm mb-2 text-sm font-semibold">
                      Hire based on what candidates can actually do, not what they claim.
                    </p>
                    <p className="text-[var(--color-primary-violet)]/60 mathco-body-sm mb-4 text-xs">
                      We create role-specific projects, candidates build solutions, we audit the work, and you interview only pre-vetted talent. No more resume roulette.
                    </p>
                    <Link href="/services/for-companies" className="flex items-center justify-between group-hover:text-[var(--color-primary-violet)] transition-colors duration-300">
                      <span className="text-[var(--color-black)] text-xs sm:text-sm font-medium">See how it works</span>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-teal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg viewBox="0 0 24 24" fill="black">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16 @container">
              <div className="glass-card rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto text-center">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <h1 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl lg:text-4xl">
                    See Why 20+ Institutions and 50+ Companies Choose Us
                  </h1>
                  <p className="text-[var(--color-neutral-dark)] mathco-body max-w-3xl mx-auto text-sm sm:text-base">
                    Schedule a 30-minute demo and see exactly how we'll save your team time, increase placement rates, and connect you with the right talent. No sales pitch—just a real walkthrough of what we do.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center">
                  <a href="mailto:contact@thecollegetech.com?subject=Ready%20to%20Transform%20Our%20Institution%20-%20TheCollegeTech" className="mathco-button-primary flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Start automating today</span>
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


