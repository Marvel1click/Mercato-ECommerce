import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Leaf,
  PackageCheck,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import { useCategories } from "../../hooks/useProducts";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { label: "Featured", path: "products?featured=true" },
  { label: "New", path: "products?new=true" },
  { label: "Gifts", path: "products?category=gift-collections" },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { setMobileMenuOpen, isMobileMenuOpen, setAuthModalOpen } = useUI();
  const { mainCategories, getSubcategories } = useCategories();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`products?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const navigateAndClose = (path: string) => {
    onNavigate(path);
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-stone-200 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-sm backdrop-blur-xl"
          : "bg-white/90 backdrop-blur"
      }`}
    >
      <div className="bg-terracotta-700 text-xs font-semibold text-white">
        <div className="container-custom flex min-h-8 items-center justify-center gap-3 py-2 text-center sm:justify-between">
          <span className="hidden items-center gap-2 sm:inline-flex">
            <PackageCheck className="h-4 w-4" />
            Free shipping on orders $75+
          </span>
          <span className="inline-flex items-center gap-2">
            Handpicked in Italy, delivered to your door
          </span>
          <button
            onClick={() => onNavigate("products")}
            className="hidden items-center gap-1 border-b border-white/50 pb-0.5 transition hover:border-white md:inline-flex"
          >
            Shop now
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex items-center justify-between gap-4 py-4">
          <button
            className="rounded-lg p-2 text-stone-800 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-500 lg:hidden"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={() => navigateAndClose("home")}
            className="group flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-4"
            aria-label="Go to Mercato homepage"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-950 text-white shadow-sm transition group-hover:bg-terracotta-700">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="hidden sm:block">
              <span className="block text-xl font-extrabold uppercase tracking-[0.22em] text-stone-950">
                Mercato
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Italian artisan goods
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            <button
              onClick={() => navigateAndClose("home")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                currentPage === "home"
                  ? "bg-cream-100 text-terracotta-700"
                  : "text-stone-700 hover:bg-stone-100 hover:text-stone-950"
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
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  currentPage === "products"
                    ? "bg-cream-100 text-terracotta-700"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                }`}
              >
                Shop
                <ChevronDown className="h-4 w-4" />
              </button>

              {isMegaMenuOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
                  <div className="min-w-[760px] rounded-lg border border-stone-200 bg-white p-5 shadow-strong animate-fade-in">
                    <div className="grid grid-cols-4 gap-4">
                      {mainCategories.map((category) => (
                        <div
                          key={category.id}
                          className="rounded-lg border border-stone-200 p-3"
                        >
                          <button
                            onClick={() =>
                              navigateAndClose(`products?category=${category.slug}`)
                            }
                            className="group block w-full text-left"
                          >
                            <img
                              src={category.image || ""}
                              alt={category.name}
                              className="mb-3 h-24 w-full rounded-md object-cover"
                            />
                            <span className="font-semibold text-stone-950 transition group-hover:text-terracotta-700">
                              {category.name}
                            </span>
                          </button>
                          <ul className="mt-3 space-y-2">
                            {getSubcategories(category.id).slice(0, 4).map((sub) => (
                              <li key={sub.id}>
                                <button
                                  onClick={() =>
                                    navigateAndClose(`products?category=${sub.slug}`)
                                  }
                                  className="text-sm text-stone-500 transition hover:text-terracotta-700"
                                >
                                  {sub.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
                      <p className="text-sm text-stone-500">
                        Curated products, premium gifting, and a faster route to
                        checkout.
                      </p>
                      <button
                        onClick={() => navigateAndClose("products")}
                        className="font-semibold text-terracotta-700 transition hover:text-terracotta-900"
                      >
                        View all products
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
                className="rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden flex-1 md:block md:max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Mercato"
                className="h-11 w-full rounded-lg border border-stone-300 bg-white pl-4 pr-11 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-200"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-stone-600 transition hover:bg-stone-100 hover:text-terracotta-700"
                aria-label="Search products"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigateAndClose("wishlist")}
              className="relative rounded-lg p-2 text-stone-800 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              aria-label="Open wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta-600 px-1 text-[11px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => toggleCart(true)}
              className="relative rounded-lg p-2 text-stone-800 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta-600 px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={() => navigateAndClose("account")}
                className="rounded-lg p-2 text-stone-800 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                aria-label="Open account"
              >
                <User className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden h-10 items-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-terracotta-700 hover:shadow-medium sm:flex"
              >
                <User className="h-4 w-4" />
                Account
              </button>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-112px)] overflow-y-auto border-t border-stone-200 bg-white shadow-strong lg:hidden animate-fade-in">
          <div className="container-custom py-6">
            <form onSubmit={handleSearch} className="mb-5">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products"
                  className="h-12 w-full rounded-lg border border-stone-300 bg-white pl-4 pr-12 outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-terracotta-600 text-white"
                  aria-label="Search products"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <nav className="space-y-1">
              <button
                onClick={() => navigateAndClose("home")}
                className="w-full rounded-lg px-4 py-3 text-left font-semibold text-stone-950 transition hover:bg-stone-100"
              >
                Home
              </button>
              <button
                onClick={() => navigateAndClose("products")}
                className="w-full rounded-lg px-4 py-3 text-left font-semibold text-stone-950 transition hover:bg-stone-100"
              >
                All products
              </button>
              {mainCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigateAndClose(`products?category=${category.slug}`)}
                  className="w-full rounded-lg px-4 py-3 text-left font-semibold text-stone-950 transition hover:bg-stone-100"
                >
                  {category.name}
                </button>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-lg px-4 py-3 text-left font-semibold text-terracotta-700 transition hover:bg-terracotta-50"
                >
                  Sign in or register
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
