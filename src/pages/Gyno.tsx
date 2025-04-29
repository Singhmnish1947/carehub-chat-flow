
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, Heart, Plus, Edit, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MaternalPatient {
  id: string;
  name: string;
  age: number;
  gestationWeek: number;
  dueDateEst: string;
  lastCheckup: string;
  nextCheckup: string;
  assignedDoctor: string;
  highRisk: boolean;
  notes?: string;
}

const initialPatients: MaternalPatient[] = [
  {
    id: "1",
    name: "Priya Malhotra",
    age: 28,
    gestationWeek: 24,
    dueDateEst: "2025-08-15",
    lastCheckup: "2025-04-20",
    nextCheckup: "2025-05-04",
    assignedDoctor: "Dr. Sharma",
    highRisk: false,
    notes: "Normal pregnancy progression, vitamin supplements prescribed."
  },
  {
    id: "2",
    name: "Anjali Gupta",
    age: 32,
    gestationWeek: 30,
    dueDateEst: "2025-07-01",
    lastCheckup: "2025-04-25",
    nextCheckup: "2025-05-09",
    assignedDoctor: "Dr. Patel",
    highRisk: true,
    notes: "Gestational diabetes, requires close monitoring."
  },
  {
    id: "3",
    name: "Meera Singh",
    age: 26,
    gestationWeek: 12,
    dueDateEst: "2025-10-22",
    lastCheckup: "2025-04-22",
    nextCheckup: "2025-05-20",
    assignedDoctor: "Dr. Sharma",
    highRisk: false,
    notes: "First pregnancy, normal progression."
  }
];

