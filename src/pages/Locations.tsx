
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, FileEdit, Trash2, MapPin, Building, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  type: "Hospital" | "Clinic" | "Lab" | "Pharmacy";
  status: "active" | "inactive" | "under-construction";
  beds: number;
  operatingRooms: number;
}

const initialLocations: Location[] = [
  {
    id: "1",
    name: "HavenMed Central Hospital",
    address: "123 Medical Plaza",
    city: "Bangalore",
    state: "Karnataka",
    zipcode: "560001",
    country: "India",
    phone: "+91 80 2345 6789",
    type: "Hospital",
    status: "active",
    beds: 500,
    operatingRooms: 24,
  },
  {
    id: "2",
    name: "HavenMed North Clinic",
    address: "45 Health Avenue",
    city: "Bangalore",
    state: "Karnataka",
    zipcode: "560024",
    country: "India",
    phone: "+91 80 2345 6790",
    type: "Clinic",
    status: "active",
    beds: 50,
    operatingRooms: 6,
  },
  {
    id: "3",
    name: "HavenMed South Lab Center",
    address: "78 Diagnostic Lane",
    city: "Bangalore",
    state: "Karnataka",
    zipcode: "560068",
    country: "India",
    phone: "+91 80 2345 6791",
    type: "Lab",
    status: "active",
    beds: 0,
    operatingRooms: 0,
  },
  {
    id: "4",
    name: "HavenMed West Hospital",
    address: "234 Care Street",
    city: "Mumbai",
    state: "Maharashtra",
    zipcode: "400001",
    country: "India",
    phone: "+91 22 2345 6792",
    type: "Hospital",
    status: "active",
    beds: 350,
    operatingRooms: 18,
  },
  {
    id: "5",
    name: "HavenMed East Pharmacy",
    address: "56 Medicine Road",
    city: "Delhi",
    state: "Delhi",
    zipcode: "110001",
    country: "India",
    phone: "+91 11 2345 6793",
    type: "Pharmacy",
    status: "active",
    beds: 0,
    operatingRooms: 0,
  },
  {
    id: "6",
    name: "HavenMed Chennai Hospital",
    address: "89 Healthcare Boulevard",
    city: "Chennai",
    state: "Tamil Nadu",
    zipcode: "600001",
    country: "India",
    phone: "+91 44 2345 6794",
    type: "Hospital",
    status: "under-construction",
    beds: 400,
    operatingRooms: 20,
  },
  {
    id: "7",
    name: "HavenMed Kolkata Clinic",
    address: "12 Wellness Street",
    city: "Kolkata",
    state: "West Bengal",
    zipcode: "700001",
    country: "India",
    phone: "+91 33 2345 6795",
    type: "Clinic",
    status: "inactive",
    beds: 30,
    operatingRooms: 3,
  }
];

