import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const sizes = {
    sm: {
      button: 'w-7 h-7',
      icon: 'w-3 h-3',
      input: 'w-10 text-sm',
    },
    md: {
      button: 'w-10 h-10',
      icon: 'w-4 h-4',
      input: 'w-14 text-base',
    },
  };

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-stone-300 bg-white">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`${sizes[size].button} flex items-center justify-center transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-50`}
        aria-label="Decrease quantity"
      >
        <Minus className={sizes[size].icon} />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || min;
          onChange(Math.min(Math.max(newValue, min), max));
        }}
        min={min}
        max={max}
        className={`${sizes[size].input} border-x border-stone-300 bg-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`${sizes[size].button} flex items-center justify-center transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-50`}
        aria-label="Increase quantity"
      >
        <Plus className={sizes[size].icon} />
      </button>
    </div>
  );
}
