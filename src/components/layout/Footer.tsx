import { useState } from 'react';
import {
  ArrowRight,
  CreditCard,
  Leaf,
  Mail,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import Button from '../ui/Button';
import BrandCredit from './BrandCredit';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const shopLinks = [
  { label: 'Shop everything', path: 'products' },
  { label: 'The pantry', path: 'products?category=gourmet-foods' },
  { label: 'Table & kitchen', path: 'products?category=kitchen-dining' },
  { label: 'Objects for home', path: 'products?category=home-decor' },
  { label: 'The gift edit', path: 'products?category=gift-collections' },
];

const helpLinks = [
  { label: 'Our story', path: 'info/story' },
  { label: 'Shipping information', path: 'info/shipping' },
  { label: 'Returns & exchanges', path: 'info/returns' },
  { label: 'Frequently asked questions', path: 'info/faq' },
  { label: 'Customer care', path: 'info/contact' },
];

const promises = [
  { icon: PackageCheck, label: 'Gift-ready wrapping' },
  { icon: ShieldCheck, label: 'Protected checkout' },
  { icon: CreditCard, label: 'Secure payments' },
];

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="overflow-hidden bg-wine-950 text-stone-300">
      <div className="border-b border-white/10 bg-terracotta-700 text-white">
        <div className="container-custom grid gap-px sm:grid-cols-3">
          {promises.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-center gap-3 border-white/15 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] sm:border-r sm:last:border-r-0">
                <Icon className="h-4 w-4 text-cream-100" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="container-custom py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.1fr_0.65fr_0.8fr_1.15fr] lg:gap-12">
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-3 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-4 focus:ring-offset-wine-950"
            >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-wine-950 transition group-hover:rotate-[-5deg] group-hover:bg-terracotta-200">
                <Leaf className="h-5 w-5" />
                <span className="absolute inset-1.5 rounded-full border border-wine-950/20" />
              </span>
              <span>
                <span className="block font-display text-3xl font-semibold leading-none text-white">Mercato</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-stone-500">Bottega Italiana</span>
              </span>
            </button>

            <p className="mt-7 max-w-md font-display text-2xl font-medium leading-8 text-cream-100">
              Beautiful things for generous tables and well-lived homes.
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-stone-400">
              A considered collection of Italian pantry staples, tableware and gifts, sourced from independent makers and family workshops.
            </p>

            <div className="mt-7 space-y-3 text-sm text-stone-400">
              <a href="mailto:hello@mercato.com" className="flex w-fit items-center gap-3 transition hover:text-terracotta-300">
                <Mail className="h-4 w-4" /> hello@mercato.com
              </a>
              <span className="flex items-center gap-3"><MapPin className="h-4 w-4" /> Florence, Italy</span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-terracotta-300">Here to help</p>
            <ul className="mt-6 space-y-3.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.path)} className="group inline-flex items-center gap-2 text-left text-sm text-stone-300 transition hover:text-white">
                    <span className="h-px w-0 bg-terracotta-300 transition-all group-hover:w-4" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-terracotta-300">Visit the market</p>
            <ul className="mt-6 space-y-3.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.path)} className="group inline-flex items-center gap-2 text-sm text-stone-300 transition hover:text-white">
                    <span className="h-px w-0 bg-terracotta-300 transition-all group-hover:w-4" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-terracotta-300">Letters from Italy</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-none text-white">A little beauty, once a month.</h2>
            <p className="mt-4 text-sm leading-6 text-stone-400">Seasonal recipes, maker stories and first access to limited collections.</p>

            {subscribed ? (
              <div className="mt-6 rounded-2xl border border-olive-400/30 bg-olive-500/10 p-4 text-sm text-olive-200" role="status">
                Benvenuto. Your first market letter is on its way.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="footer-email">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="min-h-12 flex-1 rounded-full border border-white/15 bg-wine-900 px-5 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-300/30"
                  required
                />
                <Button type="submit" className="bg-cream-100 text-wine-950 hover:bg-terracotta-200">
                  Join <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
            <p className="mt-3 text-xs text-stone-500">No clutter. Unsubscribe whenever you like.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-5 text-xs text-stone-500 sm:flex-row">
          <p>© 2026 Mercato. All rights reserved.</p>
          <p>Italian goods, thoughtfully gathered.</p>
        </div>
      </div>
      <BrandCredit />
    </footer>
  );
}
