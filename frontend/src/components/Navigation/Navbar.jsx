import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-md border-b border-black/[0.03] transition-all duration-300">
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo - Tightened tracking for a custom-logotype feel */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <span className="text-ink-primary text-[19px] font-semibold tracking-tighter transition-opacity group-hover:opacity-70">
              RoomRota
            </span>
          </div>

          {/* Desktop Navigation - Reduced font size for premium UI look */}
          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#how"
              className="text-ink-secondary/80 hover:text-ink-primary text-[13px] font-medium transition-all tracking-tight"
            >
              How it works
            </a>

            <a
              href="#philosophy"
              className="text-ink-secondary/80 hover:text-ink-primary text-[13px] font-medium transition-all tracking-tight"
            >
              The Philosophy
            </a>

            <button
              onClick={() => navigate('/login')}
              className="text-ink-secondary/80 hover:text-ink-primary text-[13px] font-medium transition-all tracking-tight"
            >
              Log in
            </button>
          </div>

          {/* Desktop CTA - Matched to Hero Action Style */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-ink-primary text-black px-5 py-2 rounded-full text-[13px] font-medium transition-all shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] hover:bg-black hover:shadow-[0_12px_20px_-6px_rgba(0,0,0,0.15)] active:scale-[0.96]"
            >
              Start free
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ink-secondary p-2 -mr-2 transition-colors hover:text-ink-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved animation and spacing */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/[0.03] transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
      >
        <div className="px-8 py-10 flex flex-col space-y-8">
          <a
            href="#how"
            className="text-ink-secondary text-base font-medium tracking-tight"
          >
            How it works
          </a>

          <a
            href="#philosophy"
            className="text-ink-secondary text-base font-medium tracking-tight"
          >
            The Philosophy
          </a>

          <div className="pt-4 flex flex-col space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="text-ink-secondary text-base font-medium tracking-tight text-left"
            >
              Log in
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-ink-primary text-black py-4 rounded-full text-base font-medium shadow-lg active:scale-[0.98] transition-transform"
            >
              Start free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;