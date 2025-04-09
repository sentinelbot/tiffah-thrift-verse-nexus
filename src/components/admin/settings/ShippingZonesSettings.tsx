
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Save,
  Map,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

// Sample Kenya counties for demonstration
const kenyaCounties = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos", "Nyeri", 
  "Uasin Gishu", "Meru", "Kakamega", "Kilifi", "Bungoma", "Kisii", "Garissa"
];

// Initial shipping zones for demonstration
const initialShippingZones = [
  {
    id: '1',
    name: 'Nairobi',
    regions: ['Nairobi'],
    baseRate: 200,
    deliveryTime: '1-2',
    sameDayAvailable: true,
    sameDaySurcharge: 150,
    freeShippingThreshold: 2000,
    priority: 'high',
    isActive: true,
  },
  {
    id: '2',
    name: 'Central Kenya',
    regions: ['Kiambu', 'Nyeri', 'Murang\'a'],
    baseRate: 350,
    deliveryTime: '2-3',
    sameDayAvailable: false,
    sameDaySurcharge: 0,
    freeShippingThreshold: 3500,
    priority: 'medium',
    isActive: true,
  },
  {
    id: '3',
    name: 'Coastal Region',
    regions: ['Mombasa', 'Kilifi', 'Kwale'],
    baseRate: 500,
    deliveryTime: '3-5',
    sameDayAvailable: false,
    sameDaySurcharge: 0,
    freeShippingThreshold: 5000,
    priority: 'normal',
    isActive: true,
  }
];

