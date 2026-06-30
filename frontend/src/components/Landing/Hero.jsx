import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight, Circle } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative pt-24 pb-32 flex flex-col items-center text-center px-6 overflow-hidden">
      
      {/* Background Refinement: Breathing Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.5, 0.4] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-protocol-blue/10 rounded-full blur-[120px] -z-10"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-protocol-blue/5 rounded-full blur-[140px] -z-10"
      />

      <motion.div 
        variants={stagger}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div 
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-protocol-blue/5 border border-protocol-blue/10 mb-8"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-protocol-blue animate-pulse"></span>
          <span className="text-protocol-blue text-[11px] font-bold tracking-widest uppercase">
            Now in Public Beta
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-semibold text-ink-primary tracking-tight max-w-[850px] leading-[1.05] mb-6"
        >
          Shared living, without <br className="hidden md:block" />
          the friction.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          variants={fadeInUp}
          className="text-lg md:text-xl text-ink-secondary max-w-[580px] leading-relaxed mb-10"
        >
          The neutral rhythm for your home. RoomRota automates chores and rotations so you can go back to being friends.
        </motion.p>

        {/* Primary CTA */}
        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate('/signup')}
            className="group inline-flex items-center justify-center h-14 px-8 rounded-full bg-ink-primary text-black font-medium tracking-[-0.01em] shadow-[0_8px_24px_rgba(17,24,39,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,24,39,0.18)] active:translate-y-0 active:scale-[0.98]"
          >
            <span>Start free</span>
            <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          {/* Trust Signal */}
          <div className="flex items-center gap-2 text-[12px] font-medium text-ink-secondary/60">
            <span>Free forever for small homes</span>
            <span className="w-1 h-1 rounded-full bg-ink-secondary/30"></span>
            <span>Setup in 2 mins</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Product Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -5 }}
        className="relative w-full max-w-[800px] mt-24"
      >
        <div className="bg-white rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-border-subtle p-8 md:p-12 text-left relative z-10 overflow-hidden">
          
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-[11px] font-bold text-ink-secondary/50 uppercase tracking-[0.2em] mb-2">
                Today's Rotation
              </p>
              <h3 className="text-3xl font-medium text-ink-primary tracking-tight">
                Your focus
              </h3>
            </div>

            {/* Realistic Avatars */}
            <div className="flex -space-x-3">
              <AvatarCircle color="bg-blue-100" text="AG" textColor="text-blue-600" delay={0.6} />
              <AvatarCircle color="bg-orange-100" text="SK" textColor="text-orange-600" delay={0.7} />
              <AvatarCircle color="bg-emerald-100" text="MJ" textColor="text-emerald-600" delay={0.8} />
            </div>
          </div>

          <div className="space-y-3">
            {/* Task 1: You */}
            <ChoreRow 
              title="Deep clean kitchen" 
              assignee="You" 
              time="15 mins" 
              isDone={true} 
              priority="Essential"
            />
            {/* Task 2: Rahul */}
            <ChoreRow 
              title="Take out trash" 
              assignee="Rahul" 
              time="5 mins" 
              isDone={false} 
              priority="Daily"
            />
            {/* Task 3: Ishan */}
            <ChoreRow 
              title="Bathroom cleaning" 
              assignee="Ishan" 
              time="20 mins" 
              isDone={false} 
              priority="Weekly"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// --- Sub-components for Polish ---

const AvatarCircle = ({ color, text, textColor, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4 }}
    className={`w-12 h-12 rounded-full border-[3px] border-white ${color} flex items-center justify-center shadow-sm cursor-pointer transition-transform`}
  >
    <span className={`text-[10px] font-bold ${textColor}`}>{text}</span>
  </motion.div>
);

const ChoreRow = ({ title, assignee, time, isDone, priority }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className={`group flex items-center justify-between p-5 rounded-[20px] transition-all border ${
      isDone ? 'bg-canvas/50 border-transparent' : 'bg-white border-border-subtle hover:border-protocol-blue/20 hover:shadow-md'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        {isDone ? (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="text-protocol-blue"
          >
            <CheckCircle2 size={22} strokeWidth={2.5} />
          </motion.div>
        ) : (
          <Circle size={22} className="text-border-subtle group-hover:text-protocol-blue/30 transition-colors" strokeWidth={2} />
        )}
      </div>

      <div>
        <h4 className={`text-[15px] font-medium transition-colors ${isDone ? 'text-ink-secondary/50 line-through' : 'text-ink-primary'}`}>
          {title}
        </h4>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] text-ink-secondary/60 font-medium">
            <Clock size={11} /> {time}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${isDone ? 'text-ink-secondary/30' : 'text-protocol-blue/60'}`}>
            {priority}
          </span>
        </div>
      </div>
    </div>

    <div className="text-right">
      <span className={`text-[11px] font-bold uppercase tracking-wider ${isDone ? 'text-ink-secondary/30' : 'text-ink-secondary'}`}>
        {assignee}
      </span>
    </div>
  </motion.div>
);

export default Hero;