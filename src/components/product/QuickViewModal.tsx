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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
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
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
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
          <div className="flex flex-wrap gap-2 mb-2">
            {quickViewProduct.is_new && <Badge variant="info">New</Badge>}
            {discount > 0 && <Badge variant="error">-{discount}% OFF</Badge>}
          </div>

          <p className="text-olive-600 font-medium">{quickViewProduct.brand}</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{quickViewProduct.name}</h2>

          <div className="flex items-center gap-2 mt-3">
            <Rating value={quickViewProduct.rating} />
            <span className="text-sm text-gray-500">
              ({quickViewProduct.review_count} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-gray-900">
              ${quickViewProduct.price.toFixed(2)}
            </span>
            {quickViewProduct.original_price && (
              <span className="text-lg text-gray-400 line-through">
                ${quickViewProduct.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-600 mt-4 line-clamp-3">
            {quickViewProduct.short_description || quickViewProduct.description}
          </p>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {quickViewProduct.stock} in stock
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
              className={`p-3 rounded-lg border-2 transition-colors ${
                isWishlisted
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleViewDetails}
            className="w-full mt-3 text-center text-terracotta-600 hover:text-terracotta-700 font-medium"
          >
            View Full Details
          </button>
        </div>
      </div>
    </Modal>
  );
}
