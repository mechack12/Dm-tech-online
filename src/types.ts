export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'guest';
  avatar?: string;
}

export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  sku: string;
  stockLevel: number;
  status: ProductStatus;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  tags?: string[];
  sizes?: string[];
  colors?: { name: string; value: string }[];
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Delivered' | 'Cancelled';
  estimatedDelivery?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export interface Review {
  id: string;
  userName: string;
  userInitials: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CartItem extends Product {
  quantity: number;
}
