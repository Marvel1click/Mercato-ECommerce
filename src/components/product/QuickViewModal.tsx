import { useState } from 'react';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import Modal from '../ui/Modal';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface QuickViewModalProps {
  onNavigate: (slug: string) => void;
}

export default function QuickViewModal({ onNavigate }: QuickViewModalProps) {
  const { quickViewProduct, setQuickViewProduct, showToast } = useUI();
  const { addItem, toggleCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);
  const discount = quickViewProduct.original_price
    ? Math.round((1 - quickViewProduct.price / quickViewProduct.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(quickViewProduct, quantity);
    showToast(`${quickViewProduct.name} added to cart`);
    toggleCart(true);
    setQuickViewProduct(null);
  };

  const handleWishlist = () => {
    toggleWishlist(quickViewProduct);
    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleViewDetails = () => {
    onNavigate(quickViewProduct.slug);
    setQuickViewProduct(null);
  };

  return (
    <Modal
      isOpen={!!quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
      size="xl"
    >
      <div className="grid gap-7 md:grid-cols-2 md:gap-9">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream-100">
            <img
              src={quickViewProduct.images[selectedImage]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {quickViewProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    selectedImage === index ? 'border-terracotta-500' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {quickViewProduct.is_new && <Badge variant="info">New</Badge>}
            {discount > 0 && <Badge variant="error">-{discount}% OFF</Badge>}
          </div>

          <p className="eyebrow">{quickViewProduct.brand}</p>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-none text-wine-950">{quickViewProduct.name}</h2>

          <div className="flex items-center gap-2 mt-3">
            <Rating value={quickViewProduct.rating} />
            <span className="text-sm text-stone-500">
              ({quickViewProduct.review_count} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-4xl font-semibold text-wine-950">
              ${quickViewProduct.price.toFixed(2)}
            </span>
            {quickViewProduct.original_price && (
              <span className="text-lg text-gray-400 line-through">
                ${quickViewProduct.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-stone-600">
            {quickViewProduct.short_description || quickViewProduct.description}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-600">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-full border border-stone-300 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-stone-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-stone-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-stone-500">
                {quickViewProduct.stock} in stock
              </span>
            </div>
          </div>

          <div className="mt-7 flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={quickViewProduct.stock === 0}
              className="flex-1"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <button
              onClick={handleWishlist}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                isWishlisted
                  ? 'border-wine-900 bg-wine-900 text-white'
                  : 'border-stone-300 bg-white hover:border-terracotta-400 hover:text-terracotta-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleViewDetails}
            className="mt-4 w-full text-center text-sm font-semibold text-terracotta-700 underline decoration-terracotta-200 underline-offset-4 transition hover:text-wine-950"
          >
            View Full Details
          </button>
        </div>
      </div>
    </Modal>
  );
}
