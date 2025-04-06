import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileEdit, Trash2, X, CheckCircle, AlertCircle } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  head: string;
  specialty: string;
  rooms: number;
  staff: number;
  status: "active" | "inactive";
  description: string;
}

const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Cardiology",
    head: "Dr. Rajesh Kumar",
    specialty: "Heart & Vascular Care",
    rooms: 15,
    staff: 42,
    status: "active",
    description: "Specializing in diagnosis and treatment of heart diseases and conditions."
  },
  {
    id: "2",
    name: "Neurology",
    head: "Dr. Priya Sharma",
    specialty: "Brain & Nervous System",
    rooms: 12,
    staff: 38,
    status: "active",
    description: "Diagnoses and treats disorders of the nervous system including brain and spinal cord."
  },
  {
    id: "3",
    name: "Orthopedics",
    head: "Dr. Amit Patel",
    specialty: "Bone & Joint Care",
    rooms: 18,
    staff: 45,
    status: "active",
    description: "Focuses on diagnosis and treatment of disorders of the bones, joints, ligaments, tendons and muscles."
  },
  {
    id: "4",
    name: "Pediatrics",
    head: "Dr. Sneha Reddy",
    specialty: "Child Healthcare",
    rooms: 20,
    staff: 55,
    status: "active",
    description: "Provides medical care to infants, children, adolescents, and young adults."
  },
  {
    id: "5",
    name: "Oncology",
    head: "Dr. Vikram Singh",
    specialty: "Cancer Care",
    rooms: 16,
    staff: 36,
    status: "active",
    description: "Specializes in the diagnosis and treatment of cancer."
  },
  {
    id: "6",
    name: "Radiology",
    head: "Dr. Ananya Desai",
    specialty: "Diagnostic Imaging",
    rooms: 8,
    staff: 25,
    status: "active",
    description: "Diagnoses and treats diseases using medical imaging procedures."
  },
  {
    id: "7",
    name: "Dermatology",
    head: "Dr. Karan Malhotra",
    specialty: "Skin Care",
    rooms: 6,
    staff: 18,
    status: "inactive",
    description: "Specializes in conditions and diseases of the skin, hair, and nails."
  }
];

const Departments = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  
  const [formData, setFormData] = useState<Omit<Department, "id">>({
    name: "",
    head: "",
    specialty: "",
    rooms: 0,
    staff: 0,
    status: "active",
    description: ""
  });

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rooms" || name === "staff" ? parseInt(value) || 0 : value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as "active" | "inactive",
    });
  };

  const handleAddDepartment = () => {
    const newDepartment: Department = {
      id: Date.now().toString(),
      ...formData,
    };

    setDepartments([...departments, newDepartment]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Department Added",
      description: `${newDepartment.name} department has been added successfully.`,
    });
  };

  const handleEditDepartment = () => {
    if (!currentDepartment) return;

    const updatedDepartments = departments.map((dept) =>
      dept.id === currentDepartment.id ? { ...currentDepartment, ...formData } : dept
    );

    setDepartments(updatedDepartments);
    setIsEditDialogOpen(false);
    resetForm();
    toast({
      title: "Department Updated",
      description: `${formData.name} department has been updated successfully.`,
    });
  };

  const handleDeleteDepartment = () => {
    if (!currentDepartment) return;

    const filteredDepartments = departments.filter(
      (dept) => dept.id !== currentDepartment.id
    );

    setDepartments(filteredDepartments);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Department Deleted",
      description: `${currentDepartment.name} department has been deleted.`,
      variant: "destructive",
    });
  };

  const openEditDialog = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      head: department.head,
      specialty: department.specialty,
      rooms: department.rooms,
      staff: department.staff,
      status: department.status,
      description: department.description
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (department: Department) => {
    setCurrentDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      head: "",
      specialty: "",
      rooms: 0,
      staff: 0,
      status: "active",
      description: ""
    });
    setCurrentDepartment(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-gray-500">Manage hospital departments and specialties</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search departments..."
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
            <Plus size={18} className="mr-2" /> Add Department
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Head of Department</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead className="text-center">Rooms</TableHead>
                  <TableHead className="text-center">Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.head}</TableCell>
                      <TableCell>{department.specialty}</TableCell>
                      <TableCell className="text-center">{department.rooms}</TableCell>
                      <TableCell className="text-center">{department.staff}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            department.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {department.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(department)}
                          >
                            <FileEdit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(department)}
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
                      No departments found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department) => (
              <Card key={department.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{department.name}</CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        department.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {department.status}
                    </span>
                  </div>
                  <CardDescription>{department.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Head of Department</p>
                      <p className="text-sm text-gray-500">{department.head}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Rooms</p>
                        <p className="text-sm text-gray-500">{department.rooms}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Staff</p>
                        <p className="text-sm text-gray-500">{department.staff}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{department.description}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex justify-end gap-2 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(department)}
                  >
                    <FileEdit size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(department)}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <AlertCircle size={32} />
              </div>
              <p className="text-center">No departments found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Enter the details of the new department to add it to the system.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Department Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Cardiology"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="head" className="text-sm font-medium">
                Head of Department
              </label>
              <Input
                id="head"
                name="head"
                placeholder="e.g. Dr. Rajesh Kumar"
                value={formData.head}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="specialty" className="text-sm font-medium">
                Specialty
              </label>
              <Input
                id="specialty"
                name="specialty"
                placeholder="e.g. Heart & Vascular Care"
                value={formData.specialty}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="rooms" className="text-sm font-medium">
                  Rooms
                </label>
                <Input
                  id="rooms"
                  name="rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="staff" className="text-sm font-medium">
                  Staff
                </label>
                <Input
                  id="staff"
                  name="staff"
                  type="number"
                  value={formData.staff}
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
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter department description..."
                value={formData.description}
                onChange={handleInputChange}
              />
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
            <Button onClick={handleAddDepartment} disabled={!formData.name || !formData.head}>
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the details of this department.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Department Name
              </label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-head" className="text-sm font-medium">
                Head of Department
              </label>
              <Input
                id="edit-head"
                name="head"
                value={formData.head}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-specialty" className="text-sm font-medium">
                Specialty
              </label>
              <Input
                id="edit-specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-rooms" className="text-sm font-medium">
                  Rooms
                </label>
                <Input
                  id="edit-rooms"
                  name="rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-staff" className="text-sm font-medium">
                  Staff
                </label>
                <Input
                  id="edit-staff"
                  name="staff"
                  type="number"
                  value={formData.staff}
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
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
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
            <Button onClick={handleEditDepartment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {currentDepartment && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium">{currentDepartment.name}</h3>
                <p className="text-sm text-gray-500">{currentDepartment.specialty}</p>
                <p className="text-sm text-gray-500">
                  Head: {currentDepartment.head}
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
              onClick={handleDeleteDepartment}
            >
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Departments;
