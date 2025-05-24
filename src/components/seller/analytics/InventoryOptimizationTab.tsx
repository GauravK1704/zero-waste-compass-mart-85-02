
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Package, Plus, Truck, Calendar, DollarSign, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ScheduleDialog from './ScheduleDialog';

interface UrgentReorderItem {
  id: string;
  name: string;
  currentStock: number;
  reorderPoint: number;
  suggestedOrderQuantity: number;
  supplier: string;
  unitCost: number;
  estimatedDeliveryTime: string;
  urgencyLevel: 'critical' | 'high' | 'medium';
  category: string;
  lastOrderDate: string;
  averageDailySales: number;
  daysUntilStockout: number;
}

interface CreateOrderFormData {
  supplierId: string;
  supplierName: string;
  orderQuantity: number;
  unitCost: number;
  expectedDelivery: string;
  notes: string;
  priority: 'urgent' | 'standard' | 'low';
}

const InventoryOptimizationTab: React.FC = () => {
  const [urgentItems, setUrgentItems] = useState<UrgentReorderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<UrgentReorderItem | null>(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [orderForm, setOrderForm] = useState<CreateOrderFormData>({
    supplierId: '',
    supplierName: '',
    orderQuantity: 0,
    unitCost: 0,
    expectedDelivery: '',
    notes: '',
    priority: 'urgent'
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    generateUrgentReorderData();
  }, []);

  const generateUrgentReorderData = () => {
    const mockItems: UrgentReorderItem[] = [
      {
        id: '1',
        name: 'Organic Milk 1L',
        currentStock: 15,
        reorderPoint: 50,
        suggestedOrderQuantity: 200,
        supplier: 'Fresh Dairy Co.',
        unitCost: 45,
        estimatedDeliveryTime: '2-3 days',
        urgencyLevel: 'critical',
        category: 'Dairy',
        lastOrderDate: '2024-05-20',
        averageDailySales: 25,
        daysUntilStockout: 1
      },
      {
        id: '2',
        name: 'Fresh Bread Loaves',
        currentStock: 8,
        reorderPoint: 30,
        suggestedOrderQuantity: 100,
        supplier: 'Artisan Bakery',
        unitCost: 35,
        estimatedDeliveryTime: '1-2 days',
        urgencyLevel: 'critical',
        category: 'Bakery',
        lastOrderDate: '2024-05-22',
        averageDailySales: 18,
        daysUntilStockout: 0
      },
      {
        id: '3',
        name: 'Yogurt Cups (12 pack)',
        currentStock: 45,
        reorderPoint: 75,
        suggestedOrderQuantity: 150,
        supplier: 'Fresh Dairy Co.',
        unitCost: 180,
        estimatedDeliveryTime: '2-3 days',
        urgencyLevel: 'high',
        category: 'Dairy',
        lastOrderDate: '2024-05-18',
        averageDailySales: 12,
        daysUntilStockout: 4
      },
      {
        id: '4',
        name: 'Seasonal Fruit Mix',
        currentStock: 20,
        reorderPoint: 40,
        suggestedOrderQuantity: 80,
        supplier: 'Local Farms Network',
        unitCost: 120,
        estimatedDeliveryTime: '1 day',
        urgencyLevel: 'high',
        category: 'Fresh Produce',
        lastOrderDate: '2024-05-21',
        averageDailySales: 8,
        daysUntilStockout: 3
      },
      {
        id: '5',
        name: 'Eco-Friendly Cleaning Supplies',
        currentStock: 25,
        reorderPoint: 35,
        suggestedOrderQuantity: 60,
        supplier: 'Green Clean Co.',
        unitCost: 85,
        estimatedDeliveryTime: '3-5 days',
        urgencyLevel: 'medium',
        category: 'Household',
        lastOrderDate: '2024-05-15',
        averageDailySales: 4,
        daysUntilStockout: 6
      }
    ];

    setUrgentItems(mockItems.sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2 };
      return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
    }));
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const openCreateOrderDialog = (item: UrgentReorderItem) => {
    setSelectedItem(item);
    setOrderForm({
      supplierId: item.supplier.toLowerCase().replace(/\s+/g, '-'),
      supplierName: item.supplier,
      orderQuantity: item.suggestedOrderQuantity,
      unitCost: item.unitCost,
      expectedDelivery: new Date(Date.now() + (item.estimatedDeliveryTime.includes('1') ? 2 : 4) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Urgent reorder for ${item.name} - current stock critically low`,
      priority: item.urgencyLevel === 'critical' ? 'urgent' : 'standard'
    });
    setIsCreateOrderOpen(true);
  };

  const openScheduleDialog = (item: UrgentReorderItem) => {
    setSelectedItem(item);
    setIsScheduleOpen(true);
  };

  const handleCreateOrder = async () => {
    if (!selectedItem) return;

    setIsSubmittingOrder(true);
    
    // Simulate order creation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update stock levels optimistically
    setUrgentItems(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { 
            ...item, 
            currentStock: item.currentStock + Math.floor(orderForm.orderQuantity * 0.1), // Simulate partial immediate stock
            lastOrderDate: new Date().toISOString().split('T')[0]
          }
        : item
    ));

    setIsSubmittingOrder(false);
    setIsCreateOrderOpen(false);
    
    toast.success("Order Created Successfully", {
      description: `Purchase order for ${orderForm.orderQuantity} units of ${selectedItem.name} has been sent to ${orderForm.supplierName}`
    });

    // Reset form
    setSelectedItem(null);
    setOrderForm({
      supplierId: '',
      supplierName: '',
      orderQuantity: 0,
      unitCost: 0,
      expectedDelivery: '',
      notes: '',
      priority: 'urgent'
    });
  };

  const calculateTotalOrderValue = () => {
    return orderForm.orderQuantity * orderForm.unitCost;
  };

  const criticalItems = urgentItems.filter(item => item.urgencyLevel === 'critical');
  const totalValueAtRisk = urgentItems.reduce((total, item) => 
    total + (item.averageDailySales * item.unitCost * Math.max(0, item.daysUntilStockout)), 0
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Critical Items</p>
                <p className="text-2xl font-bold text-red-700">{criticalItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Total Items to Reorder</p>
                <p className="text-2xl font-bold text-orange-700">{urgentItems.length}</p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Value at Risk</p>
                <p className="text-2xl font-bold text-blue-700">₹{totalValueAtRisk.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Reorder Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI-Powered Urgent Reorder Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <Badge className={getUrgencyColor(item.urgencyLevel)}>
                        {item.urgencyLevel}
                      </Badge>
                      {item.daysUntilStockout <= 1 && (
                        <Badge variant="destructive" className="animate-pulse">
                          STOCKOUT RISK
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Current Stock:</span>
                        <p className="font-medium">{item.currentStock} units</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Reorder Point:</span>
                        <p className="font-medium">{item.reorderPoint} units</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Days Until Stockout:</span>
                        <p className={`font-medium ${item.daysUntilStockout <= 1 ? 'text-red-600' : 'text-orange-600'}`}>
                          {item.daysUntilStockout} days
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Daily Sales:</span>
                        <p className="font-medium">{item.averageDailySales} units/day</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-md border border-blue-200 mb-4">
                      <div className="flex items-start gap-2">
                        <Bot className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-700 mb-1">AI Recommendation</p>
                          <p className="text-sm text-blue-800">
                            Order {item.suggestedOrderQuantity} units from {item.supplier} immediately. 
                            Estimated delivery: {item.estimatedDeliveryTime}. 
                            Cost: ₹{(item.suggestedOrderQuantity * item.unitCost).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => openCreateOrderDialog(item)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Order
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openScheduleDialog(item)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Order Dialog with Scroller */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedItem && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium">{selectedItem.name}</h4>
                  <p className="text-sm text-gray-600">Current Stock: {selectedItem.currentStock} units</p>
                  <p className="text-sm text-gray-600">Reorder Point: {selectedItem.reorderPoint} units</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={orderForm.supplierName}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, supplierName: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="quantity">Order Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={orderForm.orderQuantity}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, orderQuantity: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unitCost">Unit Cost (₹)</Label>
                      <Input
                        id="unitCost"
                        type="number"
                        value={orderForm.unitCost}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="delivery">Expected Delivery Date</Label>
                    <Input
                      id="delivery"
                      type="date"
                      value={orderForm.expectedDelivery}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={orderForm.priority} onValueChange={(value: 'urgent' | 'standard' | 'low') => 
                      setOrderForm(prev => ({ ...prev, priority: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <h5 className="font-medium text-blue-800 mb-1">Order Summary</h5>
                    <p className="text-sm text-blue-700">
                      Total Value: ₹{calculateTotalOrderValue().toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-700">
                      Expected Delivery: {orderForm.expectedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleCreateOrder}
              disabled={isSubmittingOrder || !orderForm.orderQuantity}
              className="flex-1"
            >
              {isSubmittingOrder ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Order...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Create Order
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <ScheduleDialog
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        itemName={selectedItem?.name || ''}
        itemId={selectedItem?.id || ''}
      />
    </div>
  );
};

export default InventoryOptimizationTab;
