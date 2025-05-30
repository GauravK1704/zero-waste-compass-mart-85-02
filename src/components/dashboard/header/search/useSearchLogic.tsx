
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/use-auth';
import { mockProducts } from '@/pages/marketplace/data/mockProducts';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'order' | 'user' | 'category' | 'page' | 'setting';
  description?: string;
  url: string;
  price?: number;
}

export const useSearchLogic = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const searchItems = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results: SearchResult[] = [];
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Search marketplace products
    const productResults = mockProducts
      .filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        title: product.name,
        type: 'product' as const,
        description: `₹${product.price} - ${product.category}`,
        url: '/marketplace',
        price: product.price
      }));

    // Mock results based on user type
    const contextResults: SearchResult[] = currentUser?.isSeller ? [
      {
        id: '1',
        title: 'Seller Analytics',
        type: 'page',
        description: 'View sales analytics',
        url: '/seller/analytics'
      },
      {
        id: '2',
        title: 'Order Management',
        type: 'page',
        description: 'Manage your orders',
        url: '/seller/orders'
      },
      {
        id: '3',
        title: 'Product Management',
        type: 'page',
        description: 'Manage your products',
        url: '/seller/products'
      }
    ] : [
      {
        id: '1',
        title: 'My Orders',
        type: 'page',
        description: 'Track your orders',
        url: '/orders'
      },
      {
        id: '2',
        title: 'Profile Settings',
        type: 'setting',
        description: 'Update your profile',
        url: '/profile'
      },
      {
        id: '3',
        title: 'Account Settings',
        type: 'setting',
        description: 'Manage account settings',
        url: '/settings'
      }
    ];
    
    const filteredContextResults = contextResults.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    results.push(...productResults, ...filteredContextResults);
    
    setIsLoading(false);
    return results.slice(0, 6);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        searchItems(query).then(setResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
    handleResultClick,
    clearSearch
  };
};
