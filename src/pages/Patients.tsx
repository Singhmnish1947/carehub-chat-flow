
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

// Patient type definition
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  insuranceProvider: string;
  insuranceNumber: string;
  medicalHistory: string[];
  registeredDate: string;
  lastVisit: string;
}

// Sample patient data
const initialPatients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    gender: "Male",
    dateOfBirth: "1985-04-12",
    address: "123 Main St, Springfield, IL",
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC12345678",
    medicalHistory: ["Hypertension", "Diabetes Type 2"],
    registeredDate: "2022-01-15",
    lastVisit: "2023-11-22",
  },
  {
    id: "P002",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-987-6543",
    gender: "Female",
    dateOfBirth: "1990-08-24",
    address: "456 Oak Lane, Riverdale, NY",
    insuranceProvider: "Aetna",
    insuranceNumber: "AET87654321",
    medicalHistory: ["Asthma", "Allergies"],
    registeredDate: "2021-06-10",
    lastVisit: "2023-12-05",
  },
  {
    id: "P003",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "555-555-5555",
    gender: "Male",
    dateOfBirth: "1978-11-30",
    address: "789 Pine Road, Cedar City, UT",
    insuranceProvider: "United Healthcare",
    insuranceNumber: "UH98765432",
    medicalHistory: ["Arthritis", "Heart Disease"],
    registeredDate: "2020-03-22",
    lastVisit: "2023-10-18",
  },
];

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [tempPatient, setTempPatient] = useState<Partial<Patient>>({});

  // Filter patients based on search query and gender
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      !searchQuery ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender =
      filterGender === "all" || patient.gender.toLowerCase() === filterGender.toLowerCase();

    return matchesSearch && matchesGender;
  });

  // Handle creating a new patient
  const handleCreatePatient = () => {
    setDialogMode("create");
    setCurrentPatient(null);
    setTempPatient({});
    setIsDialogOpen(true);
  };

  // Handle editing an existing patient
  const handleEditPatient = (patient: Patient) => {
    setDialogMode("edit");
    setCurrentPatient(patient);
    setTempPatient({ ...patient });
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempPatient({ ...tempPatient, [name]: value });
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setTempPatient({ ...tempPatient, [name]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!tempPatient.name || !tempPatient.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (dialogMode === "create") {
      // Create a new patient
      const newPatient: Patient = {
        id: `P${String(patients.length + 1).padStart(3, "0")}`,
        name: tempPatient.name || "",
        email: tempPatient.email || "",
        phone: tempPatient.phone || "",
        gender: tempPatient.gender || "Other",
        dateOfBirth: tempPatient.dateOfBirth || new Date().toISOString().split("T")[0],
        address: tempPatient.address || "",
        insuranceProvider: tempPatient.insuranceProvider || "",
        insuranceNumber: tempPatient.insuranceNumber || "",
        medicalHistory: tempPatient.medicalHistory || [],
        registeredDate: new Date().toISOString().split("T")[0],
        lastVisit: new Date().toISOString().split("T")[0],
      };

      setPatients([...patients, newPatient]);
      
      toast({
        title: "Success",
        description: "Patient has been created successfully.",
      });
    } else {
      // Update existing patient
      if (!currentPatient) return;
      
      const updatedPatients = patients.map((patient) =>
        patient.id === currentPatient.id
          ? { ...patient, ...tempPatient } as Patient
          : patient
      );
      
      setPatients(updatedPatients);
      
      toast({
        title: "Success",
        description: "Patient has been updated successfully.",
      });
    }

    setIsDialogOpen(false);
  };

  // Handle patient deletion
  const handleDeletePatient = (patientId: string) => {
    const updatedPatients = patients.filter((patient) => patient.id !== patientId);
    setPatients(updatedPatients);
    
    toast({
      title: "Success",
      description: "Patient has been deleted successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
            <p className="text-gray-500">Manage patient records and information</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreatePatient}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filterGender}
              onValueChange={(value) => setFilterGender(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                Total: {filteredPatients.length} patients found
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-gray-500">
                            {patient.gender}, {patient.dateOfBirth}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{patient.email}</div>
                          <div className="text-xs text-gray-500">{patient.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div>{patient.insuranceProvider}</div>
                          <div className="text-xs text-gray-500">{patient.insuranceNumber}</div>
                        </TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No patients found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Patient form dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Patient" : "Edit Patient"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter the patient's information below"
                : "Update the patient's information"}
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
                  placeholder="John Doe"
                  value={tempPatient.name || ""}
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
                  placeholder="johndoe@example.com"
                  value={tempPatient.email || ""}
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
                  value={tempPatient.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <Select
                  value={tempPatient.gender || ""}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={tempPatient.dateOfBirth || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, State"
                  value={tempPatient.address || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="insuranceProvider" className="text-sm font-medium">
                  Insurance Provider
                </label>
                <Input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  placeholder="Blue Cross"
                  value={tempPatient.insuranceProvider || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="insuranceNumber" className="text-sm font-medium">
                  Insurance Number
                </label>
                <Input
                  id="insuranceNumber"
                  name="insuranceNumber"
                  placeholder="INS123456789"
                  value={tempPatient.insuranceNumber || ""}
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
              {dialogMode === "create" ? "Create Patient" : "Update Patient"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Patients;
