
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, AlertCircle, Calendar, FileText, Pill, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Medication = {
  id: string;
  name: string;
  category: string;
  code: string;
  stock: number;
  price: string;
  expiry: string;
  description: string;
  image: string;
};

const initialMedications: Medication[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    code: "MED001",
    stock: 250,
    price: "₹5.99",
    expiry: "6/30/2025",
    description: "For pain relief and fever reduction",
    image: "/lovable-uploads/ff9ef56a-904a-4387-bbd2-4bd8cceca136.png"
  },
  {
    id: "2",
    name: "Azithromycin 250mg",
    category: "Antibiotic",
    code: "MED002",
    stock: 120,
    price: "₹12.50",
    expiry: "11/15/2024",
    description: "For bacterial infections",
    image: "/lovable-uploads/383be895-d7bd-417e-a8e1-c4f8bd2c1c83.png"
  },
  {
    id: "3",
    name: "Lisinopril 10mg",
    category: "Antihypertensive",
    code: "MED003",
    stock: 180,
    price: "₹8.75",
    expiry: "8/22/2024",
    description: "For high blood pressure",
    image: "/lovable-uploads/af1b4d48-905c-409b-af69-0eb3bec618a5.png"
  },
  {
    id: "4",
    name: "Metformin 500mg",
    category: "Antidiabetic",
    code: "MED004",
    stock: 200,
    price: "₹7.25",
    expiry: "1/10/2025",
    description: "For type 2 diabetes",
    image: "/lovable-uploads/179b9d9f-4460-4b8d-9130-43dce33875c2.png"
  }
];

