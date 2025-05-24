
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon,
  Bell,
  Lock,
  Sun,
  Moon,
  Trash2,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

const Settings: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>
        <Button onClick={handleSaveSettings} className="mt-4 md:mt-0 flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <TabsList className="flex flex-col h-auto space-y-1 bg-transparent w-full">
                <TabsTrigger value="general" className="justify-start w-full">
                  <SettingsIcon size={16} className="mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start w-full">
                  <Lock size={16} className="mr-2" />
                  Security & Privacy
                </TabsTrigger>
                <TabsTrigger value="appearance" className="justify-start w-full">
                  <Sun size={16} className="mr-2" />
                  Appearance
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <TabsContent value="general" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your basic account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select 
                      id="language" 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-input rounded-md"
                    >
                      <option value="english">English</option>
                      <option value="hindi">हिंदी (Hindi)</option>
                      <option value="tamil">தமிழ் (Tamil)</option>
                      <option value="telugu">తెలుగు (Telugu)</option>
                      <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                    </select>
                    <p className="text-sm text-muted-foreground">
                      Your profile language will be updated when you save changes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select 
                      id="timezone" 
                      className="w-full h-10 px-3 py-2 border border-input rounded-md"
                    >
                      <option value="IST">Indian Standard Time (IST)</option>
                      <option value="PST">Pacific Standard Time (PST)</option>
                      <option value="EST">Eastern Standard Time (EST)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Allow the app to send you notifications</p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  
                  {notificationsEnabled && (
                    <>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch 
                          id="email-notifications" 
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                        </div>
                        <Switch 
                          id="push-notifications" 
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="mt-2">Update Password</Button>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Account Deletion</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" className="flex items-center">
                      <Trash2 size={16} className="mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className={`p-4 border rounded-lg cursor-pointer flex items-center gap-2 ${!darkMode ? 'border-primary bg-primary/10' : ''}`} onClick={() => setDarkMode(false)}>
                        <Sun size={18} />
                        <span>Light Mode</span>
                      </div>
                      <div className={`p-4 border rounded-lg cursor-pointer flex items-center gap-2 ${darkMode ? 'border-primary bg-primary/10' : ''}`} onClick={() => setDarkMode(true)}>
                        <Moon size={18} />
                        <span>Dark Mode</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Font Size</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 border rounded-lg cursor-pointer text-center">
                        <span className="text-sm">Small</span>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer text-center border-primary bg-primary/10">
                        <span className="text-base">Medium</span>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer text-center">
                        <span className="text-lg">Large</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
