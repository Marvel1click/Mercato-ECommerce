import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useUI } from '../../contexts/UIContext';
import QuantitySelector from '../ui/QuantitySelector';
import Button from '../ui/Button';

interface CartSlideOutProps {
  onNavigate: (page: string) => void;
}

export default function CartSlideOut({ onNavigate }: CartSlideOutProps) {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, subtotal, shipping, total } =
    useCart();
  const { showToast } = useUI();

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId);
    showToast(`${productName} removed from cart`);
  };

  const handleCheckout = () => {
    toggleCart(false);
    onNavigate('checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-wine-950/70 backdrop-blur-sm animate-fade-in"
        onClick={() => toggleCart(false)}
      />

      <aside className="fixed right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-strong animate-slide-in-right" aria-label="Shopping cart">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-wine-950">Market bag <span className="text-stone-400">({items.length})</span></h2>
          </div>
          <button
            onClick={() => toggleCart(false)}
            className="rounded-full border border-stone-200 bg-white p-2 transition-colors hover:bg-stone-100"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cream-200 text-terracotta-700"><ShoppingBag className="h-8 w-8" /></div>
            <h3 className="font-display text-3xl font-semibold text-wine-950">
              Your market bag is empty
            </h3>
            <p className="mb-7 mt-2 max-w-xs text-sm leading-6 text-stone-500">
              Discover pantry treasures, handmade ceramics and gifts from across Italy.
            </p>
            <Button onClick={() => {
              toggleCart(false);
              onNavigate('products');
            }}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-soft">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-cream-100">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="truncate font-display text-lg font-semibold text-wine-950">
                        {item.product.name}
                      </h4>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta-700">{item.product.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.product.id, qty)}
                          max={item.product.stock}
                          size="sm"
                        />
                        <span className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="self-start rounded-full p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-stone-200 bg-white p-6 shadow-[0_-12px_32px_-24px_rgba(46,18,25,0.4)]">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-olive-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal < 75 && (
                  <p className="text-sm text-terracotta-600">
                    Add ${(75 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between border-t border-stone-200 pt-3 font-display text-2xl font-semibold text-wine-950">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="w-full">
                Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <button
                onClick={() => {
                  toggleCart(false);
                  onNavigate('products');
                }}
                className="w-full text-center text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
