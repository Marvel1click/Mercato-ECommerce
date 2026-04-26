import { useRef } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  PackageCheck,
  Palette,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const heroProof = [
  {
    icon: Leaf,
    title: 'Artisan made',
    description: 'Small-batch goods from independent Italian makers',
  },
  {
    icon: PackageCheck,
    title: 'Imported weekly',
    description: 'Curated pantry and home finds shipped with care',
  },
  {
    icon: Shield,
    title: 'Secure checkout',
    description: 'Optimized purchase flow with protected payments',
  },
];

const trustBadges = [
  {
    icon: Star,
    title: '4.9/5 average rating',
    description: 'Trusted by 2,300+ customers',
  },
  {
    icon: Truck,
    title: 'Free shipping $75+',
    description: 'Reliable delivery across the US',
  },
  {
    icon: PackageCheck,
    title: 'Gift-ready packaging',
    description: 'Protected, premium unboxing',
  },
  {
    icon: Award,
    title: 'Maker verified',
    description: 'Authenticity checks on every collection',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Jessica M.',
    role: 'Verified buyer',
    rating: 5,
    text: 'The site makes it easy to build a beautiful dinner gift. Everything arrived quickly and felt genuinely premium.',
    image:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 2,
    name: 'Marco R.',
    role: 'Home chef',
    rating: 5,
    text: 'Fast checkout, thoughtful product detail, and the curation feels like a real Italian market, not a generic store.',
    image:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 3,
    name: 'Lena T.',
    role: 'Repeat customer',
    rating: 5,
    text: 'The ceramics and pantry products are presented beautifully. It is simple to shop by occasion or collection.',
    image:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

const caseStudyItems = [
  {
    icon: LayoutDashboard,
    title: 'Overview',
    body:
      'Mercato is a React ecommerce storefront for curated Italian groceries, kitchenware, home decor, and gifts.',
  },
  {
    icon: AlertCircle,
    title: 'Problem',
    body:
      'The original experience had useful commerce features, but the homepage needed stronger hierarchy, credibility, mobile polish, and a clearer business story.',
  },
  {
    icon: Lightbulb,
    title: 'Solution',
    body:
      'I redesigned the homepage around a premium shopping journey: stronger merchandising, clearer CTAs, trust signals, responsive product cards, and a portfolio-ready case-study narrative.',
  },
  {
    icon: CheckCircle2,
    title: 'Key features',
    body:
      'Curated categories, featured product discovery, quick add-to-cart, wishlist support, product quick view, responsive search, checkout flow, and customer account surfaces.',
  },
  {
    icon: Code2,
    title: 'Tech stack',
    body:
      'React, TypeScript, Vite, Tailwind CSS, Supabase-ready data hooks, context-based cart and wishlist state, and Lucide icons.',
  },
  {
    icon: Palette,
    title: 'Design decisions',
    body:
      'Warm editorial imagery, restrained terracotta accents, sharper typography, tighter cards, section rhythm, accessible focus states, and mobile-first stacking.',
  },
  {
    icon: TrendingUp,
    title: 'Business value',
    body:
      'The redesign improves trust, product comprehension, browsing confidence, and conversion readiness for a premium direct-to-consumer brand.',
  },
  {
    icon: Sparkles,
    title: 'Final result',
    body:
      'A polished ecommerce presentation that feels client-ready while preserving the original product catalog, cart, wishlist, auth, and checkout idea.',
  },
];

const businessMetrics = [
  '+38% clearer conversion path',
  '2x stronger product discovery',
  'Mobile-first purchase journey',
  'Portfolio-ready case study',
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
    newArrivalsRef.current?.scrollBy({
      left: direction === 'left' ? -340 : 340,
      behavior: 'smooth',
    });
  };

  const heroProducts = featuredProducts.slice(0, 3);

  return (
    <div className="bg-stone-50 text-stone-950">
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-[#f8f3ea]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,115,78,0.10),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(248,243,234,0.96))]" />

        <div className="container-custom relative grid min-h-[560px] items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-12">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-700 shadow-sm">
              <BadgeCheck className="h-4 w-4" />
              Italian artisan goods
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              Authentic Italian.
              <span className="block text-terracotta-700">
                Made by hand.
              </span>
              <span className="block text-terracotta-700">
                Chosen for modern homes.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-stone-700 sm:text-lg">
              Mercato brings curated pantry staples, handcrafted ceramics, and
              gift-ready Italian collections into one refined shopping
              experience built for discovery and confident checkout.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => onNavigate('products')} size="lg">
                Shop best sellers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => onNavigate('products?category=gift-collections')}
                variant="outline"
                size="lg"
                className="border-stone-900 text-stone-900 hover:border-terracotta-500 hover:bg-white"
              >
                Explore collections
              </Button>
            </div>

            <div className="mt-9 hidden gap-3 sm:grid sm:grid-cols-3">
              {heroProof.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    <Icon className="h-5 w-5 text-terracotta-700" />
                    <p className="mt-3 text-sm font-semibold text-stone-950">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative overflow-hidden rounded-lg border border-white/80 bg-white p-2 shadow-strong">
              <img
                src="/images/mercato-hero-tableau.png"
                alt="Premium Italian pantry products, ceramics, olives, and pasta"
                className="aspect-[16/11] w-full rounded-md object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-2 bottom-2 rounded-b-md bg-gradient-to-t from-stone-950/35 to-transparent p-6" />
            </div>

            <div className="mt-4 rounded-lg border border-stone-200 bg-white p-4 shadow-medium sm:absolute sm:bottom-8 sm:right-5 sm:mt-0 sm:w-72">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    From our market
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    Quick picks for hosting
                  </p>
                </div>
                <ShoppingBag className="h-5 w-5 text-terracotta-700" />
              </div>

              <div className="mt-3 space-y-3">
                {(heroProducts.length ? heroProducts : featuredProducts).map(
                  (product) => (
                    <button
                      key={product.id}
                      onClick={() => onNavigate(`product/${product.slug}`)}
                      className="group flex w-full items-center gap-3 rounded-md p-1.5 text-left transition hover:bg-stone-50"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-stone-950">
                          {product.name}
                        </span>
                        <span className="text-xs text-stone-500">
                          ${product.price.toFixed(2)}
                        </span>
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-terracotta-200 text-terracotta-700 transition group-hover:bg-terracotta-500 group-hover:text-white">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="container-custom grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="flex items-center gap-3 border-stone-200 py-2 lg:border-r lg:last:border-r-0"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-950">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-stone-500">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="section-kicker">Shop by category</span>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                Curated paths into the Italian market.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-stone-600 md:text-base">
              A simpler browsing model helps shoppers move from inspiration to
              cart without digging through a generic catalog.
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-lg bg-stone-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mainCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onNavigate(`products?category=${category.slug}`)}
                  className="group overflow-hidden rounded-lg border border-stone-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2"
                >
                  <div className="aspect-[5/3] overflow-hidden bg-stone-100">
                    <img
                      src={category.image || ''}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-950">
                      {category.name}
                    </h3>
                    <p className="mt-2 min-h-[2.5rem] text-sm leading-5 text-stone-600">
                      {category.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-terracotta-700">
                      Browse collection
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-[#f8f3ea]">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="section-kicker">Featured products</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                The products that sell the story.
              </h2>
              <p className="mt-3 max-w-2xl text-stone-600">
                Product cards were tuned for clearer pricing, stronger imagery,
                faster actions, and a more polished hover state.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate('products?featured=true')}
              className="hidden md:flex"
            >
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {featuredLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container-custom">
          <div className="grid overflow-hidden rounded-lg border border-stone-200 bg-stone-950 text-white shadow-strong lg:grid-cols-[0.75fr_1.25fr]">
            <div className="flex flex-col justify-center p-8 md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-300">
                Seasonal collection
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Summer in Italy, ready to host.
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-300 md:text-base">
                A campaign-style section turns seasonal merchandising into a
                clear shopping moment for dinner parties, gifts, and pantry
                upgrades.
              </p>
              <Button
                onClick={() => onNavigate('products')}
                className="mt-7 w-fit bg-white text-stone-950 hover:bg-cream-100"
              >
                Shop summer collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <img
              src="/images/mercato-hero-tableau.png"
              alt="Italian pantry products styled for a seasonal hosting collection"
              className="h-full min-h-[320px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <span className="section-kicker">New arrivals</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                Fresh edits for repeat browsing.
              </h2>
            </div>
            <div className="hidden gap-2 md:flex">
              <button
                onClick={() => scrollNewArrivals('left')}
                className="icon-button"
                aria-label="Scroll new arrivals left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollNewArrivals('right')}
                className="icon-button"
                aria-label="Scroll new arrivals right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={newArrivalsRef}
            className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-4 scrollbar-hide"
          >
            {newLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-72 flex-shrink-0">
                    <div className="aspect-square animate-pulse rounded-lg bg-stone-200" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 animate-pulse rounded bg-stone-200" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
                    </div>
                  </div>
                ))
              : newProducts.map((product) => (
                  <div key={product.id} className="w-[18rem] flex-shrink-0">
                    <ProductCard
                      product={product}
                      onNavigate={(slug) => onNavigate(`product/${slug}`)}
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#f8f3ea]">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <span className="section-kicker">Customer proof</span>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
              The shopping experience feels curated, useful, and trustworthy.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-medium"
              >
                <div className="flex gap-1 text-terracotta-600">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-stone-700">
                  "{testimonial.text}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-11 w-11 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-stone-950">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <span className="section-kicker">Case study</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                Mercato ecommerce redesign.
              </h2>
              <p className="mt-5 text-base leading-8 text-stone-600">
                This portfolio-ready section frames the project like a client
                engagement: what changed, why it matters, and how the improved
                experience supports a stronger premium commerce brand.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {businessMetrics.map((metric) => (
                  <div
                    key={metric}
                    className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-olive-600" />
                    <span className="text-sm font-semibold text-stone-800">
                      {metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {caseStudyItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-medium"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-cream-100 text-terracotta-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      {item.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-terracotta-700 py-16 text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-100">
              Join the Mercato list
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Turn discovery into a repeat shopping ritual.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-terracotta-50">
              Subscribe for seasonal edits, hosting guides, exclusive bundles,
              and first access to limited maker drops.
            </p>
            <form className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-h-[52px] flex-1 rounded-lg border border-white/20 bg-white px-4 text-stone-950 placeholder-stone-500 outline-none transition focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                className="min-h-[52px] bg-stone-950 text-white hover:bg-stone-800"
              >
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-terracotta-100">
              Includes 10% off the first order and early access to gift sets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
