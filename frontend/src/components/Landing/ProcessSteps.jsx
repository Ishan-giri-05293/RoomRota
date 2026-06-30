import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Wind } from 'lucide-react';

const ProcessSteps = () => {
  const steps = [
    {
      icon: <Users size={22} strokeWidth={1.5} />,
      title: "Invite your circle",
      description: "Send a magic link to your roommates. No complex sign-ups or passwords—just a shared space that's ready when they are."
    },
    {
      icon: <Heart size={22} strokeWidth={1.5} />,
      title: "Define your rhythms",
      description: "Select the tasks that keep your home breathing. We handle the rotation logic so the mental load stays light and perfectly fair."
    },
    {
      icon: <Wind size={22} strokeWidth={1.5} />,
      title: "Enjoy the quiet",
      description: "RoomRota manages the reminders and the 'who does what.' No more awkward conversations—just a home that manages itself."
    }
  ];

  // Animation Variants (Consistent with Hero)
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
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const lineVariant = {
    hidden: { scaleY: 0 },
    visible: { 
      scaleY: 1, 
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 } 
    }
  };

  return (
    <section id="how" className="py-32 px-8 bg-canvas/30">
      <div className="max-w-[900px] mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-28"
        >
          <motion.span 
            variants={fadeInUp}
            className="text-[11px] font-bold tracking-[0.25em] text-protocol-blue/60 uppercase mb-4 block"
          >
            The Journey
          </motion.span>
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-medium text-ink-primary tracking-tight"
          >
            Setting a new pace for your home.
          </motion.h2>
        </motion.div>

        {/* Vertical Flow Container */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="relative space-y-24"
        >
          {/* Subtle Connecting Line (Timeline) */}
          <motion.div 
            variants={lineVariant}
            className="absolute left-8 md:left-8 top-8 bottom-8 w-[1px] bg-border-subtle/60 origin-top hidden md:block"
          />

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20 text-center md:text-left group relative"
            >
              {/* Icon Container (Squircle) */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-16 h-16 rounded-[22px] bg-white border border-border-subtle flex items-center justify-center text-ink-secondary group-hover:text-protocol-blue group-hover:border-protocol-blue/30 group-hover:shadow-sm transition-all duration-500 relative z-10"
              >
                {step.icon}
              </motion.div>
              
              <div className="max-w-[450px] pt-2">
                <h3 className="text-xl font-medium text-ink-primary mb-3 tracking-tight transition-colors duration-500 group-hover:text-protocol-blue/80">
                  {step.title}
                </h3>
                <p className="text-ink-secondary leading-relaxed text-[15px] md:text-[16px] opacity-90">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSteps;