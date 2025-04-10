
import { useState, useEffect } from 'react';
import { Camera, Menu, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import OfflineDeliveryNotice from './OfflineDeliveryNotice';
import DeliveryScanner from '@/components/barcode/DeliveryScanner';
import DeliveryList from './delivery/DeliveryList';
import DeliveryDetail from './delivery/DeliveryDetail';
import DeliverySidebar from './delivery/DeliverySidebar';
import { mockDeliveries, DeliveryType } from '@/types/delivery';

const MobileDeliveryApp = () => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle delivery selection
  const handleDeliverySelect = (delivery: DeliveryType) => {
    setSelectedDelivery(delivery);
  };
  
  // Handle back button click
  const handleBack = () => {
    setSelectedDelivery(null);
    setIsScanning(false);
  };
  
  // Handle barcode scan
  const handleScan = (data: string) => {
    console.log('Scanned barcode:', data);
    setIsScanning(false);
    // In a real app, we would validate the barcode and update the delivery status
  };
  
  // Handle scan button click
  const handleScanClick = () => {
    setIsScanning(true);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Side effect to ensure proper layout on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen, isMobile]);
  
  // If scanning, show scanner component
  if (isScanning) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-background p-4 flex items-center shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setIsScanning(false)}>
            <Clock className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium ml-2">Scan Barcode</h1>
        </div>
        <div className="flex-1">
          <DeliveryScanner onScan={handleScan} />
        </div>
      </div>
    );
  }
  
  // If delivery detail view is active
  if (selectedDelivery) {
    return <DeliveryDetail 
      delivery={selectedDelivery} 
      onBack={handleBack} 
      onScanClick={handleScanClick} 
    />;
  }
  
  // Main delivery list view
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile header */}
      <div className="bg-background p-4 flex justify-between items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Deliveries</h1>
        <Button variant="ghost" size="icon" onClick={handleScanClick}>
          <Camera className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile sidebar */}
      <DeliverySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 overflow-auto p-4">
        <OfflineDeliveryNotice className="mb-4" />
        
        <DeliveryList 
          deliveries={mockDeliveries}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onDeliverySelect={handleDeliverySelect}
        />
      </div>
      
      <div className="p-4 border-t grid grid-cols-2 gap-2">
        <Button onClick={handleScanClick}>
          <Camera className="h-4 w-4 mr-2" />
          Scan Barcode
        </Button>
        <Button variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </div>
    </div>
  );
};

export default MobileDeliveryApp;