const GynoPage = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<MaternalPatient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<MaternalPatient | null>(null);
  
  const [newPatient, setNewPatient] = useState<Omit<MaternalPatient, 'id'>>({
    name: "",
    age: 0,
    gestationWeek: 0,
    dueDateEst: "",
    lastCheckup: "",
    nextCheckup: "",
    assignedDoctor: "",
    highRisk: false,
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (isEditDialogOpen && currentPatient) {
      if (type === 'checkbox') {
        setCurrentPatient({
          ...currentPatient,
          [name]: (e.target as HTMLInputElement).checked,
        });
      } else {
        setCurrentPatient({
          ...currentPatient,
          [name]: name === 'age' || name === 'gestationWeek' ? parseInt(value) : value,
        });
      }
    } else {
      if (type === 'checkbox') {
        setNewPatient({
          ...newPatient,
          [name]: (e.target as HTMLInputElement).checked,
        });
      } else {
        setNewPatient({
          ...newPatient,
          [name]: name === 'age' || name === 'gestationWeek' ? parseInt(value) : value,
        });
      }
    }
  };

  const handleAddPatient = () => {
    const newId = (patients.length + 1).toString();
    const patientToAdd = { id: newId, ...newPatient };
    setPatients([...patients, patientToAdd]);
    setNewPatient({
      name: "",
      age: 0,
      gestationWeek: 0,
      dueDateEst: "",
      lastCheckup: "",
      nextCheckup: "",
      assignedDoctor: "",
      highRisk: false,
      notes: ""
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Patient Added",
      description: `${newPatient.name} has been added to maternal care program.`,
    });
  };

  const handleEditPatient = () => {
    if (currentPatient) {
      setPatients(patients.map(patient => 
        patient.id === currentPatient.id ? currentPatient : patient
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Patient Updated",
        description: `${currentPatient.name}'s information has been updated.`,
      });
    }
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(patient => patient.id !== id));
    toast({
      title: "Patient Removed",
      description: "The patient has been removed from maternal care program.",
    });
  };

  const openEditDialog = (patient: MaternalPatient) => {
    setCurrentPatient(patient);
    setIsEditDialogOpen(true);
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2 p-6 bg-white">
          <h2 className="text-xl font-bold mb-2">Maternal Care Tracker</h2>
          <p className="text-gray-500 mb-4">Monitor pregnancy progress and maternity care</p>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search patients..." 
                className="pl-10 bg-white border border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800 gap-2 whitespace-nowrap">
                  <Plus size={16} />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Maternal Care Patient</DialogTitle>
                  <DialogDescription>
                    Enter patient details to add them to the maternal care program.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Name</label>
                    <Input
                      name="name"
                      className="col-span-3"
                      value={newPatient.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Age</label>
                    <Input
                      name="age"
                      type="number"
                      className="col-span-3"
                      value={newPatient.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Gestation Week</label>
                    <Input
                      name="gestationWeek"
                      type="number"
                      className="col-span-3"
                      value={newPatient.gestationWeek}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Est. Due Date</label>
                    <Input
                      name="dueDateEst"
                      type="date"
                      className="col-span-3"
                      value={newPatient.dueDateEst}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Last Checkup</label>
                    <Input
                      name="lastCheckup"
                      type="date"
                      className="col-span-3"
                      value={newPatient.lastCheckup}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Next Checkup</label>
                    <Input
                      name="nextCheckup"
                      type="date"
                      className="col-span-3"
                      value={newPatient.nextCheckup}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Assigned Doctor</label>
                    <Input
                      name="assignedDoctor"
                      className="col-span-3"
                      value={newPatient.assignedDoctor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">High Risk</label>
                    <div className="col-span-3 flex items-center">
                      <input
                        type="checkbox"
                        id="highRisk"
                        name="highRisk"
                        checked={newPatient.highRisk}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="highRisk">Mark as high risk pregnancy</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Notes</label>
                    <Textarea
                      name="notes"
                      className="col-span-3"
                      value={newPatient.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={handleAddPatient}
                  >
                    Add Patient
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Patient Details</DialogTitle>
                  <DialogDescription>
                    Update the maternal care patient information.
                  </DialogDescription>
                </DialogHeader>
                {currentPatient && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Name</label>
                      <Input
                        name="name"
                        className="col-span-3"
                        value={currentPatient.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Age</label>
                      <Input
                        name="age"
                        type="number"
                        className="col-span-3"
                        value={currentPatient.age}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Gestation Week</label>
                      <Input
                        name="gestationWeek"
                        type="number"
                        className="col-span-3"
                        value={currentPatient.gestationWeek}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Est. Due Date</label>
                      <Input
                        name="dueDateEst"
                        type="date"
                        className="col-span-3"
                        value={currentPatient.dueDateEst}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Last Checkup</label>
                      <Input
                        name="lastCheckup"
                        type="date"
                        className="col-span-3"
                        value={currentPatient.lastCheckup}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Next Checkup</label>
                      <Input
                        name="nextCheckup"
                        type="date"
                        className="col-span-3"
                        value={currentPatient.nextCheckup}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Assigned Doctor</label>
                      <Input
                        name="assignedDoctor"
                        className="col-span-3"
                        value={currentPatient.assignedDoctor}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">High Risk</label>
                      <div className="col-span-3 flex items-center">
                        <input
                          type="checkbox"
                          id="editHighRisk"
                          name="highRisk"
                          checked={currentPatient.highRisk}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="editHighRisk">Mark as high risk pregnancy</label>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Notes</label>
                      <Textarea
                        name="notes"
                        className="col-span-3"
                        value={currentPatient.notes || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={handleEditPatient}
                  >
                    Update Patient
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pregnancy</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Checkup</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-gray-500 text-sm">{patient.age} years</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div>Week {patient.gestationWeek}</div>
                        <div className="text-gray-500 text-sm">Due: {new Date(patient.dueDateEst).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{patient.assignedDoctor}</td>
                    <td className="px-4 py-4">{new Date(patient.nextCheckup).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span 
                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                          patient.highRisk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {patient.highRisk ? 'High Risk' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 border-gray-200 p-1 h-8"
                          onClick={() => openEditDialog(patient)}
                        >
                          <Edit size={14} />
                          <span className="hidden md:inline">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 border-gray-200 text-red-600 hover:bg-red-50 p-1 h-8"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 size={14} />
                          <span className="hidden md:inline">Remove</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPatients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-1">No patients found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  There are currently no patients in the maternal care program or none match your search criteria.
                </p>
                <Button className="bg-black hover:bg-gray-800" onClick={() => setIsAddDialogOpen(true)}>
                  Add Patient
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
          <p className="text-gray-500 mb-4">Common gynecology department tasks</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Create Care Plan
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <Clock className="mr-2 h-4 w-4" />
              Register Pregnancy
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <Heart className="mr-2 h-4 w-4" />
              View Patient History
            </Button>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="bg-black rounded-md mb-6">
          <TabsTrigger value="patients" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Patients
          </TabsTrigger>
          <TabsTrigger value="antenatal" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Antenatal Care
          </TabsTrigger>
          <TabsTrigger value="procedures" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Procedures
          </TabsTrigger>
          <TabsTrigger value="education" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Patient Education
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="mt-6">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Gynecology Patients</h2>
            <p className="text-gray-500 mb-6">Manage gynecology patients and records</p>
            
            {patients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-gray-500 mb-4">
                  No patients have been added to the gynecology department yet.
                </p>
                <Button className="bg-black hover:bg-gray-800" onClick={() => setIsAddDialogOpen(true)}>
                  Add Patient
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map(patient => (
                  <Card key={patient.id} className="p-4 border border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.age} years</p>
                      </div>
                      <span 
                        className={`inline-flex rounded-full h-fit px-2 text-xs font-semibold ${
                          patient.highRisk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {patient.highRisk ? 'High Risk' : 'Normal'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Pregnancy: <span className="font-normal">Week {patient.gestationWeek}</span></p>
                      <p className="text-sm font-medium">Due Date: <span className="font-normal">{new Date(patient.dueDateEst).toLocaleDateString()}</span></p>
                      <p className="text-sm font-medium">Next Checkup: <span className="font-normal">{new Date(patient.nextCheckup).toLocaleDateString()}</span></p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        onClick={() => openEditDialog(patient)}
                      >
                        View Details
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="p-1 h-8"
                          onClick={() => openEditDialog(patient)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="p-1 h-8 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="antenatal">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Antenatal Care Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The antenatal care module is under development. You'll be able to manage pregnancy checkups and track fetal development.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="procedures">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Procedures Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The procedures management module is under development. You'll be able to schedule and track gynecological procedures.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="education">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Patient Education Resources Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The patient education module is under development. You'll be able to share informational resources with patients.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GynoPage;
