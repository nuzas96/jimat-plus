import { motion } from 'framer-motion';
import { ArrowRight, Shield, Calendar, AlertTriangle, ShoppingCart } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const VALUE_HIGHLIGHTS = [
  { icon: Calendar, text: 'Know how many days your food can cover' },
  { icon: AlertTriangle, text: 'See what happens if you do nothing' },
  { icon: ShoppingCart, text: 'Find the cheapest next item to buy' },
];

const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-2xl w-full text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-label text-muted-foreground">LastBite Score</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground mb-6" style={{ textWrap: 'balance' }}>
          Can your remaining food and budget realistically last?
        </h1>

        <p className="text-lg text-muted-foreground mb-4 max-w-lg mx-auto">
          LastBite Score helps university students turn leftover pantry items and limited money into a practical short-term food plan.
        </p>

        <p className="text-base text-muted-foreground/80 mb-10 max-w-md mx-auto italic">
          Some students don't run out of food completely. They run out of confidence in how to make the rest of their food and money last.
        </p>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-elevated transition-all hover:opacity-90"
        >
          Check My Food Situation
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Value highlights */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {VALUE_HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 font-label text-muted-foreground">
          No login required · Free to use · Private
        </p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
