export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  inStock: boolean;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  brand: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestseller?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: { name: string; slug: string }[];
}
