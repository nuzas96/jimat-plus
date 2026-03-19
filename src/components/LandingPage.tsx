import { motion } from 'framer-motion';
import { ArrowRight, Calendar, AlertTriangle, ShoppingCart, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const VALUE_HIGHLIGHTS = [
  { icon: Calendar, text: 'Estimate how many days your food can still cover', delay: 0.4 },
  { icon: AlertTriangle, text: 'See the risk before your budget runs out', delay: 0.5 },
  { icon: ShoppingCart, text: 'Get the cheapest next purchase to stabilize the plan', delay: 0.6 },
];

const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 gradient-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 mb-4"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary tracking-wide">JiMAT+</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs sm:text-sm uppercase tracking-[0.24em] text-muted-foreground/75 mb-4"
        >
          Student Food Budget Survival Planner
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl sm:text-5xl leading-[1.1] text-foreground mb-5"
          style={{ textWrap: 'balance' }}
        >
          Can your food and budget
          <span className="text-primary"> really last until allowance day?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg text-muted-foreground mb-4 max-w-md mx-auto leading-relaxed"
        >
          JiMAT+ helps students turn leftover pantry items and limited ringgit into a practical survival plan for the last stretch before the next allowance.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm text-muted-foreground/70 mb-10 max-w-sm mx-auto italic"
        >
          You have not run out yet. JiMAT+ helps you make the next move before things become critical.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="inline-flex items-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-semibold shadow-glow transition-all"
        >
          Start My JiMAT+ Check
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <div className="mt-14 space-y-3 sm:space-y-0 sm:flex sm:flex-col sm:items-center sm:gap-4">
          {VALUE_HIGHLIGHTS.map(({ icon: Icon, text, delay }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{text}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-10 text-xs text-muted-foreground/50 font-medium tracking-wide"
        >
          No login | Private | Built for students
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
