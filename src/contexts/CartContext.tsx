import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Product, CartItem, Coupon } from '../types/database';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; coupon: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'TOGGLE_CART'; isOpen?: boolean }
  | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextType {
  items: CartItem[];
  coupon: Coupon | null;
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  toggleCart: (isOpen?: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mercato_cart';
const FREE_SHIPPING_THRESHOLD = 75;
const TAX_RATE = 0.08;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + (action.quantity || 1),
        };
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity || 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.productId),
      };

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== action.productId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null };

    case 'APPLY_COUPON':
      return { ...state, coupon: action.coupon };

    case 'REMOVE_COUPON':
      return { ...state, coupon: null };

    case 'TOGGLE_CART':
      return { ...state, isOpen: action.isOpen ?? !state.isOpen };

    case 'LOAD_CART':
      return { ...state, items: action.items };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    coupon: null,
    isOpen: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        dispatch({ type: 'LOAD_CART', items });
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount = state.coupon
    ? state.coupon.discount_type === 'percentage'
      ? subtotal * (state.coupon.discount_value / 100)
      : Math.min(state.coupon.discount_value, subtotal)
    : 0;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + shipping + tax;

  const value: CartContextType = {
    items: state.items,
    coupon: state.coupon,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    addItem: (product, quantity) => dispatch({ type: 'ADD_ITEM', product, quantity }),
    removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
    updateQuantity: (productId, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    applyCoupon: (coupon) => dispatch({ type: 'APPLY_COUPON', coupon }),
    removeCoupon: () => dispatch({ type: 'REMOVE_COUPON' }),
    toggleCart: (isOpen) => dispatch({ type: 'TOGGLE_CART', isOpen }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
