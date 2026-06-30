// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Home, ArrowRight } from 'lucide-react';

// const Footer = () => {
//   const navigate = useNavigate();

//   // Unified Animation System
//   const fadeInUp = {
//     hidden: { opacity: 0, y: 15 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
//     }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.08,
//       }
//     }
//   };

//   return (
//     <footer className="bg-white border-t border-black/[0.03] pt-16 pb-10 px-8 overflow-hidden">
//       <div className="max-w-[1100px] mx-auto">
        
//         {/* Section 1: Compact Mission CTA */}
//         <motion.div 
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.5 }}
//           variants={staggerContainer}
//           className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16"
//         >
//           <motion.div variants={fadeInUp} className="max-w-[420px]">
//             <h3 className="text-[20px] font-medium text-ink-primary tracking-tight mb-2">
//               Bring rhythm to your home.
//             </h3>
//             <p className="text-ink-secondary text-[14px] leading-relaxed opacity-80">
//               I built RoomRota to solve the subtle frictions of shared living. Start small, define your rhythms, and reclaim your peace.
//             </p>
//           </motion.div>
          
//           <motion.button
//             variants={fadeInUp}
//             onClick={() => navigate('/signup')}
//             className="group relative h-12 px-8 rounded-full bg-ink-primary text-white text-[13px] font-medium flex items-center justify-center gap-2 overflow-hidden transition-all hover:bg-black hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.2)] active:scale-[0.96]"
//           >
//             <span>Start free</span>
//             <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
//           </motion.button>
//         </motion.div>

//         {/* Section 2: Tighter Navigation & Branding */}
//         <motion.div 
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.5 }}
//           variants={staggerContainer}
//           className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12"
//         >
//           {/* Brand Identity */}
//           <motion.div variants={fadeInUp}>
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-5 h-5 rounded-md bg-protocol-blue flex items-center justify-center text-white">
//                 <Home size={12} />
//               </div>
//               <span className="text-ink-primary text-[14px] font-semibold tracking-tighter">
//                 RoomRota
//               </span>
//             </div>
//             <p className="text-ink-secondary/60 text-[12px] leading-relaxed max-w-[180px]">
//               Built for harmony. <br />
//               Designed for peace.
//             </p>
//           </motion.div>

//           {/* Minimal Links - Tighter Spatial logic */}
//           <motion.div variants={fadeInUp} className="flex flex-row gap-12 md:justify-end">
//             <div className="flex flex-col space-y-3">
//               <h4 className="text-ink-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-30">Product</h4>
//               <a href="#how" className="text-ink-secondary/80 hover:text-protocol-blue text-[12px] font-medium transition-colors tracking-tight">How it works</a>
//               <a href="#philosophy" className="text-ink-secondary/80 hover:text-protocol-blue text-[12px] font-medium transition-colors tracking-tight">The Philosophy</a>
//             </div>
            
//             <div className="flex flex-col space-y-3">
//               <h4 className="text-ink-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-30">Entry</h4>
//               <button onClick={() => navigate('/login')} className="text-left text-ink-secondary/80 hover:text-protocol-blue text-[12px] font-medium transition-colors tracking-tight">Log in</button>
//               <button onClick={() => navigate('/signup')} className="text-left text-ink-secondary/80 hover:text-protocol-blue text-[12px] font-medium transition-colors tracking-tight">Start free</button>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Section 3: Bottom Bar - Ultra Compact */}
//         <motion.div 
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeInUp}
//           className="pt-6 border-t border-black/[0.03] flex justify-between items-center"
//         >
//           <p className="text-[10px] font-medium text-ink-secondary/40 tracking-wide uppercase">
//             © 2026 RoomRota
//           </p>
//           <p className="text-[10px] font-bold text-ink-secondary/20 uppercase tracking-[0.2em]">
//             Made in India
//           </p>
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;