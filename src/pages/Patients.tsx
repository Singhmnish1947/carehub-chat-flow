
import React, { useState, useEffect } from "react";
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
import {
  Badge,
  BadgeProps,
} from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

// Patient type definition with fields matching Supabase schema
interface Patient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  blood_group: string | null;
  medical_history: string[] | null;
  allergies: string[] | null;
  emergency_contact: string | null;
  patient_type: "OPD" | "IPD" | "Emergency";
  registration_date: string | null;
  last_visit: string | null;
  current_status: string | null;
  reward_points: number | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Additional UI fields
  profileImage?: string;
}

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"all" | "name" | "phone" | "email" | "id">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterPatientType, setFilterPatientType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [tempPatient, setTempPatient] = useState<Partial<Patient>>({});

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('patients')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // Add placeholder profile images
          const patientsWithImages = data.map((patient: Patient) => ({
            ...patient,
            profileImage: `https://randomuser.me/api/portraits/${patient.gender?.toLowerCase() === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
          }));
          setPatients(patientsWithImages);
        }
      } catch (error: any) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: `Failed to fetch patients: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  // Filter patients based on search query, gender, and patient type
  const filteredPatients = patients.filter((patient) => {
    let matchesSearch = true;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      switch (searchField) {
        case "name":
          matchesSearch = patient.name.toLowerCase().includes(query);
          break;
        case "phone":
          matchesSearch = patient.phone?.toLowerCase().includes(query) || false;
          break;
        case "email":
          matchesSearch = patient.email?.toLowerCase().includes(query) || false;
          break;
        case "id":
          matchesSearch = patient.id.toLowerCase().includes(query);
          break;
        default:
          matchesSearch = 
            patient.name.toLowerCase().includes(query) ||
            (patient.email?.toLowerCase().includes(query) || false) ||
            patient.id.toLowerCase().includes(query) ||
            (patient.phone?.toLowerCase().includes(query) || false);
      }
    }

    const matchesGender =
      filterGender === "all" || patient.gender?.toLowerCase() === filterGender.toLowerCase();

    const matchesPatientType =
      filterPatientType === "all" || patient.patient_type === filterPatientType;

    return matchesSearch && matchesGender && matchesPatientType;
  });

  // Get badge variant based on patient type
  const getPatientTypeBadgeVariant = (type: string): BadgeProps['variant'] => {
    switch(type) {
      case 'OPD': return 'default';
      case 'IPD': return 'secondary';
      case 'Emergency': return 'destructive';
      default: return 'outline';
    }
  };

  // Handle creating a new patient
  const handleCreatePatient = () => {
    setDialogMode("create");
    setCurrentPatient(null);
    setTempPatient({
      patient_type: "OPD",
    });
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
  const handleSubmit = async () => {
    if (!tempPatient.name) {
      toast({
        title: "Error",
        description: "Name is a required field.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (dialogMode === "create") {
        // Create a new patient
        const { data, error } = await supabase
          .from('patients')
          .insert([
            {
              name: tempPatient.name,
              email: tempPatient.email || null,
              phone: tempPatient.phone || null,
              gender: tempPatient.gender || null,
              date_of_birth: tempPatient.date_of_birth || null,
              address: tempPatient.address || null,
              city: tempPatient.city || null,
              state: tempPatient.state || null,
              pincode: tempPatient.pincode || null,
              blood_group: tempPatient.blood_group || null,
              medical_history: tempPatient.medical_history || [],
              allergies: tempPatient.allergies || [],
              emergency_contact: tempPatient.emergency_contact || null,
              patient_type: tempPatient.patient_type as "OPD" | "IPD" | "Emergency" || "OPD",
            }
          ])
          .select();

        if (error) throw error;

        if (data) {
          const newPatient: Patient = {
            ...data[0],
            profileImage: `https://randomuser.me/api/portraits/${data[0].gender?.toLowerCase() === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
          };
          setPatients([...patients, newPatient]);
          
          toast({
            title: "Success",
            description: "Patient has been created successfully.",
          });
        }
      } else {
        // Update existing patient
        if (!currentPatient) return;
        
        const { error } = await supabase
          .from('patients')
          .update({
            name: tempPatient.name,
            email: tempPatient.email || null,
            phone: tempPatient.phone || null,
            gender: tempPatient.gender || null,
            date_of_birth: tempPatient.date_of_birth || null,
            address: tempPatient.address || null,
            city: tempPatient.city || null,
            state: tempPatient.state || null,
            pincode: tempPatient.pincode || null,
            blood_group: tempPatient.blood_group || null,
            medical_history: tempPatient.medical_history || [],
            allergies: tempPatient.allergies || [],
            emergency_contact: tempPatient.emergency_contact || null,
            patient_type: tempPatient.patient_type as "OPD" | "IPD" | "Emergency" || currentPatient.patient_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPatient.id);
          
        if (error) throw error;
        
        const updatedPatients = patients.map((patient) =>
          patient.id === currentPatient.id
            ? { ...patient, ...tempPatient, updated_at: new Date().toISOString() }
            : patient
        );
        
        setPatients(updatedPatients);
        
        toast({
          title: "Success",
          description: "Patient has been updated successfully.",
        });
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: `Failed to save patient: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Handle patient deletion
  const handleDeletePatient = async (patientId: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) throw error;

      const updatedPatients = patients.filter((patient) => patient.id !== patientId);
      setPatients(updatedPatients);
      
      toast({
        title: "Success",
        description: "Patient has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: `Failed to delete patient: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="OPD">OPD</SelectItem>
                <SelectItem value="IPD">IPD</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
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
              <TabsTrigger value="OPD">OPD ({patients.filter(p => p.patient_type === "OPD").length})</TabsTrigger>
              <TabsTrigger value="IPD">IPD ({patients.filter(p => p.patient_type === "IPD").length})</TabsTrigger>
              <TabsTrigger value="Emergency">Emergency ({patients.filter(p => p.patient_type === "Emergency").length})</TabsTrigger>
              <TabsTrigger value="recent">Recent Visits ({patients.filter(p => p.last_visit && new Date(p.last_visit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : viewMode === "table" ? (
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
                      <TableHead>Location</TableHead>
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
                                  <Badge variant={getPatientTypeBadgeVariant(patient.patient_type)}>
                                    {patient.patient_type}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {patient.gender}, {patient.blood_group}{" "}
                                  {patient.reward_points ? `• ${patient.reward_points} points` : ""}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{patient.phone || "-"}</div>
                            <div className="text-xs text-gray-500">{patient.email || "-"}</div>
                          </TableCell>
                          <TableCell>
                            <div>{patient.city || "-"}</div>
                            <div className="text-xs text-gray-500">{patient.state || "-"}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {patient.medical_history?.slice(0, 2).map((condition, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                              {patient.medical_history && patient.medical_history.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{patient.medical_history.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>Last: {patient.last_visit ? formatDate(patient.last_visit) : "-"}</div>
                            <div className="text-xs text-gray-500">
                              Reg: {patient.registration_date ? formatDate(patient.registration_date) : "-"} 
                              {patient.current_status && <span> • {patient.current_status}</span>}
                            </div>
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
                    <div className={`p-6 flex flex-col items-center bg-gradient-to-r ${
                      patient.patient_type === "OPD" ? "from-blue-50 to-indigo-50" : 
                      patient.patient_type === "IPD" ? "from-green-50 to-teal-50" : 
                      "from-orange-50 to-red-50"
                    }`}>
                      <Avatar className="h-24 w-24 mb-4 border-2 border-white shadow-lg">
                        <AvatarImage src={patient.profileImage} alt={patient.name} />
                        <AvatarFallback className="text-lg">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getPatientTypeBadgeVariant(patient.patient_type)}>
                          {patient.patient_type}
                        </Badge>
                        <span className="text-sm text-gray-500">{patient.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{patient.gender || "Unknown"}</Badge>
                        {patient.blood_group && <Badge variant="secondary">{patient.blood_group}</Badge>}
                        {patient.reward_points ? (
                          <Badge variant="outline" className="bg-amber-50">
                            {patient.reward_points} points
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm">{patient.phone || "-"}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm">{patient.email || "-"}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="text-sm truncate" title={patient.address || ""}>
                          {patient.address ? `${patient.address}, ${patient.city || ''}, ${patient.state || ''}` : "-"}
                        </span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Clipboard size={16} className="text-gray-500" />
                        <div className="flex flex-wrap gap-1">
                          {patient.medical_history?.slice(0, 2).map((condition, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                          {patient.medical_history && patient.medical_history.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{patient.medical_history.length - 2} more
                            </Badge>
                          )}
                          {!patient.medical_history || patient.medical_history.length === 0 ? (
                            <span className="text-xs text-gray-500">No medical history</span>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                    
                    <div className="p-4 bg-gray-50 border-t flex flex-col gap-2">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Last Visit:</span> {patient.last_visit ? formatDate(patient.last_visit) : "-"}
                        {patient.current_status && <span> • {patient.current_status}</span>}
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
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={tempPatient.email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="9876543210"
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
                  value={tempPatient.patient_type || "OPD"}
                  onValueChange={(value) => handleSelectChange("patient_type", value)}
                >
                  <SelectTrigger id="patientType">
                    <SelectValue placeholder="Select patient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPD">OPD</SelectItem>
                    <SelectItem value="IPD">IPD</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="date_of_birth" className="text-sm font-medium">
                  Date of Birth
                </label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={tempPatient.date_of_birth || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="blood_group" className="text-sm font-medium">
                  Blood Group
                </label>
                <Select
                  value={tempPatient.blood_group || ""}
                  onValueChange={(value) => handleSelectChange("blood_group", value)}
                >
                  <SelectTrigger id="blood_group">
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
                <label htmlFor="emergency_contact" className="text-sm font-medium">
                  Emergency Contact
                </label>
                <Input
                  id="emergency_contact"
                  name="emergency_contact"
                  placeholder="9876543210"
                  value={tempPatient.emergency_contact || ""}
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
                  placeholder="123 Main St"
                  value={tempPatient.address || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Mumbai"
                  value={tempPatient.city || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  placeholder="Maharashtra"
                  value={tempPatient.state || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm font-medium">
                  Pincode
                </label>
                <Input
                  id="pincode"
                  name="pincode"
                  placeholder="400001"
                  value={tempPatient.pincode || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="aadhar_number" className="text-sm font-medium">
                  Aadhar Number
                </label>
                <Input
                  id="aadhar_number"
                  name="aadhar_number"
                  placeholder="1234 5678 9012"
                  value={tempPatient.aadhar_number || ""}
                  onChange={handleInputChange}
                />
              </div>
              {/* We would add more fields for medical_history and allergies as needed */}
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
