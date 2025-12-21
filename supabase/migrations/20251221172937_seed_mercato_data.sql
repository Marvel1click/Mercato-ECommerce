/*
  # Seed Mercato with Sample Data

  1. Categories
    - Gourmet Foods (Olive Oils, Pasta & Grains, Sauces, Cheese & Dairy)
    - Kitchen & Dining (Cookware, Tableware, Utensils)
    - Home Decor (Textiles, Ceramics, Artwork)
    - Gift Collections

  2. Products
    - 30 products across all categories with realistic Italian marketplace items
    - Includes images, descriptions, ratings, and pricing

  3. Sample Coupons
    - Welcome discount codes
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, image, sort_order) VALUES
  ('Gourmet Foods', 'gourmet-foods', 'Premium Italian ingredients and delicacies for the discerning palate', 'https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
  ('Kitchen & Dining', 'kitchen-dining', 'Artisan cookware and elegant tableware for your home', 'https://images.pexels.com/photos/6996089/pexels-photo-6996089.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('Home Decor', 'home-decor', 'Beautiful Mediterranean-inspired pieces for your living space', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
  ('Gift Collections', 'gift-collections', 'Curated gift sets perfect for any occasion', 'https://images.pexels.com/photos/5874592/pexels-photo-5874592.jpeg?auto=compress&cs=tinysrgb&w=800', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Subcategories using the parent slugs
INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Olive Oils', 'olive-oils', 'Extra virgin olive oils from Italy''s finest regions', 
       'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800', 
       id, 1
FROM categories WHERE slug = 'gourmet-foods'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Pasta & Grains', 'pasta-grains', 'Artisanal pasta and premium Italian grains', 
       'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800', 
       id, 2
FROM categories WHERE slug = 'gourmet-foods'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Sauces & Condiments', 'sauces-condiments', 'Traditional sauces and specialty condiments', 
       'https://images.pexels.com/photos/4033636/pexels-photo-4033636.jpeg?auto=compress&cs=tinysrgb&w=800', 
       id, 3
FROM categories WHERE slug = 'gourmet-foods'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Cheese & Dairy', 'cheese-dairy', 'Aged cheeses and artisan dairy products', 
       'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=800', 
       id, 4
FROM categories WHERE slug = 'gourmet-foods'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Cookware', 'cookware', 'Professional-grade pots, pans, and cooking essentials', 
       'https://images.pexels.com/photos/6996089/pexels-photo-6996089.jpeg?auto=compress&cs=tinysrgb&w=800', 
       id, 1
FROM categories WHERE slug = 'kitchen-dining'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Tableware', 'tableware', 'Elegant plates, bowls, and serving pieces', 
       'https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=800', 
       id, 2
FROM categories WHERE slug = 'kitchen-dining'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Textiles', 'textiles', 'Linens, throws, and Mediterranean fabrics', 
       'https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg?auto=compress&cs=tinysrgb&w=800', 
       id, 1
FROM categories WHERE slug = 'home-decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order) 
SELECT 'Ceramics', 'ceramics', 'Hand-painted ceramics and pottery', 
       'https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=800', 
       id, 2
FROM categories WHERE slug = 'home-decor'
ON CONFLICT (slug) DO NOTHING;

-- Insert Products for Olive Oils category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Tuscan Gold Extra Virgin Olive Oil',
  'tuscan-gold-evoo',
  'This premium extra virgin olive oil is cold-pressed from hand-picked olives grown in the sun-drenched hills of Tuscany. With its rich golden color and complex flavor profile featuring notes of fresh herbs, artichoke, and a pleasant peppery finish, it elevates any dish from ordinary to extraordinary.',
  'Premium cold-pressed Tuscan olive oil with herbaceous notes',
  45.99, 52.99, id, 'Frantoio Toscano', 'EVOO-001', 50,
  '["https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"volume": "500ml", "origin": "Tuscany, Italy", "harvest": "2024", "acidity": "0.3%"}'::jsonb,
  4.8, 124, true, false, ARRAY['bestseller', 'organic', 'premium']
FROM categories WHERE slug = 'olive-oils'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Sicilian Lemon Infused Olive Oil',
  'sicilian-lemon-olive-oil',
  'A delightful fusion of premium Sicilian olive oil and fresh Meyer lemon essence. This aromatic oil brings a bright, citrusy dimension to seafood, salads, and grilled vegetables.',
  'Bright citrus-infused olive oil perfect for seafood and salads',
  38.99, NULL, id, 'Oleificio Ferrara', 'EVOO-002', 35,
  '["https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"volume": "250ml", "origin": "Sicily, Italy", "infusion": "Natural Meyer Lemon"}'::jsonb,
  4.6, 89, true, true, ARRAY['infused', 'citrus', 'seafood']
FROM categories WHERE slug = 'olive-oils'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Umbrian Truffle Olive Oil',
  'umbrian-truffle-olive-oil',
  'Luxurious extra virgin olive oil infused with prized Umbrian black truffles. Each bottle contains real truffle pieces for an authentic, earthy aroma that transforms pasta, risotto, and eggs into gourmet experiences.',
  'Decadent truffle-infused oil for gourmet dishes',
  65.99, NULL, id, 'Tartufi Neri', 'EVOO-003', 20,
  '["https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"volume": "200ml", "origin": "Umbria, Italy", "truffle_content": "5%"}'::jsonb,
  4.9, 67, true, false, ARRAY['luxury', 'truffle', 'gourmet']
FROM categories WHERE slug = 'olive-oils'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Pasta & Grains category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Artisan Bronze-Cut Spaghetti',
  'artisan-bronze-cut-spaghetti',
  'Traditional spaghetti crafted using bronze dies and slow-dried for 48 hours, creating a rough, porous surface that holds sauce beautifully. Made from 100% Italian durum wheat semolina.',
  'Traditional bronze-cut pasta with perfect sauce-holding texture',
  12.99, NULL, id, 'Pastificio Artigiano', 'PASTA-001', 100,
  '["https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "500g", "cooking_time": "10-12 minutes", "ingredients": "Durum wheat semolina, water"}'::jsonb,
  4.7, 203, true, false, ARRAY['bestseller', 'traditional', 'bronze-cut']
FROM categories WHERE slug = 'pasta-grains'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Handmade Pappardelle',
  'handmade-pappardelle',
  'Wide, ribbon-like pasta handmade by skilled artisans using a centuries-old recipe. These luxurious pappardelle are perfect for rich meat ragus, mushroom sauces, and creamy preparations.',
  'Wide ribbon pasta ideal for rich meat sauces',
  16.99, NULL, id, 'Pastificio Artigiano', 'PASTA-002', 60,
  '["https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "400g", "cooking_time": "8-10 minutes", "ingredients": "Durum wheat, eggs, water"}'::jsonb,
  4.8, 156, false, true, ARRAY['handmade', 'egg-pasta', 'premium']
FROM categories WHERE slug = 'pasta-grains'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Carnaroli Risotto Rice',
  'carnaroli-risotto-rice',
  'The king of risotto rice, prized by Italian chefs for its superior starch content and firm texture that remains al dente throughout cooking. Grown in the Po Valley.',
  'Premium risotto rice for the creamiest results',
  18.99, 22.99, id, 'Riso Gallo', 'RICE-001', 75,
  '["https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "1kg", "origin": "Po Valley, Italy", "variety": "Carnaroli Superfino"}'::jsonb,
  4.9, 98, true, false, ARRAY['risotto', 'premium', 'bestseller']
FROM categories WHERE slug = 'pasta-grains'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Artisan Orecchiette Pasta',
  'artisan-orecchiette',
  'Little ear-shaped pasta from Puglia, perfect for catching chunky vegetable sauces and broccoli rabe. Made by hand using traditional techniques.',
  'Traditional Puglian pasta for vegetable sauces',
  14.99, NULL, id, 'Pastificio Artigiano', 'PASTA-003', 55,
  '["https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "500g", "cooking_time": "12-14 minutes", "origin": "Puglia, Italy"}'::jsonb,
  4.7, 88, false, true, ARRAY['puglia', 'handmade', 'traditional']
FROM categories WHERE slug = 'pasta-grains'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Sauces & Condiments category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'San Marzano Tomato Passata',
  'san-marzano-passata',
  'Made exclusively from DOP San Marzano tomatoes grown in the volcanic soil near Mount Vesuvius, this passata captures the essence of Italian cooking.',
  'Premium DOP tomato passata for authentic Italian sauces',
  9.99, NULL, id, 'La Valle', 'SAUCE-001', 150,
  '["https://images.pexels.com/photos/4033636/pexels-photo-4033636.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"volume": "680g", "origin": "Campania, Italy", "certification": "DOP San Marzano"}'::jsonb,
  4.7, 312, true, false, ARRAY['dop', 'tomato', 'essential']
FROM categories WHERE slug = 'sauces-condiments'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Traditional Pesto Genovese',
  'pesto-genovese',
  'Authentic Ligurian pesto made with fragrant Genovese basil, pine nuts, aged Parmigiano-Reggiano, Pecorino Sardo, and premium extra virgin olive oil.',
  'Classic basil pesto from the Ligurian coast',
  14.99, NULL, id, 'Casa Ligure', 'SAUCE-002', 80,
  '["https://images.pexels.com/photos/4033636/pexels-photo-4033636.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "180g", "origin": "Liguria, Italy"}'::jsonb,
  4.8, 178, true, true, ARRAY['pesto', 'basil', 'traditional']
FROM categories WHERE slug = 'sauces-condiments'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Aged Balsamic Vinegar of Modena',
  'aged-balsamic-modena',
  'This exquisite balsamic vinegar has been aged for 12 years in a succession of wooden barrels, developing complex layers of flavor with notes of fig, cherry, and caramel.',
  '12-year aged balsamic with complex, sweet notes',
  42.99, 48.99, id, 'Acetaia del Cristo', 'VIN-001', 30,
  '["https://images.pexels.com/photos/4033636/pexels-photo-4033636.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"volume": "250ml", "origin": "Modena, Italy", "aging": "12 years"}'::jsonb,
  4.9, 89, true, false, ARRAY['balsamic', 'aged', 'luxury']
FROM categories WHERE slug = 'sauces-condiments'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Calabrian Chili Paste',
  'calabrian-chili-paste',
  'Fiery and flavorful, this authentic Calabrian chili paste adds warmth and depth to any dish. Made from sun-ripened Calabrian peppers preserved in olive oil.',
  'Authentic spicy pepper paste from southern Italy',
  11.99, NULL, id, 'Tutto Calabria', 'SAUCE-003', 60,
  '["https://images.pexels.com/photos/4033636/pexels-photo-4033636.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "280g", "origin": "Calabria, Italy", "heat_level": "Medium-Hot"}'::jsonb,
  4.6, 145, false, false, ARRAY['spicy', 'chili', 'condiment']
FROM categories WHERE slug = 'sauces-condiments'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Cheese & Dairy category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Parmigiano Reggiano 24 Months',
  'parmigiano-reggiano-24',
  'The undisputed King of Cheeses, aged for 24 months in the traditional manner. Hand-selected for its perfect crystalline texture, rich umami flavor, and sweet, nutty finish.',
  'The King of Cheeses, aged to perfection',
  89.99, NULL, id, 'Consorzio Parmigiano', 'CHEESE-001', 25,
  '["https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/4087611/pexels-photo-4087611.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "1kg wedge", "origin": "Emilia-Romagna, Italy", "aging": "24 months", "certification": "DOP"}'::jsonb,
  5.0, 234, true, false, ARRAY['dop', 'aged', 'bestseller']
FROM categories WHERE slug = 'cheese-dairy'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Fresh Burrata di Puglia',
  'burrata-puglia',
  'Creamy, luscious burrata from the heart of Puglia. Each pouch of fresh mozzarella is filled with stracciatella and cream, creating an indulgent experience.',
  'Creamy fresh cheese with a decadent center',
  24.99, NULL, id, 'Caseificio Pugliese', 'CHEESE-002', 15,
  '["https://images.pexels.com/photos/4087611/pexels-photo-4087611.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "250g", "origin": "Puglia, Italy"}'::jsonb,
  4.7, 156, true, true, ARRAY['fresh', 'creamy', 'premium']
FROM categories WHERE slug = 'cheese-dairy'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Pecorino Romano DOP',
  'pecorino-romano-dop',
  'Sharp, salty, and intensely flavored, this ancient Roman cheese is made from 100% sheep milk using methods unchanged for centuries.',
  'Sharp sheep milk cheese essential for Roman pasta',
  34.99, NULL, id, 'Caseificio Romano', 'CHEESE-003', 40,
  '["https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "500g wedge", "origin": "Lazio, Italy", "aging": "8 months"}'::jsonb,
  4.8, 145, false, false, ARRAY['dop', 'sheep-milk', 'traditional']
FROM categories WHERE slug = 'cheese-dairy'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Gorgonzola Dolce DOP',
  'gorgonzola-dolce',
  'Mild and creamy Italian blue cheese with a sweet, gentle flavor and buttery texture. Perfect for risotto, pasta, or enjoyed with honey and walnuts.',
  'Creamy, mild blue cheese from Lombardy',
  28.99, NULL, id, 'Caseificio Lombardo', 'CHEESE-004', 20,
  '["https://images.pexels.com/photos/4087611/pexels-photo-4087611.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"weight": "300g", "origin": "Lombardy, Italy", "certification": "DOP"}'::jsonb,
  4.5, 78, false, true, ARRAY['blue-cheese', 'dop', 'creamy']
FROM categories WHERE slug = 'cheese-dairy'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Cookware category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Hand-Forged Carbon Steel Skillet',
  'carbon-steel-skillet',
  'Crafted by master blacksmiths in the Italian Alps, this carbon steel skillet develops a natural non-stick patina over time. Perfect for searing meats and achieving restaurant-quality results.',
  'Professional-grade skillet that improves with use',
  129.99, 149.99, id, 'Ferro Alpino', 'COOK-001', 20,
  '["https://images.pexels.com/photos/6996089/pexels-photo-6996089.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"diameter": "28cm", "material": "Carbon steel", "handle": "Riveted iron"}'::jsonb,
  4.9, 87, true, false, ARRAY['handmade', 'professional', 'heirloom']
FROM categories WHERE slug = 'cookware'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Copper-Core Risotto Pan',
  'copper-core-risotto-pan',
  'Specifically designed for making perfect risotto, this pan features a copper core for precise heat control and a wide, flat bottom.',
  'Perfect heat control for creamy risotto every time',
  189.99, NULL, id, 'Ruffoni', 'COOK-002', 15,
  '["https://images.pexels.com/photos/6996089/pexels-photo-6996089.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"diameter": "30cm", "material": "Copper core, stainless steel"}'::jsonb,
  4.8, 56, true, true, ARRAY['copper', 'risotto', 'luxury']
FROM categories WHERE slug = 'cookware'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Traditional Pizza Stone Set',
  'pizza-stone-set',
  'Bring authentic pizzeria results to your home oven with this cordierite pizza stone and wooden peel set.',
  'Create pizzeria-quality pizza at home',
  74.99, 89.99, id, 'Forno Italiano', 'COOK-003', 45,
  '["https://images.pexels.com/photos/6996089/pexels-photo-6996089.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"stone_size": "38cm round", "material": "Cordierite"}'::jsonb,
  4.6, 198, false, false, ARRAY['pizza', 'baking', 'set']
FROM categories WHERE slug = 'cookware'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Tableware category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Hand-Painted Deruta Dinner Set',
  'deruta-dinner-set',
  'A stunning 16-piece dinner set featuring the iconic Renaissance patterns of Deruta, Umbria. Each piece is hand-painted by skilled artisans.',
  'Artisan Italian ceramics for elegant dining',
  289.99, 349.99, id, 'Ceramiche Deruta', 'TABLE-001', 10,
  '["https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"pieces": "16 (4 dinner plates, 4 salad plates, 4 bowls, 4 mugs)", "material": "Hand-painted majolica"}'::jsonb,
  4.9, 45, true, false, ARRAY['handmade', 'ceramics', 'luxury']
FROM categories WHERE slug = 'tableware'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Murano Glass Carafe Set',
  'murano-glass-carafe',
  'Blown by master glass artists on the island of Murano, this elegant carafe and glass set features subtle swirls of color that catch the light beautifully.',
  'Handblown Venetian glass for special occasions',
  159.99, NULL, id, 'Vetro Murano', 'TABLE-002', 12,
  '["https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"pieces": "1 carafe, 6 glasses", "material": "Murano glass"}'::jsonb,
  4.8, 67, true, true, ARRAY['murano', 'handblown', 'gift']
FROM categories WHERE slug = 'tableware'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Olive Wood Serving Board',
  'olive-wood-serving-board',
  'Carved from a single piece of centuries-old olive wood, each serving board is a unique work of art with distinctive grain patterns.',
  'Unique olive wood board for beautiful presentations',
  68.99, NULL, id, 'Legno Mediterraneo', 'TABLE-003', 30,
  '["https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"size": "40cm x 25cm", "material": "Olive wood"}'::jsonb,
  4.7, 134, false, false, ARRAY['olive-wood', 'serving', 'natural']
FROM categories WHERE slug = 'tableware'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Italian Espresso Cups Set',
  'espresso-cups-set',
  'Classic Italian espresso cups in the traditional style of Naples cafes. Set of six cups with matching saucers.',
  'Traditional espresso cups for coffee lovers',
  49.99, NULL, id, 'Porcellana Napoli', 'TABLE-004', 40,
  '["https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"pieces": "6 cups, 6 saucers", "capacity": "60ml"}'::jsonb,
  4.8, 167, false, false, ARRAY['espresso', 'coffee', 'porcelain']
FROM categories WHERE slug = 'tableware'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Textiles category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Tuscan Linen Tablecloth',
  'tuscan-linen-tablecloth',
  'Woven from the finest Italian flax, this tablecloth brings rustic elegance to any dining occasion. Pre-washed for softness.',
  'Premium Italian linen for elegant dining',
  124.99, 149.99, id, 'Tessuti Toscani', 'TEXT-001', 25,
  '["https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"size": "180cm x 270cm", "material": "100% Italian linen"}'::jsonb,
  4.8, 78, true, false, ARRAY['linen', 'tablecloth', 'natural']
FROM categories WHERE slug = 'textiles'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Mediterranean Throw Blanket',
  'mediterranean-throw-blanket',
  'A luxuriously soft throw blanket featuring traditional Mediterranean patterns in warm terracotta and olive tones.',
  'Cozy throw with classic Mediterranean patterns',
  89.99, NULL, id, 'Tessuti Toscani', 'TEXT-002', 35,
  '["https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"size": "150cm x 200cm", "material": "60% cotton, 40% wool"}'::jsonb,
  4.6, 92, false, true, ARRAY['throw', 'blanket', 'cozy']
FROM categories WHERE slug = 'textiles'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Ceramics category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Amalfi Coast Vase Collection',
  'amalfi-coast-vases',
  'A set of three hand-painted ceramic vases inspired by the vibrant colors of the Amalfi Coast.',
  'Vibrant hand-painted vases inspired by coastal Italy',
  149.99, 179.99, id, 'Ceramiche Amalfi', 'CER-001', 15,
  '["https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"pieces": "3 vases", "heights": "15cm, 20cm, 25cm"}'::jsonb,
  4.9, 56, true, true, ARRAY['vases', 'handpainted', 'amalfi']
FROM categories WHERE slug = 'ceramics'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Sicilian Ceramic Tile Set',
  'sicilian-tile-set',
  'Bring the beauty of Sicily into your home with this set of six decorative ceramic tiles featuring traditional patterns.',
  'Traditional Sicilian patterns for home decoration',
  54.99, NULL, id, 'Ceramiche Siciliane', 'CER-002', 40,
  '["https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"pieces": "6 tiles", "size": "10cm x 10cm each"}'::jsonb,
  4.7, 123, false, false, ARRAY['tiles', 'sicilian', 'decor']
FROM categories WHERE slug = 'ceramics'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Venetian Glass Jewelry Dish',
  'venetian-jewelry-dish',
  'A petite treasure from the island of Murano, this hand-blown glass dish features swirling colors and gold leaf accents.',
  'Elegant handmade dish for precious trinkets',
  45.99, NULL, id, 'Vetro Murano', 'CER-003', 25,
  '["https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"diameter": "12cm", "material": "Murano glass with gold leaf"}'::jsonb,
  4.9, 89, false, false, ARRAY['murano', 'jewelry', 'gift']
FROM categories WHERE slug = 'ceramics'
ON CONFLICT (sku) DO NOTHING;

-- Insert Products for Gift Collections category
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Italian Pantry Essentials Box',
  'pantry-essentials-box',
  'Everything you need to create authentic Italian cuisine at home. This beautifully packaged gift box includes extra virgin olive oil, aged balsamic vinegar, San Marzano tomatoes, artisan pasta, and premium herbs.',
  'Complete starter kit for Italian home cooking',
  129.99, 159.99, id, 'Mercato', 'GIFT-001', 30,
  '["https://images.pexels.com/photos/5874592/pexels-photo-5874592.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"includes": "EVOO 500ml, Balsamic 250ml, Passata 680g, Spaghetti 500g, Italian herbs", "packaging": "Wooden gift crate"}'::jsonb,
  4.9, 187, true, false, ARRAY['gift', 'set', 'bestseller']
FROM categories WHERE slug = 'gift-collections'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'Olive Oil Tasting Collection',
  'olive-oil-tasting',
  'Explore the diverse world of Italian olive oils with this curated tasting set featuring four regional varieties.',
  'Discover regional Italian olive oil varieties',
  79.99, NULL, id, 'Mercato', 'GIFT-002', 25,
  '["https://images.pexels.com/photos/5874592/pexels-photo-5874592.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"includes": "4 x 100ml olive oils, tasting wheel, recipe cards", "packaging": "Elegant gift box"}'::jsonb,
  4.8, 94, true, true, ARRAY['tasting', 'olive-oil', 'gift']
FROM categories WHERE slug = 'gift-collections'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, brand, sku, stock, images, specifications, rating, review_count, is_featured, is_new, tags)
SELECT 
  'La Dolce Vita Entertaining Set',
  'dolce-vita-set',
  'Host the perfect Italian-inspired gathering with this complete entertaining set including marble cheese board, olive wood utensils, and hand-painted plates.',
  'Complete hosting set for Italian-style entertaining',
  199.99, 249.99, id, 'Mercato', 'GIFT-003', 15,
  '["https://images.pexels.com/photos/5874592/pexels-photo-5874592.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '{"includes": "Marble board, olive wood servers, 4 appetizer plates, 8 napkins", "packaging": "Premium gift box"}'::jsonb,
  4.7, 62, true, false, ARRAY['entertaining', 'gift', 'luxury']
FROM categories WHERE slug = 'gift-collections'
ON CONFLICT (sku) DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, is_active) VALUES
  ('WELCOME10', 'percentage', 10.00, 50.00, true),
  ('SAVE20', 'fixed', 20.00, 100.00, true),
  ('FREESHIP', 'fixed', 9.99, 75.00, true)
ON CONFLICT (code) DO NOTHING;
