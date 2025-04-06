
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  FileEdit,
  Trash2,
  UserCheck,
  X,
  Check
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Type definitions
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
}

interface Patient {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  type: "consultation" | "follow-up" | "emergency" | "routine-checkup";
  notes: string;
}

// Sample data
const sampleDoctors: Doctor[] = [
  { id: "D001", name: "Dr. Robert Chen", specialization: "Cardiology", department: "Cardiology" },
  { id: "D002", name: "Dr. Sarah Johnson", specialization: "Pediatrics", department: "Pediatrics" },
  { id: "D003", name: "Dr. Michael Rodriguez", specialization: "Neurology", department: "Neurology" }
];

const samplePatients: Patient[] = [
  { id: "P001", name: "John Smith" },
  { id: "P002", name: "Jane Doe" },
  { id: "P003", name: "Michael Johnson" }
];

const sampleAppointments: Appointment[] = [
  {
    id: "A001",
    patientId: "P001",
    patientName: "John Smith",
    doctorId: "D001",
    doctorName: "Dr. Robert Chen",
    date: "2025-04-10",
    time: "09:00",
    status: "scheduled",
    type: "consultation",
    notes: "Initial consultation for heart palpitations"
  },
  {
    id: "A002",
    patientId: "P002",
    patientName: "Jane Doe",
    doctorId: "D002",
    doctorName: "Dr. Sarah Johnson",
    date: "2025-04-10",
    time: "10:30",
    status: "scheduled",
    type: "routine-checkup",
    notes: "Annual wellness checkup"
  },
  {
    id: "A003",
    patientId: "P003",
    patientName: "Michael Johnson",
    doctorId: "D003",
    doctorName: "Dr. Michael Rodriguez",
    date: "2025-04-11",
    time: "14:00",
    status: "scheduled",
    type: "follow-up",
    notes: "Follow-up on medication effectiveness"
  }
];

const appointmentTypes = ["consultation", "follow-up", "emergency", "routine-checkup"];
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

const Appointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [doctors] = useState<Doctor[]>(sampleDoctors);
  const [patients] = useState<Patient[]>(samplePatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [tempAppointment, setTempAppointment] = useState<Partial<Appointment>>({});

  // Filter appointments based on search, status, date and tab
  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date().toISOString().split('T')[0];
    const isUpcoming = appointment.date >= today && appointment.status === 'scheduled';
    const isPast = appointment.date < today || appointment.status === 'completed' || appointment.status === 'cancelled' || appointment.status === 'no-show';
    
    const matchesTab = 
      (activeTab === "upcoming" && isUpcoming) ||
      (activeTab === "past" && isPast) ||
      (activeTab === "all");

    const matchesSearch =
      !searchQuery ||
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      filterStatus === "all" || 
      appointment.status === filterStatus;

    const matchesDate =
      !filterDate || appointment.date === filterDate;

    return matchesTab && matchesSearch && matchesStatus && matchesDate;
  });

  // Create new appointment
  const handleCreateAppointment = () => {
    setDialogMode("create");
    setCurrentAppointment(null);
    setTempAppointment({
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      status: "scheduled",
      type: "consultation",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  // Edit existing appointment
  const handleEditAppointment = (appointment: Appointment) => {
    setDialogMode("edit");
    setCurrentAppointment(appointment);
    setTempAppointment({ ...appointment });
    setIsDialogOpen(true);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempAppointment({ ...tempAppointment, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setTempAppointment({ ...tempAppointment, [name]: value });
  };

  // Handle doctor selection
  const handleDoctorChange = (doctorId: string) => {
    const selectedDoctor = doctors.find(doctor => doctor.id === doctorId);
    if (selectedDoctor) {
      setTempAppointment({
        ...tempAppointment,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name
      });
    }
  };

  // Handle patient selection
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(patient => patient.id === patientId);
    if (selectedPatient) {
      setTempAppointment({
        ...tempAppointment,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name
      });
    }
  };

  // Save appointment
  const handleSaveAppointment = () => {
    if (
      !tempAppointment.patientId ||
      !tempAppointment.doctorId ||
      !tempAppointment.date ||
      !tempAppointment.time
    ) {
      toast({
        title: "Error",
        description: "Patient, doctor, date, and time are required.",
        variant: "destructive"
      });
      return;
    }

    if (dialogMode === "create") {
      const newAppointment: Appointment = {
        id: `A${String(appointments.length + 1).padStart(3, "0")}`,
        patientId: tempAppointment.patientId!,
        patientName: tempAppointment.patientName!,
        doctorId: tempAppointment.doctorId!,
        doctorName: tempAppointment.doctorName!,
        date: tempAppointment.date!,
        time: tempAppointment.time!,
        status: tempAppointment.status as "scheduled" | "completed" | "cancelled" | "no-show",
        type: tempAppointment.type as "consultation" | "follow-up" | "emergency" | "routine-checkup",
        notes: tempAppointment.notes || ""
      };

      setAppointments([...appointments, newAppointment]);
      
      toast({
        title: "Success",
        description: "Appointment has been scheduled successfully."
      });
    } else if (currentAppointment) {
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === currentAppointment.id 
          ? { ...appointment, ...tempAppointment } as Appointment
          : appointment
      );
      
      setAppointments(updatedAppointments);
      
      toast({
        title: "Success",
        description: "Appointment has been updated successfully."
      });
    }

    setIsDialogOpen(false);
  };

  // Delete appointment
  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId));
    
    toast({
      title: "Success",
      description: "Appointment has been deleted successfully."
    });
  };

  // Update appointment status
  const handleStatusChange = (appointmentId: string, newStatus: "scheduled" | "completed" | "cancelled" | "no-show") => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    );
    
    setAppointments(updatedAppointments);
    
    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${newStatus}.`
    });
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch(status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
            <p className="text-gray-500">Schedule and manage patient appointments</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreateAppointment}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="w-[180px]">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4 md:w-96">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Appointment List</CardTitle>
                <CardDescription>
                  {activeTab === "upcoming" ? "Upcoming appointments" : 
                   activeTab === "past" ? "Past appointments" : "All appointments"}
                  : {filteredAppointments.length} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAppointments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAppointments.map(appointment => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <div className={`px-4 py-2 text-xs font-medium uppercase ${getStatusClass(appointment.status)}`}>
                          {appointment.status}
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditAppointment(appointment)}
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{appointment.doctorName}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                            
                            <div className="text-sm">
                              <span className="font-medium">Type: </span> 
                              <span className="capitalize">{appointment.type.replace(/-/g, ' ')}</span>
                            </div>
                            
                            {appointment.status === "scheduled" && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleStatusChange(appointment.id, "completed")}
                                >
                                  <Check className="h-3 w-3 mr-1" /> Complete
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleStatusChange(appointment.id, "cancelled")}
                                >
                                  <X className="h-3 w-3 mr-1" /> Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No appointments found.</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or create a new appointment.</p>
                    <Button className="mt-4" onClick={handleCreateAppointment}>
                      <Plus className="h-4 w-4 mr-2" /> Schedule Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>

      {/* Appointment Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Schedule New Appointment" : "Edit Appointment"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Fill out the form to schedule a new appointment"
                : "Update the appointment details"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="patientId" className="text-sm font-medium">
                  Patient*
                </label>
                <Select
                  value={tempAppointment.patientId || ""}
                  onValueChange={(value) => handlePatientChange(value)}
                >
                  <SelectTrigger id="patientId">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="doctorId" className="text-sm font-medium">
                  Doctor*
                </label>
                <Select
                  value={tempAppointment.doctorId || ""}
                  onValueChange={(value) => handleDoctorChange(value)}
                >
                  <SelectTrigger id="doctorId">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date*
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={tempAppointment.date || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Time*
                </label>
                <Select
                  value={tempAppointment.time || ""}
                  onValueChange={(value) => handleSelectChange("time", value)}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Appointment Type
                </label>
                <Select
                  value={tempAppointment.type || ""}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="capitalize">{type.replace(/-/g, ' ')}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {dialogMode === "edit" && (
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={tempAppointment.status || ""}
                    onValueChange={(value) => handleSelectChange("status", value as any)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add any notes or instructions"
                value={tempAppointment.notes || ""}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveAppointment}>
              {dialogMode === "create" ? "Schedule Appointment" : "Update Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Appointments;
