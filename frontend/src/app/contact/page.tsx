"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {


  return (
    <>
      <Navbar isDarkBackground={false} variant="fixed-top" />
        
      {/* Main content */}
      <div
        className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
        style={{ fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5 pt-24 sm:pt-28">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto px-4">
              
              {/* Hero Section */}
              <div className="flex flex-col gap-6 sm:gap-8 py-8 sm:py-12">
                <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
                  <h1 className="text-[var(--color-primary-violet)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    Get in Touch
                  </h1>
                  <p className="text-[var(--color-neutral-dark)] text-base sm:text-lg">
                    Have questions about buying or selling textbooks? Need help with your account? We're here to help GMU students and faculty.
                  </p>
                </div>
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
                {/* Email */}
                <div className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.19V181.81Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-[var(--color-primary-violet)] font-semibold text-lg mb-2">Email Us</h3>
                  <a href="mailto:support@gmubooktrading.com" className="text-[var(--color-primary-violet)] hover:underline">
                    support@gmubooktrading.com
                  </a>
                </div>

                {/* Instagram */}
                <div className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-[var(--color-primary-violet)] font-semibold text-lg mb-2">Follow Us</h3>
                  <a href="https://www.instagram.com/gmubooktradingco" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-violet)] hover:underline">
                    @gmubooktradingco
                  </a>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="flex flex-col gap-6 py-8">
                <h2 className="text-[var(--color-primary-violet)] text-2xl sm:text-3xl font-bold text-center mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-[var(--color-primary-violet)] font-semibold text-lg mb-2">
                      How do I list a textbook for sale?
                    </h3>
                    <p className="text-[var(--color-neutral-dark)]">
                      Create an account, click "Sell Books" in the navigation menu, and fill out the listing form with your textbook details and price. Your listing will be visible to all GMU students immediately.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-[var(--color-primary-violet)] font-semibold text-lg mb-2">
                      Is GMUBookTrading Company only for GMU students?
                    </h3>
                    <p className="text-[var(--color-neutral-dark)]">
                      Yes, our platform is exclusively for George Mason University students and faculty. You'll need to verify your GMU email address to create an account.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-[var(--color-primary-violet)] font-semibold text-lg mb-2">
                      How do I arrange to meet a buyer or seller?
                    </h3>
                    <p className="text-[var(--color-neutral-dark)]">
                      Once you connect through our platform, you can message directly to arrange a safe meeting location on campus. We recommend meeting in public areas like the Johnson Center or library.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-[var(--color-primary-violet)] font-semibold text-lg mb-2">
                      Is there a fee to use the platform?
                    </h3>
                    <p className="text-[var(--color-neutral-dark)]">
                      GMUBookTrading Company is completely free to use. No listing fees, no transaction fees. We're built by GMU students, for GMU students.
                    </p>
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

