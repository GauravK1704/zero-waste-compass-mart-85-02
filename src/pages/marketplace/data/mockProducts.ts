
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  seller: string;
  sellerId: string;
  rating: number;
  image: string;
  expiryDate: string;
  discountPercentage?: number;
  inStock?: boolean;
  sellerVerified?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Fresh Apples',
    price: 150,
    category: 'fruits',
    seller: 'Fresh Farm Co.',
    sellerId: 'seller1',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2025-01-30',
    discountPercentage: 10,
    inStock: true,
    sellerVerified: true
  },
  {
    id: '2',
    name: 'Premium Basmati Rice',
    price: 280,
    category: 'grains',
    seller: 'Grain Masters',
    sellerId: 'seller2',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2025-12-31',
    inStock: true,
    sellerVerified: false
  },
  {
    id: '3',
    name: 'Fresh Organic Vegetables Mix',
    price: 200,
    category: 'vegetables',
    seller: 'Green Valley',
    sellerId: 'seller3',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2025-01-28',
    discountPercentage: 15,
    inStock: true,
    sellerVerified: true
  },
  {
    id: '4',
    name: 'Artisan Whole Wheat Bread',
    price: 80,
    category: 'bakery',
    seller: 'Local Bakery',
    sellerId: 'seller4',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2025-01-27',
    discountPercentage: 5,
    inStock: true,
    sellerVerified: false
  },
  {
    id: '5',
    name: 'Premium Dairy Milk',
    price: 60,
    category: 'dairy',
    seller: 'Pure Dairy Co.',
    sellerId: 'seller5',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2025-01-29',
    inStock: true,
    sellerVerified: true
  },
  {
    id: '6',
    name: 'Organic Honey',
    price: 350,
    category: 'condiments',
    seller: 'Bee Natural',
    sellerId: 'seller6',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2026-01-25',
    inStock: true,
    sellerVerified: true
  },
  {
    id: '7',
    name: 'Fresh Chicken Breast',
    price: 300,
    category: 'meat',
    seller: 'Farm Fresh Meat',
    sellerId: 'seller7',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2025-01-26',
    discountPercentage: 20,
    inStock: true,
    sellerVerified: false
  },
  {
    id: '8',
    name: 'Wild Caught Salmon',
    price: 450,
    category: 'seafood',
    seller: 'Ocean Fresh',
    sellerId: 'seller8',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format&q=80',
    expiryDate: '2025-01-25',
    inStock: true,
    sellerVerified: true
  }
];
