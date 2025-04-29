
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XSquare, Search, Plus, Edit, Trash2, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface XRayRecord {
  id: string;
  patientName: string;
  patientId: string;
  referringDoctor: string;
  date: string;
  bodyPart: string;
  findings: string;
  status: "pending" | "completed" | "reviewed";
  imagePath: string;
}

const initialRecords: XRayRecord[] = [
  {
    id: "1",
    patientName: "Arjun Mehta",
    patientId: "P10045",
    referringDoctor: "Dr. Sharma",
    date: "2025-04-28",
    bodyPart: "Chest",
    findings: "No abnormalities detected.",
    status: "completed",
    imagePath: "/lovable-uploads/40dac181-641b-409d-a776-3b4eeb43e298.png"
  },
  {
    id: "2",
    patientName: "Sunita Patel",
    patientId: "P10078",
    referringDoctor: "Dr. Verma",
    date: "2025-04-27",
    bodyPart: "Left Wrist",
    findings: "Hairline fracture of the distal radius.",
    status: "reviewed",
    imagePath: "/lovable-uploads/609c1ea7-12ec-44a2-bb9d-5f1ddbbbc93b.png"
  },
  {
    id: "3",
    patientName: "Ramesh Kumar",
    patientId: "P10092",
    referringDoctor: "Dr. Gupta",
    date: "2025-04-29",
    bodyPart: "Lumbar Spine",
    findings: "Pending review by radiologist.",
    status: "pending",
    imagePath: "/lovable-uploads/a9450c4a-b487-46ab-9c8b-e4532fa48636.png"
  }
];