const ShippingZonesSettings = () => {
  const [shippingZones, setShippingZones] = useState(initialShippingZones);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newZone, setNewZone] = useState({
    name: '',
    regions: [],
    baseRate: 0,
    deliveryTime: '',
    sameDayAvailable: false,
    sameDaySurcharge: 0,
    freeShippingThreshold: 0,
    priority: 'normal',
    isActive: true,
  });
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const filteredZones = shippingZones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.regions.some(region => region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateZone = () => {
    const zone = {
      ...newZone,
      id: Date.now().toString(),
      regions: selectedRegions,
    };
    
    setShippingZones([...shippingZones, zone]);
    setIsCreateDialogOpen(false);
    setNewZone({
      name: '',
      regions: [],
      baseRate: 0,
      deliveryTime: '',
      sameDayAvailable: false,
      sameDaySurcharge: 0,
      freeShippingThreshold: 0,
      priority: 'normal',
      isActive: true,
    });
    setSelectedRegions([]);
    
    toast.success('Shipping zone created successfully');
  };

  const handleDeleteZone = (id: string) => {
    setShippingZones(shippingZones.filter(zone => zone.id !== id));
    toast.success('Shipping zone deleted successfully');
  };

  const handleToggleZoneStatus = (id: string) => {
    setShippingZones(shippingZones.map(zone => 
      zone.id === id ? { ...zone, isActive: !zone.isActive } : zone
    ));
    
    const zone = shippingZones.find(z => z.id === id);
    if (zone) {
      toast.success(`${zone.name} ${zone.isActive ? 'disabled' : 'enabled'} successfully`);
    }
  };

  const handleRegionSelect = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Shipping Zones</CardTitle>
              <CardDescription>
                Configure shipping zones, rates, and delivery options for different regions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search zones..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Zone
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Shipping Zone</DialogTitle>
                    <DialogDescription>
                      Add a new shipping zone with delivery options for specific regions
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="zoneName">Zone Name</Label>
                      <Input 
                        id="zoneName"
                        placeholder="e.g., Nairobi Metropolitan" 
                        value={newZone.name}
                        onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Regions</Label>
                      <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {kenyaCounties.map((county) => (
                            <div key={county} className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id={`county-${county}`}
                                checked={selectedRegions.includes(county)}
                                onChange={() => handleRegionSelect(county)}
                                className="rounded text-primary focus:ring-primary"
                              />
                              <Label htmlFor={`county-${county}`} className="cursor-pointer">
                                {county}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Selected: {selectedRegions.length} region(s)
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="baseRate">Base Shipping Rate (KES)</Label>
                        <Input 
                          id="baseRate"
                          type="number" 
                          placeholder="e.g., 200" 
                          value={newZone.baseRate}
                          onChange={(e) => setNewZone({...newZone, baseRate: Number(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deliveryTime">Delivery Time (days)</Label>
                        <Input 
                          id="deliveryTime"
                          placeholder="e.g., 1-2" 
                          value={newZone.deliveryTime}
                          onChange={(e) => setNewZone({...newZone, deliveryTime: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sameDayAvailable">Same Day Delivery Available</Label>
                      <Switch 
                        id="sameDayAvailable"
                        checked={newZone.sameDayAvailable}
                        onCheckedChange={(checked) => setNewZone({...newZone, sameDayAvailable: checked})}
                      />
                    </div>
                    
                    {newZone.sameDayAvailable && (
                      <div className="space-y-2">
                        <Label htmlFor="sameDaySurcharge">Same Day Delivery Surcharge (KES)</Label>
                        <Input 
                          id="sameDaySurcharge"
                          type="number" 
                          placeholder="e.g., 150" 
                          value={newZone.sameDaySurcharge}
                          onChange={(e) => setNewZone({...newZone, sameDaySurcharge: Number(e.target.value)})}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KES)</Label>
                      <Input 
                        id="freeShippingThreshold"
                        type="number" 
                        placeholder="e.g., 2000" 
                        value={newZone.freeShippingThreshold}
                        onChange={(e) => setNewZone({...newZone, freeShippingThreshold: Number(e.target.value)})}
                      />
                      <p className="text-xs text-muted-foreground">
                        Set to 0 for no free shipping option
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select 
                        value={newZone.priority}
                        onValueChange={(value) => setNewZone({...newZone, priority: value})}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateZone} disabled={!newZone.name || selectedRegions.length === 0}>
                      Create Zone
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Zone Name</TableHead>
                    <TableHead>Regions</TableHead>
                    <TableHead className="text-right">Base Rate (KES)</TableHead>
                    <TableHead className="text-center">Delivery Time (days)</TableHead>
                    <TableHead className="text-center">Same Day</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No shipping zones found. Create your first shipping zone.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredZones.map((zone) => (
                      <TableRow key={zone.id} className={!zone.isActive ? "opacity-60" : ""}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {zone.regions.slice(0, 2).map((region) => (
                              <span key={region} className="bg-muted px-2 py-1 rounded text-xs">
                                {region}
                              </span>
                            ))}
                            {zone.regions.length > 2 && (
                              <span className="bg-muted px-2 py-1 rounded text-xs">
                                +{zone.regions.length - 2} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{zone.baseRate.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{zone.deliveryTime}</TableCell>
                        <TableCell className="text-center">
                          {zone.sameDayAvailable ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                              Unavailable
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={zone.isActive} 
                            onCheckedChange={() => handleToggleZoneStatus(zone.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Zone
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteZone(zone.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Zone
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Shipping Options</CardTitle>
            <CardDescription>
              Configure additional shipping preferences and calculation methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weightBasedPricing">Weight-Based Price Adjustments</Label>
              <div className="flex items-center gap-4">
                <Switch id="weightBasedPricing" />
                <p className="text-sm text-muted-foreground">
                  Enable additional charges based on product weight
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distanceCalculation">Distance Calculation</Label>
              <div className="flex items-center gap-4">
                <Switch id="distanceCalculation" />
                <p className="text-sm text-muted-foreground">
                  Calculate shipping cost based on actual delivery distance
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialHandling">Special Handling Fees</Label>
              <div className="flex items-center gap-4">
                <Switch id="specialHandling" />
                <p className="text-sm text-muted-foreground">
                  Apply additional fees for fragile or bulky items
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="holidaySurcharge">Holiday/Weekend Surcharge</Label>
              <div className="flex items-center gap-4">
                <Switch id="holidaySurcharge" />
                <p className="text-sm text-muted-foreground">
                  Apply surcharge for deliveries on holidays and weekends
                </p>
              </div>
            </div>
            
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Advanced Options
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Zone Visualization</CardTitle>
            <CardDescription>
              View shipping zones on a map of Kenya
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center border-2 border-dashed rounded-md">
            <div className="text-center">
              <Map className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Map visualization coming soon</p>
              <Button variant="outline" className="mt-4">
                <Filter className="mr-2 h-4 w-4" />
                Toggle Zone Display
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingZonesSettings;
