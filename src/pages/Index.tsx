
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Calendar, FileText, Activity, LogIn, UserPlus, Search, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
              alt="HavenMed Logo" 
              className="h-8 w-8 mr-2" 
            />
            <h1 className="text-2xl font-bold text-care-dark">HavenMed</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-care-dark font-medium">Home</Link>
            <Link to="/dashboard" className="text-gray-500 hover:text-care-dark">Dashboard</Link>
            <Link to="/appointments" className="text-gray-500 hover:text-care-dark">Appointments</Link>
            <Link to="/doctors" className="text-gray-500 hover:text-care-dark">Doctors</Link>
            <Link to="/ai-chatbot" className="text-gray-500 hover:text-care-dark">Health AI</Link>
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
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-care-dark mb-4">Modern Healthcare Management System</h1>
              <p className="text-lg text-gray-600 mb-8">
                Streamline your hospital operations, enhance patient care, and optimize resource management all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="bg-care-primary hover:bg-care-dark">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-care-primary text-care-primary">
                  Book a Demo
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/lovable-uploads/a9450c4a-b487-46ab-9c8b-e4532fa48636.png" 
                alt="Hospital Dashboard" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-care-dark mb-3">Comprehensive Healthcare Management</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform provides all the tools you need to efficiently manage your healthcare facility, from patient records to inventory tracking.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link to="/appointments" className="block">
                <Card className="h-full transition-all hover:shadow-lg border-none bg-blue-50 hover:bg-blue-100">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                      <Calendar className="h-7 w-7 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Appointments</h3>
                    <p className="text-gray-600">
                      Efficiently schedule and manage patient appointments with our intuitive calendar interface.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/patients" className="block">
                <Card className="h-full transition-all hover:shadow-lg border-none bg-green-50 hover:bg-green-100">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-green-200 flex items-center justify-center mb-4">
                      <FileText className="h-7 w-7 text-green-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Patient Records</h3>
                    <p className="text-gray-600">
                      Maintain comprehensive patient records with medical history, treatments, and billing information.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/chat" className="block">
                <Card className="h-full transition-all hover:shadow-lg border-none bg-purple-50 hover:bg-purple-100">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-purple-200 flex items-center justify-center mb-4">
                      <MessageSquare className="h-7 w-7 text-purple-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Communication</h3>
                    <p className="text-gray-600">
                      Seamlessly communicate with staff and patients through our integrated messaging system.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/ai-chatbot" className="block">
                <Card className="h-full transition-all hover:shadow-lg border-none bg-amber-50 hover:bg-amber-100">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-amber-200 flex items-center justify-center mb-4">
                      <Activity className="h-7 w-7 text-amber-700" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                    <p className="text-gray-600">
                      Get instant support with our AI-powered assistant for medical queries and hospital information.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Call To Action Section */}
        <section className="py-16 bg-care-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your healthcare facility?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of hospitals and clinics that have optimized their operations with HavenMed.
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-care-primary hover:bg-gray-100">
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">HavenMed</h3>
              <p className="mb-4">
                Comprehensive hospital management system designed for modern healthcare facilities.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/appointments" className="hover:text-white">Appointments</Link></li>
                <li><Link to="/patients" className="hover:text-white">Patients</Link></li>
                <li><Link to="/doctors" className="hover:text-white">Doctors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
              <ul className="space-y-2">
                <li><Link to="/taskboard" className="hover:text-white">Task Management</Link></li>
                <li><Link to="/chat" className="hover:text-white">Communication</Link></li>
                <li><Link to="/payments" className="hover:text-white">Billing & Payments</Link></li>
                <li><Link to="/inventory" className="hover:text-white">Inventory Management</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2">
                <li>support@havenmed.com</li>
                <li>+91 123 456 7890</li>
                <li>123 Medical Plaza, Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-gray-700 text-center">
            <p>© 2025 HavenMed Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