const XrayPage = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<XRayRecord[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<XRayRecord | null>(null);
  
  const [newRecord, setNewRecord] = useState<Omit<XRayRecord, 'id'>>({
    patientName: "",
    patientId: "",
    referringDoctor: "",
    date: "",
    bodyPart: "",
    findings: "",
    status: "pending",
    imagePath: "/lovable-uploads/ca7f1a7c-3742-446f-a9ed-301c5093d39b.png" // Default image
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && currentRecord) {
      setCurrentRecord({
        ...currentRecord,
        [name]: value,
      });
    } else {
      setNewRecord({
        ...newRecord,
        [name]: value,
      });
    }
  };

  const handleAddRecord = () => {
    const newId = (records.length + 1).toString();
    const recordToAdd = { id: newId, ...newRecord };
    setRecords([...records, recordToAdd]);
    setNewRecord({
      patientName: "",
      patientId: "",
      referringDoctor: "",
      date: "",
      bodyPart: "",
      findings: "",
      status: "pending",
      imagePath: "/lovable-uploads/ca7f1a7c-3742-446f-a9ed-301c5093d39b.png"
    });
    setIsAddDialogOpen(false);
    toast({
      title: "X-Ray Record Added",
      description: `X-Ray record for ${newRecord.patientName} has been added.`,
    });
  };

  const handleEditRecord = () => {
    if (currentRecord) {
      setRecords(records.map(record => 
        record.id === currentRecord.id ? currentRecord : record
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "X-Ray Record Updated",
        description: `X-Ray record for ${currentRecord.patientName} has been updated.`,
      });
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "X-Ray Record Deleted",
      description: "The X-Ray record has been deleted from the system.",
    });
  };

  const openEditDialog = (record: XRayRecord) => {
    setCurrentRecord(record);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (record: XRayRecord) => {
    setCurrentRecord(record);
    setIsViewDialogOpen(true);
  };

  // Filter records based on search
  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.referringDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.bodyPart.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">X-Ray Department</h1>
        <p className="text-gray-600">Manage and review X-Ray records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Total Records</p>
            <h2 className="text-3xl font-bold">{records.length}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <XSquare size={20} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Pending Review</p>
            <h2 className="text-3xl font-bold">
              {records.filter(record => record.status === "pending").length}
            </h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Eye size={20} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Completed Today</p>
            <h2 className="text-3xl font-bold">
              {records.filter(record => 
                record.status === "completed" && 
                record.date === new Date().toISOString().split('T')[0]
              ).length}
            </h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <Download size={20} />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-black rounded-md mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white">
            All Records
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Pending Review
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card className="p-6 bg-white">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search X-Ray records..." 
                  className="pl-10 bg-white border border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 gap-2 whitespace-nowrap">
                    <Plus size={16} />
                    Add X-Ray Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New X-Ray Record</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new X-Ray record.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Patient Name</label>
                      <Input
                        name="patientName"
                        className="col-span-3"
                        value={newRecord.patientName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Patient ID</label>
                      <Input
                        name="patientId"
                        className="col-span-3"
                        value={newRecord.patientId}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Referring Doctor</label>
                      <Input
                        name="referringDoctor"
                        className="col-span-3"
                        value={newRecord.referringDoctor}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Date</label>
                      <Input
                        name="date"
                        type="date"
                        className="col-span-3"
                        value={newRecord.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Body Part</label>
                      <Input
                        name="bodyPart"
                        className="col-span-3"
                        value={newRecord.bodyPart}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Findings</label>
                      <Textarea
                        name="findings"
                        className="col-span-3"
                        value={newRecord.findings}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Status</label>
                      <select
                        name="status"
                        className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                        value={newRecord.status}
                        onChange={handleInputChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="reviewed">Reviewed</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={handleAddRecord}
                    >
                      Add Record
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Edit Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit X-Ray Record</DialogTitle>
                    <DialogDescription>
                      Update the details for this X-Ray record.
                    </DialogDescription>
                  </DialogHeader>
                  {currentRecord && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Patient Name</label>
                        <Input
                          name="patientName"
                          className="col-span-3"
                          value={currentRecord.patientName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Patient ID</label>
                        <Input
                          name="patientId"
                          className="col-span-3"
                          value={currentRecord.patientId}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Referring Doctor</label>
                        <Input
                          name="referringDoctor"
                          className="col-span-3"
                          value={currentRecord.referringDoctor}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Date</label>
                        <Input
                          name="date"
                          type="date"
                          className="col-span-3"
                          value={currentRecord.date}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Body Part</label>
                        <Input
                          name="bodyPart"
                          className="col-span-3"
                          value={currentRecord.bodyPart}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Findings</label>
                        <Textarea
                          name="findings"
                          className="col-span-3"
                          value={currentRecord.findings}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Status</label>
                        <select
                          name="status"
                          className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                          value={currentRecord.status}
                          onChange={handleInputChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="reviewed">Reviewed</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={handleEditRecord}
                    >
                      Update Record
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* View Dialog */}
              <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>X-Ray Image</DialogTitle>
                    <DialogDescription>
                      {currentRecord?.patientName} - {currentRecord?.bodyPart} X-Ray
                    </DialogDescription>
                  </DialogHeader>
                  {currentRecord && (
                    <div className="py-4">
                      <div className="relative w-full h-80 bg-black rounded-md overflow-hidden mb-4">
                        <img 
                          src={currentRecord.imagePath} 
                          alt={`${currentRecord.patientName} X-Ray`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-500">Patient</p>
                          <p className="font-medium">{currentRecord.patientName}</p>
                          <p className="text-sm text-gray-600">{currentRecord.patientId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">{new Date(currentRecord.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`font-medium ${
                            currentRecord.status === 'pending' ? 'text-amber-600' :
                            currentRecord.status === 'completed' ? 'text-blue-600' :
                            'text-green-600'
                          }`}>
                            {currentRecord.status.charAt(0).toUpperCase() + currentRecord.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Findings</p>
                        <p className="mt-1">{currentRecord.findings}</p>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        openEditDialog(currentRecord!);
                      }}
                    >
                      Edit Record
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">X-Ray</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden mr-3 cursor-pointer" onClick={() => openViewDialog(record)}>
                            <img 
                              src={record.imagePath} 
                              alt={`${record.patientName} X-Ray`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>{record.bodyPart} X-Ray</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.patientName}</div>
                          <div className="text-gray-500 text-sm">{record.patientId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">{record.referringDoctor}</td>
                      <td className="px-4 py-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <span 
                          className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                            record.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            record.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 border-gray-200 p-1 h-8"
                            onClick={() => openViewDialog(record)}
                          >
                            <Eye size={14} />
                            <span className="hidden md:inline">View</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 border-gray-200 p-1 h-8"
                            onClick={() => openEditDialog(record)}
                          >
                            <Edit size={14} />
                            <span className="hidden md:inline">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 border-gray-200 text-red-600 hover:bg-red-50 p-1 h-8"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 size={14} />
                            <span className="hidden md:inline">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRecords.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <XSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-1">No X-Ray records found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    There are currently no X-Ray records in the system or none match your search criteria.
                  </p>
                  <Button className="bg-black hover:bg-gray-800" onClick={() => setIsAddDialogOpen(true)}>
                    Add X-Ray Record
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold mb-4">Pending X-Ray Records</h2>
            {records.filter(record => record.status === "pending").length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">X-Ray</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records
                      .filter(record => record.status === "pending")
                      .map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden mr-3 cursor-pointer" onClick={() => openViewDialog(record)}>
                                <img 
                                  src={record.imagePath} 
                                  alt={`${record.patientName} X-Ray`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span>{record.bodyPart} X-Ray</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{record.patientName}</div>
                              <div className="text-gray-500 text-sm">{record.patientId}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">{record.referringDoctor}</td>
                          <td className="px-4 py-4">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-4 py-4 text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 border-gray-200 p-1 h-8"
                                onClick={() => openViewDialog(record)}
                              >
                                <Eye size={14} />
                                <span className="hidden md:inline">View</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 border-gray-200 p-1 h-8"
                                onClick={() => openEditDialog(record)}
                              >
                                <Edit size={14} />
                                <span className="hidden md:inline">Edit</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 mb-4">
                  There are no pending X-Ray records that need review.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold mb-4">Completed X-Ray Records</h2>
            {records.filter(record => record.status === "completed" || record.status === "reviewed").length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">X-Ray</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records
                      .filter(record => record.status === "completed" || record.status === "reviewed")
                      .map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden mr-3 cursor-pointer" onClick={() => openViewDialog(record)}>
                                <img 
                                  src={record.imagePath} 
                                  alt={`${record.patientName} X-Ray`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span>{record.bodyPart} X-Ray</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{record.patientName}</div>
                              <div className="text-gray-500 text-sm">{record.patientId}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">{record.referringDoctor}</td>
                          <td className="px-4 py-4">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-4 py-4">
                            <span 
                              className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                record.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 border-gray-200 p-1 h-8"
                                onClick={() => openViewDialog(record)}
                              >
                                <Eye size={14} />
                                <span className="hidden md:inline">View</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 border-gray-200 text-blue-600 hover:bg-blue-50 p-1 h-8"
                              >
                                <Download size={14} />
                                <span className="hidden md:inline">Download</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 mb-4">
                  There are no completed X-Ray records.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default XrayPage;
