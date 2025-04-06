
import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, PackagePlus, ArrowDownToLine, CalendarIcon } from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface InventoryTransaction {
  id: string;
  transaction_type: string;
  quantity: number;
  transaction_date: string | null;
  notes: string | null;
  created_at: string | null;
  reference_number: string | null;
  item_id: string | null;
  item_name?: string;
  item_category?: string;
}

const InventoryTransactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<InventoryTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>("7");

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Get transactions with item information joined
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          inventory_items (name, category)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Format data with item name and category
        const formattedData = data.map(transaction => ({
          ...transaction,
          item_name: transaction.inventory_items?.name || 'Unknown Item',
          item_category: transaction.inventory_items?.category || 'Unknown',
        }));
        
        setTransactions(formattedData);
        setFilteredTransactions(formattedData);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter by search and transaction type
  useEffect(() => {
    let result = [...transactions];
    
    // Apply date filter
    if (dateFilter !== "all") {
      const daysAgo = parseInt(dateFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      result = result.filter(transaction => {
        const transactionDate = transaction.created_at ? new Date(transaction.created_at) : null;
        return transactionDate && transactionDate >= cutoffDate;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(transaction => 
        (transaction.item_name && transaction.item_name.toLowerCase().includes(lowerQuery)) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(lowerQuery)) ||
        (transaction.reference_number && transaction.reference_number.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Filter by transaction type
    if (filterType !== "all") {
      result = result.filter(transaction => transaction.transaction_type === filterType);
    }
    
    setFilteredTransactions(result);
  }, [transactions, searchQuery, filterType, dateFilter]);

  // Transaction type badge
  const getTransactionTypeColor = (type: string) => {
    switch(type) {
      case 'received': return 'bg-green-500 hover:bg-green-600';
      case 'issued': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy, h:mm a");
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={dateFilter}
            onValueChange={setDateFilter}
          >
            <SelectTrigger className="w-[150px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTransactions}
          >
            Refresh
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Inventory Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transactions {filterType !== "all" ? `(${filterType})` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No transactions found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.item_name}</div>
                      {transaction.item_category && (
                        <div className="text-xs text-gray-500">{transaction.item_category}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                        {transaction.transaction_type === 'received' ? (
                          <><PackagePlus className="h-3 w-3 mr-1" /> Received</>
                        ) : (
                          <><ArrowDownToLine className="h-3 w-3 mr-1" /> Issued</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.quantity}
                    </TableCell>
                    <TableCell>
                      {transaction.reference_number || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {transaction.notes || "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTransactions;
