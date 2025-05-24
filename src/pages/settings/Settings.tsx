
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import GeneralSettings from "./components/GeneralSettings";
import NotificationSettings from "./components/NotificationSettings";
import SecuritySettings from "./components/SecuritySettings";
import AppearanceSettings from "./components/AppearanceSettings";
import SettingsNavigation from "./components/SettingsNavigation";

const Settings: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState(currentUser?.language || "english");

  // Initialize settings from user data
  useEffect(() => {
    if (currentUser) {
      setLanguage(currentUser.language || "english");
      if (currentUser.notificationPreferences) {
        setEmailNotifications(currentUser.notificationPreferences.email);
        setPushNotifications(currentUser.notificationPreferences.push);
      }
    }
  }, [currentUser]);

  const handleSaveSettings = async () => {
    try {
      const previousLanguage = currentUser?.language;
      
      await updateUser({
        language,
        notificationPreferences: {
          email: emailNotifications,
          push: pushNotifications,
          sms: false,
          marketingEmails: true
        }
      });
      
      toast.success("Settings saved successfully!");
      
      // Force a page reload only if language changed
      if (previousLanguage !== language) {
        toast.success("Language updated! Reloading page...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 px-4 md:px-0"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Settings</h1>
          <p className="text-muted-foreground dark:text-gray-300">
            Manage your account preferences and settings
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="mt-4 md:mt-0 flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <SettingsNavigation />

          <div className="lg:col-span-3 space-y-6">
            <TabsContent value="general" className="m-0">
              <GeneralSettings 
                language={language}
                setLanguage={setLanguage}
              />
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <NotificationSettings
                notificationsEnabled={notificationsEnabled}
                setNotificationsEnabled={setNotificationsEnabled}
                emailNotifications={emailNotifications}
                setEmailNotifications={setEmailNotifications}
                pushNotifications={pushNotifications}
                setPushNotifications={setPushNotifications}
              />
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="appearance" className="m-0">
              <AppearanceSettings />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
