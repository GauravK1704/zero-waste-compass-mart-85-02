
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon,
  Bell,
  Lock,
  Sun
} from "lucide-react";

const SettingsNavigation: React.FC = () => {
  return (
    <Card className="lg:col-span-1 dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <TabsList className="flex flex-col h-auto space-y-1 bg-transparent w-full">
          <TabsTrigger value="general" className="justify-start w-full dark:data-[state=active]:bg-gray-700 dark:text-white">
            <SettingsIcon size={16} className="mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start w-full dark:data-[state=active]:bg-gray-700 dark:text-white">
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="justify-start w-full dark:data-[state=active]:bg-gray-700 dark:text-white">
            <Lock size={16} className="mr-2" />
            Security & Privacy
          </TabsTrigger>
          <TabsTrigger value="appearance" className="justify-start w-full dark:data-[state=active]:bg-gray-700 dark:text-white">
            <Sun size={16} className="mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>
      </CardContent>
    </Card>
  );
};

export default SettingsNavigation;
