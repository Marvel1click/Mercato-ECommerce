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
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-terracotta-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love for later</p>
          <Button onClick={() => onNavigate('products')}>Explore Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">{items.length} saved items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-soft overflow-hidden group"
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
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <p className="text-sm text-olive-600 font-medium">{product.brand}</p>
                <h3
                  className="font-medium text-gray-900 mt-1 cursor-pointer hover:text-terracotta-600 line-clamp-2"
                  onClick={() => onNavigate(`product/${product.slug}`)}
                >
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <Rating value={product.rating} size="sm" />
                  <span className="text-xs text-gray-500">({product.review_count})</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-gray-900">
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
                    Move to Cart
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
