import { useRef } from 'react';
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'New York, NY',
    rating: 5,
    text: 'The quality of the olive oil is incredible. It has completely transformed my cooking. Will be ordering again!',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Beautiful ceramics and fast shipping. The hand-painted pieces are even more stunning in person.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    location: 'Austin, TX',
    rating: 5,
    text: 'The pantry essentials box was the perfect gift. My mom absolutely loved everything in it!',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

const trustBadges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $75',
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: '256-bit SSL encryption',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: 'Authentic Italian products',
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { products: featuredProducts, loading: featuredLoading } = useProducts({
    featured: true,
    limit: 8,
  });
  const { products: newProducts, loading: newLoading } = useProducts({
    isNew: true,
    limit: 8,
  });
  const { mainCategories, loading: categoriesLoading } = useCategories();
  const newArrivalsRef = useRef<HTMLDivElement>(null);

  const scrollNewArrivals = (direction: 'left' | 'right') => {
    if (newArrivalsRef.current) {
      const scrollAmount = 320;
      newArrivalsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Italian marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative container-custom h-full flex items-center">
          <div className="max-w-xl text-white">
            <span className="inline-block px-4 py-1 bg-terracotta-500/90 rounded-full text-sm font-medium mb-6">
              Authentic Italian Artisan Products
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Taste the Heart of
              <span className="text-terracotta-400"> Italy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Discover carefully curated gourmet foods, artisan cookware, and
              beautiful home decor from Italy's finest craftsmen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => onNavigate('products')} size="lg">
                Shop Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => onNavigate('products?category=gift-collections')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                View Gift Sets
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-cream-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-6 h-6 text-terracotta-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{badge.title}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of authentic Italian products
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mainCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onNavigate(`products?category=${category.slug}`)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                >
                  <img
                    src={category.image || ''}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {category.name}
                      </h3>
                      <span className="text-terracotta-300 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">Our most loved items</p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate('products?featured=true')}
              className="hidden md:flex"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {featuredLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={(slug) => onNavigate(`product/${slug}`)}
                />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button
              variant="outline"
              onClick={() => onNavigate('products?featured=true')}
            >
              View All Featured
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Italian kitchen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative container-custom text-center text-white">
          <span className="inline-block px-4 py-1 bg-terracotta-500/90 rounded-full text-sm font-medium mb-6">
            Limited Time Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Seasonal Collection
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover our hand-picked selection of winter favorites. Perfect for
            cozy evenings and holiday entertaining.
          </p>
          <Button onClick={() => onNavigate('products')} size="lg">
            Explore Collection
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                New Arrivals
              </h2>
              <p className="text-gray-600">Fresh additions to our collection</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scrollNewArrivals('left')}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollNewArrivals('right')}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={newArrivalsRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          >
            {newLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-72 flex-shrink-0">
                    <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))
              : newProducts.map((product) => (
                  <div key={product.id} className="w-72 flex-shrink-0">
                    <ProductCard
                      product={product}
                      onNavigate={(slug) => onNavigate(`product/${slug}`)}
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy customers who have discovered the joy of
              authentic Italian products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 shadow-soft"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-terracotta-500">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Mercato Family
            </h2>
            <p className="text-terracotta-100 mb-8">
              Subscribe to our newsletter for exclusive offers, Italian recipes,
              and early access to new products.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                variant="secondary"
                className="bg-white text-terracotta-600 hover:bg-gray-100"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-terracotta-200 mt-4">
              Get 10% off your first order when you subscribe
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
