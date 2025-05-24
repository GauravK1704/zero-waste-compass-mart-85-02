
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  emailNotifications: boolean;
  setEmailNotifications: (enabled: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (enabled: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationsEnabled,
  setNotificationsEnabled,
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications
}) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Control how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications" className="dark:text-white">Enable Notifications</Label>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Allow the app to send you notifications
            </p>
          </div>
          <Switch 
            id="notifications" 
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
        
        {notificationsEnabled && (
          <>
            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-600">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="dark:text-white">Email Notifications</Label>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-600">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="dark:text-white">Push Notifications</Label>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Receive push notifications on your device
                </p>
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
  );
};

export default NotificationSettings;
