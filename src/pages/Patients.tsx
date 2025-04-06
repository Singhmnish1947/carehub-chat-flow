
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileEdit, Trash2, Filter, User, Phone, MapPin, Clipboard } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Patient type definition with extended fields
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
  // New fields
  patientType: "internal" | "external";
  bloodGroup?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  emergencyContact?: string;
  occupation?: string;
  maritalStatus?: string;
  referredBy?: string;
  profileImage?: string;
}

// Sample patient data with extended fields
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
    patientType: "internal",
    bloodGroup: "A+",
    height: "178 cm",
    weight: "75 kg",
    allergies: ["Penicillin"],
    emergencyContact: "555-987-6543",
    occupation: "Software Engineer",
    maritalStatus: "Married",
    referredBy: "Dr. Emily Johnson",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
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
    patientType: "external",
    bloodGroup: "O-",
    height: "165 cm",
    weight: "58 kg",
    allergies: ["Nuts", "Shellfish"],
    emergencyContact: "555-123-4567",
    occupation: "Teacher",
    maritalStatus: "Single",
    referredBy: "Dr. Michael Brown",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
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
    patientType: "internal",
    bloodGroup: "B+",
    height: "182 cm",
    weight: "88 kg",
    allergies: ["Sulfa drugs"],
    emergencyContact: "555-222-3333",
    occupation: "Accountant",
    maritalStatus: "Divorced",
    referredBy: "Dr. Sarah Wilson",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"all" | "name" | "phone" | "email" | "id">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterPatientType, setFilterPatientType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [tempPatient, setTempPatient] = useState<Partial<Patient>>({});

  // Filter patients based on search query, gender, and patient type
  const filteredPatients = patients.filter((patient) => {
    let matchesSearch = true;
    
    if (searchQuery) {
      switch (searchField) {
        case "name":
          matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        case "phone":
          matchesSearch = patient.phone.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        case "email":
          matchesSearch = patient.email.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        case "id":
          matchesSearch = patient.id.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        default:
          matchesSearch = 
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.phone.toLowerCase().includes(searchQuery.toLowerCase());
      }
    }

    const matchesGender =
      filterGender === "all" || patient.gender.toLowerCase() === filterGender.toLowerCase();

    const matchesPatientType =
      filterPatientType === "all" || patient.patientType === filterPatientType;

    return matchesSearch && matchesGender && matchesPatientType;
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

  // Handle multi-select for medical history and allergies
  const handleMultiSelectChange = (name: string, value: string) => {
    const currentArray = tempPatient[name as keyof Patient] as string[] || [];
    
    if (currentArray.includes(value)) {
      // Remove the value if it already exists
      const updatedArray = currentArray.filter(item => item !== value);
      setTempPatient({ ...tempPatient, [name]: updatedArray });
    } else {
      // Add the value if it doesn't exist
      setTempPatient({ ...tempPatient, [name]: [...currentArray, value] });
    }
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
        patientType: tempPatient.patientType || "external",
        bloodGroup: tempPatient.bloodGroup,
        height: tempPatient.height,
        weight: tempPatient.weight,
        allergies: tempPatient.allergies || [],
        emergencyContact: tempPatient.emergencyContact,
        occupation: tempPatient.occupation,
        maritalStatus: tempPatient.maritalStatus,
        referredBy: tempPatient.referredBy,
        profileImage: tempPatient.profileImage || `https://randomuser.me/api/portraits/${tempPatient.gender?.toLowerCase() === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
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
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <div className="flex">
              <Select
                value={searchField}
                onValueChange={(value) => setSearchField(value as "all" | "name" | "phone" | "email" | "id")}
              >
                <SelectTrigger className="w-[120px] rounded-r-none border-r-0">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="id">Patient ID</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={`Search ${searchField === 'all' ? 'patients' : 'by ' + searchField}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-l-none"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select
              value={filterGender}
              onValueChange={(value) => setFilterGender(value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterPatientType}
              onValueChange={(value) => setFilterPatientType(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Patient Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
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
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                className="px-2 py-1 h-auto"
                onClick={() => setViewMode("cards")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Patients ({patients.length})</TabsTrigger>
              <TabsTrigger value="internal">Internal ({patients.filter(p => p.patientType === "internal").length})</TabsTrigger>
              <TabsTrigger value="external">External ({patients.filter(p => p.patientType === "external").length})</TabsTrigger>
              <TabsTrigger value="recent">Recent Visits ({patients.filter(p => new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {viewMode === "table" ? (
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardTitle>Patient List</CardTitle>
                <CardDescription>
                  Total: {filteredPatients.length} patients found
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Insurance</TableHead>
                      <TableHead>Medical</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={patient.profileImage} alt={patient.name} />
                                <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {patient.name} 
                                  <Badge variant={patient.patientType === "internal" ? "default" : "outline"}>
                                    {patient.patientType}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500">{patient.id} · {patient.gender}, {patient.bloodGroup}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{patient.phone}</div>
                            <div className="text-xs text-gray-500">{patient.email}</div>
                          </TableCell>
                          <TableCell>
                            <div>{patient.insuranceProvider}</div>
                            <div className="text-xs text-gray-500">{patient.insuranceNumber}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {patient.medicalHistory.map((condition, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>Last: {patient.lastVisit}</div>
                            <div className="text-xs text-gray-500">Reg: {patient.registeredDate}</div>
                          </TableCell>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <Card key={patient.id} className="overflow-hidden">
                    <div className={`p-6 flex flex-col items-center ${patient.patientType === "internal" ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "bg-gradient-to-r from-gray-50 to-zinc-50"}`}>
                      <Avatar className="h-24 w-24 mb-4 border-2 border-white shadow-lg">
                        <AvatarImage src={patient.profileImage} alt={patient.name} />
                        <AvatarFallback className="text-lg">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={patient.patientType === "internal" ? "default" : "outline"}>
                          {patient.patientType}
                        </Badge>
                        <span className="text-sm text-gray-500">{patient.id}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{patient.gender}</Badge>
                        {patient.bloodGroup && <Badge variant="secondary">{patient.bloodGroup}</Badge>}
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm">{patient.phone}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm">{patient.email}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="text-sm truncate" title={patient.address}>
                          {patient.address}
                        </span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Clipboard size={16} className="text-gray-500" />
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalHistory.slice(0, 2).map((condition, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                          {patient.medicalHistory.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{patient.medicalHistory.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <div className="p-4 bg-gray-50 border-t flex flex-col gap-2">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Last Visit:</span> {patient.lastVisit}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPatient(patient)}
                        >
                          <FileEdit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border">
                  <p className="text-gray-500">No patients found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Patient form dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
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
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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
                <label htmlFor="patientType" className="text-sm font-medium">
                  Patient Type
                </label>
                <Select
                  value={tempPatient.patientType || "external"}
                  onValueChange={(value) => handleSelectChange("patientType", value as "internal" | "external")}
                >
                  <SelectTrigger id="patientType">
                    <SelectValue placeholder="Select patient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
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
                <label htmlFor="bloodGroup" className="text-sm font-medium">
                  Blood Group
                </label>
                <Select
                  value={tempPatient.bloodGroup || ""}
                  onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                >
                  <SelectTrigger id="bloodGroup">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="height" className="text-sm font-medium">
                  Height
                </label>
                <Input
                  id="height"
                  name="height"
                  placeholder="175 cm"
                  value={tempPatient.height || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium">
                  Weight
                </label>
                <Input
                  id="weight"
                  name="weight"
                  placeholder="70 kg"
                  value={tempPatient.weight || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="maritalStatus" className="text-sm font-medium">
                  Marital Status
                </label>
                <Select
                  value={tempPatient.maritalStatus || ""}
                  onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                >
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="occupation" className="text-sm font-medium">
                  Occupation
                </label>
                <Input
                  id="occupation"
                  name="occupation"
                  placeholder="Software Engineer"
                  value={tempPatient.occupation || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="emergencyContact" className="text-sm font-medium">
                  Emergency Contact
                </label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="555-987-6543"
                  value={tempPatient.emergencyContact || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="referredBy" className="text-sm font-medium">
                  Referred By
                </label>
                <Input
                  id="referredBy"
                  name="referredBy"
                  placeholder="Dr. Jane Smith"
                  value={tempPatient.referredBy || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
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
