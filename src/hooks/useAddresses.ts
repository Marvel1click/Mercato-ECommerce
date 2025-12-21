import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Address } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
      setLoading(false);
    }
  }, [user]);

  async function fetchAddresses() {
    setLoading(true);
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user!.id)
      .order('is_default', { ascending: false });

    setAddresses(data || []);
    setLoading(false);
  }

  async function addAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at'>) {
    if (!user) return null;

    if (address.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        ...address,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      await fetchAddresses();
    }

    return { data, error };
  }

  async function updateAddress(id: string, updates: Partial<Address>) {
    if (!user) return null;

    if (updates.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error) {
      await fetchAddresses();
    }

    return { data, error };
  }

  async function deleteAddress(id: string) {
    if (!user) return;

    await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    await fetchAddresses();
  }

  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];

  return {
    addresses,
    loading,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    refetch: fetchAddresses,
  };
}
