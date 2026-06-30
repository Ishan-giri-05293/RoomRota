import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navigation/Navbar';
import Hero from '../components/Landing/Hero';
import SocialDebt from '../components/Landing/SocialDebt';
import ProcessSteps from '../components/Landing/ProcessSteps';
import ConciergeHighlight from '../components/Landing/ConciergeHighlight';

/**
 * RoomRota Landing Page
 * 
 * Final Polish:
 * 1. Compact, mission-driven footer.
 * 2. Visual pacing between white and canvas sections.
 * 3. Consistent motion system across all components.
 */
const Landing = () => {
  // Simple fade-up for the footer to match the rest of the page's motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-canvas selection:bg-protocol-blue/10 selection:text-protocol-blue">
      {/* Fixed Navigation */}
      <Navbar />
      
      <main className="pt-16">
        {/* Section 1: Hero - The Dream State */}
        <Hero />

        {/* Section 2: Social Debt - The Emotional Hook */}
        <div className="bg-white">
            <SocialDebt />
        </div>

        {/* Section 3: Process Steps - The Logical Path */}
        <ProcessSteps />

        {/* Section 4: Concierge Highlight - The Functional Trust */}
        <div className="bg-white border-y border-black/[0.03]">
            <ConciergeHighlight />
        </div>

        {/* Final Grounding: Compact Inline Footer */}
        <motion.footer 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="py-16 px-8 text-center bg-canvas"
        >
          <div className="max-w-[1200px] mx-auto">
            {/* Minimal Brand Mark */}
            <div className="flex flex-col items-center mb-4">
              <p className="text-ink-primary font-semibold tracking-tighter text-[16px] mb-1">
                RoomRota
              </p>
              <p className="text-ink-secondary/60 text-[13px] font-medium tracking-tight">
                Built for harmony. Designed for peace.
              </p>
            </div>

            {/* Bottom Utility Bar */}
            <div className="mt-10 pt-8 border-t border-black/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[11px] font-medium text-ink-secondary/30 uppercase tracking-widest">
                © 2026 RoomRota
              </p>
              
              <div className="flex items-center gap-8">
                <p className="text-[10px] font-bold text-ink-secondary/40 uppercase tracking-[0.25em]">
                  Made in India
                </p>
                
                <a 
                  href="mailto:ishangiri05293@gmail.com" 
                  className="group text-[12px] text-ink-secondary/60 hover:text-protocol-blue transition-colors"
                >
                  Say hello
                    {/* <ArrowRight className="inline ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" /> */}
                </a>
              </div>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
};

export default Landing;