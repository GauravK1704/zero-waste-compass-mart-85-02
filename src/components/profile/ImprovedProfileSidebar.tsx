
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Link2, 
  ShieldCheck, 
  Settings,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ImprovedProfileSidebarProps {
  currentUser: any;
  profileImage: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ImprovedProfileSidebar: React.FC<ImprovedProfileSidebarProps> = ({ 
  currentUser, 
  profileImage, 
  activeTab, 
  setActiveTab 
}) => {
  const { isDarkMode } = useTheme();

  const navigationItems = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      color: "from-blue-500 to-blue-600",
      description: "Manage your personal details"
    },
    {
      id: "security",
      label: "Security",
      icon: ShieldCheck,
      color: "from-green-500 to-green-600",
      description: "Password and security settings"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "from-amber-500 to-amber-600",
      description: "Notification preferences"
    },
    {
      id: "social",
      label: "Social Media",
      icon: Link2,
      color: "from-purple-500 to-purple-600",
      description: "Connect your social accounts"
    }
  ];

  const navItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className={`w-full md:w-80 transition-colors duration-300 ${
        isDarkMode ? 'dark' : ''
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div 
            className="relative flex flex-col items-center text-center"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="h-20 w-20 border-4 border-white/30 shadow-2xl mb-4">
                <AvatarImage src={profileImage || undefined} alt={currentUser.displayName || "Profile"} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold backdrop-blur-sm">
                  {currentUser.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            <h2 className="text-xl font-bold text-white mb-1">
              {currentUser.displayName || "User"}
            </h2>
            
            <p className="text-white/80 text-sm mb-3">
              {currentUser.email}
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <User className="h-3 w-3 mr-1" />
                {currentUser.isSeller ? 'Seller' : 'Buyer'}
              </Badge>
              {currentUser.verified && (
                <Badge variant="secondary" className="bg-green-500/20 text-white border-green-400/30">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </motion.div>
        </div>

        <CardContent className="p-6 dark:bg-gray-800">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="h-5 w-5 mx-auto text-blue-600 dark:text-blue-400 mb-1" />
              <p className="text-xs text-gray-600 dark:text-gray-300">Joined</p>
              <p className="font-semibold text-sm dark:text-white">Jan 2024</p>
            </div>
            {currentUser.isSeller && currentUser.trustScore && (
              <div className="text-center p-3 bg-amber-50 dark:bg-gray-700 rounded-lg">
                <Star className="h-5 w-5 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Trust Score</p>
                <p className="font-semibold text-sm dark:text-white">{currentUser.trustScore}/5.0</p>
              </div>
            )}
          </div>

          <Separator className="my-6 dark:bg-gray-600" />
          
          {/* Navigation */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
              Profile Settings
            </h3>
            
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start p-4 h-auto text-left transition-all duration-200 ${
                      isActive 
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg dark:shadow-gray-900/50` 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="flex items-center w-full">
                      <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                      <div className="flex-1">
                        <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <Separator className="my-6 dark:bg-gray-600" />

          {/* Footer info */}
          <motion.div 
            className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Profile completion: <span className="font-semibold text-blue-600 dark:text-blue-400">85%</span>
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ImprovedProfileSidebar;
