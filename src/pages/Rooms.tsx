
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileEdit, Trash2, BedDouble } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
interface Room {
  id: string;
  number: string;
  type: "general" | "private" | "semi-private" | "icu" | "operation" | "emergency";
  floor: number;
  wing: string;
  capacity: number;
  occupied: number;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  price: number;
  facilities: string[];
}

interface Bed {
  id: string;
  roomId: string;
  roomNumber: string;
  bedNumber: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  patientId?: string;
  patientName?: string;
  admittedOn?: string;
  expectedDischarge?: string;
}

// Sample data
const sampleRooms: Room[] = [
  {
    id: "R001",
    number: "101",
    type: "private",
    floor: 1,
    wing: "East",
    capacity: 1,
    occupied: 0,
    status: "available",
    price: 250,
    facilities: ["Air conditioning", "TV", "Private bathroom", "WiFi"]
  },
  {
    id: "R002",
    number: "102",
    type: "private",
    floor: 1,
    wing: "East",
    capacity: 1,
    occupied: 1,
    status: "occupied",
    price: 250,
    facilities: ["Air conditioning", "TV", "Private bathroom", "WiFi"]
  },
  {
    id: "R003",
    number: "201",
    type: "semi-private",
    floor: 2,
    wing: "West",
    capacity: 2,
    occupied: 1,
    status: "available",
    price: 150,
    facilities: ["Air conditioning", "Shared bathroom", "WiFi"]
  },
  {
    id: "R004",
    number: "301",
    type: "icu",
    floor: 3,
    wing: "North",
    capacity: 1,
    occupied: 0,
    status: "available",
    price: 500,
    facilities: ["Ventilator", "Cardiac monitor", "Oxygen supply", "Nurse call"]
  }
];

const sampleBeds: Bed[] = [
  {
    id: "B001",
    roomId: "R001",
    roomNumber: "101",
    bedNumber: "101-A",
    status: "available"
  },
  {
    id: "B002",
    roomId: "R002",
    roomNumber: "102",
    bedNumber: "102-A",
    status: "occupied",
    patientId: "P001",
    patientName: "John Smith",
    admittedOn: "2025-04-01",
    expectedDischarge: "2025-04-10"
  },
  {
    id: "B003",
    roomId: "R003",
    roomNumber: "201",
    bedNumber: "201-A",
    status: "occupied",
    patientId: "P002",
    patientName: "Jane Doe",
    admittedOn: "2025-04-03",
    expectedDischarge: "2025-04-07"
  },
  {
    id: "B004",
    roomId: "R003",
    roomNumber: "201",
    bedNumber: "201-B",
    status: "available"
  },
  {
    id: "B005",
    roomId: "R004",
    roomNumber: "301",
    bedNumber: "301-A",
    status: "maintenance"
  }
];

const roomTypes = ["general", "private", "semi-private", "icu", "operation", "emergency"];
const wings = ["East", "West", "North", "South"];
const facilities = [
  "Air conditioning", 
  "TV", 
  "Private bathroom", 
  "Shared bathroom", 
  "WiFi", 
  "Telephone",
  "Oxygen supply", 
  "Nurse call", 
  "Ventilator", 
  "Cardiac monitor"
];

