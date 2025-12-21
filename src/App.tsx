import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { UIProvider } from "./contexts/UIContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartSlideOut from "./components/cart/CartSlideOut";
import AuthModal from "./components/auth/AuthModal";
import QuickViewModal from "./components/product/QuickViewModal";
import ToastContainer from "./components/ui/Toast";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";

type PageType =
  | "home"
  | "products"
  | "product"
  | "checkout"
  | "wishlist"
  | "account";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [pageParams, setPageParams] = useState<string>("");
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams()
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, pageParams]);

  const navigate = (path: string) => {
    const [page, ...rest] = path.split("/");
    const params = rest.join("/");

    if (page.includes("?")) {
      const [basePage, queryString] = page.split("?");
      setCurrentPage((basePage as PageType) || "home");
      setSearchParams(new URLSearchParams(queryString));
      setPageParams("");
    } else if (params.includes("?")) {
      const [paramPath, queryString] = params.split("?");
      setCurrentPage(page as PageType);
      setPageParams(paramPath);
      setSearchParams(new URLSearchParams(queryString));
    } else {
      setCurrentPage((page as PageType) || "home");
      setPageParams(params);
      setSearchParams(new URLSearchParams());
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "products":
        return (
          <ProductsPage onNavigate={navigate} searchParams={searchParams} />
        );
      case "product":
        return <ProductDetailPage slug={pageParams} onNavigate={navigate} />;
      case "checkout":
        return <CheckoutPage onNavigate={navigate} />;
      case "wishlist":
        return <WishlistPage onNavigate={navigate} />;
      case "account":
        return <AccountPage onNavigate={navigate} section={pageParams} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const showHeaderFooter = currentPage !== "checkout";

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && (
        <Header currentPage={currentPage} onNavigate={navigate} />
      )}
      <main className="flex-1">{renderPage()}</main>
      {showHeaderFooter && <Footer onNavigate={navigate} />}
      <CartSlideOut onNavigate={navigate} />
      <AuthModal />
      <QuickViewModal onNavigate={navigate} />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <UIProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </UIProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
