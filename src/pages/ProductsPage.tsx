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
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-500 hover:text-gray-700"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            {currentCategory?.parent_id && (
              <>
                <button
                  onClick={() => {
                    const parent = categories.find(
                      (c) => c.id === currentCategory.parent_id
                    );
                    if (parent) onNavigate(`products?category=${parent.slug}`);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {categories.find((c) => c.id === currentCategory.parent_id)?.name}
                </button>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{pageTitle}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-600 mt-1">{totalCount} products</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            <div className="hidden sm:flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
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
                  <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => onNavigate('products')}
                        className={`text-sm ${
                          !categorySlug
                            ? 'text-terracotta-600 font-medium'
                            : 'text-gray-600 hover:text-gray-900'
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
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Brands</h3>
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
                  <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
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
              <div className="text-center py-16">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
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
          <div className="fixed inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-strong animate-slide-in-right overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setFilterOpen(false)}>
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
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
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
