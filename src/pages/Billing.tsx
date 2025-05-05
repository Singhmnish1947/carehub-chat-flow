
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileEdit, Trash2, CreditCard, DollarSign, Download, Eye } from "lucide-react";
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
  DialogTrigger,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  paymentMethod: "credit_card" | "debit_card" | "cash" | "bank_transfer" | "insurance";
  status: "paid" | "pending" | "overdue" | "cancelled" | "refunded";
  departmentName: string;
  serviceName: string;
}

interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  items: BillItem[];
}

interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const initialPayments: Payment[] = [
  {
    id: "1",
    patientId: "P001",
    patientName: "Rajesh Sharma",
    invoiceNumber: "INV-2023-001",
    amount: 1500.00,
    date: "2023-04-01T10:30:00.000Z",
    paymentMethod: "credit_card",
    status: "paid",
    departmentName: "Cardiology",
    serviceName: "ECG Test"
  },
  {
    id: "2",
    patientId: "P002",
    patientName: "Priya Patel",
    invoiceNumber: "INV-2023-002",
    amount: 2200.00,
    date: "2023-04-02T11:20:00.000Z",
    paymentMethod: "insurance",
    status: "paid",
    departmentName: "Neurology",
    serviceName: "MRI Scan"
  },
  {
    id: "3",
    patientId: "P003",
    patientName: "Amit Kumar",
    invoiceNumber: "INV-2023-003",
    amount: 850.00,
    date: "2023-04-03T14:15:00.000Z",
    paymentMethod: "cash",
    status: "paid",
    departmentName: "Orthopedics",
    serviceName: "Consultation"
  },
  {
    id: "4",
    patientId: "P004",
    patientName: "Sneha Reddy",
    invoiceNumber: "INV-2023-004",
    amount: 3500.00,
    date: "2023-04-04T09:45:00.000Z",
    paymentMethod: "bank_transfer",
    status: "paid",
    departmentName: "Radiology",
    serviceName: "CT Scan"
  },
  {
    id: "5",
    patientId: "P005",
    patientName: "Vikram Singh",
    invoiceNumber: "INV-2023-005",
    amount: 750.00,
    date: "2023-04-05T16:30:00.000Z",
    paymentMethod: "debit_card",
    status: "pending",
    departmentName: "Dermatology",
    serviceName: "Skin Treatment"
  },
  {
    id: "6",
    patientId: "P006",
    patientName: "Ananya Desai",
    invoiceNumber: "INV-2023-006",
    amount: 1200.00,
    date: "2023-04-06T13:10:00.000Z",
    paymentMethod: "insurance",
    status: "refunded",
    departmentName: "Cardiology",
    serviceName: "Stress Test"
  },
  {
    id: "7",
    patientId: "P007",
    patientName: "Karan Malhotra",
    invoiceNumber: "INV-2023-007",
    amount: 5000.00,
    date: "2023-04-07T10:50:00.000Z",
    paymentMethod: "credit_card",
    status: "paid",
    departmentName: "Surgery",
    serviceName: "Minor Surgery"
  }
];

