import { useRef } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Leaf,
  PackageCheck,
  Shield,
  ShoppingBag,
  Star,
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
    <div className="page-shell">
      <section className="paper-texture relative overflow-hidden border-b border-stone-200/80">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-terracotta-300/30" />
        <div className="absolute -right-6 -top-6 h-56 w-56 rounded-full border border-wine-900/10" />

        <div className="container-custom relative grid min-h-[650px] items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta-200 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-terracotta-700 shadow-sm backdrop-blur">
              <BadgeCheck className="h-4 w-4" />
              Curated in Florence · Delivered worldwide
            </span>

            <h1 className="editorial-title mt-7 max-w-4xl text-5xl sm:text-6xl lg:text-7xl xl:text-[5.7rem]">
              Italy, gathered
              <span className="block italic text-terracotta-700">for your table.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-stone-700 sm:text-lg">
              Pantry treasures, hand-thrown ceramics and small-batch finds from
              the makers who keep Italian craft beautifully alive.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => onNavigate('products')} size="lg">
                Enter the market
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => onNavigate('products?category=gift-collections')}
                variant="outline"
                size="lg"
                className="border-stone-900 text-stone-900 hover:border-terracotta-500 hover:bg-white"
              >
                Shop the gift edit
              </Button>
            </div>

            <div className="mt-9 hidden gap-3 sm:grid sm:grid-cols-3">
              {heroProof.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    <Icon className="h-5 w-5 text-terracotta-700" />
                    <p className="mt-3 font-display text-lg font-semibold text-wine-950">
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
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2.5 shadow-strong">
              <img
                src="/images/mercato-hero-tableau.png"
                alt="Premium Italian pantry products, ceramics, olives, and pasta"
                className="aspect-[16/12] w-full rounded-[1.55rem] object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-2 bottom-2 rounded-b-md bg-gradient-to-t from-stone-950/35 to-transparent p-6" />
            </div>

            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-strong sm:absolute sm:-bottom-5 sm:right-6 sm:mt-0 sm:w-72">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Il consiglio del giorno
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    Today’s table picks
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

      <section className="border-b border-stone-200 bg-white/80">
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
                  <h3 className="font-display text-lg font-semibold text-wine-950">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-stone-500">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="section-kicker">Wander by department</span>
              <h2 className="editorial-title mt-4 max-w-3xl text-4xl md:text-6xl">
                Begin with what draws you in.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-stone-600 md:text-base">
              From sun-warmed pantry staples to objects made for long lunches,
              every department is selected with use, beauty and provenance in mind.
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-stone-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mainCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onNavigate(`products?category=${category.slug}`)}
                  className="group overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white text-left shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-strong focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2"
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
                    <h3 className="font-display text-2xl font-semibold text-wine-950">
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

      <section className="paper-texture section-padding border-y border-stone-200/70">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="section-kicker">From the counter</span>
              <h2 className="editorial-title mt-4 text-4xl md:text-6xl">
                The market favourites.
              </h2>
              <p className="mt-3 max-w-2xl text-stone-600">
                The pieces our customers return for, from pantry essentials to
                quietly beautiful gifts.
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
          <div className="grid overflow-hidden rounded-[2rem] border border-stone-200 bg-wine-950 text-white shadow-strong lg:grid-cols-[0.75fr_1.25fr]">
            <div className="flex flex-col justify-center p-8 md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-300">
                Seasonal collection
              </span>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-none md:text-6xl">
                Summer in Italy, set for supper.
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-300 md:text-base">
                Gather olive oils, linens, ceramics and generous pantry staples
                for evenings that drift long past dessert.
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

      <section className="section-padding bg-cream-50">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <span className="section-kicker">New arrivals</span>
              <h2 className="editorial-title mt-4 text-4xl md:text-6xl">
                Newly arrived from Italy.
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

      <section className="paper-texture section-padding border-t border-stone-200/70">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <span className="section-kicker">Notes from the table</span>
            <h2 className="editorial-title mx-auto mt-4 max-w-3xl text-4xl md:text-6xl">
              Treasured after arrival.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-medium"
              >
                <div className="flex gap-1 text-terracotta-600">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 font-display text-xl leading-7 text-wine-950">
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

      <section className="bg-terracotta-700 py-16 text-white md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-100">
              Join the Mercato list
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none md:text-6xl">
              Keep a little Italy in your inbox.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-terracotta-50">
              Subscribe for seasonal edits, hosting guides, exclusive bundles,
              and first access to limited maker drops.
            </p>
            <form className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-h-[52px] flex-1 rounded-full border border-white/20 bg-white px-5 text-stone-950 placeholder-stone-500 outline-none transition focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                className="min-h-[52px] bg-wine-950 text-white hover:bg-wine-900"
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
