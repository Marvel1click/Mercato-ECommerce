import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Coupon } from '../types/database';

export function useCoupons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function validateCoupon(code: string, orderAmount: number): Promise<Coupon | null> {
    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (queryError) throw queryError;

      if (!data) {
        setError('Invalid coupon code');
        return null;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('This coupon has expired');
        return null;
      }

      if (data.max_uses && data.used_count >= data.max_uses) {
        setError('This coupon has reached its usage limit');
        return null;
      }

      if (data.min_order_amount && orderAmount < data.min_order_amount) {
        setError(`Minimum order amount of $${data.min_order_amount.toFixed(2)} required`);
        return null;
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate coupon');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { validateCoupon, loading, error, clearError: () => setError(null) };
}
