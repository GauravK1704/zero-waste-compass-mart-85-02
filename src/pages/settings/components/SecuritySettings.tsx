
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

const SecuritySettings: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Security & Privacy</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Manage your account security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium dark:text-white">Change Password</h3>
          <div className="space-y-2">
            <Label htmlFor="current-password" className="dark:text-white">Current Password</Label>
            <Input 
              id="current-password" 
              type="password" 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="dark:text-white">New Password</Label>
            <Input 
              id="new-password" 
              type="password" 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="dark:text-white">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <Button className="mt-2">Update Password</Button>
        </div>
        
        <div className="pt-6 border-t dark:border-gray-600">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Account Deletion</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" className="flex items-center">
            <Trash2 size={16} className="mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