const initialBills: Bill[] = [
  {
    id: "1",
    patientId: "P001",
    patientName: "Rajesh Sharma",
    invoiceNumber: "INV-2023-001",
    amount: 1500.00,
    issueDate: "2023-03-25T10:30:00.000Z",
    dueDate: "2023-04-10T10:30:00.000Z",
    status: "paid",
    items: [
      {
        id: "1-1",
        description: "ECG Test",
        quantity: 1,
        unitPrice: 1200.00,
        total: 1200.00
      },
      {
        id: "1-2",
        description: "Consultation Fee",
        quantity: 1,
        unitPrice: 300.00,
        total: 300.00
      }
    ]
  },
  {
    id: "2",
    patientId: "P002",
    patientName: "Priya Patel",
    invoiceNumber: "INV-2023-002",
    amount: 2200.00,
    issueDate: "2023-03-28T11:20:00.000Z",
    dueDate: "2023-04-12T11:20:00.000Z",
    status: "paid",
    items: [
      {
        id: "2-1",
        description: "MRI Scan",
        quantity: 1,
        unitPrice: 2000.00,
        total: 2000.00
      },
      {
        id: "2-2",
        description: "Report Fee",
        quantity: 1,
        unitPrice: 200.00,
        total: 200.00
      }
    ]
  },
  {
    id: "3",
    patientId: "P003",
    patientName: "Amit Kumar",
    invoiceNumber: "INV-2023-003",
    amount: 850.00,
    issueDate: "2023-03-30T14:15:00.000Z",
    dueDate: "2023-04-15T14:15:00.000Z",
    status: "paid",
    items: [
      {
        id: "3-1",
        description: "Orthopedic Consultation",
        quantity: 1,
        unitPrice: 600.00,
        total: 600.00
      },
      {
        id: "3-2",
        description: "X-Ray",
        quantity: 1,
        unitPrice: 250.00,
        total: 250.00
      }
    ]
  },
  {
    id: "4",
    patientId: "P004",
    patientName: "Sneha Reddy",
    invoiceNumber: "INV-2023-004",
    amount: 3500.00,
    issueDate: "2023-04-01T09:45:00.000Z",
    dueDate: "2023-04-16T09:45:00.000Z",
    status: "paid",
    items: [
      {
        id: "4-1",
        description: "CT Scan",
        quantity: 1,
        unitPrice: 3000.00,
        total: 3000.00
      },
      {
        id: "4-2",
        description: "Radiologist Fee",
        quantity: 1,
        unitPrice: 500.00,
        total: 500.00
      }
    ]
  },
  {
    id: "5",
    patientId: "P005",
    patientName: "Vikram Singh",
    invoiceNumber: "INV-2023-005",
    amount: 750.00,
    issueDate: "2023-04-02T16:30:00.000Z",
    dueDate: "2023-04-17T16:30:00.000Z",
    status: "pending",
    items: [
      {
        id: "5-1",
        description: "Dermatology Consultation",
        quantity: 1,
        unitPrice: 500.00,
        total: 500.00
      },
      {
        id: "5-2",
        description: "Skin Test",
        quantity: 1,
        unitPrice: 250.00,
        total: 250.00
      }
    ]
  },
  {
    id: "6",
    patientId: "P008",
    patientName: "Neha Kapoor",
    invoiceNumber: "INV-2023-008",
    amount: 4200.00,
    issueDate: "2023-04-05T10:15:00.000Z",
    dueDate: "2023-04-20T10:15:00.000Z",
    status: "overdue",
    items: [
      {
        id: "6-1",
        description: "Surgical Procedure",
        quantity: 1,
        unitPrice: 3500.00,
        total: 3500.00
      },
      {
        id: "6-2",
        description: "Hospital Stay (1 Day)",
        quantity: 1,
        unitPrice: 700.00,
        total: 700.00
      }
    ]
  }
];

