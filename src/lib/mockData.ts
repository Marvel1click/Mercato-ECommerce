import { Product, Category } from "../types/database";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Gourmet Foods",
    slug: "gourmet-foods",
    description:
      "Premium Italian ingredients and delicacies for the discerning palate",
    image:
      "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=800",
    parent_id: null,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Kitchen & Dining",
    slug: "kitchen-dining",
    description: "Artisan cookware and elegant tableware for your home",
    image:
      "https://images.pexels.com/photos/6996089/pexels-photo-6996089.jpeg?auto=compress&cs=tinysrgb&w=800",
    parent_id: null,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Home Decor",
    slug: "home-decor",
    description:
      "Beautiful Mediterranean-inspired pieces for your living space",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    parent_id: null,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Gift Collections",
    slug: "gift-collections",
    description: "Curated gift sets perfect for any occasion",
    image:
      "https://images.pexels.com/photos/5874592/pexels-photo-5874592.jpeg?auto=compress&cs=tinysrgb&w=800",
    parent_id: null,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Tuscan Gold Extra Virgin Olive Oil",
    slug: "tuscan-gold-evoo",
    description:
      "This premium extra virgin olive oil is cold-pressed from hand-picked olives grown in the sun-drenched hills of Tuscany.",
    short_description:
      "Premium cold-pressed Tuscan olive oil with herbaceous notes",
    price: 45.99,
    original_price: 52.99,
    category_id: "1",
    brand: "Frantoio Toscano",
    sku: "EVOO-001",
    stock: 50,
    images: [
      "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    specifications: {
      volume: "500ml",
      origin: "Tuscany, Italy",
      harvest: "2024",
    },
    rating: 4.8,
    review_count: 124,
    is_featured: true,
    is_new: false,
    tags: ["bestseller", "organic", "premium"],
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Artisan Bronze-Cut Spaghetti",
    slug: "artisan-bronze-cut-spaghetti",
    description:
      "Traditional spaghetti crafted using bronze dies and slow-dried for 48 hours.",
    short_description:
      "Traditional bronze-cut pasta with perfect sauce-holding texture",
    price: 12.99,
    original_price: null,
    category_id: "1",
    brand: "Pastificio Artigiano",
    sku: "PASTA-001",
    stock: 100,
    images: [
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    specifications: { weight: "500g", cooking_time: "10-12 minutes" },
    rating: 4.7,
    review_count: 203,
    is_featured: true,
    is_new: false,
    tags: ["bestseller", "traditional", "bronze-cut"],
    created_at: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Parmigiano Reggiano 24 Months",
    slug: "parmigiano-reggiano-24",
    description:
      "The undisputed King of Cheeses, aged for 24 months in the traditional manner.",
    short_description: "The King of Cheeses, aged to perfection",
    price: 89.99,
    original_price: null,
    category_id: "1",
    brand: "Consorzio Parmigiano",
    sku: "CHEESE-001",
    stock: 25,
    images: [
      "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    specifications: {
      weight: "1kg wedge",
      origin: "Emilia-Romagna, Italy",
      aging: "24 months",
    },
    rating: 5.0,
    review_count: 234,
    is_featured: true,
    is_new: false,
    tags: ["dop", "aged", "bestseller"],
    created_at: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "Hand-Painted Deruta Dinner Set",
    slug: "deruta-dinner-set",
    description:
      "A stunning 16-piece dinner set featuring the iconic Renaissance patterns of Deruta, Umbria.",
    short_description: "Artisan Italian ceramics for elegant dining",
    price: 289.99,
    original_price: 349.99,
    category_id: "2",
    brand: "Ceramiche Deruta",
    sku: "TABLE-001",
    stock: 10,
    images: [
      "https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    specifications: { pieces: "16", material: "Hand-painted majolica" },
    rating: 4.9,
    review_count: 45,
    is_featured: true,
    is_new: false,
    tags: ["handmade", "ceramics", "luxury"],
    created_at: new Date().toISOString(),
  },
];
