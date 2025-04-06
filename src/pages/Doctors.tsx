
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileEdit, Trash2, Filter } from "lucide-react";
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
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Doctor type definition
interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  experience: number;
  education: string;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  consultationFee: number;
  rating: number;
  image?: string;
}

// Sample doctor data
const initialDoctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Robert Chen",
    email: "robert.chen@havenmed.com",
    phone: "555-111-2222",
    specialization: "Cardiology",
    department: "Cardiology",
    experience: 15,
    education: "MD, Harvard Medical School",
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    consultationFee: 250,
    rating: 4.8,
  },
  {
    id: "D002",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@havenmed.com",
    phone: "555-222-3333",
    specialization: "Pediatrics",
    department: "Pediatrics",
    experience: 10,
    education: "MD, Johns Hopkins University",
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    consultationFee: 200,
    rating: 4.9,
  },
  {
    id: "D003",
    name: "Dr. Michael Rodriguez",
    email: "michael.rodriguez@havenmed.com",
    phone: "555-333-4444",
    specialization: "Neurology",
    department: "Neurology",
    experience: 12,
    education: "MD, Stanford University",
    availability: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: true,
      friday: false,
      saturday: false,
      sunday: false,
    },
    consultationFee: 275,
    rating: 4.7,
  },
];

// Department options
const departments = [
  "Cardiology", 
  "Neurology", 
  "Pediatrics", 
  "Orthopedics", 
  "Dermatology",
  "Ophthalmology",
  "Psychiatry",
  "General Medicine",
  "Obstetrics & Gynecology",
  "Oncology"
];

const Doctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [tempDoctor, setTempDoctor] = useState<Partial<Doctor>>({});

  // Helper to initialize availability
  const initializeAvailability = () => {
    return {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    };
  };

  // Filter doctors based on search query and department
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      !searchQuery ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      filterDepartment === "all" || doctor.department === filterDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Handle creating a new doctor
  const handleCreateDoctor = () => {
    setDialogMode("create");
    setCurrentDoctor(null);
    setTempDoctor({
      availability: initializeAvailability()
    });
    setIsDialogOpen(true);
  };

  // Handle editing an existing doctor
  const handleEditDoctor = (doctor: Doctor) => {
    setDialogMode("edit");
    setCurrentDoctor(doctor);
    setTempDoctor({ ...doctor });
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempDoctor({ ...tempDoctor, [name]: value });
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempDoctor({ ...tempDoctor, [name]: Number(value) });
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setTempDoctor({ ...tempDoctor, [name]: value });
  };

  // Handle availability change
  const handleAvailabilityChange = (day: string, checked: boolean) => {
    if (!tempDoctor.availability) return;
    
    setTempDoctor({
      ...tempDoctor,
      availability: {
        ...tempDoctor.availability,
        [day]: checked
      }
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!tempDoctor.name || !tempDoctor.email || !tempDoctor.specialization) {
      toast({
        title: "Error",
        description: "Name, email, and specialization are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (dialogMode === "create") {
      // Create a new doctor
      const newDoctor: Doctor = {
        id: `D${String(doctors.length + 1).padStart(3, "0")}`,
        name: tempDoctor.name || "",
        email: tempDoctor.email || "",
        phone: tempDoctor.phone || "",
        specialization: tempDoctor.specialization || "",
        department: tempDoctor.department || tempDoctor.specialization || "",
        experience: tempDoctor.experience || 0,
        education: tempDoctor.education || "",
        availability: tempDoctor.availability || initializeAvailability(),
        consultationFee: tempDoctor.consultationFee || 0,
        rating: 0,
      };

      setDoctors([...doctors, newDoctor]);
      
      toast({
        title: "Success",
        description: "Doctor profile has been created successfully.",
      });
    } else {
      // Update existing doctor
      if (!currentDoctor) return;
      
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === currentDoctor.id
          ? { ...doctor, ...tempDoctor } as Doctor
          : doctor
      );
      
      setDoctors(updatedDoctors);
      
      toast({
        title: "Success",
        description: "Doctor profile has been updated successfully.",
      });
    }

    setIsDialogOpen(false);
  };

  // Handle doctor deletion
  const handleDeleteDoctor = (doctorId: string) => {
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== doctorId);
    setDoctors(updatedDoctors);
    
    toast({
      title: "Success",
      description: "Doctor profile has been deleted successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
            <p className="text-gray-500">Manage doctor profiles and schedules</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreateDoctor}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Doctor
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filterDepartment}
              onValueChange={(value) => setFilterDepartment(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle>Doctor List</CardTitle>
              <CardDescription>
                Total: {filteredDoctors.length} doctors found
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-xs text-gray-500">
                            {doctor.education}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>{doctor.experience} years</TableCell>
                        <TableCell>
                          <div>{doctor.email}</div>
                          <div className="text-xs text-gray-500">{doctor.phone}</div>
                        </TableCell>
                        <TableCell>${doctor.consultationFee}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No doctors found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Doctor form dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Doctor" : "Edit Doctor Profile"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter the doctor's information below"
                : "Update the doctor's information"}
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
                  value={tempDoctor.name || ""}
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
                  placeholder="doctor@havenmed.com"
                  value={tempDoctor.email || ""}
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
                  placeholder="555-123-4567"
                  value={tempDoctor.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="specialization" className="text-sm font-medium">
                  Specialization*
                </label>
                <Input
                  id="specialization"
                  name="specialization"
                  placeholder="Cardiology"
                  value={tempDoctor.specialization || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department
                </label>
                <Select
                  value={tempDoctor.department || ""}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-medium">
                  Experience (Years)
                </label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={tempDoctor.experience || ""}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="education" className="text-sm font-medium">
                  Education & Qualifications
                </label>
                <Input
                  id="education"
                  name="education"
                  placeholder="MD, Harvard Medical School"
                  value={tempDoctor.education || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="consultationFee" className="text-sm font-medium">
                  Consultation Fee ($)
                </label>
                <Input
                  id="consultationFee"
                  name="consultationFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="200"
                  value={tempDoctor.consultationFee || ""}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Availability
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                  <label key={day} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tempDoctor.availability?.[day as keyof typeof tempDoctor.availability] || false}
                      onChange={(e) => handleAvailabilityChange(day, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>
              {dialogMode === "create" ? "Create Profile" : "Update Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Doctors;
