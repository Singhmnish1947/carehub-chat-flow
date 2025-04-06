
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

const Payments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"payments" | "bills" | "analytics">("payments");
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewBillId, setViewBillId] = useState<string | null>(null);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);

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
      bill.id === billId ? { ...bill, status: "paid" } : bill
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-gray-500">Manage billing and payment processing</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <DollarSign className="h-8 w-8 text-green-700" />
            </div>
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-yellow-100 p-3 mb-4">
              <CreditCard className="h-8 w-8 text-yellow-700" />
            </div>
            <h3 className="text-lg font-medium">Pending Amount</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(pendingAmount)}</p>
          </CardContent>
        </Card>
        
        <Card>
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
        <TabsList>
          <TabsTrigger value="payments">Payment Records</TabsTrigger>
          <TabsTrigger value="bills">Manage Bills</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          {activeTab === "payments" && (
            <Button onClick={() => toast({ title: "Coming Soon", description: "This feature will be available soon." })}>
              <Plus size={18} className="mr-2" /> Record Payment
            </Button>
          )}
          {activeTab === "bills" && (
            <Button onClick={() => toast({ title: "Coming Soon", description: "This feature will be available soon." })}>
              <Plus size={18} className="mr-2" /> Create Bill
            </Button>
          )}
        </div>
      </div>

      {/* Payments Tab Content */}
      {activeTab === "payments" && (
        <Card>
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
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="icon"
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
        <Card>
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
                            size="icon"
                            onClick={() => handleViewBill(bill.id)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
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

      {/* Analytics Tab Content */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
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
            <Card>
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
            
            <Card>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice #{currentBill?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Viewing bill details for {currentBill?.patientName}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {currentBill && (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">HavenMed Hospital</h3>
                    <p className="text-sm text-gray-500">123 Medical Plaza</p>
                    <p className="text-sm text-gray-500">Bangalore, Karnataka, India</p>
                    <p className="text-sm text-gray-500">Phone: +91 80 2345 6789</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      <span className="font-medium">Invoice #:</span> {currentBill.invoiceNumber}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Issue Date:</span> {formatDate(currentBill.issueDate)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Due Date:</span> {formatDate(currentBill.dueDate)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                        currentBill.status
                      )}`}
                    >
                      {currentBill.status}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-b py-4">
                  <h3 className="font-medium mb-2">Bill To:</h3>
                  <p>{currentBill.patientName}</p>
                  <p className="text-sm text-gray-500">Patient ID: {currentBill.patientId}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Items:</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentBill.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="flex justify-end mt-4">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(currentBill.amount)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Tax:</span>
                        <span>{formatCurrency(0)}</span>
                      </div>
                      <div className="flex justify-between py-2 font-bold border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(currentBill.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 border-t pt-4">
                  <p>Thank you for choosing HavenMed Hospital for your healthcare needs.</p>
                  <p>For any billing queries, please contact: billing@havenmed.com</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              {currentBill?.status === "pending" || currentBill?.status === "overdue" ? (
                <Button onClick={() => {
                  handleMarkAsPaid(currentBill.id);
                  setViewBillId(null);
                }}>
                  Mark as Paid
                </Button>
              ) : null}
              <Button variant="outline" onClick={handlePrintBill}>
                Print
              </Button>
              <Button onClick={handleDownloadBill}>
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;
