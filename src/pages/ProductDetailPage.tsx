import { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Share2,
  Minus,
  Plus,
  Check,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
} from 'lucide-react';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import { useReviews } from '../hooks/useReviews';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: string) => void;
}

export default function ProductDetailPage({ slug, onNavigate }: ProductDetailPageProps) {
  const { product, loading: productLoading } = useProduct(slug);
  const { reviews, ratingBreakdown, addReview, voteHelpful, loading: reviewsLoading } =
    useReviews(product?.id || '');
  const { products: relatedProducts } = useRelatedProducts(
    product?.id || '',
    product?.category_id || null
  );
  const { addItem, toggleCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast, setAuthModalOpen } = useUI();
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'shipping'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  if (productLoading) {
    return (
      <div className="container-custom py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => onNavigate('products')}>Browse Products</Button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`${product.name} added to cart`);
    toggleCart(true);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.short_description || product.name,
      url: window.location.href,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Product link copied');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      showToast('Unable to share this product', 'error');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview(reviewForm.rating, reviewForm.title, reviewForm.content);
      setReviewForm({ rating: 5, title: '', content: '' });
      showToast('Review submitted successfully');
    } catch {
      showToast('Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="border-b border-stone-200 bg-white/70">
        <div className="container-custom py-4">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-terracotta-700"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to the market
          </button>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-4">
            <div
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[2rem] border border-stone-200 bg-cream-100 shadow-soft"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-150' : ''
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                    : undefined
                }
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-terracotta-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.is_new && <Badge variant="info">New Arrival</Badge>}
              {discount > 0 && <Badge variant="error">-{discount}% OFF</Badge>}
              {product.stock === 0 && <Badge variant="warning">Out of Stock</Badge>}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="warning">Only {product.stock} left</Badge>
              )}
            </div>

            <p className="eyebrow">{product.brand}</p>
            <h1 className="editorial-title mt-3 text-5xl md:text-6xl">{product.name}</h1>

            <div className="flex items-center gap-3 mt-4">
              <Rating value={product.rating} showValue />
              <span className="text-sm text-stone-500">({product.review_count} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mt-6">
              <span className="font-display text-5xl font-semibold text-wine-950">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-6 text-base leading-8 text-stone-600">
              {product.short_description || product.description?.slice(0, 200)}
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p className="eyebrow mb-2">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center overflow-hidden rounded-full border border-stone-300 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-stone-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-stone-100"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-stone-500">
                    {product.stock} available
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <button
                  onClick={handleWishlist}
                  className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors ${
                    isWishlisted
                      ? 'border-wine-900 bg-wine-900 text-white'
                      : 'border-stone-300 bg-white hover:border-terracotta-400 hover:text-terracotta-700'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button onClick={handleShare} className="flex h-14 w-14 items-center justify-center rounded-full border border-stone-300 bg-white transition-colors hover:border-terracotta-400 hover:text-terracotta-700" aria-label="Share product">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
                <Truck className="w-5 h-5 text-olive-600" />
                <div className="text-sm">
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-gray-500">Over $75</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
                <RotateCcw className="w-5 h-5 text-olive-600" />
                <div className="text-sm">
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-gray-500">30 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
                <Shield className="w-5 h-5 text-olive-600" />
                <div className="text-sm">
                  <p className="font-medium">Secure</p>
                  <p className="text-gray-500">Payment</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>SKU: {product.sku}</p>
            </div>
          </div>
        </div>

        <div className="surface-card mt-16 overflow-hidden p-5 md:p-8">
          <div className="overflow-x-auto border-b border-stone-200">
            <nav className="flex min-w-max gap-7">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${product.review_count})` },
                { id: 'shipping', label: 'Shipping' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-4 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-terracotta-600'
                      : 'text-stone-600 hover:text-wine-950'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta-500" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8 md:py-10">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-xl">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-3 text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 font-medium text-gray-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="rounded-2xl border border-stone-200 bg-cream-50 p-6">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-gray-900">
                        {product.rating.toFixed(1)}
                      </div>
                      <Rating value={product.rating} size="lg" />
                      <p className="text-gray-500 mt-2">
                        Based on {product.review_count} reviews
                      </p>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm w-8">{star} star</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{
                                width: `${
                                  product.review_count > 0
                                    ? (ratingBreakdown[star as keyof typeof ratingBreakdown] /
                                        product.review_count) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-8">
                            {ratingBreakdown[star as keyof typeof ratingBreakdown]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-4 font-display text-2xl font-semibold text-wine-950">Write a review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating
                        </label>
                        <Rating
                          value={reviewForm.rating}
                          interactive
                          onChange={(value) =>
                            setReviewForm({ ...reviewForm, rating: value })
                          }
                          size="lg"
                        />
                      </div>
                      <Input
                        label="Title"
                        value={reviewForm.title}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, title: e.target.value })
                        }
                        placeholder="Sum it up"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Review
                        </label>
                        <textarea
                          value={reviewForm.content}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, content: e.target.value })
                          }
                          rows={4}
                          className="input-field resize-none"
                          placeholder="Share your experience..."
                        />
                      </div>
                      <Button type="submit" loading={isSubmittingReview} className="w-full">
                        Submit Review
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {reviewsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 h-32 rounded-lg" />
                      ))}
                    </div>
                  ) : reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <Rating value={review.rating} size="sm" />
                            <h4 className="font-medium text-gray-900 mt-1">
                              {review.title || 'Great product!'}
                            </h4>
                          </div>
                          {review.is_verified_purchase && (
                            <Badge variant="success" size="sm">
                              <Check className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mt-2">{review.content}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{review.profiles?.full_name || 'Customer'}</span>
                            <span>|</span>
                            <span>
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => voteHelpful(review.id)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Helpful ({review.helpful_votes})
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Shipping Information
                  </h3>
                  <p className="text-gray-600">
                    We ship to all 50 US states. International shipping is available
                    to select countries.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Delivery Times
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Standard Shipping (5-7 business days)</span>
                      <span className="font-medium">$9.99</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Express Shipping (2-3 business days)</span>
                      <span className="font-medium">$19.99</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Overnight Shipping (1 business day)</span>
                      <span className="font-medium">$29.99</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-olive-600 font-medium">
                    Free standard shipping on orders over $75!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <p className="section-kicker">Complete the table</p>
            <h2 className="editorial-title mb-8 mt-3 text-4xl md:text-5xl">
              You may also love
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onNavigate={(s) => onNavigate(`product/${s}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
