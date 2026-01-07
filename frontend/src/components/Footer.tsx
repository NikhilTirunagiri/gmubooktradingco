    import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mathco-hero-bg text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-[var(--color-accent-white)] mathco-h3 mb-4 text-lg sm:text-xl">TheCollegeTech</h3>
            <p className="text-white/80 mathco-body max-w-md mb-4 sm:mb-6 text-sm sm:text-base">
              Empowering educational institutions with innovative technology solutions for placements, learning management, and comprehensive IT services.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="https://www.linkedin.com/company/thecollegetech/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-accent-mint)] hover:text-[var(--color-primary-violet)] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-5 sm:h-5">
                  <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
                </svg>
              </a>
              <a href="mailto:contact@thecollegetech.com" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-accent-mint)] hover:text-[var(--color-primary-violet)] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256" className="sm:w-5 sm:h-5">
                  <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[var(--color-accent-white)] mathco-h3 mb-3 sm:mb-4 text-base sm:text-lg">Solutions</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Placeeasy</a></li>
              <li><a href="#" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Vidya LMS</a></li>
              <li><a href="#" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">IT Services</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[var(--color-accent-white)] mathco-h3 mb-3 sm:mb-4 text-base sm:text-lg">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">About Us</a></li>
              <li><Link href="/careers" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Careers</Link></li>
              <li><a href="#" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Contact</a></li>
              <li><a href="#" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-white/80 mathco-body-sm hover:text-[var(--color-accent-mint)] transition-colors duration-300 text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-white/60 mathco-body-sm text-xs sm:text-sm text-center md:text-left">&copy; 2025 TheCollegeTech. All rights reserved.</p>
          <div>
            <p className="text-[var(--color-accent-white)] mathco-body-sm font-medium text-xs sm:text-sm text-center md:text-right">It&apos;s time for a change and we can make it happen.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

