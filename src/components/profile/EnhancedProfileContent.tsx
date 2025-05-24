
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Star, Shield, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { User as UserType } from '@/types';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface EnhancedProfileContentProps {
  currentUser: UserType;
  updateProfile?: (user: Partial<UserType>) => Promise<void>;
  activeTab: string;
  isEditing: boolean;
  toggleEdit: () => void;
  handleSave: () => void;
  loading: boolean;
  profileImage: string | null;
  handleProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const translations = {
  english: {
    personalInfo: "Personal Information",
    displayName: "Display Name",
    email: "Email Address",
    language: "Language",
    profilePicture: "Profile Picture",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    accountDetails: "Account Details",
    memberSince: "Member Since",
    accountType: "Account Type",
    verified: "Verified",
    unverified: "Unverified",
    buyer: "Buyer",
    seller: "Seller",
    admin: "Admin"
  },
  hindi: {
    personalInfo: "व्यक्तिगत जानकारी",
    displayName: "प्रदर्शन नाम",
    email: "ईमेल पता",
    language: "भाषा",
    profilePicture: "प्रोफ़ाइल चित्र",
    editProfile: "प्रोफ़ाइल संपादित करें",
    saveChanges: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    accountDetails: "खाता विवरण",
    memberSince: "सदस्य बने",
    accountType: "खाता प्रकार",
    verified: "सत्यापित",
    unverified: "असत्यापित",
    buyer: "खरीदार",
    seller: "विक्रेता",
    admin: "व्यवस्थापक"
  }
};

const EnhancedProfileContent: React.FC<EnhancedProfileContentProps> = ({
  currentUser,
  updateProfile,
  activeTab,
  isEditing,
  toggleEdit,
  handleSave,
  loading,
  profileImage,
  handleProfileImageChange
}) => {
  const [editedUser, setEditedUser] = useState<Partial<UserType>>(currentUser);
  const { isDarkMode } = useTheme();
  const userLanguage = currentUser.language || 'english';
  const t = translations[userLanguage as keyof typeof translations] || translations.english;

  if (activeTab !== "personal") return null;

  const handleInputChange = (field: keyof UserType, value: any) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Profile Header Card */}
        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
            <div className="absolute -bottom-16 left-6 flex items-end space-x-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profileImage || currentUser.photoURL || undefined} />
                  <AvatarFallback className="text-2xl bg-white text-gray-600">
                    {currentUser.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <Edit3 size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          <CardContent className="pt-20 pb-6 dark:bg-gray-800">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold dark:text-white">{currentUser.displayName}</h1>
                <p className="text-gray-600 dark:text-gray-300">{currentUser.email}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={currentUser.verified ? "default" : "secondary"}>
                    <Shield size={12} className="mr-1" />
                    {currentUser.verified ? t.verified : t.unverified}
                  </Badge>
                  <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                    <User size={12} className="mr-1" />
                    {currentUser.role === 'buyer' ? t.buyer : currentUser.role === 'seller' ? t.seller : t.admin}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button onClick={toggleEdit} variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Edit3 size={16} className="mr-2" />
                    {t.editProfile}
                  </Button>
                ) : (
                  <>
                    <Button onClick={toggleEdit} variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      <X size={16} className="mr-2" />
                      {t.cancel}
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      <Save size={16} className="mr-2" />
                      {t.saveChanges}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <User size={20} />
              <span>{t.personalInfo}</span>
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Manage your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="dark:text-gray-300">{t.displayName}</Label>
                {isEditing ? (
                  <Input
                    id="displayName"
                    value={editedUser.displayName || ''}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md dark:text-white">{currentUser.displayName}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300">{t.email}</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md dark:text-white">{currentUser.email}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="dark:text-gray-300">{t.language}</Label>
                {isEditing ? (
                  <select
                    id="language"
                    value={editedUser.language || 'english'}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="english">English</option>
                    <option value="hindi">हिंदी (Hindi)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                    <option value="telugu">తెలుగు (Telugu)</option>
                    <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                  </select>
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md dark:text-white">
                    {currentUser.language === 'hindi' ? 'हिंदी (Hindi)' : 
                     currentUser.language === 'tamil' ? 'தமிழ் (Tamil)' :
                     currentUser.language === 'telugu' ? 'తెలుగు (Telugu)' :
                     currentUser.language === 'kannada' ? 'ಕನ್ನಡ (Kannada)' : 'English'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <Shield size={20} />
              <span>{t.accountDetails}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.memberSince}</p>
                  <p className="font-medium dark:text-white">January 2024</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User size={16} className="text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.accountType}</p>
                  <p className="font-medium capitalize dark:text-white">{currentUser.role}</p>
                </div>
              </div>
              
              {currentUser.isSeller && currentUser.trustScore && (
                <div className="flex items-center space-x-3">
                  <Star size={16} className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Trust Score</p>
                    <p className="font-medium dark:text-white">{currentUser.trustScore}/5.0</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedProfileContent;
