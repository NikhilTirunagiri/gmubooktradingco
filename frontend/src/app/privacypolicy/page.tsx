"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Sections with dark backgrounds (SVG/gradient backgrounds)
    const darkSections = ['privacy-hero'];
    
    // Initial check - determine which section is at the navbar position
    const checkInitialSection = () => {
      // Navbar is fixed at top: 16px, so check what's behind the navbar center (around 45px from top)
      const navbarCenterY = 45;
      const sections = document.querySelectorAll('#privacy-hero, #content-section');
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
      const sections = document.querySelectorAll('#privacy-hero, #content-section');
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
      <Navbar isDarkBackground={false} variant="island" currentPath="/privacypolicy" />
        
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
                <div id="privacy-hero" className="mathco-hero-bg flex min-h-[40vh] flex-col gap-6 sm:gap-8 items-start justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 @[480px]:rounded-xl relative overflow-hidden">
                  
                  <div className="flex flex-col gap-4 sm:gap-6 relative z-10 max-w-2xl">
                    <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight">
                      Privacy Policy
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
                    GMUBookTrading Company ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully.
                  </p>
                </section>

                {/* 1. Information We Collect */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">1. Information We Collect</h2>
                  
                  <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-xl font-semibold mb-3 mt-6">1.1. Personal Information</h3>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-2">
                    When you register and use our platform, we collect:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>Name and GMU email address</li>
                    <li>Profile information (optional: photo, phone number, preferred contact method)</li>
                    <li>Account credentials (encrypted password)</li>
                    <li>GMU affiliation status (student, faculty, or staff)</li>
                  </ul>

                  <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-xl font-semibold mb-3 mt-6">1.2. Transaction Information</h3>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    We collect information about your listings and interactions:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>Book listings (title, author, condition, price, photos)</li>
                    <li>Messages exchanged through the platform</li>
                    <li>Transaction history and feedback</li>
                    <li>Search queries and browsing behavior</li>
                  </ul>

                  <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-xl font-semibold mb-3 mt-6">1.3. Technical Information</h3>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    We automatically collect certain technical data:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages viewed, time spent, and access times</li>
                    <li>Referring website addresses</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                {/* 2. How We Use Your Information */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-2">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>Create and manage your account</li>
                    <li>Verify your GMU affiliation</li>
                    <li>Enable communication between buyers and sellers</li>
                    <li>Process and display your book listings</li>
                    <li>Improve and personalize your experience</li>
                    <li>Send service-related notifications and updates</li>
                    <li>Detect and prevent fraud or abuse</li>
                    <li>Maintain platform security</li>
                    <li>Analyze usage patterns and improve our services</li>
                    <li>Comply with legal obligations</li>
                    <li>Respond to your inquiries and support requests</li>
                  </ul>
                </section>

                {/* 3. Information Sharing */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
                  
                  <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-xl font-semibold mb-3 mt-6">3.1. With Other Users</h3>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    When you list a book or express interest in a listing, certain information becomes visible to other verified GMU users, including your name, profile information, and listing details.
                  </p>

                  <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-xl font-semibold mb-3 mt-6">3.2. Service Providers</h3>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    We may share information with third-party service providers who help us operate the platform, such as hosting providers, analytics services, and email delivery services. These providers are bound by confidentiality agreements.
                  </p>

                  <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-xl font-semibold mb-3 mt-6">3.3. Legal Requirements</h3>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    We may disclose your information if required by law, court order, or government request, or to protect the rights, property, or safety of our users or others.
                  </p>

                  <h3 className="text-[var(--color-primary-violet)] mathco-h3 text-xl font-semibold mb-3 mt-6">3.4. Business Transfers</h3>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                  </p>

                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed font-semibold">
                    We do not sell your personal information to third parties.
                  </p>
                </section>

                {/* 4. Data Security */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">4. Data Security</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    We implement industry-standard security measures to protect your information, including:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure password hashing</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Monitoring for suspicious activity</li>
                  </ul>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </section>

                {/* 5. Cookies and Tracking */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>Keep you logged in</li>
                    <li>Remember your preferences</li>
                    <li>Understand how you use the platform</li>
                    <li>Improve performance and user experience</li>
                    <li>Analyze traffic and usage patterns</li>
                  </ul>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    You can control cookies through your browser settings, but disabling them may affect platform functionality.
                  </p>
                </section>

                {/* 6. Your Rights and Choices */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-2">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from promotional emails</li>
                    <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                  </ul>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    To exercise these rights, contact us at support@gmubooktrading.com. We will respond to your request within 30 days.
                  </p>
                </section>

                {/* 7. Data Retention */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">7. Data Retention</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    We retain your personal information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-[var(--color-neutral-dark)] mathco-body text-base space-y-2">
                    <li>Legal compliance and dispute resolution</li>
                    <li>Fraud prevention and security</li>
                    <li>Aggregated analytics (anonymized data)</li>
                  </ul>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    Most personal data is deleted within 90 days of account closure, unless retention is required by law.
                  </p>
                </section>

                {/* 8. Third-Party Links */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">8. Third-Party Links</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    Our platform may contain links to external websites. We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies before providing any information.
                  </p>
                </section>


                {/* 10. GMU Affiliation */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">9. GMU Affiliation Verification</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    We are not Affiliated with George Mason University. We verify GMU affiliation through your university email address. This information is used solely to ensure platform exclusivity and is not shared with George Mason University unless required by law or university policy.
                  </p>
                </section>


                {/* 10. Changes to Privacy Policy */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                {/* 11. Contact Us */}
                <section className="mb-8">
                  <h2 className="text-[var(--color-primary-violet)] mathco-h2 text-2xl font-semibold mb-4">11. Contact Us</h2>
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed mb-3">
                    If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed">
                    <p className="mb-1"><strong>Email:</strong> support@gmubooktrading.com</p>
                    <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
                  </div>
                </section>

                {/* Agreement */}
                <section className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <p className="text-[var(--color-neutral-dark)] mathco-body text-base leading-relaxed font-medium">
                    By using GMUBookTrading Company, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
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
