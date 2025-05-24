
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";

interface GeneralSettingsProps {
  language: string;
  setLanguage: (language: string) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ language, setLanguage }) => {
  const { isDarkMode, setDarkMode } = useTheme();

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">General Settings</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Manage your basic account settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language" className="dark:text-white">Language</Label>
          <select 
            id="language" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-input rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="english">English</option>
            <option value="hindi">हिंदी (Hindi)</option>
            <option value="tamil">தமிழ் (Tamil)</option>
            <option value="telugu">తెలుగు (Telugu)</option>
            <option value="kannada">ಕನ್ನಡ (Kannada)</option>
          </select>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Your profile language will be updated when you save changes.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone" className="dark:text-white">Timezone</Label>
          <select 
            id="timezone" 
            className="w-full h-10 px-3 py-2 border border-input rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="IST">Indian Standard Time (IST)</option>
            <option value="PST">Pacific Standard Time (PST)</option>
            <option value="EST">Eastern Standard Time (EST)</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode" className="dark:text-white">Dark Mode</Label>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Toggle dark mode theme</p>
          </div>
          <Switch 
            id="dark-mode" 
            checked={isDarkMode}
            onCheckedChange={handleDarkModeToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
