
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileEdit, Trash2, AlertCircle } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Type definitions
interface Medication {
  id: string;
  name: string;
  brand: string;
  category: string;
  dosage: string;
  form: "tablet" | "capsule" | "liquid" | "cream" | "injection" | "powder" | "inhaler" | "spray" | "patch";
  price: number;
  stockQuantity: number;
  reorderLevel: number;
  expiryDate?: string;
  description: string;
  sideEffects: string[];
  requiresPrescription: boolean;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medications: PrescriptionMedication[];
  issuedDate: string;
  status: "active" | "completed" | "cancelled";
  notes: string;
}

interface PrescriptionMedication {
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Sample data
const sampleMedications: Medication[] = [
  {
    id: "MED001",
    name: "Amoxicillin",
    brand: "Amoxil",
    category: "Antibiotics",
    dosage: "500mg",
    form: "capsule",
    price: 15.99,
    stockQuantity: 150,
    reorderLevel: 30,
    expiryDate: "2026-05-15",
    description: "Penicillin antibiotic that fights bacteria",
    sideEffects: ["Diarrhea", "Rash", "Nausea", "Vomiting"],
    requiresPrescription: true
  },
  {
    id: "MED002",
    name: "Ibuprofen",
    brand: "Advil",
    category: "Pain Relief",
    dosage: "200mg",
    form: "tablet",
    price: 8.49,
    stockQuantity: 200,
    reorderLevel: 40,
    expiryDate: "2027-02-28",
    description: "Nonsteroidal anti-inflammatory drug used to treat pain and inflammation",
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness"],
    requiresPrescription: false
  },
  {
    id: "MED003",
    name: "Salbutamol",
    brand: "Ventolin",
    category: "Respiratory",
    dosage: "100mcg",
    form: "inhaler",
    price: 25.99,
    stockQuantity: 45,
    reorderLevel: 10,
    expiryDate: "2025-11-20",
    description: "Used to relieve symptoms of asthma and prevent bronchospasm",
    sideEffects: ["Tremor", "Headache", "Nervousness", "Throat irritation"],
    requiresPrescription: true
  },
  {
    id: "MED004",
    name: "Cetirizine",
    brand: "Zyrtec",
    category: "Antihistamine",
    dosage: "10mg",
    form: "tablet",
    price: 12.99,
    stockQuantity: 120,
    reorderLevel: 25,
    expiryDate: "2026-08-15",
    description: "Antihistamine used to relieve allergy symptoms",
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
    requiresPrescription: false
  }
];

const samplePrescriptions: Prescription[] = [
  {
    id: "PRE001",
    patientId: "P001",
    patientName: "John Smith",
    doctorId: "D001",
    doctorName: "Dr. Robert Chen",
    medications: [
      {
        medicationId: "MED001",
        medicationName: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times a day",
        duration: "7 days",
        instructions: "Take with food"
      }
    ],
    issuedDate: "2025-04-03",
    status: "active",
    notes: "Patient has bacterial infection"
  },
  {
    id: "PRE002",
    patientId: "P002",
    patientName: "Jane Doe",
    doctorId: "D002",
    doctorName: "Dr. Sarah Johnson",
    medications: [
      {
        medicationId: "MED003",
        medicationName: "Salbutamol",
        dosage: "100mcg",
        frequency: "As needed",
        duration: "30 days",
        instructions: "Use when experiencing shortness of breath"
      },
      {
        medicationId: "MED004",
        medicationName: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "14 days",
        instructions: "Take at bedtime"
      }
    ],
    issuedDate: "2025-04-01",
    status: "active",
    notes: "Patient has allergic asthma"
  }
];

const medicationForms = ["tablet", "capsule", "liquid", "cream", "injection", "powder", "inhaler", "spray", "patch"];

const medicationCategories = [
  "Antibiotics",
  "Pain Relief",
  "Antihistamine",
  "Respiratory",
  "Cardiovascular",
  "Gastrointestinal",
  "Antidepressants",
  "Antidiabetic",
  "Hormones",
  "Dermatological"
];

const Medication = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>(sampleMedications);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(samplePrescriptions);
  const [activeTab, setActiveTab] = useState("medications");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Medication dialog state
  const [isMedDialogOpen, setIsMedDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [tempMedication, setTempMedication] = useState<Partial<Medication>>({});
  const [selectedSideEffects, setSelectedSideEffects] = useState<string[]>([]);
  
  // Prescription dialog state
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [tempPrescription, setTempPrescription] = useState<Partial<Prescription>>({});
  const [tempPrescMedications, setTempPrescMedications] = useState<PrescriptionMedication[]>([]);
  const [currentPrescMedIndex, setCurrentPrescMedIndex] = useState<number | null>(null);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [tempPrescMed, setTempPrescMed] = useState<Partial<PrescriptionMedication>>({});
  
  // Filters state
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRequiresPrescription, setFilterRequiresPrescription] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Filter medications based on search and filters
  const filteredMedications = medications.filter(med => {
    const matchesSearch =
      !searchQuery ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      filterCategory === "all" || 
      med.category === filterCategory;

    const matchesPrescription =
      filterRequiresPrescription === "all" ||
      (filterRequiresPrescription === "yes" && med.requiresPrescription) ||
      (filterRequiresPrescription === "no" && !med.requiresPrescription);

    return matchesSearch && matchesCategory && matchesPrescription;
  });

