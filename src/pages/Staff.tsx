
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileEdit, Trash2, Filter, User, Phone, Briefcase, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { staffMembers } from "@/data/staffData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Staff type from the data file
import { Staff } from "@/types/task";

// Extended staff interface with more fields
interface ExtendedStaff extends Staff {
  email?: string;
  phone?: string;
  specialization?: string;
  joinDate?: string;
  status?: "active" | "on-leave" | "terminated";
  qualification?: string;
  address?: string;
  emergencyContact?: string;
  shift?: "morning" | "evening" | "night";
}

const Staff = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<ExtendedStaff[]>(() => 
    // Initialize with extended data from staffMembers
    staffMembers.map(member => ({
      ...member,
      email: `${member.name.toLowerCase().replace(/\s+/g, ".")}@hospital.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 1000000000)}`,
      specialization: member.role.includes("Nurse") ? "General Care" : 
        member.role.includes("Dr.") ? member.department : "Administration",
      joinDate: `2022-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      status: "active",
      qualification: member.role.includes("Dr.") ? "MD, " + member.department : "BSc Nursing",
      address: "123 Healthcare Avenue, Medical District",
      emergencyContact: "+91 " + Math.floor(9000000000 + Math.random() * 1000000000),
      shift: ["morning", "evening", "night"][Math.floor(Math.random() * 3)] as "morning" | "evening" | "night"
    }))
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<ExtendedStaff | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [tempStaff, setTempStaff] = useState<Partial<ExtendedStaff>>({});

  // Get unique departments for filtering
  const departments = Array.from(new Set(staff.map((s) => s.department)));

  // Filter staff based on search query and department
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      !searchQuery ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.phone && member.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      filterDepartment === "all" || member.department === filterDepartment;
      
    const matchesStatus = 
      filterStatus === "all" || member.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Handle creating a new staff member
  const handleCreateStaff = () => {
    setDialogMode("create");
    setCurrentStaff(null);
    setTempStaff({});
    setIsDialogOpen(true);
  };

  // Handle editing an existing staff member
  const handleEditStaff = (member: ExtendedStaff) => {
    setDialogMode("edit");
    setCurrentStaff(member);
    setTempStaff({ ...member });
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempStaff({ ...tempStaff, [name]: value });
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setTempStaff({ ...tempStaff, [name]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!tempStaff.name || !tempStaff.role || !tempStaff.department) {
      toast({
        title: "Error",
        description: "Name, role, and department are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (dialogMode === "create") {
      // Create a new staff member
      const newStaff: ExtendedStaff = {
        id: `staff-${staff.length + 1}`,
        name: tempStaff.name || "",
        avatar: tempStaff.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
        role: tempStaff.role || "",
        department: tempStaff.department || "",
        email: tempStaff.email || `${tempStaff.name?.toLowerCase().replace(/\s+/g, ".")}@hospital.com`,
        phone: tempStaff.phone || "",
        specialization: tempStaff.specialization || "",
        joinDate: tempStaff.joinDate || new Date().toISOString().split("T")[0],
        status: tempStaff.status || "active",
        qualification: tempStaff.qualification || "",
        address: tempStaff.address || "",
        emergencyContact: tempStaff.emergencyContact || "",
        shift: tempStaff.shift || "morning",
      };

      setStaff([...staff, newStaff]);
      
      toast({
        title: "Success",
        description: "Staff member has been created successfully.",
      });
    } else {
      // Update existing staff member
      if (!currentStaff) return;
      
      const updatedStaff = staff.map((member) =>
        member.id === currentStaff.id
          ? { ...member, ...tempStaff } as ExtendedStaff
          : member
      );
      
      setStaff(updatedStaff);
      
      toast({
        title: "Success",
        description: "Staff member has been updated successfully.",
      });
    }

    setIsDialogOpen(false);
  };

  // Handle staff deletion
  const handleDeleteStaff = (staffId: string) => {
    const updatedStaff = staff.filter((member) => member.id !== staffId);
    setStaff(updatedStaff);
    
    toast({
      title: "Success",
      description: "Staff member has been removed from the system.",
    });
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'on-leave': return 'bg-amber-500 hover:bg-amber-600';
      case 'terminated': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
            <p className="text-gray-500">Manage hospital staff and personnel</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreateStaff}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Staff
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, phone or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select
              value={filterDepartment}
              onValueChange={(value) => setFilterDepartment(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 bg-white border rounded-md p-1">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                className="px-2 py-1 h-auto"
                onClick={() => setViewMode("table")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="px-2 py-1 h-auto"
                onClick={() => setViewMode("grid")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Staff ({staff.length})</TabsTrigger>
              <TabsTrigger value="doctors">Doctors ({staff.filter(s => s.role.includes("Dr.")).length})</TabsTrigger>
              <TabsTrigger value="nurses">Nurses ({staff.filter(s => s.role.includes("Nurse")).length})</TabsTrigger>
              <TabsTrigger value="others">Others ({staff.filter(s => !s.role.includes("Dr.") && !s.role.includes("Nurse")).length})</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {viewMode === "table" ? (
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>
                  Total: {filteredStaff.length} staff members found
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.qualification}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>
                            <div>{member.email}</div>
                            <div className="text-xs text-gray-500">{member.phone}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(member.status)}>
                              {member.status || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStaff(member)}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStaff(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          No staff members found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center">
                      <Avatar className="h-20 w-20 mb-4 border-2 border-white shadow-lg">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-lg">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status || "Unknown"}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Briefcase size={16} className="text-gray-500" />
                        <span className="text-sm">{member.department}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Check size={16} className="text-gray-500" />
                        <span className="text-sm">{member.specialization}</span>
                      </div>
                    </CardContent>
                    
                    <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditStaff(member)}
                      >
                        <FileEdit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border">
                  <p className="text-gray-500">No staff members found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Staff form dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Staff Member" : "Edit Staff Member"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter the staff member's information below"
                : "Update the staff member's information"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Dr. John Doe"
                  value={tempStaff.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address*
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@hospital.com"
                  value={tempStaff.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={tempStaff.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role*
                </label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Cardiologist"
                  value={tempStaff.role || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="qualification" className="text-sm font-medium">
                  Qualification
                </label>
                <Input
                  id="qualification"
                  name="qualification"
                  placeholder="MD, Cardiology"
                  value={tempStaff.qualification || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department*
                </label>
                <Select
                  value={tempStaff.department || ""}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                    <SelectItem value="Pathology">Pathology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="specialization" className="text-sm font-medium">
                  Specialization
                </label>
                <Input
                  id="specialization"
                  name="specialization"
                  placeholder="Heart Surgery"
                  value={tempStaff.specialization || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="joinDate" className="text-sm font-medium">
                  Join Date
                </label>
                <Input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={tempStaff.joinDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={tempStaff.status || "active"}
                  onValueChange={(value) => handleSelectChange("status", value as "active" | "on-leave" | "terminated")}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="shift" className="text-sm font-medium">
                  Shift
                </label>
                <Select
                  value={tempStaff.shift || "morning"}
                  onValueChange={(value) => handleSelectChange("shift", value as "morning" | "evening" | "night")}
                >
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning Shift</SelectItem>
                    <SelectItem value="evening">Evening Shift</SelectItem>
                    <SelectItem value="night">Night Shift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Medical Street, Hospital City"
                  value={tempStaff.address || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="emergencyContact" className="text-sm font-medium">
                  Emergency Contact
                </label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="+91 9876543210"
                  value={tempStaff.emergencyContact || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>
              {dialogMode === "create" ? "Create Staff Member" : "Update Staff Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Staff;
