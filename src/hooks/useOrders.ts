import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    setOrders((data as OrderWithItems[]) || []);
    setLoading(false);
  }

  return { orders, loading, refetch: fetchOrders };
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  async function fetchOrder() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .eq('user_id', user!.id)
      .maybeSingle();

    setOrder(data as OrderWithItems | null);
    setLoading(false);
  }

  return { order, loading };
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { items, subtotal, shipping, tax, discount, total, clearCart } = useCart();

  async function createOrder(
    shippingAddress: Record<string, string>,
    paymentMethod: string,
    shippingMethod: string
  ): Promise<Order | null> {
    if (!user) {
      setError('Must be logged in to place order');
      return null;
    }

    if (items.length === 0) {
      setError('Cart is empty');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const orderNumber = `MRC-${Date.now().toString(36).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          subtotal,
          shipping_cost: shipping,
          tax,
          discount,
          total,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          payment_status: 'paid',
          shipping_method: shippingMethod,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0] || null,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createOrder, loading, error };
}
