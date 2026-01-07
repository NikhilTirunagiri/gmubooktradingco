"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Sections with dark backgrounds (SVG/gradient backgrounds)
    const darkSections = ['tandc-hero'];
    
    // Initial check - determine which section is at the navbar position
    const checkInitialSection = () => {
      // Navbar is fixed at top: 16px, so check what's behind the navbar center (around 45px from top)
      const navbarCenterY = 45;
      const sections = document.querySelectorAll('#tandc-hero, #content-section');
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
      const sections = document.querySelectorAll('#tandc-hero, #content-section');
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
      <Navbar isDarkBackground={false} variant="fixed-top" currentPath="/tandc" />
        
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
                <div id="tandc-hero" className="mathco-hero-bg flex min-h-[40vh] flex-col gap-6 sm:gap-8 items-start justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 @[480px]:rounded-xl relative overflow-hidden">
                  
                  <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-w-2xl">
                    <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight">
                      Terms and Conditions
                    </h1>
                    <p className="text-[var(--color-primary-white)]/80 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
                      Last Updated: January 7, 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div id="content-section" className="flex flex-col gap-8 sm:gap-10 px-4 py-12 sm:py-16">
              <div className="prose prose-lg max-w-4xl mx-auto">
                
                {/* Introduction */}
                <section className="mb-8">
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    Welcome to GMUBookTrading Company ("Platform", "we", "us", or "our"). We are not affiliated with George Mason Univeristy. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                  </p>
                </section>

                {/* 1. Eligibility */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">1. Eligibility</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    1.1. Our platform is exclusively available to George Mason University (GMU) students, faculty, and staff ("GMU Affiliates").
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    1.2. You must register using a valid GMU email address ending in @gmu.edu or @masonlive.gmu.edu.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    1.3. You must be at least 18 years old to use this platform.
                  </p>
                </section>

                {/* 2. Account Registration */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">2. Account Registration</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    2.1. You agree to provide accurate, current, and complete information during registration.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    2.2. You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    2.3. You agree to notify us immediately of any unauthorized access to your account.
                  </p>
                </section>

                {/* 3. Platform Use */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">3. Platform Use</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    3.1. GMUBookTrading Company serves as a marketplace facilitating connections between buyers and sellers of textbooks and course materials.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    3.2. We do not own, sell, or take possession of any books listed on the platform.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    3.3. All transactions are conducted directly between users. We are not a party to these transactions.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    3.4. The platform is provided for personal, non-commercial use only.
                  </p>
                </section>

                {/* 4. Listing Books */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">4. Listing Books</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    4.1. Sellers must provide accurate descriptions, conditions, and pricing for all listed books.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    4.2. You may only list books that you legally own and have the right to sell.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    4.3. Prohibited items include counterfeit materials, pirated content, and illegal copies.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    4.4. We reserve the right to remove any listing that violates these terms or is deemed inappropriate.
                  </p>
                </section>

                {/* 5. Transactions */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">5. Transactions</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    5.1. All payment, delivery, and communication arrangements are made directly between buyers and sellers.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    5.2. We recommend meeting in safe, public locations on campus for exchanges.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    5.3. We are not responsible for the quality, safety, legality, or availability of items listed.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    5.4. Users assume all risks associated with transactions conducted through the platform.
                  </p>
                </section>

                {/* 6. Prohibited Conduct */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">6. Prohibited Conduct</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-2">
                    You agree not to:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>Use the platform for any fraudulent or illegal purpose</li>
                    <li>Impersonate another person or entity</li>
                    <li>Post false, misleading, or deceptive listings</li>
                    <li>Harass, threaten, or abuse other users</li>
                    <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
                    <li>Scrape, data mine, or use automated tools without permission</li>
                    <li>List items outside the scope of textbooks and course materials</li>
                  </ul>
                </section>

                {/* 7. Intellectual Property */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">7. Intellectual Property</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    7.1. All content on the platform, including design, logos, and code, is owned by GMUBookTrading Company and protected by copyright laws.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    7.2. Users retain ownership of content they post but grant us a license to display and distribute such content on the platform.
                  </p>
                </section>

                {/* 8. Privacy */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">8. Privacy</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    Your use of the platform is also governed by our Privacy Policy. We collect and use your information as described in that policy.
                  </p>
                </section>

                {/* 9. Disclaimers */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">9. Disclaimers</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    9.1. THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    9.2. We do not guarantee the accuracy, completeness, or reliability of any listings or user content.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    9.3. We make no warranties regarding the availability, security, or error-free operation of the platform.
                  </p>
                </section>

                {/* 10. Limitation of Liability */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    10.1. TO THE MAXIMUM EXTENT PERMITTED BY LAW, GMUBOOKTRADING COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    10.2. Our total liability shall not exceed $100 or the amount you paid to use the platform, whichever is less.
                  </p>
                </section>

                {/* 11. Indemnification */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">11. Indemnification</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    You agree to indemnify and hold harmless GMUBookTrading Company from any claims, damages, losses, or expenses arising from your use of the platform or violation of these terms.
                  </p>
                </section>

                {/* 12. Termination */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">12. Termination</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    12.1. We may suspend or terminate your account at any time for violation of these terms.
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    12.2. You may close your account at any time by contacting us.
                  </p>
                </section>

                {/* 13. Changes to Terms */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">13. Changes to Terms</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                {/* 14. Governing Law */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">14. Governing Law</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    These terms are governed by the laws of the Commonwealth of Virginia, without regard to conflict of law principles.
                  </p>
                </section>

                {/* 15. Contact Us */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">15. Contact Us</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    If you have questions about these Terms and Conditions, please contact us at:
                  </p>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    Email: support@gmubooktrading.com
                  </p>
                </section>

                {/* Agreement */}
                <section className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed font-medium">
                    By using GMUBookTrading Company, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                  </p>
                </section>

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

