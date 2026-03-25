import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Clock, Leaf, Minus, Package, Plus, Wallet, X } from 'lucide-react';
import { DietaryPreference, UserInput } from '@/lib/types';

interface InputFlowProps {
  onSubmit: (input: UserInput) => void;
  onBack: () => void;
}

const COMMON_ITEMS = ['rice', 'eggs', 'onion', 'instant noodles', 'bread', 'sardines', 'tofu', 'cabbage', 'soy sauce'];
const DIETARY_OPTIONS: Array<{ value: DietaryPreference; label: string; emoji: string }> = [
  { value: 'no-preference', label: 'No Preference', emoji: 'No pref' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: 'Veg' },
  { value: 'halal-friendly', label: 'Halal-Friendly', emoji: 'Halal' },
  { value: 'low-cost-only', label: 'Low-Cost Only', emoji: 'Budget' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function normalizeItemLabel(item: string): string {
  return item.trim().toLowerCase();
}

function buildPantryPayload(pantryCounts: Record<string, number>): string[] {
  return Object.entries(pantryCounts)
    .filter(([, quantity]) => quantity > 0)
    .map(([item, quantity]) => (quantity > 1 ? `${quantity} ${item}` : item));
}

const InputFlow = ({ onSubmit, onBack }: InputFlowProps) => {
  const [budget, setBudget] = useState('');
  const [daysLeft, setDaysLeft] = useState('');
  const [dietary, setDietary] = useState<DietaryPreference>('no-preference');
  const [pantryCounts, setPantryCounts] = useState<Record<string, number>>({});
  const [currentItem, setCurrentItem] = useState('');

  const setItemQuantity = (item: string, nextQuantity: number) => {
    const normalizedItem = normalizeItemLabel(item);
    if (!normalizedItem) {
      return;
    }

    setPantryCounts(previous => {
      if (nextQuantity <= 0) {
        const { [normalizedItem]: _removed, ...remaining } = previous;
        return remaining;
      }

      return {
        ...previous,
        [normalizedItem]: nextQuantity,
      };
    });
  };

  const incrementItem = (item: string) => {
    const normalizedItem = normalizeItemLabel(item);
    if (!normalizedItem) {
      return;
    }

    setPantryCounts(previous => ({
      ...previous,
      [normalizedItem]: Math.min((previous[normalizedItem] ?? 0) + 1, 9),
    }));
  };

  const decrementItem = (item: string) => {
    const currentQuantity = pantryCounts[normalizeItemLabel(item)] ?? 0;
    setItemQuantity(item, currentQuantity - 1);
  };

  const addCustomItem = () => {
    const normalizedItem = normalizeItemLabel(currentItem);
    if (!normalizedItem) {
      return;
    }

    incrementItem(normalizedItem);
    setCurrentItem('');
  };

  const handleSubmit = () => {
    const parsedBudget = Number(budget);
    const parsedDaysLeft = Number(daysLeft);

    if (budget === '' || daysLeft === '' || Number.isNaN(parsedBudget) || Number.isNaN(parsedDaysLeft) || parsedBudget < 0 || parsedDaysLeft <= 0) {
      return;
    }

    onSubmit({
      budget: parsedBudget,
      daysLeft: parsedDaysLeft,
      dietaryPreference: dietary,
      pantryItems: buildPantryPayload(pantryCounts),
    });
  };

  const pantryEntries = Object.entries(pantryCounts)
    .filter(([, quantity]) => quantity > 0)
    .sort(([left], [right]) => left.localeCompare(right));
  const parsedBudget = Number(budget);
  const parsedDaysLeft = Number(daysLeft);
  const isValid = budget !== ''
    && daysLeft !== ''
    && !Number.isNaN(parsedBudget)
    && !Number.isNaN(parsedDaysLeft)
    && parsedBudget >= 0
    && parsedDaysLeft > 0;

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
            Tell us your current food situation
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            JiMAT+ estimates how far your pantry and budget can stretch.
          </p>
          <p className="text-xs text-muted-foreground/70 mb-8">
            Add quantities when you can for better accuracy.
          </p>
        </motion.div>

        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-primary" />
            </div>
            <label className="font-label text-muted-foreground">Remaining Budget (RM)</label>
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

        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-accent" />
            </div>
            <label className="font-label text-muted-foreground">Days Left Until Next Allowance</label>
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

        <motion.div
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
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
                className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  dietary === option.value
                    ? 'bg-primary/10 text-primary border-primary/25 shadow-sm'
                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:border-border/50'
                }`}
              >
                <span>{option.label}</span>
                <span className="text-[11px] uppercase tracking-wide">{option.emoji}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          custom={4}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-8 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-status-tight/10 flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-status-tight" />
            </div>
            <label className="font-label text-muted-foreground">What Do You Still Have At Home?</label>
          </div>
          <p className="text-xs text-muted-foreground/60 mb-2 ml-9">
            Tap items to add them, then adjust quantity.
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4 ml-9">
            Counts like `3 eggs` improve the estimate. If you only list an item once, the app assumes a small student-sized amount.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {COMMON_ITEMS.map(item => {
              const quantity = pantryCounts[item] ?? 0;

              return (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => incrementItem(item)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors border font-medium ${
                    quantity > 0
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted border-border/30'
                  }`}
                >
                  {quantity > 0 ? `${item} x${quantity}` : `+ ${item}`}
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentItem}
              onChange={event => setCurrentItem(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && addCustomItem()}
              placeholder="Add custom item, e.g. bananas"
              className="flex-1 bg-muted/40 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-border/30"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={addCustomItem}
              className="gradient-warm text-primary-foreground p-2.5 rounded-xl shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <AnimatePresence>
            {pantryEntries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {pantryEntries.map(([item, quantity]) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 bg-primary/5 border border-primary/10 rounded-xl"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">{item}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Submitted as {quantity > 1 ? `${quantity} ${item}` : item}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementItem(item)}
                        className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                        aria-label={`Decrease ${item}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-sm font-semibold text-foreground min-w-5 text-center">{quantity}</span>
                      <button
                        onClick={() => incrementItem(item)}
                        className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-colors flex items-center justify-center"
                        aria-label={`Increase ${item}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemQuantity(item, 0)}
                        className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
                        aria-label={`Remove ${item}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {pantryEntries.length === 0 && (
            <p className="text-xs text-muted-foreground/50 italic text-center py-2">
              No items added yet - that&apos;s okay, JiMAT+ can still estimate from budget only
            </p>
          )}
        </motion.div>

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
          Generate My JiMAT+ Plan
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default InputFlow;
