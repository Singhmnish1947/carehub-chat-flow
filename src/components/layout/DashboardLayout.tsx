
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Calendar, 
  CreditCard, 
  Building2, 
  MapPin, 
  Pill, 
  BedDouble, 
  UserCog, 
  Package, 
  Settings, 
  Bot, 
  Mail, 
  CheckSquare,
  Search,
  Bell,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CheckSquare, label: "Taskboard", href: "/taskboard" },
  { icon: Mail, label: "Inbox", href: "/inbox" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Users, label: "Doctors", href: "/doctors" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Building2, label: "Departments", href: "/departments" },
  { icon: MapPin, label: "Locations", href: "/locations" },
  { icon: Pill, label: "Medication", href: "/medication" },
  { icon: BedDouble, label: "Rooms & Beds", href: "/rooms" },
  { icon: UserCog, label: "Staff", href: "/staff" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Bot, label: "AI Chatbot", href: "/ai-chatbot" },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r border-gray-200 bg-white z-10">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
              alt="HavenMed Logo" 
              className="h-8 w-8" 
            />
            <h1 className="text-xl font-bold text-gray-900">HavenMed</h1>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href} 
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href 
                    ? "bg-black text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gray-700 text-white">
                JC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900">Jack Chain</p>
              <p className="text-xs text-gray-500 truncate">Super admin</p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Settings size={18} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-10 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
            alt="HavenMed Logo" 
            className="h-8 w-8" 
          />
          <h1 className="text-xl font-bold text-gray-900">HavenMed</h1>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
                    alt="HavenMed Logo" 
                    className="h-8 w-8" 
                  />
                  <h1 className="text-xl font-bold text-gray-900">HavenMed</h1>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              
              <nav className="px-2 mt-5 space-y-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.href 
                        ? "bg-black text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gray-700 text-white">
                    JC
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">Jack Chain</p>
                  <p className="text-xs text-gray-500 truncate">Super admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        <div className="hidden md:flex fixed right-0 left-64 bg-white z-10 h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search here" 
              className="pl-10 rounded-full bg-white border border-gray-200"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="rounded-full text-gray-700 border-gray-300">
              <Plus size={16} className="mr-1" /> Add
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-700">
              <Bell size={20} />
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gray-700 text-white">
                  JC
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">Jack Chain</p>
                <p className="text-xs text-gray-500">Super admin</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6 pt-20 md:pt-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
