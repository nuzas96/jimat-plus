import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col gradient-hero relative overflow-hidden">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full"
        >
          {/* Brand tag */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">JiMAT+</span>
            <span className="text-muted-foreground text-xs ml-3 tracking-wider">Student Food Security</span>
          </motion.div>

          {/* Hero headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-foreground mb-6"
          >
            Can you make it
            <br />
            <span className="text-gradient">to allowance day?</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed mb-10"
          >
            Enter your budget, pantry, and timeline. JiMAT+ tells you exactly how many days you can cover — and what one purchase can change.
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="group inline-flex items-center gap-4 gradient-warm text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-glow transition-all"
          >
            Check my situation
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Value points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { num: '01', text: 'Know how many days your food can actually cover' },
              { num: '02', text: 'See the risk if you do nothing' },
              { num: '03', text: 'Find the one cheapest item to buy next' },
            ].map(({ num, text }) => (
              <div key={num} className="flex gap-3">
                <span className="font-mono text-xs text-primary font-bold mt-0.5">{num}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="mt-14 text-xs text-muted-foreground/40 font-mono tracking-wider"
          >
            No login · Private · Built for students
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
