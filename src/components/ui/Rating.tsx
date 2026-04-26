import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export default function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
}: RatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const filled = index < Math.floor(value);
        const partial = index === Math.floor(value) && value % 1 > 0;

        const star = (
          <>
            <Star
              className={`${sizes[size]} ${
                filled ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
              }`}
            />
            {partial && (
              <Star
                className={`${sizes[size]} absolute inset-0 fill-amber-400 text-amber-400`}
                style={{
                  clipPath: `inset(0 ${100 - (value % 1) * 100}% 0 0)`,
                }}
              />
            )}
          </>
        );

        return interactive ? (
          <button
            key={index}
            type="button"
            onClick={() => onChange?.(index + 1)}
            className="relative cursor-pointer transition-transform hover:scale-110"
            aria-label={`${index + 1} star${index === 0 ? '' : 's'}`}
          >
            {star}
          </button>
        ) : (
          <span key={index} className="relative" aria-hidden="true">
            {star}
          </span>
        );
      })}
      {showValue && (
        <span className={`ml-1 text-gray-600 ${textSizes[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