// Form schemas
const paymentSchema = z.object({
  patientName: z.string().min(1, { message: "Patient name is required" }),
  patientId: z.string().min(1, { message: "Patient ID is required" }),
  amount: z.coerce.number().min(1, { message: "Amount must be greater than 0" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  departmentName: z.string().min(1, { message: "Department is required" }),
  serviceName: z.string().min(1, { message: "Service name is required" }),
  invoiceNumber: z.string().optional(),
  status: z.string().default("paid"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const Billing = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"payments" | "bills" | "analytics" | "package_billing" | "insurance">("payments");
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewBillId, setViewBillId] = useState<string | null>(null);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [showCreateBillDialog, setShowCreateBillDialog] = useState(false);
  const [showCreatePaymentDialog, setShowCreatePaymentDialog] = useState(false);
  const [newBill, setNewBill] = useState<Partial<Bill>>({
    patientName: "",
    amount: 0,
    status: "pending",
    items: []
  });
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [newBillItem, setNewBillItem] = useState<Partial<BillItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  // React hook form for payment
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      patientName: "",
      patientId: "",
      amount: 0,
      paymentMethod: "cash",
      departmentName: "",
      serviceName: "",
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: "paid",
    },
  });

  const filteredPayments = payments.filter((payment) => {
    const searchString = searchQuery.toLowerCase();
    return (
      payment.patientName.toLowerCase().includes(searchString) ||
      payment.invoiceNumber.toLowerCase().includes(searchString) ||
      payment.status.toLowerCase().includes(searchString)
    );
  });

  const filteredBills = bills.filter((bill) => {
    const searchString = searchQuery.toLowerCase();
    return (
      bill.patientName.toLowerCase().includes(searchString) ||
      bill.invoiceNumber.toLowerCase().includes(searchString) ||
      bill.status.toLowerCase().includes(searchString)
    );
  });

  const totalRevenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = bills
    .filter((bill) => bill.status === "pending" || bill.status === "overdue")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "p");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "debit_card":
        return <CreditCard size={16} className="mr-2" />;
      case "cash":
      case "bank_transfer":
      case "insurance":
        return <DollarSign size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  const handleViewBill = (billId: string) => {
    const bill = bills.find((b) => b.id === billId);
    setCurrentBill(bill || null);
    setViewBillId(billId);
  };

  const handlePrintBill = () => {
    toast({
      title: "Printing Bill",
      description: "Bill sent to printer.",
    });
  };

  const handleDownloadBill = () => {
    toast({
      title: "Downloading Bill",
      description: "Bill downloaded as PDF.",
    });
  };
  
  const handleMarkAsPaid = (billId: string) => {
    const updatedBills = bills.map((bill) =>
      bill.id === billId ? { ...bill, status: "paid" as const } : bill
    );
    
    setBills(updatedBills);
    
    // Also create a payment record
    const billToUpdate = bills.find(bill => bill.id === billId);
    if (billToUpdate) {
      const newPayment: Payment = {
        id: Date.now().toString(),
        patientId: billToUpdate.patientId,
        patientName: billToUpdate.patientName,
        invoiceNumber: billToUpdate.invoiceNumber,
        amount: billToUpdate.amount,
        date: new Date().toISOString(),
        paymentMethod: "cash", // Default
        status: "paid",
        departmentName: "-",
        serviceName: "Multiple Services"
      };
      
      setPayments([...payments, newPayment]);
    }
    
    toast({
      title: "Payment Recorded",
      description: `Bill ${billId} marked as paid.`,
    });
  };

  const handleAddBillItem = () => {
    const total = (newBillItem.quantity || 0) * (newBillItem.unitPrice || 0);
    
    if (!newBillItem.description || !newBillItem.quantity || !newBillItem.unitPrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for the bill item.",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: BillItem = {
      id: Date.now().toString(),
      description: newBillItem.description || "",
      quantity: newBillItem.quantity || 0,
      unitPrice: newBillItem.unitPrice || 0,
      total: total
    };
    
    setNewBill({
      ...newBill,
      items: [...(newBill.items || []), newItem],
      amount: (newBill.amount || 0) + total
    });
    
    setNewBillItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    });
  };

  const handleRemoveBillItem = (itemId: string) => {
    const itemToRemove = newBill.items?.find(item => item.id === itemId);
    if (itemToRemove) {
      setNewBill({
        ...newBill,
        items: newBill.items?.filter(item => item.id !== itemId),
        amount: (newBill.amount || 0) - itemToRemove.total
      });
    }
  };

  const handleCreateBill = () => {
    if (!newBill.patientName || !newBill.items?.length) {
      toast({
        title: "Missing Information",
        description: "Please enter patient name and add at least one item.",
        variant: "destructive"
      });
      return;
    }
    
    const createdBill: Bill = {
      id: Date.now().toString(),
      patientId: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      patientName: newBill.patientName || "Unknown Patient",
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount: newBill.amount || 0,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days due
      status: "pending",
      items: newBill.items || []
    };
    
    setBills([...bills, createdBill]);
    setShowCreateBillDialog(false);
    setNewBill({
      patientName: "",
      amount: 0,
      status: "pending",
      items: []
    });
    
    toast({
      title: "Bill Created",
      description: `Invoice #${createdBill.invoiceNumber} has been created.`,
    });
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    paymentForm.reset({
      patientName: payment.patientName,
      patientId: payment.patientId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      departmentName: payment.departmentName,
      serviceName: payment.serviceName,
      invoiceNumber: payment.invoiceNumber,
      status: payment.status,
    });
    setShowCreatePaymentDialog(true);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
    toast({
      title: "Payment Deleted",
      description: "The payment record has been deleted.",
      variant: "destructive"
    });
  };

  const handleCreatePayment = (values: PaymentFormValues) => {
    if (editingPayment) {
      // Update existing payment
      const updatedPayments = payments.map(payment => 
        payment.id === editingPayment.id 
          ? {
              ...payment,
              patientName: values.patientName,
              patientId: values.patientId,
              amount: values.amount,
              paymentMethod: values.paymentMethod as "credit_card" | "debit_card" | "cash" | "bank_transfer" | "insurance",
              departmentName: values.departmentName,
              serviceName: values.serviceName,
              status: values.status as "paid" | "pending" | "overdue" | "cancelled" | "refunded",
            }
          : payment
      );
      setPayments(updatedPayments);
      toast({
        title: "Payment Updated",
        description: `Payment record for ${values.patientName} has been updated.`,
      });
    } else {
      // Create new payment
      const newPayment: Payment = {
        id: Date.now().toString(),
        patientId: values.patientId,
        patientName: values.patientName,
        invoiceNumber: values.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        amount: values.amount,
        date: new Date().toISOString(),
        paymentMethod: values.paymentMethod as "credit_card" | "debit_card" | "cash" | "bank_transfer" | "insurance",
        status: values.status as "paid" | "pending" | "overdue" | "cancelled" | "refunded",
        departmentName: values.departmentName,
        serviceName: values.serviceName,
      };
      
      setPayments([...payments, newPayment]);
      toast({
        title: "Payment Recorded",
        description: `Payment of ${formatCurrency(values.amount)} from ${values.patientName} has been recorded.`,
      });
    }
    
    setShowCreatePaymentDialog(false);
    resetPaymentForm();
  };

  const handlePaymentDialogOpenChange = (open: boolean) => {
    setShowCreatePaymentDialog(open);
    if (!open) {
      resetPaymentForm();
    }
  };

  const resetPaymentForm = () => {
    setEditingPayment(null);
    paymentForm.reset({
      patientName: "",
      patientId: "",
      amount: 0,
      paymentMethod: "cash",
      departmentName: "",
      serviceName: "",
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: "paid",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-gray-500">Manage billing and payment processing</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <DollarSign className="h-8 w-8 text-green-700" />
            </div>
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-yellow-100 p-3 mb-4">
              <CreditCard className="h-8 w-8 text-yellow-700" />
            </div>
            <h3 className="text-lg font-medium">Pending Amount</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(pendingAmount)}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <FileEdit className="h-8 w-8 text-blue-700" />
            </div>
            <h3 className="text-lg font-medium">Total Bills</h3>
            <p className="text-3xl font-bold mt-2">{bills.length}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="payments" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
        <TabsList className="glass-card border border-white/20 p-1">
          <TabsTrigger 
            value="payments" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Payment Records
          </TabsTrigger>
          <TabsTrigger 
            value="bills" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Manage Bills
          </TabsTrigger>
          <TabsTrigger 
            value="package_billing" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Package Billing
          </TabsTrigger>
          <TabsTrigger 
            value="insurance" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Insurance Claims
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          {activeTab === "payments" && (
            <Dialog open={showCreatePaymentDialog} onOpenChange={handlePaymentDialogOpenChange}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setShowCreatePaymentDialog(true)}
                  className="bg-black text-white hover:bg-black/80"
                >
                  <Plus size={18} className="mr-2" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingPayment ? "Edit Payment" : "Record New Payment"}</DialogTitle>
                  <DialogDescription>
                    {editingPayment 
                      ? "Edit payment details in the form below."
                      : "Enter the payment details to record a new payment."}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(handleCreatePayment)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="patientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter patient name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="patientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient ID</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., P001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Amount" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="debit_card">Debit Card</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="insurance">Insurance</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="departmentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Cardiology" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="serviceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., ECG Test" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Generate automatically if empty" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreatePaymentDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-black text-white hover:bg-black/90">
                        {editingPayment ? "Update Payment" : "Record Payment"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          {activeTab === "bills" && (
            <Button 
              onClick={() => setShowCreateBillDialog(true)}
              className="bg-black text-white hover:bg-black/80"
            >
              <Plus size={18} className="mr-2" /> Create Bill
            </Button>
          )}
        </div>
      </div>

      {/* Payments Tab Content */}
      {activeTab === "payments" && (
        <Card className="glass-card animate-glass-fade">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.invoiceNumber}</TableCell>
                      <TableCell className="font-medium">{payment.patientName}</TableCell>
                      <TableCell>
                        {formatDate(payment.date)}
                        <div className="text-xs text-gray-500">
                          {formatTime(payment.date)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span>{payment.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>{payment.departmentName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPayment(payment)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePayment(payment.id)}
                            className="text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast({ title: "Receipt", description: "Downloading receipt..." })}
                          >
                            <Download size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No payments found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Bills Tab Content */}
      {activeTab === "bills" && (
        <Card className="glass-card animate-glass-fade">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.invoiceNumber}</TableCell>
                      <TableCell className="font-medium">{bill.patientName}</TableCell>
                      <TableCell>{formatDate(bill.issueDate)}</TableCell>
                      <TableCell>{formatDate(bill.dueDate)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(bill.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                            bill.status
                          )}`}
                        >
                          {bill.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBill(bill.id)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadBill()}
                          >
                            <Download size={16} />
                          </Button>
                          {bill.status === "pending" || bill.status === "overdue" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                              onClick={() => handleMarkAsPaid(bill.id)}
                            >
                              Mark Paid
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No bills found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Package Billing Tab Content */}
      {activeTab === "package_billing" && (
        <div className="glass-card animate-glass-fade p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Package Billing</h3>
          <p className="text-gray-600 mb-6">Create custom billing packages for patients with special rates</p>
          <Button
            onClick={() => toast({ title: "Coming Soon", description: "Package billing will be available soon." })}
            className="bg-black text-white hover:bg-black/80"
          >
            Create Package
          </Button>
        </div>
      )}

      {/* Insurance Claims Tab Content */}
      {activeTab === "insurance" && (
        <div className="glass-card animate-glass-fade p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Insurance Claims Management</h3>
          <p className="text-gray-600 mb-6">Process and track insurance claims for patients</p>
          <Button
            onClick={() => toast({ title: "Coming Soon", description: "Insurance claims processing will be available soon." })}
            className="bg-black text-white hover:bg-black/80"
          >
            New Claim
          </Button>
        </div>
      )}

      {/* Analytics Tab Content */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>
                Overview of payment trends and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64">
                <p className="text-center text-gray-500">
                  Payment analytics charts will be displayed here.
                  <br />
                  Coming soon!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card animate-glass-fade">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-48">
                  <p className="text-center text-gray-500">
                    Payment method distribution chart will be displayed here.
                    <br />
                    Coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card animate-glass-fade">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-48">
                  <p className="text-center text-gray-500">
                    Monthly revenue chart will be displayed here.
                    <br />
                    Coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* View Bill Dialog */}
      <Dialog open={viewBillId !== null} onOpenChange={() => setViewBillId(null)}>
        <DialogContent className="glass-dialog max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice #{currentBill?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Bill details for {currentBill?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          {currentBill && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Patient Information</h4>
                  <p className="font-medium">{currentBill.patientName}</p>
                  <p className="text-sm text-gray-500">ID: {currentBill.patientId}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-medium text-gray-500">Bill Information</h4>
                  <p className="font-medium">Invoice #{currentBill.invoiceNumber}</p>
                  <p className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(currentBill.status)}`}>
                      {currentBill.status}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-500">Issue Date</h4>
                  <p>{formatDate(currentBill.issueDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Due Date</h4>
                  <p>{formatDate(currentBill.dueDate)}</p>
                </div>
                <div className="md:text-right">
                  <h4 className="font-medium text-gray-500">Amount</h4>
                  <p className="text-xl font-bold">{formatCurrency(currentBill.amount)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBill.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(currentBill.amount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handlePrintBill}
              className="w-full sm:w-auto"
            >
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadBill}
              className="w-full sm:w-auto"
            >
              <Download size={16} className="mr-2" /> Download PDF
            </Button>
            {currentBill?.status === "pending" && (
              <Button
                onClick={() => {
                  handleMarkAsPaid(currentBill.id);
                  setViewBillId(null);
                }}
                className="w-full sm:w-auto bg-black text-white hover:bg-black/80"
              >
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Bill Dialog */}
      <Dialog open={showCreateBillDialog} onOpenChange={setShowCreateBillDialog}>
        <DialogContent className="glass-dialog max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Bill</DialogTitle>
            <DialogDescription>
              Create a new bill for a patient by adding items and services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="patientName" className="text-sm font-medium">
                  Patient Name
                </label>
                <Input
                  id="patientName"
                  value={newBill.patientName}
                  onChange={(e) => setNewBill({ ...newBill, patientName: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">Add Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    value={newBillItem.description}
                    onChange={(e) => setNewBillItem({ ...newBillItem, description: e.target.value })}
                    placeholder="Service or item"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newBillItem.quantity}
                    onChange={(e) => setNewBillItem({ 
                      ...newBillItem, 
                      quantity: Number(e.target.value),
                      total: Number(e.target.value) * (newBillItem.unitPrice || 0)
                    })}
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="unitPrice" className="text-sm font-medium">
                    Unit Price
                  </label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={newBillItem.unitPrice}
                    onChange={(e) => setNewBillItem({ 
                      ...newBillItem, 
                      unitPrice: Number(e.target.value),
                      total: (newBillItem.quantity || 0) * Number(e.target.value)
                    })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddBillItem} 
                className="mt-4 bg-black text-white hover:bg-black/80"
              >
                <Plus size={16} className="mr-2" /> Add Item
              </Button>
            </div>
            
            {newBill.items && newBill.items.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Bill Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newBill.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveBillItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(newBill.amount || 0)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateBillDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBill}
              className="bg-black text-white hover:bg-black/80"
            >
              Create Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Billing;
