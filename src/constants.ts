import { Product, Order, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Quantum Wireless Over-Ear Headphones',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 299.00,
    sku: 'ELC-4029-BK',
    stockLevel: 142,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426da473b?auto=format&fit=crop&q=80&w=800',
    description: 'Experience unparalleled audio clarity with the Aura Studio Pro Wireless. Featuring active noise cancellation tailored for the modern professional, these headphones blend premium earthy materials with cutting-edge digital soundscapes.',
    rating: 4,
    reviews: 128,
    tags: ['Noise Cancelling', 'Wireless', 'Premium'],
    colors: [
      { name: 'Midnight Slate', value: '#1a1a1a' },
      { name: 'Sandstone', value: '#d2b48c' },
      { name: 'Forest Green', value: '#2e8b57' }
    ]
  },
  {
    id: '2',
    name: 'AeroGrip Performance Runners',
    category: 'Fashion',
    subcategory: 'Men',
    price: 145.00,
    sku: 'FTW-1049-RED',
    stockLevel: 18,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Lightweight performance running shoes designed for speed and comfort. Features breathable mesh and advanced cushioning.',
    rating: 4.5,
    reviews: 84,
    tags: ['Running', 'Athletic', 'Speed']
  },
  {
    id: '3',
    name: 'Nexus Smartwatch Pro',
    category: 'Electronics',
    subcategory: 'Wearables',
    price: 199.99,
    oldPrice: 250.00,
    sku: 'ELC-8821-WHT',
    stockLevel: 45,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    description: 'A minimalist smartwatch that keeps you connected and tracks your health effortlessly.',
    rating: 3.8,
    reviews: 42,
    tags: ['Smart', 'Health', 'Minimalist']
  },
  {
    id: '4',
    name: 'Artisan Ceramic Mug Set',
    category: 'Home',
    subcategory: 'Kitchen',
    price: 45.00,
    sku: 'HOM-3301-NAT',
    stockLevel: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800',
    description: 'Hand-crafted ceramic mugs with a matte finish. Perfect for your morning coffee ritual.',
    rating: 4.8,
    reviews: 210,
    tags: ['Handmade', 'Ceramic', 'Home']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    userName: 'John D.',
    userInitials: 'JD',
    rating: 5,
    date: '2 days ago',
    comment: 'The noise cancellation on these is surreal. I use them in a busy office and it completely isolates me. The build feels premium, definitely worth the investment.'
  },
  {
    id: 'r2',
    userName: 'Sarah M.',
    userInitials: 'SM',
    rating: 4,
    date: '1 week ago',
    comment: 'Sound profile is perfectly balanced for acoustic and digital tracks. My only minor gripe is they can feel a bit heavy after 4+ hours of continuous wear.'
  },
  {
    id: 'r3',
    userName: 'Alex R.',
    userInitials: 'AR',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Visually stunning piece of hardware. The touch controls are highly responsive. The battery life actually exceeds the advertised 30 hours in my experience.'
  }
];

export const ORDERS: Order[] = [
  {
    id: 'ORD-2023-8901',
    date: 'October 24, 2023',
    total: 249.99,
    status: 'Processing',
    estimatedDelivery: 'Oct 28',
    items: [
      { productId: '1', name: 'Quantum Wireless Headphones', quantity: 1, price: 299.00, image: PRODUCTS[0].image },
      { productId: '3', name: 'Nexus Smartwatch Pro', quantity: 1, price: 199.99, image: PRODUCTS[2].image }
    ]
  },
  {
    id: 'ORD-2023-8755',
    date: 'Sep 15, 2023',
    total: 129.00,
    status: 'Delivered',
    items: [
      { productId: 'x', name: 'Acoustic Smart Speaker Gen 3', quantity: 1, price: 129.00, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800' }
    ]
  }
];
