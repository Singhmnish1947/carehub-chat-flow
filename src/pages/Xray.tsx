
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  XSquare, 
  Upload, 
  Search, 
  Download, 
  Microscope, 
  Loader2, 
  FileText, 
  Calendar, 
  User, 
  Zap 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface XrayRecord {
  id: string;
  patientId: string;
  patientName: string;
  reportingDoctor: string;
  date: string;
  bodyPart: string;
  findings: string;
  status: "pending" | "processing" | "completed";
  imageUrl: string;
  aiAnalysisComplete: boolean;
  aiAnalysisResult?: string;
}

// Sample data
const sampleXrays: XrayRecord[] = [
  {
    id: "XR001",
    patientId: "P001",
    patientName: "Rajesh Sharma",
    reportingDoctor: "Dr. Preeti Gupta",
    date: "2023-04-05T10:30:00.000Z",
    bodyPart: "Chest",
    findings: "No abnormalities detected. Clear lung fields. Normal cardiac silhouette.",
    status: "completed",
    imageUrl: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&q=80&w=500",
    aiAnalysisComplete: true,
    aiAnalysisResult: "AI Analysis: Normal chest X-ray. No signs of pneumonia, pleural effusion, or pulmonary edema. No evidence of cardiomegaly. Normal mediastinal contour."
  },
  {
    id: "XR002",
    patientId: "P002",
    patientName: "Priya Patel",
    reportingDoctor: "Dr. Anil Kumar",
    date: "2023-04-06T14:15:00.000Z",
    bodyPart: "Left Wrist",
    findings: "Distal radius fracture visible. No displacement. Soft tissue swelling present.",
    status: "completed",
    imageUrl: "https://images.unsplash.com/photo-1582560486643-d51a225bc749?auto=format&fit=crop&q=80&w=500",
    aiAnalysisComplete: true,
    aiAnalysisResult: "AI Analysis: Distal radius fracture detected with 94% confidence. No displacement observed. Mild soft tissue swelling noted around fracture site. Recommend orthopedic consultation."
  },
  {
    id: "XR003",
    patientId: "P003",
    patientName: "Amit Kumar",
    reportingDoctor: "Dr. Sarah Johnson",
    date: "2023-04-07T09:45:00.000Z",
    bodyPart: "Lumbar Spine",
    findings: "Pending radiologist review",
    status: "pending",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=500",
    aiAnalysisComplete: false
  },
  {
    id: "XR004",
    patientId: "P004",
    patientName: "Sneha Reddy",
    reportingDoctor: "Dr. Vikram Singh",
    date: "2023-04-07T11:30:00.000Z",
    bodyPart: "Right Knee",
    findings: "Mild osteoarthritic changes. Small joint effusion present. No fracture visible.",
    status: "completed",
    imageUrl: "https://images.unsplash.com/photo-1562243063-2de4c979f3bd?auto=format&fit=crop&q=80&w=500",
    aiAnalysisComplete: true,
    aiAnalysisResult: "AI Analysis: Moderate osteoarthritis (KL Grade 2-3) detected with 89% confidence. Joint space narrowing observed in medial compartment. Small joint effusion detected. No acute fractures. Recommend weight management and physical therapy."
  },
  {
    id: "XR005",
    patientId: "P005",
    patientName: "Vikram Singh",
    reportingDoctor: "Dr. Meera Desai",
    date: "2023-04-08T13:20:00.000Z",
    bodyPart: "Chest",
    findings: "Currently being processed",
    status: "processing",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=500",
    aiAnalysisComplete: false
  }
];