  // Filter prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch =
      !searchQuery ||
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      filterStatus === "all" ||
      prescription.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Medication operations
  const handleCreateMedication = () => {
    setDialogMode("create");
    setCurrentMedication(null);
    setTempMedication({
      price: 0,
      stockQuantity: 0,
      reorderLevel: 0,
      requiresPrescription: false,
      sideEffects: []
    });
    setSelectedSideEffects([]);
    setIsMedDialogOpen(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setDialogMode("edit");
    setCurrentMedication(medication);
    setTempMedication({ ...medication });
    setSelectedSideEffects(medication.sideEffects);
    setIsMedDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setTempMedication({ ...tempMedication, [name]: Number(value) });
    } else if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setTempMedication({ ...tempMedication, [name]: target.checked });
    } else {
      setTempMedication({ ...tempMedication, [name]: value });
    }
  };

  const handlePrescMedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempPrescMed({ ...tempPrescMed, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setTempMedication({ ...tempMedication, [name]: value });
  };

  const handlePrescriptionSelectChange = (name: string, value: string) => {
    setTempPrescription({ ...tempPrescription, [name]: value });
  };

  const handleMedicationSelectChange = (medicationId: string) => {
    const selectedMedication = medications.find(med => med.id === medicationId);
    if (selectedMedication) {
      setTempPrescMed({
        ...tempPrescMed,
        medicationId: selectedMedication.id,
        medicationName: selectedMedication.name,
        dosage: selectedMedication.dosage
      });
    }
  };

  const toggleSideEffect = (effect: string) => {
    if (selectedSideEffects.includes(effect)) {
      setSelectedSideEffects(selectedSideEffects.filter(e => e !== effect));
    } else {
      setSelectedSideEffects([...selectedSideEffects, effect]);
    }
  };

  const addSideEffect = (effect: string) => {
    if (effect.trim() && !selectedSideEffects.includes(effect.trim())) {
      setSelectedSideEffects([...selectedSideEffects, effect.trim()]);
    }
  };

  const handleSaveMedication = () => {
    if (!tempMedication.name || !tempMedication.category || !tempMedication.form) {
      toast({
        title: "Error",
        description: "Name, category, and form are required fields.",
        variant: "destructive"
      });
      return;
    }

    const medicationWithSideEffects = {
      ...tempMedication,
      sideEffects: selectedSideEffects
    };

    if (dialogMode === "create") {
      const newMedication: Medication = {
        id: `MED${String(medications.length + 1).padStart(3, "0")}`,
        name: tempMedication.name!,
        brand: tempMedication.brand || "",
        category: tempMedication.category!,
        dosage: tempMedication.dosage || "",
        form: tempMedication.form as any,
        price: tempMedication.price || 0,
        stockQuantity: tempMedication.stockQuantity || 0,
        reorderLevel: tempMedication.reorderLevel || 0,
        expiryDate: tempMedication.expiryDate,
        description: tempMedication.description || "",
        sideEffects: selectedSideEffects,
        requiresPrescription: tempMedication.requiresPrescription || false
      };

      setMedications([...medications, newMedication]);
      
      toast({
        title: "Success",
        description: "Medication has been added successfully."
      });
    } else if (currentMedication) {
      const updatedMedications = medications.map(med => 
        med.id === currentMedication.id 
          ? { ...med, ...medicationWithSideEffects } as Medication
          : med
      );
      
      setMedications(updatedMedications);
      
      toast({
        title: "Success",
        description: "Medication has been updated successfully."
      });
    }

    setIsMedDialogOpen(false);
  };

  const handleDeleteMedication = (medId: string) => {
    // Check if any active prescriptions use this medication
    const prescriptionUses = prescriptions.filter(
      presc => presc.status === "active" && 
      presc.medications.some(med => med.medicationId === medId)
    );
    
    if (prescriptionUses.length > 0) {
      toast({
        title: "Cannot Delete Medication",
        description: "This medication is currently used in active prescriptions.",
        variant: "destructive"
      });
      return;
    }
    
    setMedications(medications.filter(med => med.id !== medId));
    
    toast({
      title: "Success",
      description: "Medication has been deleted successfully."
    });
  };

  // Prescription operations
  const handleCreatePrescription = () => {
    setDialogMode("create");
    setCurrentPrescription(null);
    setTempPrescription({
      issuedDate: new Date().toISOString().split('T')[0],
      status: "active",
      medications: [],
      notes: ""
    });
    setTempPrescMedications([]);
    setCurrentPrescMedIndex(null);
    setTempPrescMed({});
    setShowMedicationForm(false);
    setIsPrescriptionDialogOpen(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setDialogMode("edit");
    setCurrentPrescription(prescription);
    setTempPrescription({ ...prescription });
    setTempPrescMedications([...prescription.medications]);
    setCurrentPrescMedIndex(null);
    setTempPrescMed({});
    setShowMedicationForm(false);
    setIsPrescriptionDialogOpen(true);
  };

  const handleAddMedication = () => {
    setShowMedicationForm(true);
    setTempPrescMed({});
    setCurrentPrescMedIndex(null);
  };

  const handleEditPrescMedication = (index: number) => {
    setShowMedicationForm(true);
    setTempPrescMed({ ...tempPrescMedications[index] });
    setCurrentPrescMedIndex(index);
  };

  const handleSavePrescMedication = () => {
    if (!tempPrescMed.medicationId || !tempPrescMed.frequency || !tempPrescMed.duration) {
      toast({
        title: "Error",
        description: "Medication, frequency, and duration are required.",
        variant: "destructive"
      });
      return;
    }

    const prescMedication: PrescriptionMedication = {
      medicationId: tempPrescMed.medicationId!,
      medicationName: tempPrescMed.medicationName!,
      dosage: tempPrescMed.dosage || "",
      frequency: tempPrescMed.frequency!,
      duration: tempPrescMed.duration!,
      instructions: tempPrescMed.instructions || ""
    };

    if (currentPrescMedIndex !== null) {
      // Edit existing medication
      const updatedMedications = [...tempPrescMedications];
      updatedMedications[currentPrescMedIndex] = prescMedication;
      setTempPrescMedications(updatedMedications);
    } else {
      // Add new medication
      setTempPrescMedications([...tempPrescMedications, prescMedication]);
    }

    setShowMedicationForm(false);
    setTempPrescMed({});
    setCurrentPrescMedIndex(null);
  };

  const handleRemovePrescMedication = (index: number) => {
    const updatedMedications = [...tempPrescMedications];
    updatedMedications.splice(index, 1);
    setTempPrescMedications(updatedMedications);
  };

  const handleSavePrescription = () => {
    if (!tempPrescription.patientId || !tempPrescription.doctorId) {
      toast({
        title: "Error",
        description: "Patient and doctor information are required.",
        variant: "destructive"
      });
      return;
    }

    if (tempPrescMedications.length === 0) {
      toast({
        title: "Error",
        description: "At least one medication must be added to the prescription.",
        variant: "destructive"
      });
      return;
    }

    if (dialogMode === "create") {
      const newPrescription: Prescription = {
        id: `PRE${String(prescriptions.length + 1).padStart(3, "0")}`,
        patientId: tempPrescription.patientId!,
        patientName: tempPrescription.patientName!,
        doctorId: tempPrescription.doctorId!,
        doctorName: tempPrescription.doctorName!,
        medications: tempPrescMedications,
        issuedDate: tempPrescription.issuedDate || new Date().toISOString().split('T')[0],
        status: tempPrescription.status as any || "active",
        notes: tempPrescription.notes || ""
      };

      setPrescriptions([...prescriptions, newPrescription]);
      
      toast({
        title: "Success",
        description: "Prescription has been created successfully."
      });
    } else if (currentPrescription) {
      const updatedPrescriptions = prescriptions.map(presc => 
        presc.id === currentPrescription.id 
          ? { 
              ...presc, 
              ...tempPrescription,
              medications: tempPrescMedications
            } as Prescription
          : presc
      );
      
      setPrescriptions(updatedPrescriptions);
      
      toast({
        title: "Success",
        description: "Prescription has been updated successfully."
      });
    }

    setIsPrescriptionDialogOpen(false);
  };

  const handleDeletePrescription = (prescId: string) => {
    setPrescriptions(prescriptions.filter(presc => presc.id !== prescId));
    
    toast({
      title: "Success",
      description: "Prescription has been deleted successfully."
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Medication</h1>
            <p className="text-gray-500">Manage medicines and prescriptions</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={activeTab === "medications" ? handleCreateMedication : handleCreatePrescription}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "medications" ? "Add Medication" : "Create Prescription"}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={activeTab === "medications" ? "Search medications..." : "Search prescriptions..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeTab === "medications" && (
              <>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {medicationCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={filterRequiresPrescription}
                  onValueChange={setFilterRequiresPrescription}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Prescription required?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Requires Prescription</SelectItem>
                    <SelectItem value="no">OTC (No Prescription)</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            
            {activeTab === "prescriptions" && (
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <Tabs defaultValue="medications" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4 md:w-64">
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="medications">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Medication Inventory</CardTitle>
                  <CardDescription>
                    Total: {filteredMedications.length} medications found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredMedications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table className="border-collapse min-w-[800px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name/Brand</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Dosage/Form</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-center">Stock Status</TableHead>
                            <TableHead>Expiry</TableHead>
                            <TableHead className="text-center">Prescription</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMedications.map((med) => (
                            <TableRow key={med.id}>
                              <TableCell className="font-medium">{med.id}</TableCell>
                              <TableCell>
                                <div className="font-medium">{med.name}</div>
                                <div className="text-sm text-gray-500">{med.brand}</div>
                              </TableCell>
                              <TableCell>{med.category}</TableCell>
                              <TableCell>
                                <div>{med.dosage}</div>
                                <div className="text-sm capitalize text-gray-500">{med.form}</div>
                              </TableCell>
                              <TableCell>${med.price.toFixed(2)}</TableCell>
                              <TableCell className="text-center">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${med.stockQuantity <= med.reorderLevel ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                  {med.stockQuantity} in stock
                                </div>
                                {med.stockQuantity <= med.reorderLevel && (
                                  <div className="flex items-center mt-1 text-xs text-red-500">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Reorder needed
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{med.expiryDate || "N/A"}</TableCell>
                              <TableCell className="text-center">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${med.requiresPrescription ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {med.requiresPrescription ? "Required" : "OTC"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditMedication(med)}
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMedication(med.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No medications found.</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or add a new medication.</p>
                      <Button className="mt-4" onClick={handleCreateMedication}>
                        <Plus className="h-4 w-4 mr-2" /> Add Medication
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prescriptions">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Prescriptions</CardTitle>
                  <CardDescription>
                    Total: {filteredPrescriptions.length} prescriptions found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredPrescriptions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPrescriptions.map((presc) => (
                        <Card key={presc.id} className="overflow-hidden h-full">
                          <div className={`px-4 py-2 text-xs font-medium uppercase ${getStatusBadgeClass(presc.status)}`}>
                            {presc.status}
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle>{presc.id}</CardTitle>
                              <div className="text-sm">{presc.issuedDate}</div>
                            </div>
                            <CardDescription>
                              <div className="flex flex-col">
                                <span>Patient: {presc.patientName}</span>
                                <span>Doctor: {presc.doctorName}</span>
                              </div>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <h4 className="text-sm font-medium mb-2">Medications:</h4>
                            <ul className="space-y-2">
                              {presc.medications.map((med, idx) => (
                                <li key={idx} className="text-sm border-b pb-2">
                                  <div className="font-medium">{med.medicationName} ({med.dosage})</div>
                                  <div className="text-gray-500">
                                    {med.frequency} for {med.duration}
                                  </div>
                                  {med.instructions && (
                                    <div className="text-gray-500 italic">
                                      "{med.instructions}"
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                            {presc.notes && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium">Notes:</h4>
                                <p className="text-sm text-gray-500">{presc.notes}</p>
                              </div>
                            )}
                          </CardContent>
                          <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditPrescription(presc)}
                            >
                              <FileEdit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeletePrescription(presc.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No prescriptions found.</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or create a new prescription.</p>
                      <Button className="mt-4" onClick={handleCreatePrescription}>
                        <Plus className="h-4 w-4 mr-2" /> Create Prescription
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Medication Dialog */}
      <Dialog open={isMedDialogOpen} onOpenChange={setIsMedDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Medication" : "Edit Medication"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter medication details below"
                : "Update medication information"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Medication Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Amoxicillin"
                  value={tempMedication.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-medium">
                  Brand/Manufacturer
                </label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="Amoxil"
                  value={tempMedication.brand || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category*
                </label>
                <Select
                  value={tempMedication.category || ""}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicationCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="form" className="text-sm font-medium">
                  Form*
                </label>
                <Select
                  value={tempMedication.form || ""}
                  onValueChange={(value) => handleSelectChange("form", value)}
                >
                  <SelectTrigger id="form">
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicationForms.map((form) => (
                      <SelectItem key={form} value={form}>
                        <span className="capitalize">{form}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dosage" className="text-sm font-medium">
                  Dosage
                </label>
                <Input
                  id="dosage"
                  name="dosage"
                  placeholder="500mg"
                  value={tempMedication.dosage || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="15.99"
                  value={tempMedication.price || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="stockQuantity" className="text-sm font-medium">
                  Stock Quantity
                </label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={tempMedication.stockQuantity || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reorderLevel" className="text-sm font-medium">
                  Reorder Level
                </label>
                <Input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  min="0"
                  placeholder="20"
                  value={tempMedication.reorderLevel || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expiryDate" className="text-sm font-medium">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={tempMedication.expiryDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Brief description of the medication"
                  value={tempMedication.description || ""}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Side Effects</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSideEffects.map((effect, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      <span>{effect}</span>
                      <button 
                        onClick={() => toggleSideEffect(effect)} 
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    placeholder="Add side effect"
                    id="sideEffect"
                    name="sideEffect"
                    className="mr-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        addSideEffect(target.value);
                        target.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("sideEffect") as HTMLInputElement;
                      addSideEffect(input.value);
                      input.value = "";
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresPrescription"
                    name="requiresPrescription"
                    className="rounded border-gray-300"
                    checked={tempMedication.requiresPrescription || false}
                    onChange={(e) => setTempMedication({ 
                      ...tempMedication, 
                      requiresPrescription: e.target.checked 
                    })}
                  />
                  <label htmlFor="requiresPrescription" className="text-sm font-medium">
                    Requires Prescription
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveMedication}>
              {dialogMode === "create" ? "Add Medication" : "Update Medication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Medication;
