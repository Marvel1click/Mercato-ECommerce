import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Leaf,
  Menu,
  PackageCheck,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { useCategories } from '../../hooks/useProducts';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { label: 'New arrivals', path: 'products?new=true' },
  { label: 'Best sellers', path: 'products?featured=true' },
  { label: 'The gift edit', path: 'products?category=gift-collections' },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { setMobileMenuOpen, isMobileMenuOpen, setAuthModalOpen } = useUI();
  const { mainCategories, getSubcategories } = useCategories();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate(`products?search=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  const navigateAndClose = (path: string) => {
    onNavigate(path);
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const actionButtonClass =
    'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-wine-950 transition hover:-translate-y-0.5 hover:border-terracotta-300 hover:text-terracotta-700 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-terracotta-500';

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-stone-200/90 bg-cream-50/95 shadow-soft backdrop-blur-xl'
          : 'border-stone-200/70 bg-cream-50/90 backdrop-blur'
      }`}
    >
      <div className="bg-wine-950 text-cream-100">
        <div className="container-custom flex min-h-9 items-center justify-center gap-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] sm:justify-between">
          <span className="hidden items-center gap-2 sm:inline-flex">
            <PackageCheck className="h-3.5 w-3.5 text-terracotta-300" />
            Complimentary delivery over $75
          </span>
          <span>From Italian workshops to your table</span>
          <button
            onClick={() => navigateAndClose('products')}
            className="hidden items-center gap-1.5 text-terracotta-200 transition hover:text-white md:inline-flex"
          >
            Discover the market
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex h-[78px] items-center justify-between gap-3 lg:h-[88px]">
          <button
            className={`${actionButtonClass} lg:hidden`}
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={() => navigateAndClose('home')}
            className="group flex min-w-fit items-center gap-3 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-4"
            aria-label="Go to Mercato homepage"
          >
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-wine-950 text-cream-100 shadow-soft transition group-hover:rotate-[-5deg] group-hover:bg-terracotta-700">
              <Leaf className="h-5 w-5" />
              <span className="absolute inset-1.5 rounded-full border border-cream-100/25" />
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-[1.8rem] font-semibold leading-none tracking-[-0.03em] text-wine-950">Mercato</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-stone-500">Bottega Italiana</span>
            </span>
          </button>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            <button
              onClick={() => navigateAndClose('home')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                currentPage === 'home' ? 'bg-wine-950 text-white' : 'text-stone-700 hover:bg-white hover:text-wine-950'
              }`}
            >
              Home
            </button>

            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                onClick={() => setMegaMenuOpen(!isMegaMenuOpen)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  currentPage === 'products' ? 'bg-wine-950 text-white' : 'text-stone-700 hover:bg-white hover:text-wine-950'
                }`}
                aria-expanded={isMegaMenuOpen}
              >
                Shop
                <ChevronDown className={`h-4 w-4 transition ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMegaMenuOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-5">
                  <div className="min-w-[800px] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-cream-50 p-3 shadow-strong animate-fade-in">
                    <div className="grid grid-cols-4 gap-2">
                      {mainCategories.map((category) => (
                        <div key={category.id} className="rounded-2xl p-2 transition hover:bg-white">
                          <button
                            onClick={() => navigateAndClose(`products?category=${category.slug}`)}
                            className="group block w-full text-left"
                          >
                            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
                              <img
                                src={category.image || ''}
                                alt=""
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                              />
                            </div>
                            <span className="mt-3 block font-display text-xl font-semibold text-wine-950 transition group-hover:text-terracotta-700">{category.name}</span>
                          </button>
                          <ul className="mt-2 space-y-1.5">
                            {getSubcategories(category.id).slice(0, 3).map((sub) => (
                              <li key={sub.id}>
                                <button
                                  onClick={() => navigateAndClose(`products?category=${sub.slug}`)}
                                  className="text-xs text-stone-500 transition hover:text-terracotta-700"
                                >
                                  {sub.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="m-2 mt-3 flex items-center justify-between rounded-2xl bg-wine-950 px-5 py-4 text-cream-100">
                      <p className="font-display text-xl font-semibold">A slower, more beautiful way to shop.</p>
                      <button
                        onClick={() => navigateAndClose('products')}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-terracotta-200 hover:text-white"
                      >
                        Shop everything <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigateAndClose(item.path)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white hover:text-wine-950"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <form onSubmit={handleSearch} className="hidden xl:block">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search the market"
                  className="h-10 w-44 rounded-full border border-stone-200 bg-white/80 pl-4 pr-10 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:w-52 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-200"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-600 transition hover:bg-cream-100 hover:text-terracotta-700"
                  aria-label="Search products"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <button onClick={() => navigateAndClose('wishlist')} className={actionButtonClass} aria-label="Open wishlist">
              <Heart className="h-[18px] w-[18px]" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-600 px-1 text-[10px] font-bold text-white">{wishlistItems.length}</span>
              )}
            </button>

            <button onClick={() => toggleCart(true)} className={actionButtonClass} aria-label="Open shopping cart">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-600 px-1 text-[10px] font-bold text-white">{itemCount}</span>
              )}
            </button>

            <button
              onClick={() => (user ? navigateAndClose('account') : setAuthModalOpen(true))}
              className={`${actionButtonClass} hidden sm:inline-flex`}
              aria-label={user ? 'Open account' : 'Sign in'}
            >
              <User className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-112px)] overflow-y-auto border-t border-stone-200 bg-cream-50 shadow-strong lg:hidden animate-slide-down">
          <div className="container-custom py-6">
            <form onSubmit={handleSearch} className="mb-5">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="What are you looking for?"
                  className="h-12 w-full rounded-full border border-stone-300 bg-white pl-5 pr-12 outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-200"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-wine-950 text-white" aria-label="Search products">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <nav className="space-y-1" aria-label="Mobile navigation">
              {[{ label: 'Home', path: 'home' }, { label: 'Shop all', path: 'products' }, ...navItems].map((item) => (
                <button key={item.label} onClick={() => navigateAndClose(item.path)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-semibold text-wine-950 transition hover:bg-white">
                  {item.label}<ArrowRight className="h-4 w-4 text-terracotta-600" />
                </button>
              ))}
            </nav>

            <div className="my-5 h-px bg-stone-200" />
            <p className="eyebrow mb-3 px-4">Shop by department</p>
            <div className="grid grid-cols-2 gap-2">
              {mainCategories.map((category) => (
                <button key={category.id} onClick={() => navigateAndClose(`products?category=${category.slug}`)} className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-semibold text-stone-800">
                  {category.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (user) navigateAndClose('account');
                else { setAuthModalOpen(true); setMobileMenuOpen(false); }
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-wine-950 px-5 py-3 font-semibold text-white"
            >
              <User className="h-4 w-4" />
              {user ? 'My account' : 'Sign in or register'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
