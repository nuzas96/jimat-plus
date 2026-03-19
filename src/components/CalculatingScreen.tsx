import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalculatingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Checking your pantry...',
  'Matching meal options...',
  'Estimating coverage...',
  'Finding the best next purchase...',
];

const CalculatingScreen = ({ onComplete }: CalculatingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + 1.5;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor(progress / 25), STEPS.length - 1);
    setStepIndex(idx);
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gradient-surface">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center max-w-xs w-full"
      >
        {/* Animated circles */}
        <div className="relative w-20 h-20 mb-8">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-primary"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-2 rounded-full bg-primary"
          />
          <div className="absolute inset-4 rounded-full gradient-warm flex items-center justify-center shadow-glow">
            <span className="font-mono text-sm font-bold text-primary-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <h2 className="font-display text-xl text-foreground mb-2 text-center">Analyzing your situation</h2>

        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-muted-foreground mb-8 text-center"
        >
          {STEPS[stepIndex]}
        </motion.p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-warm rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CalculatingScreen;
