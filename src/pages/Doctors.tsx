
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, File, Trash2, Edit, FileEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  qualification: string;
  contact: {
    email: string;
    phone: string;
  };
  fee: string;
}

const initialDoctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Robert Chen",
    specialization: "Cardiology",
    experience: "15 years",
    qualification: "MD, Harvard Medical School",
    contact: {
      email: "robert.chen@havenmed.com",
      phone: "555-111-2222"
    },
    fee: "$250"
  },
  {
    id: "D002",
    name: "Dr. Sarah Johnson",
    specialization: "Pediatrics",
    experience: "10 years",
    qualification: "MD, Johns Hopkins University",
    contact: {
      email: "sarah.johnson@havenmed.com",
      phone: "555-222-3333"
    },
    fee: "$200"
  },
  {
    id: "D003",
    name: "Dr. Michael Rodriguez",
    specialization: "Neurology",
    experience: "12 years",
    qualification: "MD, Stanford University",
    contact: {
      email: "michael.rodriguez@havenmed.com",
      phone: "555-333-4444"
    },
    fee: "$275"
  }
];

const doctorSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  specialization: z.string().min(1, { message: "Specialization is required" }),
  qualification: z.string().min(1, { message: "Qualification is required" }),
  experience: z.string().min(1, { message: "Experience is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  fee: z.string().min(1, { message: "Fee is required" }),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

const Doctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // React hook form
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      qualification: "",
      experience: "",
      email: "",
      phone: "",
      fee: "",
    },
  });

  const handleAddOrUpdateDoctor = (values: DoctorFormValues) => {
    if (editingDoctor) {
      // Update existing doctor
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === editingDoctor.id
          ? {
              ...doctor,
              name: values.name,
              specialization: values.specialization,
              qualification: values.qualification,
              experience: values.experience,
              contact: {
                email: values.email,
                phone: values.phone,
              },
              fee: values.fee,
            }
          : doctor
      );
      setDoctors(updatedDoctors);
      toast({
        title: "Doctor updated",
        description: `${values.name} has been updated successfully.`,
      });
    } else {
      // Add new doctor
      const newDoctor: Doctor = {
        id: `D${String(doctors.length + 1).padStart(3, '0')}`,
        name: values.name,
        specialization: values.specialization,
        qualification: values.qualification,
        experience: values.experience,
        contact: {
          email: values.email,
          phone: values.phone,
        },
        fee: values.fee,
      };
      setDoctors([...doctors, newDoctor]);
      toast({
        title: "Doctor added",
        description: `${values.name} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.reset({
      name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      email: doctor.contact.email,
      phone: doctor.contact.phone,
      fee: doctor.fee,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteDoctor = (id: string) => {
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
    setDoctors(updatedDoctors);
    toast({
      title: "Doctor removed",
      description: "Doctor has been removed successfully.",
      variant: "destructive",
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const resetForm = () => {
    setEditingDoctor(null);
    form.reset({
      name: "",
      specialization: "",
      qualification: "",
      experience: "",
      email: "",
      phone: "",
      fee: "",
    });
  };

  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by search query
    const searchFilter = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
                        
    // Filter by department if not "all"
    const departmentFilter = selectedDepartment === "all" || doctor.specialization.toLowerCase() === selectedDepartment.toLowerCase();
    
    return searchFilter && departmentFilter;
  });

  // Extract unique departments for the filter
  const departments = ["all", ...Array.from(new Set(doctors.map(doctor => doctor.specialization.toLowerCase())))];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
          <p className="text-gray-500">Manage doctor profiles and schedules</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button 
              className="bg-black text-white hover:bg-black/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={18} className="mr-2" /> Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
              <DialogDescription>
                {editingDoctor 
                  ? "Edit doctor information in the form below."
                  : "Fill in the details to add a new doctor to the system."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddOrUpdateDoctor)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MD, Harvard Medical School" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10 years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fee</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $250" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black text-white hover:bg-black/90">
                    {editingDoctor ? "Update Doctor" : "Add Doctor"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedDepartment}
          onValueChange={(value) => setSelectedDepartment(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept.charAt(0).toUpperCase() + dept.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor List */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
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
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.qualification}</p>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.experience}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs">{doctor.contact.email}</p>
                          <p className="text-xs">{doctor.contact.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.fee}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No doctors found. Please adjust your search or add a new doctor.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Doctors;
