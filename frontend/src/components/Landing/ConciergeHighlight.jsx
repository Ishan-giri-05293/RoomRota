import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, ShieldCheck } from 'lucide-react';

const ConciergeHighlight = () => {
  // Animation Variants (Consistent with Hero & ProcessSteps)
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const notificationVariant = {
    hidden: { opacity: 0, x: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.9, 
        ease: [0.22, 1, 0.36, 1],
        delay: 0.4 
      } 
    }
  };

  return (
    <section className="relative py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Content Side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="flex-1 text-left"
          >
            <motion.div 
              variants={fadeInUp}
              className="w-12 h-12 rounded-[18px] bg-protocol-blue/5 flex items-center justify-center mb-8 border border-protocol-blue/10"
            >
              <ShieldCheck size={24} className="text-protocol-blue" strokeWidth={1.5} />
            </motion.div>

            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-semibold text-ink-primary tracking-tight mb-6 leading-[1.1]"
            >
              The neutral <br className="hidden md:block" /> third-party.
            </motion.h2>

            <motion.p 
              variants={fadeInUp}
              className="text-ink-secondary text-base md:text-lg leading-relaxed mb-10 max-w-[480px] opacity-90"
            >
              Stop policing the group chat. RoomRota sends intelligent, gentle reminders to the right person at the right time.
            </motion.p>
            
            <motion.ul variants={staggerContainer} className="space-y-5">
              {['Passive accountability', 'Context-aware notifications', 'Zero social friction'].map((item, i) => (
                <motion.li 
                  key={i} 
                  variants={fadeInUp}
                  className="flex items-center gap-3 text-ink-primary text-[15px] font-medium tracking-tight"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-protocol-blue/10 flex items-center justify-center">
                    <Check size={12} className="text-protocol-blue" strokeWidth={3} />
                  </div>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Visual Side: The "Invisible Concierge" Mockup */}
          <div className="flex-1 w-full flex justify-center items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative w-full max-w-[420px]"
            >
              {/* iOS-style Notification Bubble */}
              <motion.div 
                variants={notificationVariant}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 30px 60px -12px rgba(0,0,0,0.12)",
                }}
                className="relative z-10 bg-white/70 backdrop-blur-xl border border-border-subtle rounded-[28px] p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-shadow duration-300 cursor-default"
              >
                <div className="flex items-start gap-5">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-11 h-11 rounded-2xl bg-protocol-blue flex items-center justify-center shadow-lg shadow-protocol-blue/20"
                  >
                    <Bell size={22} className="text-white" strokeWidth={2} />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-ink-secondary/50 uppercase tracking-[0.2em]">RoomRota</span>
                      <span className="text-[10px] text-ink-secondary/40 font-medium">Just now</span>
                    </div>
                    
                    <h4 className="text-[15px] font-semibold text-ink-primary mb-1 tracking-tight">
                      It's your turn, Ishan.
                    </h4>
                    
                    <p className="text-[14px] text-ink-secondary leading-snug opacity-90">
                      The kitchen deep clean is scheduled for today. Everyone appreciates the help!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Refined Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-protocol-blue/[0.06] rounded-full blur-[80px] -z-10" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConciergeHighlight;