import { useState } from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types/database';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useUI } from '../../contexts/UIContext';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';

interface ProductCardProps {
  product: Product;
  onNavigate: (slug: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, toggleCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { setQuickViewProduct, showToast } = useUI();

  const isWishlisted = isInWishlist(product.id);
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`);
    toggleCart(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-soft overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
      onClick={() => onNavigate(product.slug)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && <Badge variant="info">New</Badge>}
          {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
          {product.stock === 0 && <Badge variant="warning">Out of Stock</Badge>}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 py-2.5 bg-terracotta-500 text-white font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-terracotta-600 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-olive-600 font-medium mb-1">{product.brand}</p>
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <Rating value={product.rating} size="sm" />
          <span className="text-xs text-gray-500">({product.review_count})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.original_price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.original_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
