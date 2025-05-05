
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, SquareX, Users, Bone, Plus, Edit, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  admissionDate: string;
  treatmentPlan: string;
  assignedDoctor: string;
  status: "active" | "recovered" | "referred" | "discharged";
}

const initialPatients: Patient[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    condition: "Fractured Femur",
    admissionDate: "2025-04-25",
    treatmentPlan: "Surgery and Physiotherapy",
    assignedDoctor: "Dr. Mehra",
    status: "active"
  },
  {
    id: "2",
    name: "Sneha Sharma",
    age: 32,
    gender: "Female",
    condition: "Osteoarthritis",
    admissionDate: "2025-04-22",
    treatmentPlan: "Pain Management and Physical Therapy",
    assignedDoctor: "Dr. Khanna",
    status: "active"
  },
  {
    id: "3",
    name: "Viren Singh",
    age: 28,
    gender: "Male",
    condition: "ACL Tear",
    admissionDate: "2025-04-20",
    treatmentPlan: "Arthroscopic Surgery",
    assignedDoctor: "Dr. Mehra",
    status: "active"
  }
];

const OrthoPage = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: "",
    age: 0,
    gender: "",
    condition: "",
    admissionDate: "",
    treatmentPlan: "",
    assignedDoctor: "",
    status: "active"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && currentPatient) {
      setCurrentPatient({
        ...currentPatient,
        [name]: name === 'age' ? parseInt(value) : value,
      });
    } else {
      setNewPatient({
        ...newPatient,
        [name]: name === 'age' ? parseInt(value) : value,
      });
    }
  };

  const handleAddPatient = () => {
    const newId = (patients.length + 1).toString();
    const patientToAdd = { id: newId, ...newPatient };
    setPatients([...patients, patientToAdd]);
    setNewPatient({
      name: "",
      age: 0,
      gender: "",
      condition: "",
      admissionDate: "",
      treatmentPlan: "",
      assignedDoctor: "",
      status: "active"
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Patient Added",
      description: `${newPatient.name} has been added to orthopedics department.`,
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
      description: "The patient has been removed from orthopedics department.",
    });
  };

  const openEditDialog = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsEditDialogOpen(true);
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2 p-6 bg-white">
          <h2 className="text-xl font-bold mb-2">Orthopedic Treatment Tracker</h2>
          <p className="text-gray-500 mb-4">Monitor patient progress and treatment plans</p>
          
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
                  <DialogTitle>Add New Patient</DialogTitle>
                  <DialogDescription>
                    Enter patient details to add them to the orthopedics department.
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
                    <label className="text-right text-sm font-medium">Gender</label>
                    <select
                      name="gender"
                      className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                      value={newPatient.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Condition</label>
                    <Input
                      name="condition"
                      className="col-span-3"
                      value={newPatient.condition}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Admission Date</label>
                    <Input
                      name="admissionDate"
                      type="date"
                      className="col-span-3"
                      value={newPatient.admissionDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium">Treatment Plan</label>
                    <Textarea
                      name="treatmentPlan"
                      className="col-span-3"
                      value={newPatient.treatmentPlan}
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
                    Update the patient information.
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
                      <label className="text-right text-sm font-medium">Gender</label>
                      <select
                        name="gender"
                        className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                        value={currentPatient.gender}
                        onChange={handleInputChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Condition</label>
                      <Input
                        name="condition"
                        className="col-span-3"
                        value={currentPatient.condition}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Admission Date</label>
                      <Input
                        name="admissionDate"
                        type="date"
                        className="col-span-3"
                        value={currentPatient.admissionDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Treatment Plan</label>
                      <Textarea
                        name="treatmentPlan"
                        className="col-span-3"
                        value={currentPatient.treatmentPlan}
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
                      <label className="text-right text-sm font-medium">Status</label>
                      <select
                        name="status"
                        className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                        value={currentPatient.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="recovered">Recovered</option>
                        <option value="referred">Referred</option>
                        <option value="discharged">Discharged</option>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-gray-500 text-sm">{patient.age} years, {patient.gender}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{patient.condition}</td>
                    <td className="px-4 py-4">{patient.assignedDoctor}</td>
                    <td className="px-4 py-4">
                      <span 
                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                          patient.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          patient.status === 'recovered' ? 'bg-green-100 text-green-800' :
                          patient.status === 'referred' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
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
                <Bone className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-1">No patients found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  There are currently no patients in this department or none match your search criteria.
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
          <p className="text-gray-500 mb-4">Common orthopedic department tasks</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Create Treatment Plan
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <SquareX className="mr-2 h-4 w-4" />
              View X-rays
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left text-gray-700" size="lg">
              <Users className="mr-2 h-4 w-4" />
              Assign Physiotherapist
            </Button>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="bg-black rounded-md mb-6">
          <TabsTrigger value="patients" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Patients
          </TabsTrigger>
          <TabsTrigger value="treatments" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Treatments
          </TabsTrigger>
          <TabsTrigger value="equipment" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Equipment
          </TabsTrigger>
          <TabsTrigger value="procedures" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Procedures
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="mt-6">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Orthopedic Patients</h2>
            <p className="text-gray-500 mb-6">Manage patients with orthopedic conditions</p>
            
            {patients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-gray-500 mb-4">
                  No patients have been added to the orthopedics department yet.
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
                        <p className="text-sm text-gray-500">{patient.age} years, {patient.gender}</p>
                      </div>
                      <span 
                        className={`inline-flex rounded-full h-fit px-2 text-xs font-semibold ${
                          patient.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          patient.status === 'recovered' ? 'bg-green-100 text-green-800' :
                          patient.status === 'referred' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Condition: <span className="font-normal">{patient.condition}</span></p>
                      <p className="text-sm font-medium">Admitted: <span className="font-normal">{new Date(patient.admissionDate).toLocaleDateString()}</span></p>
                      <p className="text-sm font-medium">Doctor: <span className="font-normal">{patient.assignedDoctor}</span></p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
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
        
        <TabsContent value="treatments">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Treatments View Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The treatments management module is under development. You'll be able to create and track treatment plans.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="equipment">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Equipment Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The equipment management module is under development. You'll be able to track orthopedic equipment and supplies.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="procedures">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Procedures Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The procedures management module is under development. You'll be able to track orthopedic procedures and protocols.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default OrthoPage;
