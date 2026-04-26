import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, Review } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

interface ReviewWithProfile extends Review {
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setReviews(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const addReview = async (rating: number, title: string, content: string) => {
    if (!user) throw new Error('Must be logged in to review');

    const reviewData: ReviewInsert = {
      product_id: productId,
      user_id: user.id,
      rating,
      title,
      content,
    };

    const { error: insertError } = await supabase
      .from('reviews')
      .insert(reviewData as never);

    if (insertError) throw insertError;
    await fetchReviews();
  };

  const voteHelpful = async (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    await supabase
      .from('reviews')
      .update(({ helpful_votes: review.helpful_votes + 1 } satisfies ReviewUpdate) as never)
      .eq('id', reviewId);

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpful_votes: r.helpful_votes + 1 } : r
      )
    );
  };

  const ratingBreakdown = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    loading,
    error,
    addReview,
    voteHelpful,
    ratingBreakdown,
    averageRating,
    totalReviews: reviews.length,
    refetch: fetchReviews,
  };
}
