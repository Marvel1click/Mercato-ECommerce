import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useUI } from '../contexts/UIContext';
import Button from '../components/ui/Button';
import Rating from '../components/ui/Rating';

interface WishlistPageProps {
  onNavigate: (page: string) => void;
}

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addItem, toggleCart } = useCart();
  const { showToast } = useUI();

  const handleRemove = (product: typeof items[0]) => {
    removeFromWishlist(product.id);
    showToast('Removed from wishlist');
  };

  const handleMoveToCart = (product: typeof items[0]) => {
    addItem(product);
    removeFromWishlist(product.id);
    showToast(`${product.name} moved to cart`);
    toggleCart(true);
  };

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-terracotta-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="paper-texture flex min-h-[70vh] items-center justify-center px-4">
        <div className="surface-card max-w-lg px-8 py-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-wine-950 text-cream-100"><Heart className="h-8 w-8" /></div>
          <p className="eyebrow">Saved for later</p>
          <h2 className="editorial-title mt-3 text-4xl">Your wish list is waiting to be filled.</h2>
          <p className="mb-7 mt-4 text-sm leading-6 text-stone-500">Keep the pieces that catch your eye, then return whenever the table calls.</p>
          <Button onClick={() => onNavigate('products')}>Explore the market</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10 md:py-14">
      <div className="container-custom">
        <div className="mb-10">
          <p className="eyebrow">Your private edit</p>
          <h1 className="editorial-title mt-3 text-5xl md:text-7xl">Saved favourites</h1>
          <p className="mt-3 text-stone-600">{items.length} {items.length === 1 ? 'piece' : 'pieces'} waiting for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-strong"
            >
              <div
                className="aspect-square relative cursor-pointer"
                onClick={() => onNavigate(`product/${product.slug}`)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product);
                  }}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-stone-600 shadow-md transition-colors hover:bg-wine-900 hover:text-white"
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <p className="eyebrow">{product.brand}</p>
                <h3
                  className="mt-2 line-clamp-2 cursor-pointer font-display text-2xl font-semibold leading-6 text-wine-950 hover:text-terracotta-700"
                  onClick={() => onNavigate(`product/${product.slug}`)}
                >
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <Rating value={product.rating} size="sm" />
                  <span className="text-xs text-gray-500">({product.review_count})</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="font-display text-2xl font-semibold text-wine-950">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to bag
                  </Button>
                </div>

                {product.stock === 0 && (
                  <p className="text-sm text-red-500 mt-2 text-center">Out of Stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
