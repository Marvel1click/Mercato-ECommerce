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
        className="fixed inset-0 bg-black/50 animate-fade-in"
        onClick={() => toggleCart(false)}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-strong animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart ({items.length})</h2>
          <button
            onClick={() => toggleCart(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Discover our collection of artisan Italian products
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
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
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
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-6 space-y-4">
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
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
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
      </div>
    </div>
  );
}
