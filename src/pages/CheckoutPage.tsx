import { useState } from 'react';
import { Check, CreditCard, Truck, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAddresses } from '../hooks/useAddresses';
import { useCreateOrder } from '../hooks/useOrders';
import { useCoupons } from '../hooks/useCoupons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

const shippingOptions = [
  { id: 'standard', name: 'Standard Shipping', price: 9.99, days: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 19.99, days: '2-3 business days' },
  { id: 'overnight', name: 'Overnight Shipping', price: 29.99, days: '1 business day' },
];

const steps = [
  { id: 1, name: 'Shipping' },
  { id: 2, name: 'Payment' },
  { id: 3, name: 'Review' },
];

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, subtotal, discount, tax, total, coupon, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  const { showToast, setAuthModalOpen } = useUI();
  const { defaultAddress } = useAddresses();
  const { createOrder, loading: orderLoading, error: orderError } = useCreateOrder();
  const { validateCoupon, loading: couponLoading, error: couponError, clearError } = useCoupons();

  const [currentStep, setCurrentStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingForm, setShippingForm] = useState({
    firstName: defaultAddress?.first_name || '',
    lastName: defaultAddress?.last_name || '',
    email: user?.email || '',
    phone: defaultAddress?.phone || '',
    street: defaultAddress?.street || '',
    apartment: defaultAddress?.apartment || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zipCode: defaultAddress?.zip_code || '',
    country: 'United States',
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
  });

  const shippingCost = subtotal >= 75 ? 0 : selectedShipping.price;
  const finalTotal = subtotal - discount + shippingCost + tax;

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to proceed to checkout</p>
          <Button onClick={() => onNavigate('products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    clearError();
    const validCoupon = await validateCoupon(couponCode, subtotal);
    if (validCoupon) {
      applyCoupon(validCoupon);
      setCouponCode('');
      showToast('Coupon applied successfully');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const shippingAddress = {
      first_name: shippingForm.firstName,
      last_name: shippingForm.lastName,
      street: shippingForm.street,
      apartment: shippingForm.apartment,
      city: shippingForm.city,
      state: shippingForm.state,
      zip_code: shippingForm.zipCode,
      country: shippingForm.country,
      phone: shippingForm.phone,
    };

    const order = await createOrder(
      shippingAddress,
      'Credit Card',
      selectedShipping.name
    );

    if (order) {
      setOrderNumber(order.order_number);
      setOrderComplete(true);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-cream-50 py-16">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-olive-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've sent a confirmation email to{' '}
              {shippingForm.email}
            </p>
            <div className="bg-cream-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => onNavigate('account/orders')}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => onNavigate('home')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shopping
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
                    currentStep > step.id
                      ? 'bg-olive-500 text-white'
                      : currentStep === step.id
                      ? 'bg-terracotta-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span
                  className={`ml-2 font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 md:w-24 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-olive-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={shippingForm.firstName}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Last Name"
                    value={shippingForm.lastName}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, lastName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, email: e.target.value })
                    }
                    className="col-span-2"
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, phone: e.target.value })
                    }
                    className="col-span-2"
                  />
                  <Input
                    label="Street Address"
                    value={shippingForm.street}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, street: e.target.value })
                    }
                    className="col-span-2"
                    required
                  />
                  <Input
                    label="Apartment, suite, etc. (optional)"
                    value={shippingForm.apartment}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, apartment: e.target.value })
                    }
                    className="col-span-2"
                  />
                  <Input
                    label="City"
                    value={shippingForm.city}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, city: e.target.value })
                    }
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="State"
                      value={shippingForm.state}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, state: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="ZIP Code"
                      value={shippingForm.zipCode}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, zipCode: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Shipping Method
                  </h3>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedShipping.id === option.id
                            ? 'border-terracotta-500 bg-terracotta-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping.id === option.id}
                            onChange={() => setSelectedShipping(option)}
                            className="w-4 h-4 text-terracotta-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{option.name}</p>
                            <p className="text-sm text-gray-500">{option.days}</p>
                          </div>
                        </div>
                        <span className="font-medium">
                          {subtotal >= 75 && option.id === 'standard'
                            ? 'Free'
                            : `$${option.price.toFixed(2)}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={() => setCurrentStep(2)}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    value={paymentForm.cardNumber}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, cardNumber: e.target.value })
                    }
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={paymentForm.expiry}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, expiry: e.target.value })
                      }
                      placeholder="MM/YY"
                    />
                    <Input
                      label="CVC"
                      value={paymentForm.cvc}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, cvc: e.target.value })
                      }
                      placeholder="123"
                    />
                  </div>
                  <Input
                    label="Name on Card"
                    value={paymentForm.nameOnCard}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, nameOnCard: e.target.value })
                    }
                  />
                </div>

                <div className="mt-8 flex gap-4 justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Review Your Order
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Shipping Address
                      </h3>
                      <p className="text-gray-600">
                        {shippingForm.firstName} {shippingForm.lastName}
                        <br />
                        {shippingForm.street}
                        {shippingForm.apartment && <>, {shippingForm.apartment}</>}
                        <br />
                        {shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}
                        <br />
                        {shippingForm.country}
                      </p>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-terracotta-600 mt-2"
                      >
                        Edit
                      </button>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                      </h3>
                      <p className="text-gray-600">
                        Credit Card ending in{' '}
                        {paymentForm.cardNumber.slice(-4) || '****'}
                      </p>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-terracotta-600 mt-2"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {orderError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {orderError}
                  </div>
                )}

                <div className="flex gap-4 justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handlePlaceOrder} loading={orderLoading} size="lg">
                    Place Order - ${finalTotal.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                    </div>
                    <span className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                {!coupon && (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyCoupon}
                      loading={couponLoading}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="text-sm text-red-500">{couponError}</p>
                )}

                {coupon && (
                  <div className="flex justify-between items-center bg-olive-50 p-2 rounded">
                    <span className="text-sm text-olive-700">
                      {coupon.code} applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-sm text-olive-600 hover:text-olive-700"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-olive-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-olive-600">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
