
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Pill, Package, ShoppingCart, User, FileText, Filter, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  category: string;
  description: string;
  stock: number;
  unitPrice: number;
  manufacturer: string;
  expiryDate: string;
  imageUrl?: string;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: "pending" | "processed" | "delivered" | "cancelled";
  items: PrescriptionItem[];
}

interface PrescriptionItem {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}

const sampleMedications: Medication[] = [
  {
    id: "MED001",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    description: "For pain relief and fever reduction",
    stock: 250,
    unitPrice: 5.99,
    manufacturer: "Sun Pharma",
    expiryDate: "2025-06-30",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "MED002",
    name: "Azithromycin 250mg",
    category: "Antibiotic",
    description: "For bacterial infections",
    stock: 120,
    unitPrice: 12.50,
    manufacturer: "Cipla",
    expiryDate: "2024-11-15",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "MED003",
    name: "Lisinopril 10mg",
    category: "Antihypertensive",
    description: "For high blood pressure",
    stock: 180,
    unitPrice: 8.75,
    manufacturer: "Torrent Pharma",
    expiryDate: "2024-08-22",
    imageUrl: "https://images.unsplash.com/photo-1576602975754-cf761181eb4f?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "MED004",
    name: "Metformin 500mg",
    category: "Antidiabetic",
    description: "For type 2 diabetes",
    stock: 200,
    unitPrice: 7.25,
    manufacturer: "Dr. Reddy's",
    expiryDate: "2025-01-10",
    imageUrl: "https://images.unsplash.com/photo-1626202373152-8db1760c8f61?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "MED005",
    name: "Atorvastatin 20mg",
    category: "Statin",
    description: "For cholesterol reduction",
    stock: 90,
    unitPrice: 15.30,
    manufacturer: "Lupin",
    expiryDate: "2024-10-05",
    imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "MED006",
    name: "Omeprazole 20mg",
    category: "Proton Pump Inhibitor",
    description: "For acid reflux and ulcers",
    stock: 150,
    unitPrice: 9.99,
    manufacturer: "Zydus Cadila",
    expiryDate: "2025-03-18",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=500"
  }
];

const samplePrescriptions: Prescription[] = [
  {
    id: "PRE001",
    patientId: "P001",
    patientName: "Rajesh Sharma",
    doctorName: "Dr. Preeti Gupta",
    date: "2023-04-05",
    status: "pending",
    items: [
      {
        id: "ITEM001",
        medicationId: "MED001",
        medicationName: "Paracetamol 500mg",
        dosage: "1 tablet",
        frequency: "3 times a day",
        duration: "5 days",
        quantity: 15
      },
      {
        id: "ITEM002",
        medicationId: "MED002",
        medicationName: "Azithromycin 250mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "3 days",
        quantity: 3
      }
    ]
  },
  {
    id: "PRE002",
    patientId: "P002",
    patientName: "Priya Patel",
    doctorName: "Dr. Anil Kumar",
    date: "2023-04-06",
    status: "processed",
    items: [
      {
        id: "ITEM003",
        medicationId: "MED003",
        medicationName: "Lisinopril 10mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "30 days",
        quantity: 30
      }
    ]
  },
  {
    id: "PRE003",
    patientId: "P003",
    patientName: "Amit Kumar",
    doctorName: "Dr. Sarah Johnson",
    date: "2023-04-07",
    status: "delivered",
    items: [
      {
        id: "ITEM004",
        medicationId: "MED004",
        medicationName: "Metformin 500mg",
        dosage: "1 tablet",
        frequency: "Twice daily",
        duration: "30 days",
        quantity: 60
      },
      {
        id: "ITEM005",
        medicationId: "MED005",
        medicationName: "Atorvastatin 20mg",
        dosage: "1 tablet",
        frequency: "Once daily at night",
        duration: "30 days",
        quantity: 30
      }
    ]
  }
];

