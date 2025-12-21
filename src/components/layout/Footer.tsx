import { useState } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  CreditCard,
} from 'lucide-react';
import Button from '../ui/Button';

interface FooterProps {
  onNavigate: (page: string) => void;
}

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
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-terracotta-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-white">Mercato</span>
            </div>
            <p className="text-gray-400 mb-6">
              Bringing the finest Italian artisan products to your doorstep.
              Quality ingredients and craftsmanship from the heart of Italy.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-terracotta-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-terracotta-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-terracotta-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Shop All
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products?category=gourmet-foods')}
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Gourmet Foods
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products?category=kitchen-dining')}
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Kitchen & Dining
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products?category=home-decor')}
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Home Decor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products?category=gift-collections')}
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Gift Collections
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <button className="hover:text-terracotta-400 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="hover:text-terracotta-400 transition-colors">
                  Shipping Information
                </button>
              </li>
              <li>
                <button className="hover:text-terracotta-400 transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button className="hover:text-terracotta-400 transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button className="hover:text-terracotta-400 transition-colors">
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Newsletter</h3>
            {subscribed ? (
              <div className="bg-olive-500/20 text-olive-300 p-4 rounded-lg">
                Thank you for subscribing! Check your email for exclusive offers.
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-4">
                  Subscribe for exclusive offers, recipes, and Italian living inspiration.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    required
                  />
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                </form>
              </>
            )}

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-terracotta-400" />
                <span>Florence, Italy</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-terracotta-400" />
                <span>hello@mercato.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-terracotta-400" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              2024 Mercato. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Secure Payments</span>
              <div className="flex gap-2">
                <div className="bg-gray-800 p-2 rounded">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
