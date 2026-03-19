import { motion } from 'framer-motion';
import { ArrowRight, Clock, ShoppingBag, TrendingDown } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const VALUE_POINTS = [
  { icon: Clock, text: 'Know how many days your food can cover' },
  { icon: TrendingDown, text: 'See what happens if you do nothing' },
  { icon: ShoppingBag, text: 'Find the cheapest next item to buy' },
];

const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 gradient-hero relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-primary/[0.06]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Brand badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-primary/15 bg-primary/[0.06] mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
          <span className="text-sm font-bold text-primary tracking-wide font-display">JiMAT+</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xs tracking-[0.25em] text-muted-foreground uppercase mb-5 font-display font-semibold"
        >
          Student Food Survival Engine
        </motion.p>

        {/* Hero headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.92] text-foreground mb-6"
        >
          Will your food
          <br />
          <span className="text-gradient">last until</span>
          <br />
          <span className="text-gradient-accent">allowance day?</span>
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed mb-10"
        >
          Enter what you have. JiMAT+ tells you how far it stretches — and the
          one move that makes the difference.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="inline-flex items-center gap-3 gradient-warm text-primary-foreground px-10 py-4.5 rounded-2xl text-lg font-bold shadow-glow transition-all font-display tracking-tight"
        >
          Check My Survival
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Value points */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          {VALUE_POINTS.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card/60 border border-border shadow-card"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/[0.08] border border-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium text-center leading-snug">{text}</span>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          className="mt-12 text-xs text-muted-foreground/50 font-medium tracking-widest uppercase"
        >
          No login · Private · Built for students
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
