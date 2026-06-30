import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareOff, Fingerprint, Users2 } from 'lucide-react';

const SocialDebt = () => {
  const cards = [
    {
      icon: <MessageSquareOff size={24} strokeWidth={2} />,
      title: "End the nagging.",
      description: "Stop being the 'house manager.' RoomRota handles the gentle follow-ups as a neutral third party, so you can just be a roommate again."
    },
    {
      icon: <Fingerprint size={24} strokeWidth={2} />,
      title: "Clarity, not conflict.",
      description: "No more wondering if the trash was actually taken out. Get total transparency on what’s done and what’s next without the awkward check-ins."
    },
    {
      icon: <Users2 size={24} strokeWidth={2} />,
      title: "Perfectly balanced.",
      description: "Our rhythms ensure work is distributed fairly. No one feels burdened, and no one is left guessing their fair share."
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <section className="relative py-32 px-6 bg-canvas overflow-hidden">
      {/* Seamless Transition Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-protocol-blue/[0.03] to-transparent pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-ink-primary tracking-tight mb-4">
            Friendship first. Chores second.
          </h2>
          <p className="text-ink-secondary text-base md:text-lg max-w-[520px] mx-auto leading-relaxed">
            We built RoomRota to dissolve the subtle resentments that build up in shared homes.
          </p>
        </motion.div>

        {/* Card Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -6, 
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.06)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white p-8 rounded-[24px] border border-border-subtle shadow-[0_4px_12px_-1px_rgba(0,0,0,0.02)] group cursor-default"
            >
              <motion.div 
                variants={iconVariants}
                whileHover={{ scale: 1.08, rotate: 1.5 }}
                className="w-12 h-12 rounded-[14px] bg-protocol-blue/5 flex items-center justify-center mb-6 text-protocol-blue transition-colors duration-300 group-hover:bg-protocol-blue/10"
              >
                {card.icon}
              </motion.div>
              
              <h3 className="text-xl font-semibold text-ink-primary mb-3 tracking-tight transition-colors duration-300">
                {card.title}
              </h3>
              
              <p className="text-ink-secondary leading-relaxed text-[15px]">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialDebt;