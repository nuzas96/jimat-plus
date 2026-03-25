import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Minus, Plus, X } from 'lucide-react';
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
    const n = normalizeItemLabel(item);
    if (!n) return;
    setPantryCounts(prev => {
      if (nextQuantity <= 0) {
        const { [n]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [n]: nextQuantity };
    });
  };

  const incrementItem = (item: string) => {
    const n = normalizeItemLabel(item);
    if (!n) return;
    setPantryCounts(prev => ({ ...prev, [n]: Math.min((prev[n] ?? 0) + 1, 9) }));
  };

  const decrementItem = (item: string) => {
    const q = pantryCounts[normalizeItemLabel(item)] ?? 0;
    setItemQuantity(item, q - 1);
  };

  const addCustomItem = () => {
    const n = normalizeItemLabel(currentItem);
    if (!n) return;
    incrementItem(n);
    setCurrentItem('');
  };

  const handleSubmit = () => {
    const b = Number(budget);
    const d = Number(daysLeft);
    if (budget === '' || daysLeft === '' || Number.isNaN(b) || Number.isNaN(d) || b < 0 || d <= 0) return;
    onSubmit({ budget: b, daysLeft: d, dietaryPreference: dietary, pantryItems: buildPantryPayload(pantryCounts) });
  };

  const pantryEntries = Object.entries(pantryCounts).filter(([, q]) => q > 0).sort(([a], [b]) => a.localeCompare(b));
  const b = Number(budget);
  const d = Number(daysLeft);
  const isValid = budget !== '' && daysLeft !== '' && !Number.isNaN(b) && !Number.isNaN(d) && b >= 0 && d > 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg w-full">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <span className="font-mono text-xs text-primary tracking-[0.2em] uppercase block mb-2">Survival Check-In</span>
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-1">What's your situation?</h2>
          <p className="text-sm text-muted-foreground mb-8">We'll estimate how far your food and budget can stretch.</p>
        </motion.div>

        {/* Budget */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-5 mb-3"
        >
          <label className="font-label text-muted-foreground mb-3 block">Remaining Budget</label>
          <div className="flex items-baseline gap-2">
            <span className="text-muted-foreground font-mono text-sm">RM</span>
            <input
              type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="20"
              className="flex-1 bg-transparent font-mono text-3xl font-bold text-foreground outline-none placeholder:text-muted-foreground/20"
            />
          </div>
          <p className="text-xs text-muted-foreground/50 mt-2">How much money do you have left for food?</p>
        </motion.div>

        {/* Days */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border p-5 mb-3"
        >
          <label className="font-label text-muted-foreground mb-3 block">Days Until Next Allowance</label>
          <input
            type="number" value={daysLeft} onChange={e => setDaysLeft(e.target.value)} placeholder="3"
            className="w-full bg-transparent font-mono text-3xl font-bold text-foreground outline-none placeholder:text-muted-foreground/20"
          />
          <p className="text-xs text-muted-foreground/50 mt-2">How many days do you need to get through?</p>
        </motion.div>

        {/* Dietary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-5 mb-3"
        >
          <label className="font-label text-muted-foreground mb-3 block">Dietary Preference</label>
          <div className="grid grid-cols-2 gap-2">
            {DIETARY_OPTIONS.map(opt => (
              <button
                key={opt.value} onClick={() => setDietary(opt.value)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  dietary === opt.value
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'bg-secondary text-secondary-foreground border-border hover:border-muted-foreground/30'
                }`}
              >{opt.label}</button>
            ))}
          </div>
        </motion.div>

        {/* Pantry */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card rounded-xl border border-border p-5 mb-8"
        >
          <label className="font-label text-muted-foreground mb-1 block">What Do You Still Have?</label>
          <p className="text-xs text-muted-foreground/50 mb-4">Tap items to add. Adjust quantity for better accuracy.</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {COMMON_ITEMS.map(item => {
              const qty = pantryCounts[item] ?? 0;
              return (
                <motion.button
                  key={item} whileTap={{ scale: 0.95 }} onClick={() => incrementItem(item)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all border font-medium ${
                    qty > 0
                      ? 'bg-primary/15 text-primary border-primary/25'
                      : 'bg-secondary text-muted-foreground border-border hover:border-muted-foreground/30'
                  }`}
                >
                  {qty > 0 ? `${item} ×${qty}` : `+ ${item}`}
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text" value={currentItem} onChange={e => setCurrentItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomItem()}
              placeholder="Add custom item..."
              className="flex-1 bg-secondary rounded-lg px-4 py-2.5 text-sm text-foreground outline-none border border-border focus:border-primary/40 transition-colors"
            />
            <motion.button whileTap={{ scale: 0.95 }} onClick={addCustomItem}
              className="gradient-warm text-primary-foreground p-2.5 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <AnimatePresence>
            {pantryEntries.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                {pantryEntries.map(([item, qty]) => (
                  <motion.div key={item} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 bg-primary/5 border border-primary/10 rounded-lg"
                  >
                    <p className="text-sm font-medium text-foreground capitalize">{item}</p>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => decrementItem(item)} className="w-7 h-7 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-sm font-bold text-foreground min-w-5 text-center">{qty}</span>
                      <button onClick={() => incrementItem(item)} className="w-7 h-7 rounded-md bg-primary/15 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => setItemQuantity(item, 0)} className="w-7 h-7 rounded-md text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center">
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

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} disabled={!isValid}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-glow transition-all disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Generate My JiMAT+ Plan
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default InputFlow;
