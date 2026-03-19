import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalculatingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Scanning your pantry...',
  'Matching survival meals...',
  'Calculating coverage...',
  'Finding the best move...',
];

const CalculatingScreen = ({ onComplete }: CalculatingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 1.2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor(progress / 25), STEPS.length - 1);
    setStepIndex(idx);
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gradient-surface relative overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[500px] h-[500px] rounded-full bg-primary blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center max-w-xs w-full relative z-10"
      >
        {/* Progress ring */}
        <div className="relative w-28 h-28 mb-10">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="50" fill="none" stroke="hsl(220 15% 88%)" strokeWidth="3" />
            <motion.circle
              cx="56" cy="56" r="50" fill="none"
              stroke="hsl(168 55% 32%)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={314}
              strokeDashoffset={314 - (314 * Math.min(progress, 100)) / 100}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </svg>
          <div className="absolute inset-3 rounded-full bg-card border border-border flex items-center justify-center shadow-card">
            <span className="font-mono text-2xl font-bold text-foreground">
              {Math.round(Math.min(progress, 100))}
            </span>
          </div>
        </div>

        <h2 className="font-display text-xl text-foreground mb-3 text-center">Analyzing your situation</h2>

        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-muted-foreground mb-10 text-center"
        >
          {STEPS[stepIndex]}
        </motion.p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-warm rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CalculatingScreen;
