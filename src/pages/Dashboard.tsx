
import React from "react";
import { 
  CalendarCheck, 
  Users, 
  DollarSign, 
  BedDouble, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue 
}) => {
  return (
    <Card>
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
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Dr. John Doe</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Appointments"
          value="2,845"
          description="from last month"
          icon={<CalendarCheck className="h-5 w-5 text-care-primary" />}
          trend="up"
          trendValue="+20.1%"
        />
        <StatCard
          title="Total Patients"
          value="8,294"
          description="from last month"
          icon={<Users className="h-5 w-5 text-care-primary" />}
          trend="up"
          trendValue="+10.3%"
        />
        <StatCard
          title="Total Revenue"
          value="₹42,567"
          description="from last month"
          icon={<DollarSign className="h-5 w-5 text-care-primary" />}
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="Bed Occupancy"
          value="76%"
          description="from last week"
          icon={<BedDouble className="h-5 w-5 text-care-primary" />}
          trend="down"
          trendValue="-3.2%"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-care-primary hover:bg-care-dark justify-start">
              <Plus className="mr-2 h-4 w-4" /> New Appointment
            </Button>
            <Button className="w-full bg-care-primary hover:bg-care-dark justify-start">
              <Plus className="mr-2 h-4 w-4" /> Register Patient
            </Button>
            <Button className="w-full bg-care-primary hover:bg-care-dark justify-start">
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
            <Button className="w-full bg-care-primary hover:bg-care-dark justify-start">
              <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
            </Button>
          </CardContent>
        </Card>
        
        {/* Recent Appointments */}
        <Card className="lg:col-span-2">
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
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
