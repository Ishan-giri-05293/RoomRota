import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Copy, Check, Link as LinkIcon, Trash2, Utensils, Droplets, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [houseName, setHouseName] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedChore, setSelectedChore] = useState(null);

  const inviteLink = `roomrota.app/join/summer-home-42`;

  const chores = [
    { id: 'trash', title: 'Trash & Recycling', icon: <Trash2 size={18} /> },
    { id: 'dishes', title: 'Kitchen & Dishes', icon: <Utensils size={18} /> },
    { id: 'cleaning', title: 'Common Area', icon: <Droplets size={18} /> },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    // 1. In a real app, you'd call your API to create the flat here:
    // await flatService.create({ name: houseName });
    
    // 2. Then navigate to the sanctuary
    navigate('/dashboard');
};

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
      
      {/* Navigation */}
      {step > 1 && (
        <button 
          onClick={() => setStep(step - 1)}
          className="absolute top-12 left-8 flex items-center gap-2 text-ink-secondary hover:text-ink-primary transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}

      <div className="w-full max-w-[420px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: HOUSE NAME (Previous code...) */}
          {/* ... */}

          {/* STEP 2: INVITE ROOMMATES (Previous code...) */}
          {/* ... */}

          {/* STEP 3: THE FIRST RHYTHM */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <span className="text-[11px] font-bold tracking-[0.2em] text-protocol-blue/60 uppercase mb-6 block">
                The First Rhythm
              </span>
              <h1 className="text-3xl font-medium text-ink-primary tracking-tight mb-4">
                Start with one.
              </h1>
              <p className="text-ink-secondary mb-10 text-[15px]">
                Choose the first chore you’d like to automate. You can add more later.
              </p>

              {/* Chore Selection Grid */}
              <div className="space-y-3">
                {chores.map((chore) => (
                  <button
                    key={chore.id}
                    onClick={() => setSelectedChore(chore.id)}
                    className={`w-full p-5 rounded-3xl border flex items-center justify-between transition-all duration-300 ${
                      selectedChore === chore.id 
                      ? 'bg-protocol-blue/5 border-protocol-blue/20 ring-1 ring-protocol-blue/10' 
                      : 'bg-white border-border-subtle hover:border-protocol-blue/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedChore === chore.id ? 'bg-protocol-blue/10 text-protocol-blue' : 'bg-canvas text-ink-secondary'
                      }`}>
                        {chore.icon}
                      </div>
                      <span className={`font-medium ${selectedChore === chore.id ? 'text-ink-primary' : 'text-ink-secondary'}`}>
                        {chore.title}
                      </span>
                    </div>
                    {selectedChore === chore.id && (
                      <div className="w-6 h-6 bg-protocol-blue rounded-full flex items-center justify-center text-white">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Final CTA */}
              <button 
                onClick={handleComplete}
                className="mt-10 w-full bg-protocol-blue text-white py-5 rounded-full font-medium flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-protocol-blue/10 transition-all active:scale-[0.98]"
              >
                Enter {houseName || 'the house'}
                <Sparkles size={18} />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-12 flex gap-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-protocol-blue/40' : 'w-2 bg-border-subtle'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;