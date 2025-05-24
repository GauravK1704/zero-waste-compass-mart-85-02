
import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '@/components/NotificationCenter';
import AINotificationCenter from '@/components/notifications/AINotificationCenter';
import UserMenu from './UserMenu';

const TopNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-zwm-primary">ZeroWasteMart</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => navigate('/marketplace')}>
              Marketplace
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
          
          {/* Regular Notifications */}
          <NotificationCenter />
          
          {/* AI-Powered Notifications for Sellers */}
          {user?.role === 'seller' && <AINotificationCenter />}
          
          {user ? (
            <UserMenu />
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate('/auth/login')}>
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
