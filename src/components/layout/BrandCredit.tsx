import { ArrowUpRight } from 'lucide-react';

interface BrandCreditProps {
  compact?: boolean;
}

export default function BrandCredit({ compact = false }: BrandCreditProps) {
  return (
    <div
      className={
        compact
          ? 'border-t border-stone-200 bg-cream-50 px-4 py-5 text-center'
          : 'border-t border-white/10 py-5'
      }
    >
      <p
        className={`flex items-center justify-center gap-1.5 text-xs font-medium tracking-wide ${
          compact ? 'text-stone-500' : 'text-stone-500'
        }`}
      >
        Made by
        <a
          href="https://digitalmarvels.tech"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-semibold underline decoration-1 underline-offset-4 transition ${
            compact
              ? 'text-wine-900 decoration-terracotta-300 hover:text-terracotta-700'
              : 'text-stone-200 decoration-stone-600 hover:text-terracotta-300'
          }`}
          aria-label="Visit Digital Marvels (opens in a new tab)"
        >
          Digital Marvels
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