const Locations = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<Location, "id">>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
    type: "Hospital",
    status: "active",
    beds: 0,
    operatingRooms: 0,
  });

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "beds" || name === "operatingRooms" ? parseInt(value) || 0 : value,
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as "Hospital" | "Clinic" | "Lab" | "Pharmacy",
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as "active" | "inactive" | "under-construction",
    });
  };

  const handleAddLocation = () => {
    const newLocation: Location = {
      id: Date.now().toString(),
      ...formData,
    };

    setLocations([...locations, newLocation]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Location Added",
      description: `${newLocation.name} has been added successfully.`,
    });
  };

  const handleEditLocation = () => {
    if (!currentLocation) return;

    const updatedLocations = locations.map((loc) =>
      loc.id === currentLocation.id ? { ...currentLocation, ...formData } : loc
    );

    setLocations(updatedLocations);
    setIsEditDialogOpen(false);
    resetForm();
    toast({
      title: "Location Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteLocation = () => {
    if (!currentLocation) return;

    const filteredLocations = locations.filter(
      (loc) => loc.id !== currentLocation.id
    );

    setLocations(filteredLocations);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Location Deleted",
      description: `${currentLocation.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const openEditDialog = (location: Location) => {
    setCurrentLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      zipcode: location.zipcode,
      country: location.country,
      phone: location.phone,
      type: location.type,
      status: location.status,
      beds: location.beds,
      operatingRooms: location.operatingRooms,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (location: Location) => {
    setCurrentLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: "India",
      phone: "",
      type: "Hospital",
      status: "active",
      beds: 0,
      operatingRooms: 0,
    });
    setCurrentLocation(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "under-construction":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
        <p className="text-gray-500">Manage hospital locations and facilities</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className={`${viewMode === "table" ? "bg-gray-100" : ""}`}
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
          <Button 
            variant="outline"
            className={`${viewMode === "grid" ? "bg-gray-100" : ""}`} 
            onClick={() => setViewMode("grid")}
          >
            Card View
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={18} className="mr-2" /> Add Location
          </Button>
        </div>
      </div>

      {/* Locations List */}
      {viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Beds</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>
                        {location.city}, {location.state}
                      </TableCell>
                      <TableCell>{location.type}</TableCell>
                      <TableCell>{location.phone}</TableCell>
                      <TableCell className="text-center">{location.beds}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                            location.status
                          )}`}
                        >
                          {location.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(location)}
                          >
                            <FileEdit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(location)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No locations found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <Card key={location.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{location.name}</CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                        location.status
                      )}`}
                    >
                      {location.status}
                    </span>
                  </div>
                  <CardDescription>{location.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin size={16} className="text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-500">
                        {location.address}, {location.city}, {location.state}, {location.zipcode}, {location.country}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-gray-500" />
                      <p className="text-sm text-gray-500">{location.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building size={16} className="text-gray-500" />
                      <p className="text-sm text-gray-500">
                        {location.beds} beds, {location.operatingRooms} operating rooms
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex justify-end gap-2 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(location)}
                  >
                    <FileEdit size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(location)}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <MapPin size={32} />
              </div>
              <p className="text-center">No locations found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Location Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Enter the details of the new location to add it to the system.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Location Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. HavenMed Central Hospital"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Location Type
              </label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                  <SelectItem value="Lab">Lab</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="address"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="zipcode" className="text-sm font-medium">
                  Postal Code
                </label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="beds" className="text-sm font-medium">
                  Beds
                </label>
                <Input
                  id="beds"
                  name="beds"
                  type="number"
                  value={formData.beds}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="operatingRooms" className="text-sm font-medium">
                  Operating Rooms
                </label>
                <Input
                  id="operatingRooms"
                  name="operatingRooms"
                  type="number"
                  value={formData.operatingRooms}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="under-construction">Under Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddLocation} disabled={!formData.name || !formData.address}>
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update the details of this location.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Location Name
              </label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-type" className="text-sm font-medium">
                Location Type
              </label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                  <SelectItem value="Lab">Lab</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="edit-city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  id="edit-state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-zipcode" className="text-sm font-medium">
                  Postal Code
                </label>
                <Input
                  id="edit-zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  id="edit-country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-beds" className="text-sm font-medium">
                  Beds
                </label>
                <Input
                  id="edit-beds"
                  name="beds"
                  type="number"
                  value={formData.beds}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-operatingRooms" className="text-sm font-medium">
                  Operating Rooms
                </label>
                <Input
                  id="edit-operatingRooms"
                  name="operatingRooms"
                  type="number"
                  value={formData.operatingRooms}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="under-construction">Under Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditLocation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Location Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {currentLocation && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium">{currentLocation.name}</h3>
                <p className="text-sm text-gray-500">{currentLocation.type}</p>
                <p className="text-sm text-gray-500">
                  {currentLocation.city}, {currentLocation.state}, {currentLocation.country}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLocation}
            >
              Delete Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Locations;
