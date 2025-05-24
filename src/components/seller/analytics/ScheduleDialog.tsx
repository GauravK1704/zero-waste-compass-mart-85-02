
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Repeat, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemId: string;
}

interface ScheduleData {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  quantity: number;
  supplier: string;
  autoOrder: boolean;
  notificationDays: number;
  notes: string;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({ isOpen, onClose, itemName, itemId }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    frequency: 'weekly',
    time: '09:00',
    quantity: 100,
    supplier: '',
    autoOrder: false,
    notificationDays: 3,
    notes: ''
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSchedule = async () => {
    setIsCreating(true);
    
    // Simulate schedule creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsCreating(false);
    onClose();
    
    toast.success("Schedule Created", {
      description: `Automatic reordering scheduled for ${itemName} every ${scheduleData.frequency}`
    });
  };

  const resetForm = () => {
    setScheduleData({
      frequency: 'weekly',
      time: '09:00',
      quantity: 100,
      supplier: '',
      autoOrder: false,
      notificationDays: 3,
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Schedule Automatic Reordering
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="font-medium text-blue-800">{itemName}</h4>
            <p className="text-sm text-blue-600">Item ID: {itemId}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency" className="flex items-center gap-1">
                <Repeat className="h-4 w-4" />
                Frequency
              </Label>
              <Select value={scheduleData.frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'custom') => 
                setScheduleData(prev => ({ ...prev, frequency: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Order Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={scheduleData.quantity}
                onChange={(e) => setScheduleData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label htmlFor="supplier">Preferred Supplier</Label>
              <Select value={scheduleData.supplier} onValueChange={(value) => 
                setScheduleData(prev => ({ ...prev, supplier: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh-dairy-co">Fresh Dairy Co.</SelectItem>
                  <SelectItem value="artisan-bakery">Artisan Bakery</SelectItem>
                  <SelectItem value="local-farms">Local Farms Network</SelectItem>
                  <SelectItem value="green-clean">Green Clean Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notification" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              Notification Days Before
            </Label>
            <Input
              id="notification"
              type="number"
              min="1"
              max="30"
              value={scheduleData.notificationDays}
              onChange={(e) => setScheduleData(prev => ({ ...prev, notificationDays: parseInt(e.target.value) || 3 }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoOrder"
              checked={scheduleData.autoOrder}
              onChange={(e) => setScheduleData(prev => ({ ...prev, autoOrder: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="autoOrder" className="text-sm">
              Enable automatic ordering (no manual approval required)
            </Label>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={scheduleData.notes}
              onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Special instructions, delivery preferences, etc."
              rows={3}
            />
          </div>

          <div className="bg-green-50 p-3 rounded-md">
            <h5 className="font-medium text-green-800 mb-2">Schedule Summary</h5>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Order {scheduleData.quantity} units {scheduleData.frequency}</p>
              <p>• At {scheduleData.time} from {scheduleData.supplier || 'selected supplier'}</p>
              <p>• {scheduleData.autoOrder ? 'Automatic' : 'Manual approval required'}</p>
              <p>• Notifications {scheduleData.notificationDays} days before</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleCreateSchedule}
              disabled={isCreating || !scheduleData.supplier}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Schedule...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Schedule
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
