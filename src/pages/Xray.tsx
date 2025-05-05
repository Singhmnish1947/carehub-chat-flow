
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Download, FileText, Filter, MoveUpRight, Plus, Printer, Search, FileX, Eye } from 'lucide-react';
import { XSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample data
const xrayReports = [
  {
    id: "XR001",
    patientName: "Amit Kumar",
    patientId: "P78901",
    referredBy: "Dr. Rahul Sharma",
    dateRequested: "2025-05-01",
    dateCompleted: "2025-05-01",
    status: "completed",
    type: "Chest X-ray",
    findings: "Normal chest X-ray. No active disease."
  },
  {
    id: "XR002",
    patientName: "Priya Singh",
    patientId: "P78902",
    referredBy: "Dr. Ananya Patel",
    dateRequested: "2025-05-02",
    dateCompleted: "2025-05-02",
    status: "completed",
    type: "Lumbar Spine",
    findings: "Mild degenerative changes in L4-L5 vertebrae."
  },
  {
    id: "XR003",
    patientName: "Rajesh Verma",
    patientId: "P78903",
    referredBy: "Dr. Vikram Mehta",
    dateRequested: "2025-05-03",
    dateCompleted: null,
    status: "pending",
    type: "Skull X-ray",
    findings: ""
  },
  {
    id: "XR004",
    patientName: "Neha Gupta",
    patientId: "P78904",
    referredBy: "Dr. Sanjay Kumar",
    dateRequested: "2025-05-04",
    dateCompleted: null,
    status: "in-progress",
    type: "Hand X-ray",
    findings: ""
  },
  {
    id: "XR005",
    patientName: "Vikash Jha",
    patientId: "P78905",
    referredBy: "Dr. Meena Kumari",
    dateRequested: "2025-05-04",
    dateCompleted: "2025-05-05",
    status: "completed",
    type: "Ankle X-ray",
    findings: "Hairline fracture observed in the lateral malleolus."
  },
  {
    id: "XR006",
    patientName: "Sunita Devi",
    patientId: "P78906",
    referredBy: "Dr. Rahul Sharma",
    dateRequested: "2025-05-04",
    dateCompleted: null,
    status: "pending",
    type: "Pelvis X-ray",
    findings: ""
  }
];

const XrayPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedXray, setSelectedXray] = useState(null);

  const filteredXrays = xrayReports.filter(xray => {
    const matchesSearch = xray.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          xray.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          xray.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || xray.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">X-Ray Department</h1>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-black/80">
                <Plus className="mr-2 h-4 w-4" /> New X-Ray Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New X-Ray Request</DialogTitle>
                <DialogDescription>
                  Fill out the form below to create a new X-Ray request for a patient.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Input id="patient" placeholder="Search patient..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referringDoctor">Referring Doctor</Label>
                    <Input id="referringDoctor" placeholder="Search doctor..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xrayType">X-Ray Type</Label>
                  <Input id="xrayType" placeholder="e.g., Chest X-ray, Skull X-ray" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input id="scheduledDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes</Label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="notes" 
                    placeholder="Add any relevant clinical information..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-black hover:bg-black/80">Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>X-Ray Management</CardTitle>
          <CardDescription>
            View, filter and manage all X-Ray requests and reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilterStatus('all')}>All</TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setFilterStatus('pending')}>Pending</TabsTrigger>
                <TabsTrigger value="in-progress" onClick={() => setFilterStatus('in-progress')}>In Progress</TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setFilterStatus('completed')}>Completed</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search X-rays..." 
                    className="pl-9 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Date (Newest First)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest First)</DropdownMenuItem>
                    <DropdownMenuItem>Patient Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem>X-Ray Type</DropdownMenuItem>
                    <DropdownMenuItem>Referring Doctor</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="icon">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Referred By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredXrays.map((xray) => (
                      <TableRow key={xray.id}>
                        <TableCell className="font-medium">{xray.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" alt={xray.patientName} />
                              <AvatarFallback>{xray.patientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{xray.patientName}</div>
                              <div className="text-xs text-gray-500">{xray.patientId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{xray.type}</TableCell>
                        <TableCell>{xray.referredBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3.5 w-3.5 text-gray-500" />
                            <span>{xray.dateRequested}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              xray.status === 'completed' ? 'default' : 
                              xray.status === 'pending' ? 'outline' : 
                              'secondary'
                            }
                            className={
                              xray.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' : 
                              xray.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100' : 
                              'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100'
                            }
                          >
                            {xray.status === 'completed' ? 'Completed' : 
                             xray.status === 'pending' ? 'Pending' : 
                             'In Progress'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[725px]">
                                <DialogHeader>
                                  <DialogTitle>X-Ray Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information about X-Ray {xray.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="text-lg font-medium mb-2">Patient Information</h3>
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                          <AvatarImage src="" alt={xray.patientName} />
                                          <AvatarFallback>{xray.patientName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{xray.patientName}</p>
                                          <p className="text-sm text-gray-500">{xray.patientId}</p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <p className="text-gray-500">Age</p>
                                          <p>42 years</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Gender</p>
                                          <p>Male</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Phone</p>
                                          <p>+91 98765 43210</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Blood Group</p>
                                          <p>B+</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-medium mb-2">X-Ray Information</h3>
                                    <div className="space-y-3 text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <p className="text-gray-500">X-Ray ID</p>
                                          <p>{xray.id}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Type</p>
                                          <p>{xray.type}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Referred By</p>
                                          <p>{xray.referredBy}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Date Requested</p>
                                          <p>{xray.dateRequested}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Date Completed</p>
                                          <p>{xray.dateCompleted || 'Pending'}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Status</p>
                                          <Badge 
                                            variant={
                                              xray.status === 'completed' ? 'default' : 
                                              xray.status === 'pending' ? 'outline' : 
                                              'secondary'
                                            }
                                            className={
                                              xray.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' : 
                                              xray.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100' : 
                                              'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100'
                                            }
                                          >
                                            {xray.status === 'completed' ? 'Completed' : 
                                            xray.status === 'pending' ? 'Pending' : 
                                            'In Progress'}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {xray.status === 'completed' && (
                                  <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-2">X-Ray Results</h3>
                                    <div className="grid grid-cols-12 gap-4">
                                      <div className="col-span-7 bg-gray-100 rounded-lg p-4 flex justify-center items-center h-[300px]">
                                        <div className="text-center">
                                          <FileX className="mx-auto h-16 w-16 text-gray-400" />
                                          <p className="mt-2 text-gray-500">X-Ray image preview</p>
                                        </div>
                                      </div>
                                      <div className="col-span-5">
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="findings" className="text-gray-500">Findings</Label>
                                            <div className="p-3 border rounded-md mt-1">
                                              {xray.findings || 'No findings recorded'}
                                            </div>
                                          </div>
                                          <div>
                                            <Label htmlFor="technician" className="text-gray-500">Technician</Label>
                                            <div className="p-3 border rounded-md mt-1">
                                              Rahul Joshi
                                            </div>
                                          </div>
                                          <div>
                                            <Label htmlFor="radiologist" className="text-gray-500">Radiologist</Label>
                                            <div className="p-3 border rounded-md mt-1">
                                              Dr. Meena Sharma
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {xray.status !== 'completed' && (
                                  <div className="mt-6 bg-gray-50 rounded-lg p-6 text-center">
                                    <XSquare className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-gray-700 font-medium">X-Ray Not Yet Completed</p>
                                    <p className="mt-1 text-gray-500 text-sm">Results will be available once the X-Ray is processed.</p>
                                    {xray.status === 'pending' ? (
                                      <Button variant="outline" className="mt-4">
                                        Mark as In Progress
                                      </Button>
                                    ) : (
                                      <Button variant="default" className="mt-4 bg-black hover:bg-black/80">
                                        Upload X-Ray Results
                                      </Button>
                                    )}
                                  </div>
                                )}

                                <DialogFooter className="mt-6">
                                  <Button variant="outline">Print Report</Button>
                                  <Button variant="outline">Download PDF</Button>
                                  <Button className="bg-black hover:bg-black/80">Close</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoveUpRight className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Edit Request
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Report
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <XSquare className="mr-2 h-4 w-4" />
                                  Cancel Request
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>X-Ray Statistics</CardTitle>
            <CardDescription>X-ray requests and completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total X-rays</p>
                  <p className="text-2xl font-bold">{xrayReports.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium">{xrayReports.filter(x => x.status === 'completed').length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(xrayReports.filter(x => x.status === 'completed').length / xrayReports.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">In Progress</span>
                  <span className="font-medium">{xrayReports.filter(x => x.status === 'in-progress').length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(xrayReports.filter(x => x.status === 'in-progress').length / xrayReports.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pending</span>
                  <span className="font-medium">{xrayReports.filter(x => x.status === 'pending').length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(xrayReports.filter(x => x.status === 'pending').length / xrayReports.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest X-ray activity in the department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: <Plus className="h-4 w-4" />, color: "bg-blue-100 text-blue-700", action: "New X-Ray Request", description: "X-Ray request created for Nisha Devi", time: "10 minutes ago" },
                { icon: <FileText className="h-4 w-4" />, color: "bg-green-100 text-green-700", action: "Report Uploaded", description: "X-Ray report uploaded for Amit Kumar", time: "1 hour ago" },
                { icon: <Clock className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-700", action: "Status Updated", description: "X-Ray for Rajesh Verma marked as In Progress", time: "2 hours ago" },
                { icon: <Eye className="h-4 w-4" />, color: "bg-purple-100 text-purple-700", action: "Report Viewed", description: "Dr. Rahul Sharma viewed Priya Singh's X-Ray", time: "3 hours ago" },
                { icon: <Download className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-700", action: "Report Downloaded", description: "Dr. Ananya Patel downloaded X-Ray report", time: "5 hours ago" }
              ].map((activity, i) => (
                <div key={i} className="flex">
                  <div className={`h-8 w-8 rounded-full ${activity.color} flex items-center justify-center mr-3`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default XrayPage;