const Rooms = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>(sampleRooms);
  const [beds, setBeds] = useState<Bed[]>(sampleBeds);
  const [activeTab, setActiveTab] = useState("rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentBed, setCurrentBed] = useState<Bed | null>(null);
  const [tempRoom, setTempRoom] = useState<Partial<Room>>({});
  const [tempBed, setTempBed] = useState<Partial<Bed>>({});
  const [filterFloor, setFilterFloor] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Get unique floors for filtering
  const uniqueFloors = Array.from(new Set(rooms.map(room => room.floor))).sort();

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      !searchQuery ||
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.wing.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFloor = 
      filterFloor === "all" || 
      room.floor === Number(filterFloor);

    const matchesStatus =
      filterStatus === "all" ||
      room.status === filterStatus;
    
    const matchesType =
      filterType === "all" ||
      room.type === filterType;

    return matchesSearch && matchesFloor && matchesStatus && matchesType;
  });

  // Filter beds based on search
  const filteredBeds = beds.filter(bed => {
    const matchesSearch =
      !searchQuery ||
      bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus =
      filterStatus === "all" ||
      bed.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Room operations
  const handleCreateRoom = () => {
    setDialogMode("create");
    setCurrentRoom(null);
    setTempRoom({
      floor: 1,
      capacity: 1,
      occupied: 0,
      price: 0,
      status: "available",
      facilities: []
    });
    setSelectedFacilities([]);
    setIsRoomDialogOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setDialogMode("edit");
    setCurrentRoom(room);
    setTempRoom({ ...room });
    setSelectedFacilities(room.facilities);
    setIsRoomDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setTempRoom({ ...tempRoom, [name]: Number(value) });
    } else {
      setTempRoom({ ...tempRoom, [name]: value });
    }
  };

  const handleBedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempBed({ ...tempBed, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setTempRoom({ ...tempRoom, [name]: value });
  };

  const handleBedSelectChange = (name: string, value: string) => {
    setTempBed({ ...tempBed, [name]: value });
  };

  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  const handleSaveRoom = () => {
    if (!tempRoom.number || !tempRoom.type || !tempRoom.wing) {
      toast({
        title: "Error",
        description: "Room number, type, and wing are required.",
        variant: "destructive"
      });
      return;
    }

    const roomWithFacilities = {
      ...tempRoom,
      facilities: selectedFacilities
    };

    if (dialogMode === "create") {
      const newRoom: Room = {
        id: `R${String(rooms.length + 1).padStart(3, "0")}`,
        number: tempRoom.number!,
        type: tempRoom.type as any,
        floor: tempRoom.floor!,
        wing: tempRoom.wing!,
        capacity: tempRoom.capacity!,
        occupied: tempRoom.occupied!,
        status: tempRoom.status as any,
        price: tempRoom.price!,
        facilities: selectedFacilities
      };

      setRooms([...rooms, newRoom]);
      
      toast({
        title: "Success",
        description: "Room has been created successfully."
      });
    } else if (currentRoom) {
      const updatedRooms = rooms.map(room => 
        room.id === currentRoom.id 
          ? { ...room, ...roomWithFacilities } as Room
          : room
      );
      
      setRooms(updatedRooms);
      
      toast({
        title: "Success",
        description: "Room has been updated successfully."
      });
    }

    setIsRoomDialogOpen(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    // Check if there are any occupied beds in this room
    const roomBeds = beds.filter(bed => bed.roomId === roomId);
    const hasOccupiedBeds = roomBeds.some(bed => bed.status === "occupied");
    
    if (hasOccupiedBeds) {
      toast({
        title: "Cannot Delete Room",
        description: "This room has occupied beds. Please discharge patients first.",
        variant: "destructive"
      });
      return;
    }
    
    // Remove room and all its beds
    setRooms(rooms.filter(room => room.id !== roomId));
    setBeds(beds.filter(bed => bed.roomId !== roomId));
    
    toast({
      title: "Success",
      description: "Room and associated beds have been deleted."
    });
  };

  // Bed operations
  const handleCreateBed = () => {
    setDialogMode("create");
    setCurrentBed(null);
    setTempBed({
      status: "available"
    });
    setIsBedDialogOpen(true);
  };

  const handleEditBed = (bed: Bed) => {
    setDialogMode("edit");
    setCurrentBed(bed);
    setTempBed({ ...bed });
    setIsBedDialogOpen(true);
  };

  const handleSaveBed = () => {
    if (!tempBed.roomId || !tempBed.bedNumber) {
      toast({
        title: "Error",
        description: "Room and bed number are required.",
        variant: "destructive"
      });
      return;
    }

    if (dialogMode === "create") {
      // Find the room to get the room number
      const room = rooms.find(room => room.id === tempBed.roomId);
      
      if (!room) {
        toast({
          title: "Error",
          description: "Selected room not found.",
          variant: "destructive"
        });
        return;
      }
      
      const newBed: Bed = {
        id: `B${String(beds.length + 1).padStart(3, "0")}`,
        roomId: tempBed.roomId,
        roomNumber: room.number,
        bedNumber: tempBed.bedNumber!,
        status: tempBed.status as any,
        patientId: tempBed.patientId,
        patientName: tempBed.patientName,
        admittedOn: tempBed.admittedOn,
        expectedDischarge: tempBed.expectedDischarge
      };

      setBeds([...beds, newBed]);
      
      // Update room occupancy
      if (tempBed.status === "occupied") {
        const updatedRooms = rooms.map(r => {
          if (r.id === room.id) {
            return { ...r, occupied: r.occupied + 1 };
          }
          return r;
        });
        
        setRooms(updatedRooms);
      }
      
      toast({
        title: "Success",
        description: "Bed has been created successfully."
      });
    } else if (currentBed) {
      // Track if occupied status changed
      const wasOccupied = currentBed.status === "occupied";
      const willBeOccupied = tempBed.status === "occupied";
      
      const updatedBeds = beds.map(bed => 
        bed.id === currentBed.id 
          ? { ...bed, ...tempBed } as Bed
          : bed
      );
      
      setBeds(updatedBeds);
      
      // Update room occupancy if necessary
      if (wasOccupied !== willBeOccupied) {
        const room = rooms.find(room => room.id === tempBed.roomId);
        
        if (room) {
          const updatedRooms = rooms.map(r => {
            if (r.id === room.id) {
              return { 
                ...r, 
                occupied: willBeOccupied ? r.occupied + 1 : r.occupied - 1 
              };
            }
            return r;
          });
          
          setRooms(updatedRooms);
        }
      }
      
      toast({
        title: "Success",
        description: "Bed has been updated successfully."
      });
    }

    setIsBedDialogOpen(false);
  };

  const handleDeleteBed = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    
    if (!bed) return;
    
    if (bed.status === "occupied") {
      toast({
        title: "Cannot Delete Bed",
        description: "This bed is currently occupied. Please discharge the patient first.",
        variant: "destructive"
      });
      return;
    }
    
    // Remove the bed
    setBeds(beds.filter(b => b.id !== bedId));
    
    toast({
      title: "Success",
      description: "Bed has been deleted successfully."
    });
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch(status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "cleaning":
      case "reserved":
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
            <h1 className="text-2xl font-bold tracking-tight">Rooms & Beds</h1>
            <p className="text-gray-500">Manage hospital rooms and bed allocation</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreateRoom}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
            <Button 
              onClick={handleCreateBed}
              variant="outline"
            >
              <BedDouble className="h-4 w-4 mr-2" />
              Add Bed
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search rooms or beds..."
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
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
            
            {activeTab === "rooms" && (
              <>
                <Select
                  value={filterFloor}
                  onValueChange={setFilterFloor}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    {uniqueFloors.map((floor) => (
                      <SelectItem key={floor} value={String(floor)}>
                        Floor {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="capitalize">{type.replace(/-/g, ' ')}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <Tabs defaultValue="rooms" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4 md:w-64">
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="beds">Beds</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map(room => (
                    <Card key={room.id} className="overflow-hidden">
                      <div className={`px-4 py-2 text-xs font-medium uppercase ${getStatusClass(room.status)}`}>
                        {room.status}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">Room {room.number}</CardTitle>
                          <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                            {room.occupied}/{room.capacity} Beds
                          </div>
                        </div>
                        <CardDescription>
                          Floor {room.floor}, {room.wing} Wing
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          <span className="capitalize">{room.type.replace(/-/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="font-medium">Rate:</span> ${room.price}/day
                        </div>
                        <div>
                          <span className="font-medium">Facilities:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {room.facilities.map((facility, index) => (
                              <span 
                                key={index} 
                                className="bg-gray-100 text-xs px-2 py-1 rounded"
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditRoom(room)}
                        >
                          <FileEdit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No rooms found.</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or add a new room.</p>
                    <Button className="mt-4" onClick={handleCreateRoom}>
                      <Plus className="h-4 w-4 mr-2" /> Add Room
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="beds" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBeds.length > 0 ? (
                  filteredBeds.map(bed => (
                    <Card key={bed.id} className="overflow-hidden">
                      <div className={`px-4 py-2 text-xs font-medium uppercase ${getStatusClass(bed.status)}`}>
                        {bed.status}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Bed {bed.bedNumber}</CardTitle>
                          <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                            Room {bed.roomNumber}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {bed.status === "occupied" && (
                          <>
                            <div>
                              <span className="font-medium">Patient:</span> {bed.patientName}
                            </div>
                            <div>
                              <span className="font-medium">Admitted:</span> {bed.admittedOn}
                            </div>
                            <div>
                              <span className="font-medium">Expected Discharge:</span> {bed.expectedDischarge}
                            </div>
                          </>
                        )}
                        
                        {bed.status === "maintenance" && (
                          <div className="text-orange-600">
                            This bed is under maintenance.
                          </div>
                        )}
                        
                        {bed.status === "available" && (
                          <div className="text-green-600">
                            This bed is available for allocation.
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditBed(bed)}
                        >
                          <FileEdit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteBed(bed.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No beds found.</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or add a new bed.</p>
                    <Button className="mt-4" onClick={handleCreateBed}>
                      <Plus className="h-4 w-4 mr-2" /> Add Bed
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Room Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Room" : "Edit Room"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter room details below"
                : "Update room information"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="number" className="text-sm font-medium">
                  Room Number*
                </label>
                <Input
                  id="number"
                  name="number"
                  placeholder="101"
                  value={tempRoom.number || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Room Type*
                </label>
                <Select
                  value={tempRoom.type || ""}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="capitalize">{type.replace(/-/g, ' ')}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="floor" className="text-sm font-medium">
                  Floor
                </label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={tempRoom.floor || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="wing" className="text-sm font-medium">
                  Wing*
                </label>
                <Select
                  value={tempRoom.wing || ""}
                  onValueChange={(value) => handleSelectChange("wing", value)}
                >
                  <SelectTrigger id="wing">
                    <SelectValue placeholder="Select wing" />
                  </SelectTrigger>
                  <SelectContent>
                    {wings.map((wing) => (
                      <SelectItem key={wing} value={wing}>
                        {wing} Wing
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="capacity" className="text-sm font-medium">
                  Capacity
                </label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={tempRoom.capacity || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Rate per Day ($)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="250"
                  value={tempRoom.price || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={tempRoom.status || ""}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Facilities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {facilities.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(facility)}
                      onChange={() => toggleFacility(facility)}
                      className="rounded border-gray-300"
                    />
                    <span>{facility}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveRoom}>
              {dialogMode === "create" ? "Create Room" : "Update Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bed Dialog */}
      <Dialog open={isBedDialogOpen} onOpenChange={setIsBedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Bed" : "Edit Bed"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter bed details below"
                : "Update bed information"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="roomId" className="text-sm font-medium">
                Room*
              </label>
              <Select
                value={tempBed.roomId || ""}
                onValueChange={(value) => handleBedSelectChange("roomId", value)}
              >
                <SelectTrigger id="roomId">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.number} ({room.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bedNumber" className="text-sm font-medium">
                Bed Number*
              </label>
              <Input
                id="bedNumber"
                name="bedNumber"
                placeholder="101-A"
                value={tempBed.bedNumber || ""}
                onChange={handleBedInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={tempBed.status || ""}
                onValueChange={(value) => handleBedSelectChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(tempBed.status === "occupied" || (currentBed && currentBed.status === "occupied")) && (
              <>
                <div className="space-y-2">
                  <label htmlFor="patientId" className="text-sm font-medium">
                    Patient ID
                  </label>
                  <Input
                    id="patientId"
                    name="patientId"
                    placeholder="P001"
                    value={tempBed.patientId || ""}
                    onChange={handleBedInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="patientName" className="text-sm font-medium">
                    Patient Name
                  </label>
                  <Input
                    id="patientName"
                    name="patientName"
                    placeholder="John Smith"
                    value={tempBed.patientName || ""}
                    onChange={handleBedInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="admittedOn" className="text-sm font-medium">
                    Admitted On
                  </label>
                  <Input
                    id="admittedOn"
                    name="admittedOn"
                    type="date"
                    value={tempBed.admittedOn || ""}
                    onChange={handleBedInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="expectedDischarge" className="text-sm font-medium">
                    Expected Discharge
                  </label>
                  <Input
                    id="expectedDischarge"
                    name="expectedDischarge"
                    type="date"
                    value={tempBed.expectedDischarge || ""}
                    onChange={handleBedInputChange}
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveBed}>
              {dialogMode === "create" ? "Create Bed" : "Update Bed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Rooms;
