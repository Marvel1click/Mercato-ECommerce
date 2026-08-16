import { useState, useMemo } from 'react';
import {
  Filter,
  X,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { useProducts, useCategories, useBrands } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Rating from '../components/ui/Rating';

interface ProductsPageProps {
  onNavigate: (page: string) => void;
  searchParams: URLSearchParams;
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popularity';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
];

export default function ProductsPage({ onNavigate, searchParams }: ProductsPageProps) {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStock, setInStock] = useState(false);

  const categorySlug = searchParams.get('category') || undefined;
  const searchQuery = searchParams.get('search') || undefined;
  const featured = searchParams.get('featured') === 'true';
  const isNew = searchParams.get('new') === 'true';

  const { products, loading, totalCount } = useProducts({
    filters: {
      category: categorySlug,
      search: searchQuery,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      minRating: minRating > 0 ? minRating : undefined,
      inStock: inStock || undefined,
    },
    sort,
    featured,
    isNew,
  });

  const { categories, mainCategories, getSubcategories } = useCategories();
  const brands = useBrands();

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug);
  }, [categories, categorySlug]);

  const pageTitle = useMemo(() => {
    if (searchQuery) return `Search: "${searchQuery}"`;
    if (featured) return 'Featured Products';
    if (isNew) return 'New Arrivals';
    if (currentCategory) return currentCategory.name;
    return 'All Products';
  }, [searchQuery, featured, isNew, currentCategory]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStock(false);
  };

  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < 500 ||
    selectedBrands.length > 0 ||
    minRating > 0 ||
    inStock;

  return (
    <div className="page-shell">
      <div className="border-b border-stone-200 bg-white/70">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onNavigate('home')}
              className="text-stone-500 transition hover:text-terracotta-700"
            >
              Home
            </button>
            <span className="text-stone-300">/</span>
            {currentCategory?.parent_id && (
              <>
                <button
                  onClick={() => {
                    const parent = categories.find(
                      (c) => c.id === currentCategory.parent_id
                    );
                    if (parent) onNavigate(`products?category=${parent.slug}`);
                  }}
                  className="text-stone-500 transition hover:text-terracotta-700"
                >
                  {categories.find((c) => c.id === currentCategory.parent_id)?.name}
                </button>
                <span className="text-stone-300">/</span>
              </>
            )}
            <span className="font-medium text-wine-950">{pageTitle}</span>
          </nav>
        </div>
      </div>

      <div className="paper-texture border-b border-stone-200/70">
        <div className="container-custom flex flex-col justify-between gap-7 py-10 md:flex-row md:items-end md:py-14">
          <div>
            <p className="eyebrow">The Mercato collection</p>
            <h1 className="editorial-title mt-3 text-5xl md:text-7xl">{pageTitle}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
              Thoughtfully sourced pantry goods, tableware and gifts from independent Italian makers.
              <span className="ml-2 font-semibold text-wine-950">{totalCount} pieces</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-terracotta-400 lg:hidden"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            <div className="hidden items-center gap-1 rounded-full border border-stone-300 bg-white p-1 sm:flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-full p-2 ${
                  viewMode === 'grid' ? 'bg-wine-950 text-white' : 'hover:bg-cream-100'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-full p-2 ${
                  viewMode === 'list' ? 'bg-wine-950 text-white' : 'hover:bg-cream-100'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="min-h-11 appearance-none rounded-full border border-stone-300 bg-white py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-10 md:py-14">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="surface-card sticky top-36 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-wine-950"><SlidersHorizontal className="h-4 w-4 text-terracotta-700" /> Refine</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-terracotta-600 hover:text-terracotta-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="eyebrow mb-3">Departments</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => onNavigate('products')}
                        className={`text-sm ${
                          !categorySlug
                            ? 'font-semibold text-terracotta-700'
                            : 'text-stone-600 hover:text-wine-950'
                        }`}
                      >
                        All Products
                      </button>
                    </li>
                    {mainCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() =>
                            onNavigate(`products?category=${category.slug}`)
                          }
                          className={`text-sm ${
                            categorySlug === category.slug
                              ? 'text-terracotta-600 font-medium'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {category.name}
                        </button>
                        <ul className="ml-4 mt-2 space-y-1">
                          {getSubcategories(category.id).map((sub) => (
                            <li key={sub.id}>
                              <button
                                onClick={() =>
                                  onNavigate(`products?category=${sub.slug}`)
                                }
                                className={`text-sm ${
                                  categorySlug === sub.slug
                                    ? 'text-terracotta-600 font-medium'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h3 className="eyebrow mb-3">Price range</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-20 rounded-lg border border-stone-300 bg-cream-50 px-2 py-1.5 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-20 rounded-lg border border-stone-300 bg-cream-50 px-2 py-1.5 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="eyebrow mb-3">Makers</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-gray-300 text-terracotta-500 focus:ring-terracotta-500"
                        />
                        <span className="text-sm text-gray-600">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="eyebrow mb-3">Customer rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                        className={`flex items-center gap-2 ${
                          minRating === rating ? 'text-terracotta-600' : 'text-gray-600'
                        }`}
                      >
                        <Rating value={rating} size="sm" />
                        <span className="text-sm">& up</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-sm text-gray-600">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {priceRange[0] > 0 || priceRange[1] < 500 ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 500])}
                      className="hover:text-terracotta-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ) : null}
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm"
                  >
                    {brand}
                    <button
                      onClick={() => toggleBrand(brand)}
                      className="hover:text-terracotta-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm">
                    {minRating}+ stars
                    <button
                      onClick={() => setMinRating(0)}
                      className="hover:text-terracotta-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {inStock && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm">
                    In Stock
                    <button
                      onClick={() => setInStock(false)}
                      className="hover:text-terracotta-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className="surface-card py-16 text-center">
                <Filter className="mx-auto mb-4 h-12 w-12 text-stone-300" />
                <h3 className="font-display text-3xl font-semibold text-wine-950">
                  Nothing on this stall just yet
                </h3>
                <p className="mb-6 mt-2 text-stone-500">
                  Try widening your search or clearing a filter.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={(slug) => onNavigate(`product/${slug}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-wine-950/70 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 overflow-y-auto bg-cream-50 shadow-strong animate-slide-in-right">
            <div className="sticky top-0 flex items-center justify-between border-b border-stone-200 bg-cream-50 px-4 py-4">
              <h2 className="font-display text-2xl font-semibold text-wine-950">Refine the market</h2>
              <button onClick={() => setFilterOpen(false)} className="rounded-full border border-stone-200 bg-white p-2" aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                  <ul className="space-y-2">
                    {mainCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => {
                            onNavigate(`products?category=${category.slug}`);
                            setFilterOpen(false);
                          }}
                          className={`text-sm ${
                            categorySlug === category.slug
                              ? 'text-terracotta-600 font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-24 px-2 py-1 border rounded text-sm"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-24 px-2 py-1 border rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex gap-3 border-t border-stone-200 bg-white p-4">
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                Clear
              </Button>
              <Button onClick={() => setFilterOpen(false)} className="flex-1">
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
