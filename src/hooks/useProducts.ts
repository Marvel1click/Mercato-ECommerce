import { useState, useEffect, useCallback, useMemo } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
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
  const { filters, sort, limit, featured, isNew } = options;
  const filterKey = JSON.stringify(filters ?? {});
  const stableFilters = useMemo<ProductFilters>(
    () => JSON.parse(filterKey),
    [filterKey]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const loadMockProducts = async (sourceError?: unknown) => {
      if (sourceError) {
        console.warn("Supabase fetch failed, falling back to mock data:", sourceError);
      }

      const { MOCK_PRODUCTS, MOCK_CATEGORIES } = await import("../lib/mockData");

      let filtered = [...MOCK_PRODUCTS];
      if (featured) filtered = filtered.filter((p) => p.is_featured);
      if (isNew) filtered = filtered.filter((p) => p.is_new);

      if (stableFilters?.category) {
        const category = MOCK_CATEGORIES.find((c) => c.slug === stableFilters.category);
        if (category) filtered = filtered.filter((p) => p.category_id === category.id);
      }

      if (stableFilters?.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= stableFilters.minPrice!);
      }

      if (stableFilters?.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= stableFilters.maxPrice!);
      }

      if (stableFilters?.brands?.length) {
        filtered = filtered.filter((p) => p.brand && stableFilters.brands!.includes(p.brand));
      }

      if (stableFilters?.minRating !== undefined) {
        filtered = filtered.filter((p) => p.rating >= stableFilters.minRating!);
      }

      if (stableFilters?.inStock) {
        filtered = filtered.filter((p) => p.stock > 0);
      }

      if (stableFilters?.search) {
        const search = stableFilters.search.toLowerCase();
        filtered = filtered.filter((p) =>
          [p.name, p.description, p.short_description, p.brand, ...p.tags]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(search))
        );
      }

      switch (sort) {
        case "price_asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "popularity":
          filtered.sort((a, b) => b.review_count - a.review_count);
          break;
        case "newest":
        default:
          filtered.sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }

      setTotalCount(filtered.length);
      if (limit) filtered = filtered.slice(0, limit);

      setProducts(filtered);
      setError(
        sourceError instanceof Error ? sourceError.message : sourceError ? "Failed to fetch products" : null
      );
    };

    try {
      if (!isSupabaseConfigured) {
        await loadMockProducts();
        return;
      }

      let query = supabase.from("products").select("*", { count: "exact" });

      if (featured) {
        query = query.eq("is_featured", true);
      }

      if (isNew) {
        query = query.eq("is_new", true);
      }

      if (stableFilters?.category) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", stableFilters.category)
          .maybeSingle();

        const categoryRow = category as unknown as { id: string } | null;
        if (categoryRow) {
          query = query.eq("category_id", categoryRow.id);
        }
      }

      if (stableFilters?.minPrice !== undefined) {
        query = query.gte("price", stableFilters.minPrice);
      }

      if (stableFilters?.maxPrice !== undefined) {
        query = query.lte("price", stableFilters.maxPrice);
      }

      if (stableFilters?.brands?.length) {
        query = query.in("brand", stableFilters.brands);
      }

      if (stableFilters?.minRating !== undefined) {
        query = query.gte("rating", stableFilters.minRating);
      }

      if (stableFilters?.inStock) {
        query = query.gt("stock", 0);
      }

      if (stableFilters?.search) {
        query = query.or(
          `name.ilike.%${stableFilters.search}%,description.ilike.%${stableFilters.search}%,brand.ilike.%${stableFilters.search}%`
        );
      }

      switch (sort) {
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

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      await loadMockProducts(err);
    } finally {
      setLoading(false);
    }
  }, [featured, isNew, stableFilters, sort, limit]);

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
        if (!isSupabaseConfigured) {
          const { MOCK_PRODUCTS } = await import("../lib/mockData");
          setProduct(MOCK_PRODUCTS.find((p) => p.slug === slug) || null);
          return;
        }

        const { data, error: queryError } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

      if (queryError) throw queryError;

        if (data) {
          setProduct(data);
        } else {
          const { MOCK_PRODUCTS } = await import("../lib/mockData");
          setProduct(MOCK_PRODUCTS.find((p) => p.slug === slug) || null);
        }
      } catch (err) {
        const { MOCK_PRODUCTS } = await import("../lib/mockData");
        setProduct(MOCK_PRODUCTS.find((p) => p.slug === slug) || null);
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
        if (!isSupabaseConfigured) {
          const { MOCK_CATEGORIES } = await import("../lib/mockData");
          setCategories(MOCK_CATEGORIES);
          return;
        }

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
        if (!isSupabaseConfigured) {
          const { MOCK_PRODUCTS } = await import("../lib/mockData");
          setProducts(
            MOCK_PRODUCTS.filter(
              (product) =>
                product.category_id === categoryId && product.id !== productId
            ).slice(0, limit)
          );
          return;
        }

        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", categoryId)
          .neq("id", productId)
          .limit(limit);

        setProducts(data || []);
      } catch {
        const { MOCK_PRODUCTS } = await import("../lib/mockData");
        setProducts(
          MOCK_PRODUCTS.filter(
            (product) =>
              product.category_id === categoryId && product.id !== productId
          ).slice(0, limit)
        );
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
      try {
        if (!isSupabaseConfigured) {
          const { MOCK_PRODUCTS } = await import("../lib/mockData");
          const uniqueBrands = [
            ...new Set(MOCK_PRODUCTS.map((p) => p.brand).filter(Boolean)),
          ] as string[];
          setBrands(uniqueBrands.sort());
          return;
        }

        const { data } = await supabase
          .from("products")
          .select("brand")
          .not("brand", "is", null);

        if (data) {
          const brandRows = data as unknown as Array<{ brand: string | null }>;
          const uniqueBrands = [
            ...new Set(brandRows.map((p) => p.brand).filter(Boolean)),
          ] as string[];
          setBrands(uniqueBrands.sort());
        }
      } catch {
        const { MOCK_PRODUCTS } = await import("../lib/mockData");
        const uniqueBrands = [
          ...new Set(MOCK_PRODUCTS.map((p) => p.brand).filter(Boolean)),
        ] as string[];
        setBrands(uniqueBrands.sort());
      }
    }

    fetchBrands();
  }, []);

  return brands;
}
