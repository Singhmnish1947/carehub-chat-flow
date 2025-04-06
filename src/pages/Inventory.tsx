
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, FileEdit, Trash2, Filter, RefreshCw, ArrowUpDown, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import InventoryTransactions from "@/components/inventory/InventoryTransactions";
import LowStockAlert from "@/components/inventory/LowStockAlert";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  unit: string | null;
  current_stock: number;
  minimum_stock: number | null;
  price: number | null;
  manufacturer: string | null;
  supplier: string | null;
  batch_number: string | null;
  expiry_date: string | null;
  location: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface TransactionData {
  item_id: string;
  transaction_type: string;
  quantity: number;
  notes?: string;
}

const Inventory = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"all" | "low_stock">("all");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});
  const [transactionData, setTransactionData] = useState<TransactionData>({
    item_id: "",
    transaction_type: "received",
    quantity: 1
  });

  // Categories derived from items
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch inventory items
  const fetchInventoryItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setItems(data);
        setFilteredItems(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching inventory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // Filter items based on search and category
  useEffect(() => {
    let result = [...items];
    
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
        (item.manufacturer && item.manufacturer.toLowerCase().includes(lowerQuery)) ||
        (item.supplier && item.supplier.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter(item => item.category === filterCategory);
    }
    
    // Filter by view mode
    if (viewMode === "low_stock") {
      result = result.filter(item => 
        item.current_stock < (item.minimum_stock || 0)
      );
    }
    
    // Sort items
    result = result.sort((a, b) => {
      let valA: any = a[sortColumn as keyof InventoryItem];
      let valB: any = b[sortColumn as keyof InventoryItem];
      
      if (valA === null) valA = '';
      if (valB === null) valB = '';
      
      const compareResult = 
        typeof valA === 'string' && typeof valB === 'string'
          ? valA.localeCompare(valB)
          : (valA > valB ? 1 : valA < valB ? -1 : 0);
          
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    
    setFilteredItems(result);
  }, [items, searchQuery, filterCategory, viewMode, sortColumn, sortDirection]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    const numericValue = value === '' ? null : Number(value);
    setFormData({ ...formData, [name]: numericValue });
  };

  // Handle date input changes
  const handleDateChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value || null });
  };

  // Handle add item
  const handleAddItem = async () => {
    try {
      if (!formData.name || !formData.category) {
        toast({
          title: "Validation Error",
          description: "Name and category are required fields.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{ 
          ...formData,
          current_stock: formData.current_stock || 0,
          minimum_stock: formData.minimum_stock || 10,
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item added successfully.",
      });

      setIsAddDialogOpen(false);
      fetchInventoryItems();
      setFormData({});
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle edit item
  const handleEditItem = async () => {
    try {
      if (!currentItem || !formData.name || !formData.category) {
        toast({
          title: "Validation Error",
          description: "Name and category are required fields.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('inventory_items')
        .update({ 
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item updated successfully.",
      });

      setIsEditDialogOpen(false);
      fetchInventoryItems();
      setCurrentItem(null);
      setFormData({});
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle delete item
  const handleDeleteItem = async () => {
    try {
      if (!currentItem) return;

      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', currentItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item deleted successfully.",
      });

      setIsDeleteDialogOpen(false);
      fetchInventoryItems();
      setCurrentItem(null);
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle transaction
  const handleTransaction = async () => {
    try {
      if (!currentItem || !transactionData.quantity || transactionData.quantity <= 0) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid quantity.",
          variant: "destructive",
        });
        return;
      }

      // If issuing more than available stock
      if (
        transactionData.transaction_type === "issued" && 
        transactionData.quantity > currentItem.current_stock
      ) {
        toast({
          title: "Validation Error",
          description: "Cannot issue more than available stock.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('inventory_transactions')
        .insert([{ 
          item_id: currentItem.id,
          transaction_type: transactionData.transaction_type,
          quantity: transactionData.quantity,
          notes: transactionData.notes
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Inventory ${transactionData.transaction_type} transaction recorded successfully.`,
      });

      setIsTransactionDialogOpen(false);
      fetchInventoryItems();
      setTransactionData({
        item_id: "",
        transaction_type: "received",
        quantity: 1
      });
    } catch (error: any) {
      toast({
        title: "Error recording transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Open edit dialog with item data
  const openEditDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setFormData({ ...item });
    setIsEditDialogOpen(true);
  };

  // Open transaction dialog with item data
  const openTransactionDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setTransactionData({
      item_id: item.id,
      transaction_type: "received",
      quantity: 1
    });
    setIsTransactionDialog(true);
  };

  // Open delete dialog with item data
  const openDeleteDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'medication': return 'bg-blue-500 hover:bg-blue-600';
      case 'medical supplies': return 'bg-green-500 hover:bg-green-600';
      case 'medical equipment': return 'bg-purple-500 hover:bg-purple-600';
      case 'disinfectant': return 'bg-amber-500 hover:bg-amber-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  // Get stock status
  const getStockStatus = (item: InventoryItem) => {
    const { current_stock, minimum_stock } = item;
    const min = minimum_stock || 0;
    
    if (current_stock <= 0) return { label: 'Out of Stock', class: 'bg-red-500 text-white' };
    if (current_stock < min) return { label: 'Low Stock', class: 'bg-amber-500 text-white' };
    if (current_stock < min * 2) return { label: 'Moderate', class: 'bg-yellow-500 text-white' };
    return { label: 'In Stock', class: 'bg-green-500 text-white' };
  };

  // Low stock percentage for dashboard
  const lowStockPercentage = items.length > 0
    ? Math.round((items.filter(item => item.current_stock < (item.minimum_stock || 0)).length / items.length) * 100)
    : 0;

  // Count of items with zero stock
  const zeroStockCount = items.filter(item => item.current_stock === 0).length;
  
  // Sum of total inventory value
  const totalInventoryValue = items.reduce((sum, item) => {
    return sum + (item.current_stock * (item.price || 0));
  }, 0);
  
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-gray-500">Manage hospital supplies and equipment</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchInventoryItems}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={() => {
                setFormData({});
                setIsAddDialogOpen(true);
              }}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
              <p className="text-xs text-muted-foreground">
                Items in inventory
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {items.filter(item => item.current_stock < (item.minimum_stock || 0)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {lowStockPercentage}% of inventory needs restocking
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{zeroStockCount}</div>
              <p className="text-xs text-muted-foreground">
                Items completely out of stock
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalInventoryValue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                Total inventory value
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select
              value={filterCategory}
              onValueChange={(value) => setFilterCategory(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-1 bg-white border rounded-md p-1">
              <Button
                variant={viewMode === "all" ? "default" : "outline"}
                size="sm"
                className="px-3 py-1 h-auto"
                onClick={() => setViewMode("all")}
              >
                All Items
              </Button>
              <Button
                variant={viewMode === "low_stock" ? "default" : "outline"}
                size="sm"
                className="px-3 py-1 h-auto"
                onClick={() => setViewMode("low_stock")}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Low Stock
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs and content */}
        <div className="flex-1 p-4 overflow-auto">
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList>
              <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
              <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="space-y-4">
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>
                    {filteredItems.length} items {viewMode === "low_stock" ? "with low stock" : "found"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                          Name {sortColumn === 'name' && (
                            <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                          )}
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead onClick={() => handleSort('current_stock')} className="cursor-pointer">
                          Stock {sortColumn === 'current_stock' && (
                            <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                          )}
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
                          Price {sortColumn === 'price' && (
                            <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                          )}
                        </TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            Loading inventory items...
                          </TableCell>
                        </TableRow>
                      ) : filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            No inventory items found. Try adjusting your filters or add new items.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.name}</div>
                              {item.manufacturer && (
                                <div className="text-sm text-gray-500">{item.manufacturer}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getCategoryColor(item.category)}>
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="font-medium">{item.current_stock}</div>
                                {item.unit && <span className="ml-1 text-sm text-gray-500">{item.unit}</span>}
                              </div>
                              {item.minimum_stock !== null && (
                                <div className="text-xs text-gray-500">Min: {item.minimum_stock}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStockStatus(item).class}>
                                {getStockStatus(item).label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.price !== null ? (
                                <div>₹{item.price.toLocaleString('en-IN')}</div>
                              ) : (
                                <div className="text-gray-400">-</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {item.location || <span className="text-gray-400">-</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openTransactionDialog(item)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(item)}
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDeleteDialog(item)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <InventoryTransactions />
            </TabsContent>
            
            <TabsContent value="alerts">
              <LowStockAlert items={items} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new item to the inventory system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Item Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Paracetamol 500mg"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category*
                </label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                    <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Disinfectant">Disinfectant</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="current_stock" className="text-sm font-medium">
                  Current Stock
                </label>
                <Input
                  id="current_stock"
                  name="current_stock"
                  type="number"
                  placeholder="0"
                  value={formData.current_stock === undefined ? "" : formData.current_stock}
                  onChange={(e) => handleNumberChange("current_stock", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="minimum_stock" className="text-sm font-medium">
                  Minimum Stock
                </label>
                <Input
                  id="minimum_stock"
                  name="minimum_stock"
                  type="number"
                  placeholder="10"
                  value={formData.minimum_stock === undefined ? "" : formData.minimum_stock}
                  onChange={(e) => handleNumberChange("minimum_stock", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </label>
                <Input
                  id="unit"
                  name="unit"
                  placeholder="Tablet, Box, Bottle, etc."
                  value={formData.unit || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price (₹)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price === undefined ? "" : formData.price}
                  onChange={(e) => handleNumberChange("price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="manufacturer" className="text-sm font-medium">
                  Manufacturer
                </label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  placeholder="Cipla, Sun Pharma, etc."
                  value={formData.manufacturer || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="supplier" className="text-sm font-medium">
                  Supplier
                </label>
                <Input
                  id="supplier"
                  name="supplier"
                  placeholder="MedSupply India"
                  value={formData.supplier || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="batch_number" className="text-sm font-medium">
                  Batch Number
                </label>
                <Input
                  id="batch_number"
                  name="batch_number"
                  placeholder="BN12345"
                  value={formData.batch_number || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="expiry_date" className="text-sm font-medium">
                  Expiry Date
                </label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date || ""}
                  onChange={(e) => handleDateChange("expiry_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Pharmacy Shelf A1"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter item description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update inventory item details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Item Name*
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Paracetamol 500mg"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Category*
                </label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                    <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Disinfectant">Disinfectant</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-unit" className="text-sm font-medium">
                  Unit
                </label>
                <Input
                  id="edit-unit"
                  name="unit"
                  placeholder="Tablet, Box, Bottle, etc."
                  value={formData.unit || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-minimum_stock" className="text-sm font-medium">
                  Minimum Stock
                </label>
                <Input
                  id="edit-minimum_stock"
                  name="minimum_stock"
                  type="number"
                  placeholder="10"
                  value={formData.minimum_stock === undefined ? "" : formData.minimum_stock}
                  onChange={(e) => handleNumberChange("minimum_stock", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-price" className="text-sm font-medium">
                  Price (₹)
                </label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price === undefined ? "" : formData.price}
                  onChange={(e) => handleNumberChange("price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-manufacturer" className="text-sm font-medium">
                  Manufacturer
                </label>
                <Input
                  id="edit-manufacturer"
                  name="manufacturer"
                  placeholder="Cipla, Sun Pharma, etc."
                  value={formData.manufacturer || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-supplier" className="text-sm font-medium">
                  Supplier
                </label>
                <Input
                  id="edit-supplier"
                  name="supplier"
                  placeholder="MedSupply India"
                  value={formData.supplier || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-batch_number" className="text-sm font-medium">
                  Batch Number
                </label>
                <Input
                  id="edit-batch_number"
                  name="batch_number"
                  placeholder="BN12345"
                  value={formData.batch_number || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-expiry_date" className="text-sm font-medium">
                  Expiry Date
                </label>
                <Input
                  id="edit-expiry_date"
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date || ""}
                  onChange={(e) => handleDateChange("expiry_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="edit-location"
                  name="location"
                  placeholder="Pharmacy Shelf A1"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter item description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transaction Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Inventory Transaction</DialogTitle>
            <DialogDescription>
              {currentItem && (
                <span>Record stock movement for <strong>{currentItem.name}</strong></span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Transaction Type
              </label>
              <Select
                value={transactionData.transaction_type}
                onValueChange={(value) => setTransactionData({
                  ...transactionData,
                  transaction_type: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Stock Received</SelectItem>
                  <SelectItem value="issued">Stock Issued</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="transaction-quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="transaction-quantity"
                type="number"
                min="1"
                value={transactionData.quantity}
                onChange={(e) => setTransactionData({
                  ...transactionData,
                  quantity: parseInt(e.target.value) || 0
                })}
                required
              />
              {currentItem && transactionData.transaction_type === "issued" && (
                <p className="text-xs text-gray-500">
                  Current stock: {currentItem.current_stock} {currentItem.unit || ''}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="transaction-notes" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="transaction-notes"
                placeholder="Additional notes for this transaction"
                value={transactionData.notes || ""}
                onChange={(e) => setTransactionData({
                  ...transactionData,
                  notes: e.target.value
                })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleTransaction}>
              Record Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {currentItem && (
                <span>Are you sure you want to delete <strong>{currentItem.name}</strong>? This action cannot be undone.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Inventory;
