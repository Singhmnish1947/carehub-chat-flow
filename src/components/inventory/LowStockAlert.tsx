
import React from "react";
import {
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, ShoppingCart, AlertTriangle, AlertCircle
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  minimum_stock: number | null;
  unit: string | null;
  manufacturer: string | null;
}

interface LowStockAlertProps {
  items: InventoryItem[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ items }) => {
  // Filter items with low stock
  const lowStockItems = items.filter(item => 
    item.current_stock < (item.minimum_stock || 0)
  ).sort((a, b) => {
    // Calculate percentage of minimum stock
    const percentA = a.minimum_stock ? (a.current_stock / a.minimum_stock) * 100 : 0;
    const percentB = b.minimum_stock ? (b.current_stock / b.minimum_stock) * 100 : 0;
    return percentA - percentB; // Sort by lowest percentage first
  });

  // Get out of stock items
  const outOfStockItems = items.filter(item => item.current_stock <= 0);
  
  // Get nearly empty items (less than 25% of minimum stock)
  const criticalItems = items.filter(item => {
    const minStock = item.minimum_stock || 0;
    return item.current_stock > 0 && item.current_stock < (minStock * 0.25);
  });
  
  // Get warning items (between 25% and 75% of minimum stock)
  const warningItems = items.filter(item => {
    const minStock = item.minimum_stock || 0;
    return item.current_stock >= (minStock * 0.25) && item.current_stock < (minStock * 0.75);
  });
  
  // Stock level badge
  const getStockLevelBadge = (current: number, minimum: number | null) => {
    const min = minimum || 0;
    
    if (current <= 0) {
      return { label: 'Out of Stock', class: 'bg-red-500 hover:bg-red-600' };
    }
    
    if (current < min * 0.25) {
      return { label: 'Critical', class: 'bg-red-500 hover:bg-red-600' };
    }
    
    if (current < min * 0.75) {
      return { label: 'Warning', class: 'bg-amber-500 hover:bg-amber-600' };
    }
    
    return { label: 'Low Stock', class: 'bg-yellow-500 hover:bg-yellow-600' };
  };
  
  // Calculate stock level percentage
  const getStockPercentage = (current: number, minimum: number | null) => {
    if (!minimum || minimum === 0) return 0;
    const percentage = (current / minimum) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'bg-red-500';
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 75) return 'bg-amber-500';
    return 'bg-yellow-500';
  };
  
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems.length}</div>
            <p className="text-sm text-muted-foreground">
              Items completely out of stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalItems.length}</div>
            <p className="text-sm text-muted-foreground">
              Items with less than 25% of min. stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-amber-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Warning Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningItems.length}</div>
            <p className="text-sm text-muted-foreground">
              Items with less than 75% of min. stock
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Low stock items */}
      <Card>
        <CardHeader>
          <CardTitle>Items Requiring Attention</CardTitle>
          <CardDescription>
            {lowStockItems.length} items below minimum stock level
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex mx-auto items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">All Good!</h3>
              <p className="mt-2 text-gray-500">
                All inventory items are at or above their minimum stock levels.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Minimum Stock</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => {
                  const stockPercentage = getStockPercentage(item.current_stock, item.minimum_stock);
                  const stockLevel = getStockLevelBadge(item.current_stock, item.minimum_stock);
                  const progressColor = getProgressColor(stockPercentage);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        {item.manufacturer && (
                          <div className="text-xs text-gray-500">{item.manufacturer}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.current_stock} {item.unit || ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.minimum_stock || 0} {item.unit || ''}
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={stockPercentage}
                            className={`h-2 ${progressColor}`}
                          />
                          <span className="text-xs">{Math.round(stockPercentage)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={stockLevel.class}>
                          {stockLevel.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span className="sr-only">Order</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LowStockAlert;
