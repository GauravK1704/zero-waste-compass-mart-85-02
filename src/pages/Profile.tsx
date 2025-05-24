
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import EnhancedProfileContent from '@/components/profile/EnhancedProfileContent';

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(currentUser?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (currentUser) {
      setProfileImage(currentUser.photoURL || null);
    }
  }, [currentUser]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (currentUser && updateProfile) {
        await updateProfile({
          ...currentUser,
          photoURL: profileImage,
        });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async (preferences: {
    email?: boolean;
    push?: boolean; 
    sms?: boolean;
    marketingEmails?: boolean;
  }) => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        toast.success("Notification preferences saved!");
        resolve();
      }, 500);
    });
  };

  const handleSocialSave = async (connections: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  }) => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        toast.success("Social media connections saved!");
        resolve();
      }, 500);
    });
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Sidebar */}
      <ProfileSidebar
        currentUser={currentUser}
        profileImage={profileImage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Enhanced Profile Content */}
      <div className="flex-1">
        <EnhancedProfileContent
          currentUser={currentUser}
          updateProfile={updateProfile}
          activeTab={activeTab}
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          handleSave={handleSave}
          loading={loading}
          profileImage={profileImage}
          handleProfileImageChange={handleProfileImageChange}
        />
      </div>
    </motion.div>
  );
};

export default Profile;
