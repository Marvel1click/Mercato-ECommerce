import { useState } from 'react';
import { Check, CreditCard, Truck, ShoppingBag, ArrowLeft, Leaf, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useAddresses } from '../hooks/useAddresses';
import { useCreateOrder } from '../hooks/useOrders';
import { useCoupons } from '../hooks/useCoupons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
  const { items, subtotal, discount, tax, coupon, applyCoupon, removeCoupon } = useCart();
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
      <div className="paper-texture flex min-h-[70vh] items-center justify-center px-4">
        <div className="surface-card max-w-lg px-8 py-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-wine-950 text-cream-100"><ShoppingBag className="h-8 w-8" /></div>
          <p className="eyebrow">Your market bag</p>
          <h2 className="editorial-title mt-3 text-4xl">There is nothing to wrap just yet.</h2>
          <p className="mb-7 mt-4 text-sm leading-6 text-stone-500">Choose a few Italian favourites before heading to checkout.</p>
          <Button onClick={() => onNavigate('products')}>Return to the market</Button>
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
      <div className="paper-texture min-h-screen py-16">
        <div className="container-custom max-w-2xl">
          <div className="surface-card p-8 text-center md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-olive-100">
              <Check className="w-8 h-8 text-olive-600" />
            </div>
            <p className="eyebrow">Grazie mille</p>
            <h1 className="editorial-title mt-3 text-5xl">
              Your order is confirmed.
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've sent a confirmation email to{' '}
              {shippingForm.email}
            </p>
            <div className="mb-8 rounded-2xl border border-stone-200 bg-cream-50 p-4">
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
    <div className="page-shell">
      <div className="border-b border-stone-200 bg-white/80">
        <div className="container-custom flex items-center justify-between py-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-terracotta-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to shopping
          </button>
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2" aria-label="Mercato home">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-wine-950 text-cream-100"><Leaf className="h-4 w-4" /><span className="absolute inset-1 rounded-full border border-white/20" /></span>
            <span className="hidden font-display text-2xl font-semibold text-wine-950 sm:block">Mercato</span>
          </button>
          <span className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 sm:flex"><ShieldCheck className="h-4 w-4 text-olive-600" /> Secure checkout</span>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        <div className="mx-auto mb-10 max-w-4xl">
          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    currentStep > step.id
                      ? 'bg-olive-700 text-white'
                      : currentStep === step.id
                      ? 'bg-wine-950 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span
                  className={`text-xs font-medium sm:ml-2 sm:text-sm ${
                    currentStep >= step.id ? 'text-wine-950' : 'text-stone-400'
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 hidden h-0.5 w-16 sm:block md:w-24 ${
                      currentStep > step.id ? 'bg-olive-600' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="surface-card p-6 md:p-8">
                <p className="eyebrow">Step one</p>
                <h2 className="mb-7 mt-2 font-display text-3xl font-semibold text-wine-950">
                  Where should we send it?
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
                    containerClassName="col-span-2"
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, phone: e.target.value })
                    }
                    containerClassName="col-span-2"
                  />
                  <Input
                    label="Street Address"
                    value={shippingForm.street}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, street: e.target.value })
                    }
                    containerClassName="col-span-2"
                    required
                  />
                  <Input
                    label="Apartment, suite, etc. (optional)"
                    value={shippingForm.apartment}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, apartment: e.target.value })
                    }
                    containerClassName="col-span-2"
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
                  <h3 className="mb-4 font-display text-2xl font-semibold text-wine-950">
                    Choose a delivery pace
                  </h3>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors ${
                          selectedShipping.id === option.id
                            ? 'border-terracotta-500 bg-terracotta-50'
                            : 'border-stone-200 hover:border-terracotta-300'
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
              <div className="surface-card p-6 md:p-8">
                <p className="eyebrow">Step two</p>
                <h2 className="mb-7 mt-2 font-display text-3xl font-semibold text-wine-950">
                  Secure payment
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
                <div className="surface-card p-6 md:p-8">
                  <p className="eyebrow">Final step</p>
                  <h2 className="mb-5 mt-2 font-display text-3xl font-semibold text-wine-950">
                    One last look
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

                <div className="surface-card p-6 md:p-8">
                  <h3 className="mb-4 font-display text-2xl font-semibold text-wine-950">Your market bag</h3>
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
            <div className="surface-card sticky top-8 p-6">
              <p className="eyebrow">The details</p>
              <h3 className="mb-5 mt-2 font-display text-3xl font-semibold text-wine-950">Order summary</h3>

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
                      className="min-w-0 flex-1 rounded-full border border-stone-300 bg-cream-50 px-4 py-2 text-sm"
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
                <div className="flex justify-between border-t border-stone-200 pt-3 font-display text-2xl font-semibold text-wine-950">
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
