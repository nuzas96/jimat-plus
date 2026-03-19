import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Clock, Leaf, Minus, Package, Plus, Wallet, X } from 'lucide-react';
import { DietaryPreference, UserInput } from '@/lib/types';

interface InputFlowProps {
  onSubmit: (input: UserInput) => void;
  onBack: () => void;
}

const COMMON_ITEMS = ['rice', 'eggs', 'onion', 'instant noodles', 'bread', 'sardines', 'tofu', 'cabbage', 'soy sauce'];
const DIETARY_OPTIONS: Array<{ value: DietaryPreference; label: string }> = [
  { value: 'no-preference', label: 'No Preference' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'halal-friendly', label: 'Halal-Friendly' },
  { value: 'low-cost-only', label: 'Low-Cost Only' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
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

const STEP_LABELS = ['Budget', 'Timeline', 'Diet', 'Pantry'];

const InputFlow = ({ onSubmit, onBack }: InputFlowProps) => {
  const [budget, setBudget] = useState('');
  const [daysLeft, setDaysLeft] = useState('');
  const [dietary, setDietary] = useState<DietaryPreference>('no-preference');
  const [pantryCounts, setPantryCounts] = useState<Record<string, number>>({});
  const [currentItem, setCurrentItem] = useState('');

  const setItemQuantity = (item: string, nextQuantity: number) => {
    const normalizedItem = normalizeItemLabel(item);
    if (!normalizedItem) return;
    setPantryCounts(previous => {
      if (nextQuantity <= 0) {
        const { [normalizedItem]: _removed, ...remaining } = previous;
        return remaining;
      }
      return { ...previous, [normalizedItem]: nextQuantity };
    });
  };

  const incrementItem = (item: string) => {
    const normalizedItem = normalizeItemLabel(item);
    if (!normalizedItem) return;
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
    if (!normalizedItem) return;
    incrementItem(normalizedItem);
    setCurrentItem('');
  };

  const handleSubmit = () => {
    const parsedBudget = Number(budget);
    const parsedDaysLeft = Number(daysLeft);
    if (budget === '' || daysLeft === '' || Number.isNaN(parsedBudget) || Number.isNaN(parsedDaysLeft) || parsedBudget < 0 || parsedDaysLeft <= 0) return;
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
  const isValid = budget !== '' && daysLeft !== '' && !Number.isNaN(parsedBudget) && !Number.isNaN(parsedDaysLeft) && parsedBudget >= 0 && parsedDaysLeft > 0;

  const filledSteps = [budget !== '', daysLeft !== '', true, pantryEntries.length > 0];
  const completedCount = filledSteps.filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/[0.04] rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full relative z-10"
      >
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${i < completedCount ? 'gradient-warm' : 'bg-border'}`} />
              <span className={`text-[10px] mt-1.5 block tracking-wider uppercase font-display ${i < completedCount ? 'text-primary' : 'text-muted-foreground/40'}`}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
            Your current situation
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            JiMAT+ estimates how far your pantry and budget can stretch.
          </p>
        </motion.div>

        {/* Budget */}
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <label className="font-label text-muted-foreground">Remaining Budget</label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/50 font-mono text-lg">RM</span>
            <input
              type="number"
              value={budget}
              onChange={event => setBudget(event.target.value)}
              placeholder="20"
              className="flex-1 bg-transparent font-mono text-3xl text-foreground outline-none placeholder:text-muted-foreground/20 focus:ring-0 rounded-lg px-1 py-1 transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground/50 mt-2">How much do you have left for food?</p>
        </motion.div>

        {/* Days */}
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-accent/[0.08] border border-accent/15 flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <label className="font-label text-muted-foreground">Days Until Next Allowance</label>
          </div>
          <input
            type="number"
            value={daysLeft}
            onChange={event => setDaysLeft(event.target.value)}
            placeholder="3"
            className="w-full bg-transparent font-mono text-3xl text-foreground outline-none placeholder:text-muted-foreground/20 focus:ring-0 rounded-lg px-1 py-1 transition-all"
          />
          <p className="text-xs text-muted-foreground/50 mt-2">How many days do you need to survive?</p>
        </motion.div>

        {/* Dietary */}
        <motion.div
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-3 border border-border"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-status-safe/[0.08] border border-status-safe/15 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-status-safe" />
            </div>
            <label className="font-label text-muted-foreground">Dietary Preference</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DIETARY_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setDietary(option.value)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border font-display ${
                  dietary === option.value
                    ? 'bg-primary/[0.08] text-primary border-primary/25 shadow-sm'
                    : 'bg-secondary text-muted-foreground border-border hover:border-muted-foreground/25'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pantry */}
        <motion.div
          custom={4}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-card p-5 rounded-2xl shadow-card mb-8 border border-border"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-accent/[0.08] border border-accent/15 flex items-center justify-center">
              <Package className="w-4 h-4 text-accent" />
            </div>
            <label className="font-label text-muted-foreground">What&apos;s In Your Pantry?</label>
          </div>
          <p className="text-xs text-muted-foreground/50 mb-4 ml-[46px]">
            Tap items to add. Adjust quantity for better accuracy.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMMON_ITEMS.map(item => {
              const quantity = pantryCounts[item] ?? 0;
              return (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => incrementItem(item)}
                  className={`px-3 py-1.5 text-xs rounded-xl transition-all duration-200 border font-medium ${
                    quantity > 0
                      ? 'bg-primary/[0.1] text-primary border-primary/25 shadow-sm'
                      : 'bg-secondary text-muted-foreground border-border hover:border-muted-foreground/25'
                  }`}
                >
                  {quantity > 0 ? `${item} ×${quantity}` : `+ ${item}`}
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
              placeholder="Add custom item..."
              className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/15 transition-all border border-border placeholder:text-muted-foreground/30"
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
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-primary/[0.04] border border-primary/10 rounded-xl"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">{item}</p>
                      <p className="text-[11px] text-muted-foreground/50">
                        {quantity > 1 ? `${quantity} ${item}` : item}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => decrementItem(item)}
                        className="w-7 h-7 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center border border-border"
                        aria-label={`Decrease ${item}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-sm font-bold text-foreground min-w-5 text-center">{quantity}</span>
                      <button
                        onClick={() => incrementItem(item)}
                        className="w-7 h-7 rounded-lg bg-primary/[0.08] text-primary hover:bg-primary/[0.15] transition-colors flex items-center justify-center border border-primary/15"
                        aria-label={`Increase ${item}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setItemQuantity(item, 0)}
                        className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
                        aria-label={`Remove ${item}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {pantryEntries.length === 0 && (
            <p className="text-xs text-muted-foreground/40 italic text-center py-2">
              No items yet — JiMAT+ can still estimate from budget alone
            </p>
          )}
        </motion.div>

        <motion.button
          custom={5}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-bold shadow-glow transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none font-display"
        >
          Analyze My Situation
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default InputFlow;
