
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Moon, Sun, User, Lock, Bell, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";

const Settings = () => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    darkMode: false,
    notifications: true,
    language: "en",
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserPreferences();
    }
  }, [user]);

  // Apply dark mode based on user preference
  useEffect(() => {
    if (userPreferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userPreferences.darkMode]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const fetchUserPreferences = async () => {
    if (!user) return;
    
    try {
      // Simulate fetching preferences from database
      // In a real app, you would fetch this from the database
      setUserPreferences({
        darkMode: localStorage.getItem('darkMode') === 'true',
        notifications: localStorage.getItem('notifications') !== 'false',
        language: localStorage.getItem('language') || 'en',
      });
      
      setIsDarkMode(localStorage.getItem('darkMode') === 'true');
    } catch (error: any) {
      console.error('Error fetching preferences:', error.message);
    }
  };

  const updateProfile = async (formData: any) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      setProfile({...profile, ...formData});
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setUserPreferences({...userPreferences, darkMode: newDarkMode});
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    toast({
      title: newDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled",
      description: `Theme has been changed to ${newDarkMode ? 'dark' : 'light'} mode.`,
    });
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setUserPreferences({...userPreferences, notifications: checked});
    localStorage.setItem('notifications', checked.toString());
    
    toast({
      title: checked ? "Notifications Enabled" : "Notifications Disabled",
      description: `You will ${checked ? 'now' : 'no longer'} receive notifications.`,
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value;
    setUserPreferences({...userPreferences, language});
    localStorage.setItem('language', language);
    
    toast({
      title: "Language Updated",
      description: `Language has been changed to ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Other'}.`,
    });
  };

  const handlePasswordChange = () => {
    // Implementation for password change
    toast({
      title: "Coming Soon",
      description: "Password change functionality will be implemented soon.",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Configure your account preferences and system options</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 glass-card">
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="security"><Lock className="mr-2 h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" /> Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    placeholder="John Doe"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="glass-input opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    placeholder="+91 9999999999"
                    value={profile?.phone_number || ''}
                    onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={profile?.address || ''}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="glass-input"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  onClick={() => updateProfile({
                    full_name: profile?.full_name,
                    phone_number: profile?.phone_number,
                    address: profile?.address
                  })}
                  disabled={isLoading}
                  className="glass-button bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how AssistMed looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Switch 
                      id="darkMode" 
                      checked={isDarkMode}
                      onCheckedChange={handleThemeToggle}
                    />
                    <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select your preferred language
                    </p>
                  </div>
                  <select 
                    id="language"
                    value={userPreferences.language}
                    onChange={handleLanguageChange}
                    className="glass-input rounded px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password"
                        className="glass-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password"
                        className="glass-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handlePasswordChange}
                    className="glass-button bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Update Password
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={userPreferences.notifications}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch id="smsNotifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminded about upcoming appointments
                    </p>
                  </div>
                  <Switch id="appointmentReminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="medicationReminders">Medication Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminded to take your medications
                    </p>
                  </div>
                  <Switch id="medicationReminders" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
