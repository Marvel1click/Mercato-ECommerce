import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Product, Category } from "../types/database";

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  minRating?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
}

interface UseProductsOptions {
  filters?: ProductFilters;
  sort?: "price_asc" | "price_desc" | "newest" | "rating" | "popularity";
  limit?: number;
  featured?: boolean;
  isNew?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("products").select("*", { count: "exact" });

      if (options.featured) {
        query = query.eq("is_featured", true);
      }

      if (options.isNew) {
        query = query.eq("is_new", true);
      }

      if (options.filters?.category) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", options.filters.category)
          .maybeSingle();

        if (category) {
          query = query.eq("category_id", (category as any).id);
        }
      }

      if (options.filters?.minPrice !== undefined) {
        query = query.gte("price", options.filters.minPrice);
      }

      if (options.filters?.maxPrice !== undefined) {
        query = query.lte("price", options.filters.maxPrice);
      }

      if (options.filters?.brands?.length) {
        query = query.in("brand", options.filters.brands);
      }

      if (options.filters?.minRating !== undefined) {
        query = query.gte("rating", options.filters.minRating);
      }

      if (options.filters?.inStock) {
        query = query.gt("stock", 0);
      }

      if (options.filters?.search) {
        query = query.or(
          `name.ilike.%${options.filters.search}%,description.ilike.%${options.filters.search}%,brand.ilike.%${options.filters.search}%`
        );
      }

      switch (options.sort) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
        case "popularity":
          query = query.order("review_count", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to mock data:", err);
      const { MOCK_PRODUCTS } = await import("../lib/mockData");

      let filtered = [...MOCK_PRODUCTS];
      if (options.featured) filtered = filtered.filter((p) => p.is_featured);
      if (options.isNew) filtered = filtered.filter((p) => p.is_new);
      if (options.limit) filtered = filtered.slice(0, options.limit);

      setProducts(filtered);
      setTotalCount(filtered.length);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [
    options.featured,
    options.isNew,
    options.filters,
    options.sort,
    options.limit,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, totalCount, refetch: fetchProducts };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (queryError) throw queryError;

        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error: queryError } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order");

        if (queryError) throw queryError;

        setCategories(data || []);
      } catch (err) {
        console.warn(
          "Supabase fetch failed for categories, falling back to mock data:",
          err
        );
        const { MOCK_CATEGORIES } = await import("../lib/mockData");
        setCategories(MOCK_CATEGORIES);
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const mainCategories = categories.filter((c) => !c.parent_id);
  const getSubcategories = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);

  return { categories, mainCategories, getSubcategories, loading, error };
}

export function useRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", categoryId)
          .neq("id", productId)
          .limit(limit);

        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [productId, categoryId, limit]);

  return { products, loading };
}

export function useBrands() {
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      const { data } = await supabase
        .from("products")
        .select("brand")
        .not("brand", "is", null);

      if (data) {
        const uniqueBrands = [
          ...new Set(data.map((p: any) => p.brand).filter(Boolean)),
        ] as string[];
        setBrands(uniqueBrands.sort());
      }
    }

    fetchBrands();
  }, []);

  return brands;
}
