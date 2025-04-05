
import React from "react";
import { 
  CalendarCheck, 
  Users, 
  DollarSign, 
  BedDouble, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown,
  Search,
  Bell,
  Settings
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue,
  bgColor = "bg-white" 
}) => {
  return (
    <Card className={`${bgColor} border-none shadow-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-care-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-gray-500">
          {trend === "up" ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : trend === "down" ? (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          ) : null}
          <span className={trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : ""}>
            {trendValue}
          </span>
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Dr. John Doe</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search here" 
              className="pl-10 w-full rounded-full bg-white border border-gray-200"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-care-primary text-white">JD</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Jack Chain</p>
              <p className="text-xs text-gray-500">Super admin</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients"
          value="8,294"
          description="more than yesterday"
          icon={<Users className="h-5 w-5 text-care-primary" />}
          trend="up"
          trendValue="+12%"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Appointments"
          value="2,845"
          description="more than yesterday"
          icon={<CalendarCheck className="h-5 w-5 text-care-primary" />}
          trend="up"
          trendValue="+15%"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Bed Room"
          value="76%"
          description="more than yesterday"
          icon={<BedDouble className="h-5 w-5 text-care-primary" />}
          trend="up"
          trendValue="+22%"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Total Invoice"
          value="₹42,567"
          description="more than yesterday"
          icon={<DollarSign className="h-5 w-5 text-care-primary" />}
          trend="up"
          trendValue="+41%"
          bgColor="bg-slate-50"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Health Card */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Patient Health</CardTitle>
              <CardDescription>From Patient</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-white">
              <ArrowUpRight size={16} />
            </Button>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-8">
            <div className="text-center">
              <img 
                src="/lovable-uploads/a9450c4a-b487-46ab-9c8b-e4532fa48636.png" 
                alt="Lung Illustration" 
                className="w-64 h-64 object-contain mx-auto opacity-50"
              />
              <div className="mt-4">
                <h3 className="font-bold">Today</h3>
                <p className="text-sm text-gray-500">01:15 PM - 02:00 PM</p>
                <div className="flex items-center justify-center mt-2">
                  <Avatar className="mr-2 h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-care-accent text-white">ID</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Dr. Ishita Datta</p>
                    <p className="text-xs text-gray-500">Pulmonologist</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Revenue Card */}
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>01.01.2025</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-care-primary border-care-primary">
              Monthly
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" className="rounded-full">Expense</Button>
              <Button variant="secondary" size="sm" className="rounded-full bg-purple-100">Income</Button>
            </div>
            <div className="h-40 flex items-center justify-center border-b border-dashed border-gray-200 mb-4">
              <p className="text-gray-400">Revenue Chart Placeholder</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-xs text-gray-500">Hospital total revenue</p>
                <p className="text-lg font-bold">₹ 712,3264</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Hospital expense</p>
                <p className="text-lg font-bold">₹ 14,965,5476</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest patient appointments</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="text-care-primary border-care-primary">
              View All <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-care-accent text-white">
                      {["RP", "SK", "AM", "VG", "ND"][i-1]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {["Rahul Patel", "Sunita Kumar", "Amit Malhotra", "Vijay Gupta", "Nisha Desai"][i-1]}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {["General Checkup", "Cardiology Review", "Orthopedic Consult", "Dermatology Appointment", "Pediatric Visit"][i-1]}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {["Today, 10:00 AM", "Today, 11:30 AM", "Today, 2:00 PM", "Tomorrow, 9:30 AM", "Tomorrow, 1:00 PM"][i-1]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-care-primary hover:bg-care-dark justify-start"
              onClick={() => handleNavigate('/appointments')}
            >
              <Plus className="mr-2 h-4 w-4" /> New Appointment
            </Button>
            <Button 
              className="w-full bg-care-primary hover:bg-care-dark justify-start"
              onClick={() => handleNavigate('/patients')}
            >
              <Plus className="mr-2 h-4 w-4" /> Register Patient
            </Button>
            <Button 
              className="w-full bg-care-primary hover:bg-care-dark justify-start"
              onClick={() => handleNavigate('/payments')}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
            <Button 
              className="w-full bg-care-primary hover:bg-care-dark justify-start"
              onClick={() => handleNavigate('/chat')}
            >
              <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
