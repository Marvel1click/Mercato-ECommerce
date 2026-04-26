import { useState } from 'react';
import { Heart, Eye, ShoppingCart, Plus } from 'lucide-react';
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
    <article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-terracotta-200 hover:shadow-medium focus-within:border-terracotta-300"
    >
      <div className="relative aspect-[4/4.15] overflow-hidden bg-stone-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-stone-200" />
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <button
          onClick={() => onNavigate(product.slug)}
          className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terracotta-500"
          aria-label={`View ${product.name}`}
        />

        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {product.is_new && <Badge variant="info" size="sm">New</Badge>}
          {discount > 0 && <Badge variant="error" size="sm">-{discount}%</Badge>}
          {product.stock === 0 && (
            <Badge variant="warning" size="sm">Out of stock</Badge>
          )}
        </div>

        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button
            onClick={handleWishlist}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition focus:outline-none focus:ring-2 focus:ring-terracotta-500 ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            aria-label="Open quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-olive-700">
            {product.brand}
          </p>
          {product.tags[0] && (
            <span className="hidden rounded-full bg-stone-100 px-2 py-1 text-[11px] font-semibold text-stone-500 sm:inline-flex">
              {product.tags[0]}
            </span>
          )}
        </div>

        <button
          onClick={() => onNavigate(product.slug)}
          className="min-h-[3rem] text-left text-sm font-semibold leading-6 text-stone-950 transition hover:text-terracotta-700 focus:outline-none focus:text-terracotta-700 sm:text-base"
        >
          {product.name}
        </button>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-stone-500">
          {product.short_description || product.description}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Rating value={product.rating} size="sm" />
          <span className="text-xs font-medium text-stone-500">
            ({product.review_count})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-950">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-sm text-stone-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Back soon'}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-terracotta-700 hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-300"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="hidden h-4 w-4 sm:block" />
            <Plus className="h-4 w-4 sm:hidden" />
          </button>
        </div>
      </div>
    </article>
  );
}
