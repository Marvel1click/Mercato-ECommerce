import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  Mail,
  MapPin,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';

interface InfoPageProps {
  slug: string;
  onNavigate: (page: string) => void;
}

const pages = {
  story: {
    eyebrow: 'Our story',
    title: 'Italy is best discovered around a table.',
    intro:
      'Mercato brings together pantry staples, tableware and gifts chosen for the rituals that make everyday life feel generous.',
    sections: [
      {
        title: 'Chosen slowly',
        body: 'We favour useful beauty: ingredients with a clear sense of place, objects made to be handled, and pieces that become part of family traditions.',
      },
      {
        title: 'Close to the makers',
        body: 'Our edit celebrates independent workshops and family producers across Italy, with an emphasis on enduring methods, honest materials and thoughtful production.',
      },
      {
        title: 'Made for sharing',
        body: 'Everything in the market is selected to make hosting, gifting and everyday meals feel warmer, easier and more memorable.',
      },
    ],
  },
  shipping: {
    eyebrow: 'Delivery',
    title: 'From our market to your door.',
    intro:
      'Orders are packed with care and tracked from dispatch to delivery. Complimentary standard shipping is available on orders over $75.',
    sections: [
      {
        title: 'Standard delivery',
        body: 'Allow 5–7 business days after dispatch. You will receive a tracking link as soon as your parcel leaves our packing table.',
      },
      {
        title: 'Express options',
        body: 'Express and overnight delivery are available at checkout for eligible addresses and in-stock items.',
      },
      {
        title: 'Protective packaging',
        body: 'Ceramics, glass and pantry goods are packed separately where needed, using recyclable materials wherever possible.',
      },
    ],
  },
  returns: {
    eyebrow: 'Returns & exchanges',
    title: 'Simple, considered returns.',
    intro:
      'If something is not right, contact us within 30 days of delivery. We will help arrange a return, exchange or replacement.',
    sections: [
      {
        title: 'Start a return',
        body: 'Email our care team with your order number and the item you would like to return. We will reply with the next steps.',
      },
      {
        title: 'Damaged parcels',
        body: 'Send us a photo within 48 hours of delivery and we will prioritise a replacement or refund.',
      },
      {
        title: 'Food & personalised gifts',
        body: 'For safety and quality reasons, opened food products and personalised items cannot be returned unless they arrive damaged.',
      },
    ],
  },
  faq: {
    eyebrow: 'Frequently asked questions',
    title: 'A few useful details before you order.',
    intro:
      'Everything from provenance and gift wrapping to delivery and account support, gathered in one place.',
    sections: [
      {
        title: 'Are the products made in Italy?',
        body: 'Our Italian-made and Italian-sourced pieces are identified in the product details, including origin and maker information wherever available.',
      },
      {
        title: 'Can I send an order as a gift?',
        body: 'Yes. Choose a separate delivery address at checkout and add gift-ready packaging where offered.',
      },
      {
        title: 'How do I care for artisan pieces?',
        body: 'Care notes appear in each product description. Handmade finishes can vary slightly; those differences are part of each piece’s character.',
      },
    ],
  },
  contact: {
    eyebrow: 'Customer care',
    title: 'We would be delighted to help.',
    intro:
      'Questions about an order, a maker or the right gift? Our customer-care table is open Monday to Friday.',
    sections: [
      {
        title: 'Email us',
        body: 'Write to hello@mercato.com and include your order number when your question relates to a purchase.',
      },
      {
        title: 'Response time',
        body: 'We usually reply within one business day. During holiday periods, please allow a little longer.',
      },
      {
        title: 'Where we are',
        body: 'Our buying studio is based in Florence, with fulfilment partners supporting customers across the United States.',
      },
    ],
  },
} as const;

const highlights = [
  { icon: PackageCheck, label: 'Carefully packed' },
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: RefreshCcw, label: '30-day returns' },
  { icon: HeartHandshake, label: 'Human support' },
];

export default function InfoPage({ slug, onNavigate }: InfoPageProps) {
  const page = pages[slug as keyof typeof pages] || pages.story;

  return (
    <div className="page-shell">
      <section className="paper-texture border-b border-stone-200/70">
        <div className="container-custom grid gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="editorial-title mt-4 max-w-4xl text-5xl md:text-7xl">
              {page.title}
            </h1>
          </div>
          <p className="max-w-xl text-base leading-8 text-stone-600 md:text-lg">
            {page.intro}
          </p>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-custom">
          <div className="grid gap-4 md:grid-cols-3">
            {page.sections.map((section, index) => (
              <article key={section.title} className="surface-card p-6 md:p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wine-950 font-display text-lg font-semibold text-cream-100">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-6 font-display text-3xl font-semibold text-wine-950">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-3 rounded-[2rem] bg-wine-950 p-6 text-cream-100 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-4">
                  <Icon className="h-5 w-5 text-terracotta-300" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-soft lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <Sparkles className="h-6 w-6 text-terracotta-700" />
              <h2 className="mt-5 font-display text-4xl font-semibold leading-none text-wine-950">
                Still looking for something?
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-stone-600">
                Browse the market for pantry favourites and thoughtful objects, or send our team a note for personal help.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => onNavigate('products')}>
                  Explore the market <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <a href="mailto:hello@mercato.com" className="btn-secondary min-h-12">
                  <Mail className="mr-2 h-4 w-4" /> Email customer care
                </a>
              </div>
            </div>
            <div className="grid content-center gap-5 bg-cream-100 p-8 md:p-12">
              <div className="flex items-start gap-4">
                <Clock3 className="mt-1 h-5 w-5 text-terracotta-700" />
                <div><p className="font-semibold text-wine-950">Monday–Friday</p><p className="text-sm text-stone-600">9:00–17:00 Eastern Time</p></div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-terracotta-700" />
                <div><p className="font-semibold text-wine-950">Florence, Italy</p><p className="text-sm text-stone-600">Sourcing studio and maker relations</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
