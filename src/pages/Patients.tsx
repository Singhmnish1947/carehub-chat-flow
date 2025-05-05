
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
import { Search, Plus, File, Trash2, Edit, FileEdit, UserPlus } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: {
    email: string;
    phone: string;
  };
  address: string;
  bloodGroup: string;
  registrationDate: string;
  status: "active" | "inactive" | "pending";
}

const initialPatients: Patient[] = [
  {
    id: "P001",
    name: "Raj Kumar",
    age: 45,
    gender: "Male",
    contact: {
      email: "raj.kumar@example.com",
      phone: "9876543210"
    },
    address: "123 Gandhi Road, Mumbai",
    bloodGroup: "O+",
    registrationDate: "2023-05-15",
    status: "active"
  },
  {
    id: "P002",
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    contact: {
      email: "priya.sharma@example.com",
      phone: "9876543211"
    },
    address: "456 Nehru Lane, Delhi",
    bloodGroup: "B+",
    registrationDate: "2023-06-20",
    status: "active"
  },
  {
    id: "P003",
    name: "Amit Patel",
    age: 27,
    gender: "Male",
    contact: {
      email: "amit.patel@example.com",
      phone: "9876543212"
    },
    address: "789 Sardar Street, Ahmedabad",
    bloodGroup: "A-",
    registrationDate: "2023-07-05",
    status: "inactive"
  },
];

const patientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.coerce.number().min(0, { message: "Age must be a positive number" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  bloodGroup: z.string().min(1, { message: "Blood group is required" }),
  status: z.string(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // React hook form
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      email: "",
      phone: "",
      address: "",
      bloodGroup: "",
      status: "active",
    },
  });

  const handleAddOrUpdatePatient = (values: PatientFormValues) => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    
    if (editingPatient) {
      // Update existing patient
      const updatedPatients = patients.map((patient) =>
        patient.id === editingPatient.id
          ? {
              ...patient,
              name: values.name,
              age: values.age,
              gender: values.gender,
              contact: {
                email: values.email,
                phone: values.phone,
              },
              address: values.address,
              bloodGroup: values.bloodGroup,
              status: values.status as "active" | "inactive" | "pending",
            }
          : patient
      );
      setPatients(updatedPatients);
      toast({
        title: "Patient updated",
        description: `${values.name}'s information has been updated successfully.`,
      });
    } else {
      // Add new patient
      const newPatient: Patient = {
        id: `P${String(patients.length + 1).padStart(3, '0')}`,
        name: values.name,
        age: values.age,
        gender: values.gender,
        contact: {
          email: values.email,
          phone: values.phone,
        },
        address: values.address,
        bloodGroup: values.bloodGroup,
        registrationDate: formattedDate,
        status: values.status as "active" | "inactive" | "pending",
      };
      setPatients([...patients, newPatient]);
      toast({
        title: "Patient added",
        description: `${values.name} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    form.reset({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      email: patient.contact.email,
      phone: patient.contact.phone,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      status: patient.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeletePatient = (id: string) => {
    const updatedPatients = patients.filter((patient) => patient.id !== id);
    setPatients(updatedPatients);
    toast({
      title: "Patient removed",
      description: "Patient has been removed successfully.",
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
    setEditingPatient(null);
    form.reset({
      name: "",
      age: 0,
      gender: "",
      email: "",
      phone: "",
      address: "",
      bloodGroup: "",
      status: "active",
    });
  };

  const filteredPatients = patients.filter((patient) => {
    // Filter by search query
    const searchFilter = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        patient.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        patient.contact.phone.includes(searchQuery);
                        
    // Filter by status if not "all"
    const statusFilter = selectedStatus === "all" || patient.status === selectedStatus;
    
    return searchFilter && statusFilter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-gray-500">Manage patient records and history</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button 
              className="bg-black text-white hover:bg-black/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <UserPlus size={18} className="mr-2" /> Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingPatient ? "Edit Patient" : "Register New Patient"}</DialogTitle>
              <DialogDescription>
                {editingPatient 
                  ? "Edit patient information in the form below."
                  : "Fill in the details to register a new patient in the system."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddOrUpdatePatient)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                          <Input placeholder="10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Patient's complete address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black text-white hover:bg-black/90">
                    {editingPatient ? "Update Patient" : "Register Patient"}
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
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patient List */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{patient.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.age} / {patient.gender}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs">{patient.contact.email}</p>
                          <p className="text-xs">{patient.contact.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{patient.bloodGroup}</TableCell>
                      <TableCell>{patient.registrationDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No patients found. Please adjust your search or register a new patient.
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

export default Patients;
