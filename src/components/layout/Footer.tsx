import { useState } from 'react';
import {
  ArrowRight,
  CreditCard,
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Twitter,
} from 'lucide-react';
import Button from '../ui/Button';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const shopLinks = [
  { label: 'Shop all', path: 'products' },
  { label: 'Gourmet foods', path: 'products?category=gourmet-foods' },
  { label: 'Kitchen & dining', path: 'products?category=kitchen-dining' },
  { label: 'Home decor', path: 'products?category=home-decor' },
  { label: 'Gift collections', path: 'products?category=gift-collections' },
];

const serviceLinks = [
  'Shipping information',
  'Returns and exchanges',
  'Track order',
  'Wholesale inquiries',
  'Customer support',
];

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="container-custom py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1.15fr]">
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-3 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-stone-950 transition group-hover:bg-terracotta-200">
                <Leaf className="h-5 w-5" />
              </div>
              <span>
                <span className="block text-xl font-extrabold uppercase tracking-[0.22em] text-white">
                  Mercato
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                  Italian artisan goods
                </span>
              </span>
            </button>

            <p className="mt-6 max-w-sm text-sm leading-7 text-stone-400">
              A premium ecommerce experience for Italian pantry staples,
              handmade tableware, and gift-ready collections.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-stone-400 transition hover:border-terracotta-400 hover:bg-terracotta-600 hover:text-white"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Shop
            </h3>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.path)}
                    className="text-sm text-stone-400 transition hover:text-terracotta-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Support
            </h3>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <button className="text-sm text-stone-400 transition hover:text-terracotta-300">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Market notes
            </h3>
            {subscribed ? (
              <div className="mt-5 rounded-lg border border-olive-400/30 bg-olive-500/10 p-4 text-sm text-olive-200">
                You are subscribed. Watch your inbox for seasonal edits.
              </div>
            ) : (
              <>
                <p className="mt-4 text-sm leading-6 text-stone-400">
                  Monthly product edits, hosting ideas, and first access to
                  limited maker drops.
                </p>
                <form onSubmit={handleSubscribe} className="mt-5 space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="h-12 w-full rounded-lg border border-white/10 bg-stone-900 px-4 text-white outline-none transition placeholder:text-stone-500 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/30"
                    required
                  />
                  <Button type="submit" className="w-full bg-white text-stone-950 hover:bg-terracotta-100">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </>
            )}

            <div className="mt-7 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-terracotta-300" />
                <span>Florence, Italy</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-terracotta-300" />
                <span>hello@mercato.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-terracotta-300" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 text-sm text-stone-500 md:flex-row">
          <p>2026 Mercato. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-olive-300" />
            <span>Secure checkout and protected customer data</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Secure payments</span>
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
