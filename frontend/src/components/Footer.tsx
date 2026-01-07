    import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mathco-hero-bg text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-[var(--color-accent-white)] mathco-h3 mb-4 text-lg sm:text-xl">GMUBookTrade Company</h3>
            <p className="text-white/80 mathco-body max-w-md mb-4 sm:mb-6 text-sm sm:text-base">
              An exclusive marketplace for GMU students and faculty to buy, sell, and trade used textbooks at fair prices. Save money and connect with your campus community.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="https://www.instagram.com/gmubooktradeco/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-accent-mint)] hover:text-[var(--color-primary-violet)] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-5 sm:h-5">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                </svg>
              </a>
              <a href="mailto:support@gmubooktrade.com" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-accent-mint)] hover:text-[var(--color-primary-violet)] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-5 sm:h-5">
                  <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[var(--color-accent-white)] mathco-h3 mb-3 sm:mb-4 text-base sm:text-lg">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/marketplace" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Browse Books</Link></li>
              <li><Link href="/marketplace" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Sell Books</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[var(--color-accent-white)] mathco-h3 mb-3 sm:mb-4 text-base sm:text-lg">Support</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/safety" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Safety Tips</Link></li>
              <li><Link href="/contact" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Contact Us</Link></li>
              <li><Link href="/privacypolicy" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Privacy Policy</Link></li>
              <li><Link href="/tandc" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-white/60 mathco-body-sm text-xs sm:text-sm text-center md:text-left">&copy; 2025 GMUBookTrade Company. All rights reserved.</p>
          <div>
            <p className="text-[var(--color-accent-white)] mathco-body-sm font-medium text-xs sm:text-sm text-center md:text-right">Made by students, for students.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

