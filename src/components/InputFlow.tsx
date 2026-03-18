import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, X, ChevronLeft, Wallet, Clock, Leaf, Package } from 'lucide-react';
import { DietaryPreference, UserInput } from '@/lib/types';

interface InputFlowProps {
  onSubmit: (input: UserInput) => void;
  onBack: () => void;
}

const COMMON_ITEMS = ['rice', 'eggs', 'onion', 'instant noodles', 'bread', 'sardines', 'tofu', 'cabbage', 'soy sauce'];
const DIETARY_OPTIONS: Array<{ value: DietaryPreference; label: string; emoji: string }> = [
  { value: 'no-preference', label: 'No Preference', emoji: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { value: 'halal-friendly', label: 'Halal-Friendly', emoji: '🌙' },
  { value: 'low-cost-only', label: 'Low-Cost Only', emoji: '💰' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const InputFlow = ({ onSubmit, onBack }: InputFlowProps) => {
  const [budget, setBudget] = useState('');
  const [daysLeft, setDaysLeft] = useState('');
  const [dietary, setDietary] = useState<DietaryPreference>('no-preference');
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState('');

  const addItem = (item: string) => {
    const trimmed = item.trim().toLowerCase();
    if (trimmed && !pantryItems.includes(trimmed)) {
      setPantryItems([...pantryItems, trimmed]);
    }
    setCurrentItem('');
  };

  const removeItem = (item: string) => {
    setPantryItems(pantryItems.filter(existingItem => existingItem !== item));
  };

  const handleSubmit = () => {
    if (!budget || !daysLeft) return;
    onSubmit({
      budget: parseFloat(budget),
      daysLeft: parseInt(daysLeft, 10),
      dietaryPreference: dietary,
      pantryItems,
    });
  };

  const isValid = budget && parseFloat(budget) > 0 && daysLeft && parseInt(daysLeft, 10) > 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full"
      >
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
            Tell us what you&apos;re working with
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            We&apos;ll figure out how far your food and budget can stretch.
          </p>
        </motion.div>

        {/* Budget */}
        <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-primary" />
            </div>
            <label className="font-label text-muted-foreground">Remaining Budget</label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-base">RM</span>
            <input
              type="number"
              value={budget}
              onChange={event => setBudget(event.target.value)}
              placeholder="20"
              className="flex-1 bg-transparent font-mono text-2xl text-foreground outline-none placeholder:text-muted-foreground/30 focus:ring-0 rounded-lg px-1 py-1 transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">How much money do you have left for food?</p>
        </motion.div>

        {/* Days Left */}
        <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-accent" />
            </div>
            <label className="font-label text-muted-foreground">Days Until Next Allowance</label>
          </div>
          <input
            type="number"
            value={daysLeft}
            onChange={event => setDaysLeft(event.target.value)}
            placeholder="3"
            className="w-full bg-transparent font-mono text-2xl text-foreground outline-none placeholder:text-muted-foreground/30 focus:ring-0 rounded-lg px-1 py-1 transition-all"
          />
          <p className="text-xs text-muted-foreground/60 mt-2">How many days do you need to get through?</p>
        </motion.div>

        {/* Dietary */}
        <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-status-safe/10 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-status-safe" />
            </div>
            <label className="font-label text-muted-foreground">Dietary Preference</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DIETARY_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setDietary(option.value)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  dietary === option.value
                    ? 'bg-primary/10 text-primary border-primary/25 shadow-sm'
                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:border-border/50'
                }`}
              >
                <span className="text-base">{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pantry Items */}
        <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-8 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-status-tight/10 flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-status-tight" />
            </div>
            <label className="font-label text-muted-foreground">What&apos;s In Your Pantry?</label>
          </div>
          <p className="text-xs text-muted-foreground/60 mb-4 ml-9">
            Tap common items below or type your own.
          </p>

          {/* Quick-add chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {COMMON_ITEMS.filter(item => !pantryItems.includes(item)).map(item => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addItem(item)}
                className="px-3 py-1.5 bg-muted/60 text-muted-foreground text-xs rounded-lg hover:bg-muted transition-colors border border-border/30 font-medium"
              >
                + {item}
              </motion.button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentItem}
              onChange={event => setCurrentItem(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && addItem(currentItem)}
              placeholder="Or type something else..."
              className="flex-1 bg-muted/40 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-border/30"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => addItem(currentItem)}
              className="gradient-warm text-primary-foreground p-2.5 rounded-xl shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Selected items */}
          <AnimatePresence>
            {pantryItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {pantryItems.map(item => (
                  <motion.span
                    key={item}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-xl border border-primary/15"
                  >
                    {item}
                    <button onClick={() => removeItem(item)} className="hover:text-destructive transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {pantryItems.length === 0 && (
            <p className="text-xs text-muted-foreground/50 italic text-center py-2">
              No items added yet — that&apos;s okay, we can still help
            </p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.button
          custom={5}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-semibold shadow-glow transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Analyze My Situation
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default InputFlow;
