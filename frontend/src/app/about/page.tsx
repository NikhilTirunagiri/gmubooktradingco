"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Sections with dark backgrounds (SVG/gradient backgrounds)
    const darkSections = ['about-hero'];
    
    // Initial check - determine which section is at the navbar position
    const checkInitialSection = () => {
      // Navbar is fixed at top: 16px, so check what's behind the navbar center (around 45px from top)
      const navbarCenterY = 45;
      const sections = document.querySelectorAll('#about-hero, #content-section');
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
      const sections = document.querySelectorAll('#about-hero, #content-section');
      sections.forEach(section => observer.observe(section));
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(observerTimeoutId);
      observer.disconnect();
    };
  }, []);

  const teamMembers = [
    { name: "Adolfo Posada-Hernandez", role: "", image: "https://media.licdn.com/dms/image/v2/D4E03AQF4LCX2ud6DtA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731688506713?e=1769644800&v=beta&t=QGKoQeFEgnlN5aS9RV6Dm8Wc8StXchZPnIYXhl3NhYE", linkedin: "https://www.linkedin.com/in/adolfoph/" },
    { name: "Zaina Qadan", role: "", image: "https://media.licdn.com/dms/image/v2/D4D03AQHG7hnCRowQaA/profile-displayphoto-scale_400_400/B4DZgkTNgPHwAg-/0/1752955673063?e=1769644800&v=beta&t=xQ_pL5BRM2IjNw0W1wWY6JU_Qxffo_pwuslv-EKzylE", linkedin: "https://www.linkedin.com/in/zaina-qadan-a565a1304/" },
    { name: "Manzoor Ahmad Naziri", role: "", image: "https://media.licdn.com/dms/image/v2/D4E03AQG8MGZyCPYdXw/profile-displayphoto-scale_400_400/B4EZt77FTCI0Ag-/0/1767310645787?e=1769644800&v=beta&t=14zLsWad4WuUJR-Ghv42WEsGldaU2WObf8-VkiA7aqU", linkedin: "https://www.linkedin.com/in/manzoor-naziri-6335a0254/" },
    { name: "Nikhil Tirunagiri", role: "Currently Managing the platform", image: "https://media.licdn.com/dms/image/v2/D4E03AQG2NC14e-2ClA/profile-displayphoto-scale_400_400/B4EZg9msHaGYAk-/0/1753380231441?e=1769644800&v=beta&t=cK0SxqwteaWm2qxtXd6nmc40xHzT_ObHDcwvTpZnK5c", linkedin: "https://www.linkedin.com/in/nikhiltirunagiri/" },
    { name: "Rahul Sharma", role: "Currently Managing the platform", image: "https://media.licdn.com/dms/image/v2/D5603AQFHMJlSnyOzkQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719237832732?e=1769644800&v=beta&t=_aqWzoN3DI1pd5rNG3H5SOf90vwfZvSBjsUKktMYaBM", linkedin: "https://www.linkedin.com/in/rahulsharma-cs/" },
    { name: "Jung Yang", role: "" }
  ];

  return (
    <>
      <Navbar isDarkBackground={false} variant="fixed-top" currentPath="/about" />
        
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
                <div id="about-hero" className="mathco-hero-bg flex min-h-[50vh] flex-col gap-6 sm:gap-8 items-start justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 @[480px]:rounded-xl relative overflow-hidden">
                  
                  <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-w-3xl">
                    <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight">
                      About Us
                    </h1>
                    <p className="text-[var(--color-primary-white)]/80 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                      Built by students, for students. We're making textbook trading easier, safer, and more affordable for the GMU community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div id="content-section" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16">
              
              {/* Our Story */}
              <section className="mb-8">
                <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl font-semibold mb-6">Our Story</h2>
                <p className="text-[var(--color-neutral-dark)] mathco-body text-base sm:text-lg leading-relaxed mb-4">
                  Like many students, we were frustrated by the high cost of textbooks and the hassle of buying and selling them. The campus bookstore prices were inflated, online marketplaces were filled with scammers, and trying to find books on Reddit or Facebook was a mess.
                </p>
                <p className="text-[var(--color-neutral-dark)] mathco-body text-base sm:text-lg leading-relaxed mb-4">
                  We knew there had to be a better way. So we built GMUBookTrading Company—a platform exclusively for the GMU community where students can buy, sell, and trade textbooks safely and affordably. What started as a project for CS321 (Software Engineering) has now become a real solution we've made available to the entire GMU community.
                </p>
                <p className="text-[var(--color-neutral-dark)] mathco-body text-base sm:text-lg leading-relaxed">
                  Every seller is verified through their GMU email, ensuring you're only dealing with fellow Patriots. No more worrying about scams, no more inflated prices—just a simple, secure marketplace built by students who understand the struggle.
                </p>
              </section>

              {/* Our Mission */}
              <section className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
                <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl font-semibold mb-4">Our Mission</h2>
                <p className="text-[var(--color-neutral-dark)] mathco-body text-base sm:text-lg leading-relaxed">
                  To make education more affordable by creating a trusted, GMU-exclusive marketplace where students can easily buy and sell textbooks at fair prices, while reducing waste and strengthening our campus community.
                </p>
              </section>

              {/* Why We're Different */}
              <section className="mb-8">
                <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl font-semibold mb-6">Why We're Different</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a12,12,0,1,1-12-12A12,12,0,0,1,168,148Zm-88,0a12,12,0,1,1-12-12A12,12,0,0,1,80,148Z"/>
                      </svg>
                    </div>
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg sm:text-xl font-semibold mb-3">GMU-Exclusive</h3>
                    <p className="text-[var(--color-neutral-dark)] mathco-body text-sm sm:text-base">
                      Every user is verified through their GMU email. Trade with confidence knowing you're dealing with fellow students and faculty.
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                      </svg>
                    </div>
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg sm:text-xl font-semibold mb-3">Safe & Secure</h3>
                    <p className="text-[var(--color-neutral-dark)] mathco-body text-sm sm:text-base">
                      No more sketchy Craigslist deals or Facebook scams. Our platform is built with safety and trust in mind.
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M200,168a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H192A8,8,0,0,1,200,168Zm-8-40H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Zm40-64V216a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V64A16,16,0,0,1,40,48H92.26a47.92,47.92,0,0,1,71.48,0H216A16,16,0,0,1,232,64ZM96,64h64a32,32,0,0,0-64,0ZM216,64H179.36A47.92,47.92,0,0,1,160,88H96a47.92,47.92,0,0,1-19.36-24H40V216H216Z"/>
                      </svg>
                    </div>
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg sm:text-xl font-semibold mb-3">Simple to Use</h3>
                    <p className="text-[var(--color-neutral-dark)] mathco-body text-sm sm:text-base">
                      List a book in seconds, browse easily, and connect directly with buyers or sellers. No complicated processes.
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a12,12,0,0,1-12,12H116v36a8,8,0,0,1-16,0V160H88a12,12,0,0,1,0-24h12V100a8,8,0,0,1,16,0v36h40A12,12,0,0,1,168,148Z"/>
                      </svg>
                    </div>
                    <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg sm:text-xl font-semibold mb-3">Save Money</h3>
                    <p className="text-[var(--color-neutral-dark)] mathco-body text-sm sm:text-base">
                      Buy from fellow students at fair prices and sell your books for more than the bookstore buyback offers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Meet the Team */}
              <section className="mb-8">
                <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl font-semibold mb-6 text-center">Meet the Team</h2>
                <p className="text-[var(--color-neutral-dark)] mathco-body text-base sm:text-lg leading-relaxed mb-8 text-center max-w-2xl mx-auto">
                  We're a group of GMU students who got tired of paying too much for textbooks and decided to do something about it.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
                        {member.image ? (
                          <Image 
                            src={member.image} 
                            alt={member.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-lg font-semibold mb-1">
                        {member.linkedin ? (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-[var(--color-teal)] transition-colors duration-300"
                          >
                            {member.name}
                          </a>
                        ) : (
                          member.name
                        )}
                      </h3>
                      <p className="text-[var(--color-neutral-dark)] mathco-body-sm text-sm">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Call to Action */}
              <section className="glass-card rounded-2xl p-8 sm:p-12 text-center">
                <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl sm:text-3xl font-semibold mb-4">
                  Join Our Community
                </h2>
                <p className="text-[var(--color-neutral-dark)] mathco-body text-base sm:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                  Start saving money on textbooks today. Whether you're buying or selling, GMUBookTrading Company makes it easy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/marketplace" className="mathco-button-primary flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Browse Marketplace</span>
                  </Link>
                  <Link href="/contact" className="bg-transparent border-2 border-[var(--color-primary-violet)] text-[var(--color-primary-violet)] hover:bg-[var(--color-primary-violet)] hover:text-white transition-all duration-300 flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 text-base font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Contact Us</span>
                  </Link>
                </div>
              </section>

            </div>
          </div>
          </div>
        </div>
        </div>
        <Footer />
    </>
  );
}
