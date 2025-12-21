export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          price: number;
          original_price: number | null;
          category_id: string | null;
          brand: string | null;
          sku: string;
          stock: number;
          images: string[];
          specifications: Record<string, string>;
          rating: number;
          review_count: number;
          is_featured: boolean;
          is_new: boolean;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          original_price?: number | null;
          category_id?: string | null;
          brand?: string | null;
          sku: string;
          stock?: number;
          images?: string[];
          specifications?: Record<string, string>;
          rating?: number;
          review_count?: number;
          is_featured?: boolean;
          is_new?: boolean;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          original_price?: number | null;
          category_id?: string | null;
          brand?: string | null;
          sku?: string;
          stock?: number;
          images?: string[];
          specifications?: Record<string, string>;
          rating?: number;
          review_count?: number;
          is_featured?: boolean;
          is_new?: boolean;
          tags?: string[];
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          first_name: string;
          last_name: string;
          street: string;
          apartment: string | null;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          phone: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string;
          first_name: string;
          last_name: string;
          street: string;
          apartment?: string | null;
          city: string;
          state: string;
          zip_code: string;
          country?: string;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          first_name?: string;
          last_name?: string;
          street?: string;
          apartment?: string | null;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: string;
          subtotal: number;
          shipping_cost: number;
          tax: number;
          discount: number;
          total: number;
          shipping_address: Record<string, string>;
          billing_address: Record<string, string> | null;
          payment_method: string | null;
          payment_status: string;
          shipping_method: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          order_number: string;
          status?: string;
          subtotal: number;
          shipping_cost?: number;
          tax?: number;
          discount?: number;
          total: number;
          shipping_address: Record<string, string>;
          billing_address?: Record<string, string> | null;
          payment_method?: string | null;
          payment_status?: string;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          order_number?: string;
          status?: string;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          discount?: number;
          total?: number;
          shipping_address?: Record<string, string>;
          billing_address?: Record<string, string> | null;
          payment_method?: string | null;
          payment_status?: string;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string | null;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_image?: string | null;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_image?: string | null;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          content: string | null;
          helpful_votes: number;
          is_verified_purchase: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title?: string | null;
          content?: string | null;
          helpful_votes?: number;
          is_verified_purchase?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string | null;
          content?: string | null;
          helpful_votes?: number;
          is_verified_purchase?: boolean;
          created_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: string;
          discount_value: number;
          min_order_amount: number | null;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type?: string;
          discount_value: number;
          min_order_amount?: number | null;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: string;
          discount_value?: number;
          min_order_amount?: number | null;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type WishlistItem = Database['public']['Tables']['wishlists']['Row'];
export type Coupon = Database['public']['Tables']['coupons']['Row'];

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}