const Pharmacy = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"inventory" | "prescriptions" | "dispensing" | "reports">("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [medications, setMedications] = useState<Medication[]>(sampleMedications);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(samplePrescriptions);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(medications.map(med => med.category)))];

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || med.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processed": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const lowStockMedications = medications.filter(med => med.stock < 50);
  const expiringMedications = medications.filter(med => {
    const expiryDate = new Date(med.expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-gray-500">Manage medication inventory and prescriptions</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Medications</p>
              <h3 className="text-3xl font-bold mt-1">{medications.length}</h3>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Pill className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <h3 className="text-3xl font-bold mt-1">{lowStockMedications.length}</h3>
            </div>
            <div className="p-4 bg-red-100 rounded-full">
              <Package className="h-6 w-6 text-red-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
              <h3 className="text-3xl font-bold mt-1">{expiringMedications.length}</h3>
            </div>
            <div className="p-4 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Prescriptions</p>
              <h3 className="text-3xl font-bold mt-1">{prescriptions.filter(p => p.status === "pending").length}</h3>
            </div>
            <div className="p-4 bg-indigo-100 rounded-full">
              <FileText className="h-6 w-6 text-indigo-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="inventory" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
        <TabsList className="glass-card border border-white/20 p-1">
          <TabsTrigger 
            value="inventory" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="prescriptions" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Prescriptions
          </TabsTrigger>
          <TabsTrigger 
            value="dispensing" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Dispensing
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Reports
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {activeTab === "inventory" && (
            <>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-2 glass-input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => toast({ title: "Coming Soon", description: "Add medication feature will be available soon." })}
                className="w-full sm:w-auto bg-black text-white hover:bg-black/80"
              >
                <Plus size={18} className="mr-2" /> Add Medication
              </Button>
            </>
          )}
          {activeTab === "prescriptions" && (
            <Button
              onClick={() => toast({ title: "Coming Soon", description: "Add prescription feature will be available soon." })}
              className="w-full sm:w-auto bg-black text-white hover:bg-black/80"
            >
              <Plus size={18} className="mr-2" /> Add Prescription
            </Button>
          )}
        </div>
      </div>

      {/* Inventory Tab Content */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedications.length > 0 ? (
            filteredMedications.map(medication => (
              <Card key={medication.id} className="glass-card animate-glass-fade overflow-hidden">
                <div className="h-40 relative">
                  <img
                    src={medication.imageUrl || "https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?auto=format&fit=crop&q=80&w=500"}
                    alt={medication.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                    {medication.category}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{medication.name}</CardTitle>
                  <CardDescription>{medication.id}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Stock:</span>
                    <span className={`text-sm font-medium ${medication.stock < 50 ? "text-red-600" : "text-green-600"}`}>
                      {medication.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Price:</span>
                    <span className="text-sm font-medium">
                      ₹{medication.unitPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expires:</span>
                    <span className="text-sm font-medium">
                      {new Date(medication.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-gray-500 line-clamp-2">
                    {medication.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => 
                    toast({ 
                      title: "Coming Soon", 
                      description: "Medication detail view will be available soon." 
                    })
                  }>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border rounded-md glass-card">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No Medications Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Prescriptions Tab Content */}
      {activeTab === "prescriptions" && (
        <Card className="glass-card animate-glass-fade">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map(prescription => (
                    <TableRow key={prescription.id}>
                      <TableCell>{prescription.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{prescription.patientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{prescription.patientName}</p>
                            <p className="text-xs text-gray-500">{prescription.patientId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{prescription.doctorName}</TableCell>
                      <TableCell>{prescription.date}</TableCell>
                      <TableCell>{prescription.items.length} items</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(prescription.status)}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({ title: "Coming Soon", description: "Prescription detail view will be available soon." })}
                        >
                          View
                        </Button>
                        {prescription.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => toast({ title: "Coming Soon", description: "Process prescription feature will be available soon." })}
                          >
                            Process
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No prescriptions found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dispensing Tab Content */}
      {activeTab === "dispensing" && (
        <div className="glass-card animate-glass-fade p-8">
          <div className="text-center pb-6 border-b">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Dispensing Module</h3>
            <p className="text-gray-500 mt-2">Dispense medications to patients based on prescriptions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Prescriptions</CardTitle>
                <CardDescription>Prescriptions waiting to be dispensed</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions
                      .filter(p => p.status === "pending")
                      .map(prescription => (
                        <TableRow key={prescription.id}>
                          <TableCell>{prescription.id}</TableCell>
                          <TableCell>{prescription.patientName}</TableCell>
                          <TableCell>{prescription.date}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast({ title: "Coming Soon", description: "Dispense feature will be available soon." })}
                            >
                              Dispense
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Dispensing</CardTitle>
                <CardDescription>Dispense medications without a prescription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Patient</label>
                    <div className="flex mt-1 gap-2">
                      <Input placeholder="Search patient..." className="glass-input" />
                      <Button variant="outline" size="icon">
                        <User size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Medication</label>
                    <div className="flex mt-1 gap-2">
                      <Input placeholder="Search medication..." className="glass-input" />
                      <Button variant="outline" size="icon">
                        <Pill size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-black text-white hover:bg-black/80 mt-4" 
                    onClick={() => toast({ title: "Coming Soon", description: "Quick dispensing feature will be available soon." })}
                  >
                    Start Dispensing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Reports Tab Content */}
      {activeTab === "reports" && (
        <div className="glass-card animate-glass-fade p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Report</CardTitle>
              <CardDescription>Overview of medication inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-48">
                <p className="text-center text-gray-500">
                  Inventory charts will be displayed here.
                  <br />
                  Coming soon!
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast({ title: "Coming Soon", description: "Report generation will be available soon." })}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dispensing Report</CardTitle>
              <CardDescription>Summary of medications dispensed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-48">
                <p className="text-center text-gray-500">
                  Dispensing charts will be displayed here.
                  <br />
                  Coming soon!
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast({ title: "Coming Soon", description: "Report generation will be available soon." })}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Expiring Medications</CardTitle>
              <CardDescription>Medications expiring within the next 3 months</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Manufacturer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringMedications.length > 0 ? (
                    expiringMedications.map(medication => (
                      <TableRow key={medication.id}>
                        <TableCell>{medication.id}</TableCell>
                        <TableCell>{medication.name}</TableCell>
                        <TableCell>{new Date(medication.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>{medication.stock} units</TableCell>
                        <TableCell>{medication.manufacturer}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No medications expiring soon.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Pharmacy;
