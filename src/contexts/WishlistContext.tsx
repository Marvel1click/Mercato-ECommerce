import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Product } from '../types/database';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface WishlistState {
  items: Product[];
  loading: boolean;
}

type WishlistAction =
  | { type: 'SET_ITEMS'; items: Product[] }
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'SET_LOADING'; loading: boolean };

interface WishlistContextType {
  items: Product[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'mercato_wishlist';

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.items };
    case 'ADD_ITEM':
      if (state.items.some((item) => item.id === action.product.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.product] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.productId) };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, { items: [], loading: false });

  useEffect(() => {
    if (user) {
      loadWishlistFromDb();
    } else {
      loadWishlistFromStorage();
    }
  }, [user]);

  async function loadWishlistFromDb() {
    dispatch({ type: 'SET_LOADING', loading: true });
    const { data } = await supabase
      .from('wishlists')
      .select('product_id, products(*)')
      .eq('user_id', user!.id);

    if (data) {
      const products = data
        .map((item) => item.products as unknown as Product)
        .filter(Boolean);
      dispatch({ type: 'SET_ITEMS', items: products });
    }
    dispatch({ type: 'SET_LOADING', loading: false });
  }

  function loadWishlistFromStorage() {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        dispatch({ type: 'SET_ITEMS', items });
      } catch {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
    }
  }

  function saveToStorage(items: Product[]) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }

  async function addToWishlist(product: Product) {
    if (user) {
      await supabase.from('wishlists').insert({
        user_id: user.id,
        product_id: product.id,
      });
    } else {
      const newItems = [...state.items, product];
      saveToStorage(newItems);
    }
    dispatch({ type: 'ADD_ITEM', product });
  }

  async function removeFromWishlist(productId: string) {
    if (user) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } else {
      const newItems = state.items.filter((item) => item.id !== productId);
      saveToStorage(newItems);
    }
    dispatch({ type: 'REMOVE_ITEM', productId });
  }

  function isInWishlist(productId: string) {
    return state.items.some((item) => item.id === productId);
  }

  async function toggleWishlist(product: Product) {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        loading: state.loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
