import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalculatingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Reading your pantry',
  'Matching meal options',
  'Estimating coverage',
  'Finding best next purchase',
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
    setStepIndex(Math.min(Math.floor(progress / 25), STEPS.length - 1));
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gradient-surface">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-sm w-full"
      >
        {/* Percentage display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="font-mono text-6xl font-bold text-gradient">
            {Math.round(progress)}
          </span>
          <span className="font-mono text-2xl text-muted-foreground ml-1">%</span>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full gradient-warm rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step text */}
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-muted-foreground text-center"
        >
          {STEPS[stepIndex]}...
        </motion.p>

        <p className="text-xs text-muted-foreground/30 mt-8 font-mono tracking-wider">JIMAT+</p>
      </motion.div>
    </div>
  );
};

export default CalculatingScreen;
