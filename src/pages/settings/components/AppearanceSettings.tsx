
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const AppearanceSettings: React.FC = () => {
  const { isDarkMode, setDarkMode } = useTheme();

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Appearance</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Customize how the application looks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium dark:text-white">Theme</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer flex items-center gap-2 transition-all dark:border-gray-600 ${
                !isDarkMode ? 'border-primary bg-primary/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`} 
              onClick={() => handleDarkModeToggle(false)}
            >
              <Sun size={18} />
              <span className="dark:text-white">Light Mode</span>
            </div>
            <div 
              className={`p-4 border rounded-lg cursor-pointer flex items-center gap-2 transition-all dark:border-gray-600 ${
                isDarkMode ? 'border-primary bg-primary/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`} 
              onClick={() => handleDarkModeToggle(true)}
            >
              <Moon size={18} />
              <span className="dark:text-white">Dark Mode</span>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t dark:border-gray-600">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Font Size</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg cursor-pointer text-center dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="text-sm dark:text-white">Small</span>
            </div>
            <div className="p-3 border rounded-lg cursor-pointer text-center border-primary bg-primary/10 dark:border-gray-600">
              <span className="text-base dark:text-white">Medium</span>
            </div>
            <div className="p-3 border rounded-lg cursor-pointer text-center dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="text-lg dark:text-white">Large</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