const PharmacyPage = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: "",
    category: "",
    code: "",
    stock: 0,
    price: "",
    expiry: "",
    description: "",
    image: "/lovable-uploads/ca7f1a7c-3742-446f-a9ed-301c5093d39b.png" // Default image
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && currentMedication) {
      setCurrentMedication({
        ...currentMedication,
        [name]: name === 'stock' ? parseInt(value) : value,
      });
    } else {
      setNewMedication({
        ...newMedication,
        [name]: name === 'stock' ? parseInt(value) : value,
      });
    }
  };

  const handleAddMedication = () => {
    const newId = (medications.length + 1).toString();
    const medicationToAdd = { id: newId, ...newMedication };
    setMedications([...medications, medicationToAdd]);
    setNewMedication({
      name: "",
      category: "",
      code: "",
      stock: 0,
      price: "",
      expiry: "",
      description: "",
      image: "/lovable-uploads/ca7f1a7c-3742-446f-a9ed-301c5093d39b.png"
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Medication Added",
      description: `${newMedication.name} has been added to inventory.`,
    });
  };

  const handleEditMedication = () => {
    if (currentMedication) {
      setMedications(medications.map(med => 
        med.id === currentMedication.id ? currentMedication : med
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Medication Updated",
        description: `${currentMedication.name} has been updated.`,
      });
    }
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "Medication Removed",
      description: "The medication has been removed from inventory.",
    });
  };

  const openEditDialog = (medication: Medication) => {
    setCurrentMedication(medication);
    setIsEditDialogOpen(true);
  };

  // Filter medications based on search and category
  const filteredMedications = medications.filter(med => {
    const matchesSearch = searchTerm === "" || 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || 
      med.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for the dropdown
  const categories = ["All Categories", ...new Set(medications.map(med => med.category))];

  // Count metrics
  const lowStockCount = medications.filter(med => med.stock < 50).length;
  const expiringCount = medications.filter(med => {
    const expiryDate = new Date(med.expiry);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  }).length;
  const pendingPrescriptions = 1; // Mock data

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy</h1>
        <p className="text-gray-600">Manage medication inventory and prescriptions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Total Medications</p>
            <h2 className="text-3xl font-bold">{medications.length}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Pill size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Low Stock</p>
            <h2 className="text-3xl font-bold">{lowStockCount}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <AlertCircle size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Expiring Soon</p>
            <h2 className="text-3xl font-bold">{expiringCount}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Calendar size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Pending Prescriptions</p>
            <h2 className="text-3xl font-bold">{pendingPrescriptions}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
            <FileText size={24} />
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="bg-white border border-gray-200 rounded-md">
          <TabsTrigger value="inventory" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Inventory
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="dispensing" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Dispensing
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search inventory..." 
                className="pl-10 bg-white border border-gray-200"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-56">
                <select 
                  className="w-full p-2 border border-gray-200 rounded-md"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800 gap-2 w-full md:w-auto">
                    <Plus size={16} />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new medication to the inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Name</label>
                      <Input
                        name="name"
                        className="col-span-3"
                        value={newMedication.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Category</label>
                      <Input
                        name="category"
                        className="col-span-3"
                        value={newMedication.category}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Code</label>
                      <Input
                        name="code"
                        className="col-span-3"
                        value={newMedication.code}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Stock</label>
                      <Input
                        name="stock"
                        type="number"
                        className="col-span-3"
                        value={newMedication.stock}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Price</label>
                      <Input
                        name="price"
                        className="col-span-3"
                        value={newMedication.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Expiry</label>
                      <Input
                        name="expiry"
                        className="col-span-3"
                        placeholder="MM/DD/YYYY"
                        value={newMedication.expiry}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Description</label>
                      <Input
                        name="description"
                        className="col-span-3"
                        value={newMedication.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={handleAddMedication}
                    >
                      Add Medication
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Edit Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Medication</DialogTitle>
                    <DialogDescription>
                      Update the details of this medication.
                    </DialogDescription>
                  </DialogHeader>
                  {currentMedication && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Name</label>
                        <Input
                          name="name"
                          className="col-span-3"
                          value={currentMedication.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Category</label>
                        <Input
                          name="category"
                          className="col-span-3"
                          value={currentMedication.category}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Code</label>
                        <Input
                          name="code"
                          className="col-span-3"
                          value={currentMedication.code}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Stock</label>
                        <Input
                          name="stock"
                          type="number"
                          className="col-span-3"
                          value={currentMedication.stock}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Price</label>
                        <Input
                          name="price"
                          className="col-span-3"
                          value={currentMedication.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Expiry</label>
                        <Input
                          name="expiry"
                          className="col-span-3"
                          value={currentMedication.expiry}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Description</label>
                        <Input
                          name="description"
                          className="col-span-3"
                          value={currentMedication.description}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={handleEditMedication}
                    >
                      Update Medication
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMedications.map(medication => (
              <Card key={medication.id} className="overflow-hidden border border-gray-200">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                    {medication.category}
                  </div>
                  <img 
                    src={medication.image} 
                    alt={medication.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{medication.name}</h3>
                  <p className="text-sm text-gray-500">{medication.code}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <p>
                      <span className="text-gray-500">Stock:</span> 
                      <span className={`font-medium ${medication.stock < 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {medication.stock} units
                      </span>
                    </p>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <p><span className="text-gray-500">Price:</span> <span className="font-medium">{medication.price}</span></p>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <p><span className="text-gray-500">Expiry:</span> <span className="font-medium">{medication.expiry}</span></p>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{medication.description}</p>
                  
                  <div className="mt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 border-gray-200"
                      onClick={() => openEditDialog(medication)}
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 border-gray-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteMedication(medication.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {filteredMedications.length === 0 && (
              <div className="col-span-4 text-center py-12 bg-gray-50 rounded-md">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No medications found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or add a new medication</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="prescriptions">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">Prescriptions view is under development</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              This feature will be coming soon. You'll be able to view, create and manage patient prescriptions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="dispensing">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
            <Pill className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">Dispensing module is under development</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              This feature will be coming soon. You'll be able to track and record medication dispensing to patients.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">Reports module is under development</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              This feature will be coming soon. You'll be able to generate reports on medication usage, inventory changes, and more.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PharmacyPage;