const Xray = () => {
  const { toast } = useToast();
  const [xrays, setXrays] = useState<XrayRecord[]>(sampleXrays);
  const [selectedXray, setSelectedXray] = useState<XrayRecord | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [aiAnalysisDialogOpen, setAiAnalysisDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDetails, setUploadDetails] = useState({
    patientName: "",
    patientId: "",
    bodyPart: "chest",
    notes: ""
  });

  const filteredXrays = xrays.filter(xray => 
    xray.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    xray.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    xray.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
    xray.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingXrays = filteredXrays.filter(xray => xray.status === "pending");
  const processingXrays = filteredXrays.filter(xray => xray.status === "processing");
  const completedXrays = filteredXrays.filter(xray => xray.status === "completed");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "p");
  };

  const handleViewXray = (xray: XrayRecord) => {
    setSelectedXray(xray);
    setViewDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          handleUploadComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleUploadComplete = () => {
    // Create a new X-ray record
    const newXray: XrayRecord = {
      id: `XR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      patientId: uploadDetails.patientId || `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      patientName: uploadDetails.patientName,
      reportingDoctor: "Pending Assignment",
      date: new Date().toISOString(),
      bodyPart: uploadDetails.bodyPart,
      findings: uploadDetails.notes || "Pending radiologist review",
      status: "pending",
      imageUrl: selectedFile ? URL.createObjectURL(selectedFile) : "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=500",
      aiAnalysisComplete: false
    };
    
    setXrays([newXray, ...xrays]);
    
    setTimeout(() => {
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadDetails({
        patientName: "",
        patientId: "",
        bodyPart: "chest",
        notes: ""
      });
      
      toast({
        title: "Upload Complete",
        description: "X-ray has been uploaded successfully and is pending review."
      });
    }, 500);
  };

  const runAIAnalysis = () => {
    if (!selectedXray) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Update the x-ray with AI analysis results
      const aiResults = generateAIResults(selectedXray.bodyPart);
      
      const updatedXrays = xrays.map(xray => 
        xray.id === selectedXray.id 
          ? { 
              ...xray, 
              aiAnalysisComplete: true, 
              aiAnalysisResult: aiResults 
            } 
          : xray
      );
      
      setXrays(updatedXrays);
      setSelectedXray({
        ...selectedXray,
        aiAnalysisComplete: true,
        aiAnalysisResult: aiResults
      });
      
      toast({
        title: "AI Analysis Complete",
        description: "The X-ray has been analyzed successfully."
      });
    }, 3000);
  };

  const generateAIResults = (bodyPart: string) => {
    const results = {
      "Chest": "AI Analysis: Normal chest X-ray. Lungs are clear with no focal consolidation. No pleural effusion or pneumothorax. Heart size within normal limits. No mediastinal widening. Bones intact with no destructive lesions.",
      "Wrist": "AI Analysis: No acute fracture or dislocation. Mild degenerative changes at the first carpometacarpal joint. Bone mineralization appears normal. Soft tissues are unremarkable.",
      "Knee": "AI Analysis: No acute fracture or dislocation. Mild joint space narrowing in the medial compartment consistent with early osteoarthritis. Small suprapatellar effusion noted. Soft tissues are unremarkable.",
      "Spine": "AI Analysis: Vertebral body heights are preserved. No compression fractures. Mild degenerative changes with osteophyte formation at L4-L5 and L5-S1 levels. Disc spaces are maintained. No obvious spondylolisthesis.",
      "Ankle": "AI Analysis: No acute fracture or dislocation. Ankle mortise is intact. No significant soft tissue swelling. No calcaneal spurs identified."
    };
    
    // Find a close match for the body part
    const key = Object.keys(results).find(k => bodyPart.toLowerCase().includes(k.toLowerCase()));
    
    return key ? results[key as keyof typeof results] : "AI Analysis: No significant abnormalities detected. Recommend radiologist review for confirmation.";
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">X-Ray Department</h1>
        <p className="text-gray-500">Manage X-ray studies with AI-assisted analysis</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total X-rays</p>
              <h3 className="text-3xl font-bold mt-1">{xrays.length}</h3>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <XSquare className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-3xl font-bold mt-1">{xrays.filter(x => x.status === "pending").length}</h3>
            </div>
            <div className="p-4 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <h3 className="text-3xl font-bold mt-1">{xrays.filter(x => x.status === "processing").length}</h3>
            </div>
            <div className="p-4 bg-indigo-100 rounded-full">
              <Loader2 className="h-6 w-6 text-indigo-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <h3 className="text-3xl font-bold mt-1">{xrays.filter(x => x.status === "completed").length}</h3>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <FileText className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search x-rays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="w-full sm:w-auto bg-black text-white hover:bg-black/80"
        >
          <Upload size={18} className="mr-2" /> Upload New X-ray
        </Button>
      </div>

      {/* X-ray Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="glass-card border border-white/20 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white">
            All X-rays ({filteredXrays.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Pending ({pendingXrays.length})
          </TabsTrigger>
          <TabsTrigger value="processing" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Processing ({processingXrays.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Completed ({completedXrays.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <XrayList xrays={filteredXrays} onView={handleViewXray} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <XrayList xrays={pendingXrays} onView={handleViewXray} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>
        
        <TabsContent value="processing" className="mt-6">
          <XrayList xrays={processingXrays} onView={handleViewXray} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <XrayList xrays={completedXrays} onView={handleViewXray} getStatusColor={getStatusColor} formatDate={formatDate} />
        </TabsContent>
      </Tabs>

      {/* View X-ray Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-5xl glass-dialog">
          <DialogHeader>
            <DialogTitle>X-ray Details - {selectedXray?.id}</DialogTitle>
            <DialogDescription>
              Viewing x-ray for {selectedXray?.patientName} ({selectedXray?.patientId})
            </DialogDescription>
          </DialogHeader>

          {selectedXray && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="rounded-md overflow-hidden border">
                  <img 
                    src={selectedXray.imageUrl} 
                    alt={`X-ray of ${selectedXray.bodyPart}`} 
                    className="w-full h-auto object-cover" 
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Date: {formatDate(selectedXray.date)} at {formatTime(selectedXray.date)}
                  </span>
                  
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedXray.status)}`}>
                    {selectedXray.status.charAt(0).toUpperCase() + selectedXray.status.slice(1)}
                  </span>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
                  
                  {selectedXray.aiAnalysisComplete ? (
                    <div className="p-4 border rounded-md bg-green-50 text-green-900">
                      {selectedXray.aiAnalysisResult}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 border rounded-md space-y-3">
                      <Microscope className="h-10 w-10 text-gray-400" />
                      <p className="text-gray-500">AI analysis has not been performed yet</p>
                      <Button 
                        onClick={() => runAIAnalysis()}
                        disabled={isAnalyzing}
                        className="bg-black text-white hover:bg-black/80"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Run AI Analysis
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Patient Information</h3>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{selectedXray.patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedXray.patientName}</p>
                        <p className="text-sm text-gray-500">ID: {selectedXray.patientId}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">X-ray Information</h3>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Body Part</p>
                        <p className="font-medium">{selectedXray.bodyPart}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reporting Doctor</p>
                        <p className="font-medium">{selectedXray.reportingDoctor}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Findings</p>
                      <p className="mt-1 p-2 border rounded-md">{selectedXray.findings}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" /> Generate Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" /> Download Image
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" /> Assign to Doctor
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload X-ray Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md glass-dialog">
          <DialogHeader>
            <DialogTitle>Upload New X-ray</DialogTitle>
            <DialogDescription>
              Upload a new X-ray image and enter patient details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {selectedFile ? (
                <div className="space-y-2 w-full">
                  <div className="relative rounded-md overflow-hidden">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Selected X-ray" 
                      className="w-full h-auto max-h-40 object-cover" 
                    />
                  </div>
                  <p className="text-sm text-center">{selectedFile.name}</p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedFile(null)}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <label className="w-full cursor-pointer">
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Click to select X-ray image</p>
                    <p className="text-xs text-gray-500 mt-1">DICOM, JPG, or PNG</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.dcm" 
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Patient Name</label>
                <Input 
                  placeholder="Enter patient name" 
                  value={uploadDetails.patientName}
                  onChange={(e) => setUploadDetails({...uploadDetails, patientName: e.target.value})}
                  className="glass-input"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Patient ID</label>
                <Input 
                  placeholder="Enter patient ID" 
                  value={uploadDetails.patientId}
                  onChange={(e) => setUploadDetails({...uploadDetails, patientId: e.target.value})}
                  className="glass-input"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Body Part</label>
                <Select 
                  value={uploadDetails.bodyPart}
                  onValueChange={(value) => setUploadDetails({...uploadDetails, bodyPart: value})}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select body part" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chest">Chest</SelectItem>
                    <SelectItem value="knee">Knee</SelectItem>
                    <SelectItem value="wrist">Wrist</SelectItem>
                    <SelectItem value="ankle">Ankle</SelectItem>
                    <SelectItem value="spine">Spine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  placeholder="Enter any notes for the radiologist" 
                  rows={3}
                  value={uploadDetails.notes}
                  onChange={(e) => setUploadDetails({...uploadDetails, notes: e.target.value})}
                  className="glass-input"
                />
              </div>
            </div>
            
            {uploadProgress > 0 && (
              <div className="w-full">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={simulateUpload} 
              disabled={!selectedFile || !uploadDetails.patientName || uploadProgress > 0}
              className="bg-black text-white hover:bg-black/80"
            >
              Upload X-ray
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

// X-ray list component
interface XrayListProps {
  xrays: XrayRecord[];
  onView: (xray: XrayRecord) => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}

const XrayList: React.FC<XrayListProps> = ({ xrays, onView, getStatusColor, formatDate }) => {
  if (xrays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-md glass-card animate-glass-fade">
        <XSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No X-rays Found</h3>
        <p className="text-gray-500 mt-2">There are no X-rays matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {xrays.map((xray) => (
          <Card key={xray.id} className="glass-card animate-glass-fade overflow-hidden">
            <div className="relative h-48">
              <img 
                src={xray.imageUrl} 
                alt={`X-ray of ${xray.bodyPart}`} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2 right-2">
                <Badge className={getStatusColor(xray.status)}>
                  {xray.status.charAt(0).toUpperCase() + xray.status.slice(1)}
                </Badge>
              </div>
              {xray.aiAnalysisComplete && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-indigo-100 text-indigo-800">
                    <Microscope className="h-3 w-3 mr-1" /> AI Analyzed
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{xray.patientName}</CardTitle>
              <CardDescription>
                {xray.id} | {xray.bodyPart}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">{formatDate(xray.date)}</p>
              {xray.reportingDoctor && (
                <p className="text-sm text-gray-500">Doctor: {xray.reportingDoctor}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onView(xray)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Xray;
