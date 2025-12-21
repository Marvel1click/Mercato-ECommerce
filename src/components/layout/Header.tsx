import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
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
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="bg-terracotta-500 text-white text-sm py-2">
        <div className="container-custom text-center">
          Free shipping on orders over $75 | Use code WELCOME10 for 10% off
        </div>
      </div>

      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-terracotta-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:block">
              Mercato
            </span>
          </button>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-terracotta-500 text-white rounded-full hover:bg-terracotta-600 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onNavigate("wishlist")}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => toggleCart(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta-500 text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={() => onNavigate("account")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>

        <nav className="hidden lg:flex items-center justify-center border-t border-gray-100 py-3">
          <button
            onClick={() => onNavigate("home")}
            className={`px-4 py-2 font-medium transition-colors ${
              currentPage === "home"
                ? "text-terracotta-600"
                : "text-gray-700 hover:text-terracotta-600"
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
              className={`flex items-center gap-1 px-4 py-2 font-medium transition-colors ${
                currentPage.startsWith("products")
                  ? "text-terracotta-600"
                  : "text-gray-700 hover:text-terracotta-600"
              }`}
            >
              Shop
              <ChevronDown className="w-4 h-4" />
            </button>

            {isMegaMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                <div className="bg-white rounded-xl shadow-strong p-6 min-w-[600px] animate-fade-in">
                  <div className="grid grid-cols-4 gap-8">
                    {mainCategories.map((category) => (
                      <div key={category.id}>
                        <button
                          onClick={() => {
                            onNavigate(`products?category=${category.slug}`);
                            setMegaMenuOpen(false);
                          }}
                          className="font-semibold text-gray-900 hover:text-terracotta-600 transition-colors"
                        >
                          {category.name}
                        </button>
                        <ul className="mt-3 space-y-2">
                          {getSubcategories(category.id).map((sub) => (
                            <li key={sub.id}>
                              <button
                                onClick={() => {
                                  onNavigate(`products?category=${sub.slug}`);
                                  setMegaMenuOpen(false);
                                }}
                                className="text-sm text-gray-600 hover:text-terracotta-600 transition-colors"
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <button
                      onClick={() => {
                        onNavigate("products");
                        setMegaMenuOpen(false);
                      }}
                      className="text-terracotta-600 font-medium hover:text-terracotta-700"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate("products?featured=true")}
            className="px-4 py-2 font-medium text-gray-700 hover:text-terracotta-600 transition-colors"
          >
            Featured
          </button>

          <button
            onClick={() => onNavigate("products?new=true")}
            className="px-4 py-2 font-medium text-gray-700 hover:text-terracotta-600 transition-colors"
          >
            New Arrivals
          </button>

          <button
            onClick={() => onNavigate("products?category=gift-collections")}
            className="px-4 py-2 font-medium text-gray-700 hover:text-terracotta-600 transition-colors"
          >
            Gifts
          </button>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[105px] bg-white z-50 overflow-y-auto animate-fade-in">
          <div className="container-custom py-6">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-terracotta-500 text-white rounded-lg"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <nav className="space-y-1">
              <button
                onClick={() => {
                  onNavigate("home");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate("products");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                All Products
              </button>
              {mainCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onNavigate(`products?category=${category.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
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
                  className="w-full text-left px-4 py-3 font-medium text-terracotta-600 hover:bg-terracotta-50 rounded-lg"
                >
                  Sign In / Register
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
