
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar, FileText, User, Activity, LogIn, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-care-light">
      <header className="bg-white shadow-sm border-b border-care-border">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
              alt="CareHub Logo" 
              className="h-8 w-8 mr-2" 
            />
            <h1 className="text-2xl font-bold text-care-dark">CareHub</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-care-dark font-medium">Home</Link>
            <Link to="/dashboard" className="text-gray-500 hover:text-care-dark">Dashboard</Link>
            <Link to="/chat" className="text-gray-500 hover:text-care-dark">Messages</Link>
            <Link to="/appointments" className="text-gray-500 hover:text-care-dark">Appointments</Link>
          </nav>
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="outline" className="border-care-primary text-care-primary">
                <LogIn size={18} className="mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-care-primary hover:bg-care-dark">
                <UserPlus size={18} className="mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        <div className="container mx-auto py-10 px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-care-dark mb-2">Welcome to CareHub</h2>
            <p className="text-gray-600 max-w-2xl">
              Your comprehensive hospital management platform. Connect with your care team,
              schedule appointments, access your records, and take control of your health journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/chat" className="block">
              <Card className="h-full transition-shadow hover:shadow-md border-care-border">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-care-primary/10 flex items-center justify-center mb-1">
                    <MessageSquare className="h-6 w-6 text-care-primary" />
                  </div>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Connect with your care team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Communicate securely with your doctors, nurses, and care coordinators.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/appointments" className="block">
              <Card className="h-full transition-shadow hover:shadow-md border-care-border">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-care-secondary/10 flex items-center justify-center mb-1">
                    <Calendar className="h-6 w-6 text-care-secondary" />
                  </div>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>
                    Schedule and manage visits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Book appointments, manage your schedule, and set up reminders.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/patients" className="block">
              <Card className="h-full transition-shadow hover:shadow-md border-care-border">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-care-accent/10 flex items-center justify-center mb-1">
                    <FileText className="h-6 w-6 text-care-accent" />
                  </div>
                  <CardTitle>Records</CardTitle>
                  <CardDescription>
                    Access your health documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    View and download your medical records, test results, and prescriptions.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/ai-chatbot" className="block">
              <Card className="h-full transition-shadow hover:shadow-md border-care-border">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-care-dark/10 flex items-center justify-center mb-1">
                    <Activity className="h-6 w-6 text-care-dark" />
                  </div>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Get instant support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Access our AI assistant for quick answers to your health questions and hospital information.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="mt-12 md:mt-20">
            <div className="bg-white rounded-lg shadow-md border border-care-border p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-care-dark mb-2">
                  Hospital Management System
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our comprehensive system allows healthcare providers to manage appointments, patient records,
                  staff, inventory, and more - all in one integrated platform.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-care-primary hover:bg-care-dark">
                    Access Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-care-border mt-10">
        <div className="container mx-auto py-6 px-4 text-center text-gray-500">
          <p>© 2025 CareHub Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
