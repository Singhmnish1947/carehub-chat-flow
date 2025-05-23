
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
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
  CheckSquare,
  Search,
  Bell,
  Plus,
  XSquare,
  Clipboard,
  Scissors,
  Bone,
  Heart
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  category?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CheckSquare, label: "Taskboard", href: "/taskboard" },
  { icon: Users, label: "Doctors", href: "/doctors", category: "Staff" },
  { icon: Users, label: "Patients", href: "/patients", category: "Users" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: Building2, label: "Departments", href: "/departments", category: "Admin" },
  { icon: MapPin, label: "Locations", href: "/locations", category: "Admin" },
  { icon: Pill, label: "Medication", href: "/medication", category: "Services" },
  { icon: BedDouble, label: "Rooms & Beds", href: "/rooms", category: "Admin" },
  { icon: UserCog, label: "Staff", href: "/staff", category: "Admin" },
  { icon: Package, label: "Inventory", href: "/inventory", category: "Admin" },
  { icon: XSquare, label: "X-Ray", href: "/xray", category: "Services" },
  { icon: Clipboard, label: "Pharmacy", href: "/pharmacy", category: "Services" },
  { icon: Scissors, label: "Minor OT", href: "/minor-ot", category: "Services" },
  { icon: Scissors, label: "Major OT", href: "/major-ot", category: "Services" },
  { icon: Bone, label: "Orthopedics", href: "/ortho", category: "Services" },
  { icon: Heart, label: "Gynecology", href: "/gyno", category: "Services" },
  { icon: Bot, label: "AI Chatbot", href: "/ai-chatbot" },
  { icon: Settings, label: "Settings", href: "/settings", category: "Admin" },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Group nav items by category
  const categorizedNavItems = navItems.reduce((acc: Record<string, NavItem[]>, item) => {
    const category = item.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const handleLogout = () => {
    // Implement logout functionality
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r border-gray-200 bg-white/50 backdrop-blur-md z-10">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
              alt="Bhagwati Hospital Logo" 
              className="h-8 w-8" 
            />
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-gray-900">BHAGWATI HOSPITAL</h1>
              <p className="text-xs text-gray-500">MANAGEMENT</p>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {Object.entries(categorizedNavItems).map(([category, items]) => (
            <div key={category} className="space-y-1">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-2">{category}</h3>
              {items.map((item) => (
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
            </div>
          ))}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                  <Settings size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Ranchi Road, Redma, Daltonganj</p>
          <p>PIN: 822101</p>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-10 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
            alt="Bhagwati Hospital Logo" 
            className="h-8 w-8" 
          />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-gray-900">BHAGWATI HOSPITAL</h1>
            <p className="text-xs text-gray-500">MANAGEMENT</p>
          </div>
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
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white glass">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
                    alt="Bhagwati Hospital Logo" 
                    className="h-8 w-8" 
                  />
                  <div className="flex flex-col">
                    <h1 className="text-sm font-bold text-gray-900">BHAGWATI HOSPITAL</h1>
                    <p className="text-xs text-gray-500">MANAGEMENT</p>
                  </div>
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
              
              <div className="px-2 mt-5 space-y-4">
                {Object.entries(categorizedNavItems).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-2">{category}</h3>
                    {items.map((item) => (
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
                  </div>
                ))}
              </div>
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Settings size={18} />
                </Button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
              <p>Ranchi Road, Redma, Daltonganj</p>
              <p>PIN: 822101</p>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        <div className="hidden md:flex fixed right-0 left-64 bg-white/70 backdrop-blur-md z-10 h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search here" 
              className="pl-10 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="rounded-full text-gray-700 border-gray-300 bg-white/50 backdrop-blur-sm">
              <Plus size={16} className="mr-1" /> Add
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-700">
              <Bell size={20} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer">
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
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
