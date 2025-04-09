
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TabItem, 
  TabValue, 
  TabOffset, 
  TabIndicator, 
  TabList 
} from '@/components/ui/tab';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Layout, 
  Image as ImageIcon, 
  FileText, 
  Link as LinkIcon, 
  Globe, 
  Phone, 
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Trash2,
  PlusCircle,
  Save,
  Eye,
  Clock,
  ArrowUpDown,
  Calendar
} from 'lucide-react';

// Mock data for hero carousel
const mockHeroItems = [
  {
    id: 'hero1',
    title: 'New Arrivals',
    subtitle: 'Discover our latest vintage collection',
    buttonText: 'Shop Now',
    buttonUrl: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=1920&auto=format&fit=crop',
    active: true,
    scheduledStart: '2023-04-01',
    scheduledEnd: '2023-04-30'
  },
  {
    id: 'hero2',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off selected items',
    buttonText: 'View Offers',
    buttonUrl: '/sale',
    imageUrl: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=1920&auto=format&fit=crop',
    active: true,
    scheduledStart: '2023-04-15',
    scheduledEnd: '2023-05-15'
  },
  {
    id: 'hero3',
    title: 'Sustainable Fashion',
    subtitle: 'Eco-friendly choices for a better future',
    buttonText: 'Learn More',
    buttonUrl: '/sustainable',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1920&auto=format&fit=crop',
    active: false,
    scheduledStart: '2023-05-01',
    scheduledEnd: '2023-05-31'
  }
];

// Mock data for contact information
const mockContact = {
  email: 'info@tiffahthrift.co.ke',
  phone: '+254712345678',
  address: '123 Nairobi Way, Karen, Nairobi',
  storeHours: 'Monday - Saturday: 9am - 6pm\nSunday: 10am - 4pm',
  mapLocation: '-1.300701, 36.810555',
  googleMapsLink: 'https://goo.gl/maps/exampleTiffahThrift'
};

// Mock data for social media
const mockSocial = {
  instagram: 'tiffahthrift',
  facebook: 'TiffahThriftStore',
  twitter: 'TiffahThrift',
  youtube: 'TiffahThriftChannel',
  pinterest: 'TiffahThrift'
};

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [heroItems, setHeroItems] = useState(mockHeroItems);
  const [selectedHeroItem, setSelectedHeroItem] = useState(heroItems[0]);
  const [contactInfo, setContactInfo] = useState(mockContact);
  const [socialMedia, setSocialMedia] = useState(mockSocial);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveHero = () => {
    setIsSaving(true);
    
    // Update the hero item in the list
    setHeroItems(prev => prev.map(item => 
      item.id === selectedHeroItem.id ? selectedHeroItem : item
    ));
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Hero section saved successfully');
    }, 1000);
  };
  
  const handleAddHero = () => {
    const newItem = {
      id: `hero${Date.now()}`,
      title: 'New Banner',
      subtitle: 'Banner subtitle',
      buttonText: 'Click Here',
      buttonUrl: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=1920&auto=format&fit=crop',
      active: false,
      scheduledStart: new Date().toISOString().split('T')[0],
      scheduledEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setHeroItems(prev => [...prev, newItem]);
    setSelectedHeroItem(newItem);
  };
  
  const handleDeleteHero = (id: string) => {
    setHeroItems(prev => prev.filter(item => item.id !== id));
    
    // If we deleted the selected item, select the first one
    if (selectedHeroItem.id === id) {
      if (heroItems.length > 1) {
        const remaining = heroItems.filter(item => item.id !== id);
        setSelectedHeroItem(remaining[0]);
      } else {
        // If there are no items left, create a new one
        handleAddHero();
      }
    }
    
    toast.success('Hero banner deleted');
  };
  
  const handleSaveContact = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Contact information saved successfully');
    }, 1000);
  };
  
  const handleSaveSocial = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Social media information saved successfully');
    }, 1000);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">
              Manage your website content and appearance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Info
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Hero Banners
                    <Button size="sm" variant="ghost" onClick={handleAddHero}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Manage your homepage hero carousel
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {heroItems.map((item) => (
                      <div 
                        key={item.id}
                        className={`flex items-center justify-between p-3 cursor-pointer ${
                          selectedHeroItem.id === item.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                        }`}
                        onClick={() => setSelectedHeroItem(item)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.scheduledStart).toLocaleDateString()} - {new Date(item.scheduledEnd).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.active ? (
                            <Badge variant="outline" className="bg-green-500/20 text-green-500">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-500/20 text-gray-400">Inactive</Badge>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHero(item.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Edit Hero Banner</CardTitle>
                  <CardDescription>
                    Customize the selected hero banner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={selectedHeroItem.title}
                      onChange={(e) => setSelectedHeroItem(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input 
                      id="subtitle" 
                      value={selectedHeroItem.subtitle}
                      onChange={(e) => setSelectedHeroItem(prev => ({ ...prev, subtitle: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buttonText">Button Text</Label>
                      <Input 
                        id="buttonText" 
                        value={selectedHeroItem.buttonText}
                        onChange={(e) => setSelectedHeroItem(prev => ({ ...prev, buttonText: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buttonUrl">Button URL</Label>
                      <Input 
                        id="buttonUrl" 
                        value={selectedHeroItem.buttonUrl}
                        onChange={(e) => setSelectedHeroItem(prev => ({ ...prev, buttonUrl: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="imageUrl" 
                        value={selectedHeroItem.imageUrl}
                        onChange={(e) => setSelectedHeroItem(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="flex-1"
                      />
                      <Button variant="outline">Browse</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 space-y-3">
                    <div className="aspect-[21/9] bg-gray-800 rounded-md overflow-hidden relative">
                      <img 
                        src={selectedHeroItem.imageUrl} 
                        alt="Hero preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
                        <h2 className="text-2xl font-bold mb-2">{selectedHeroItem.title}</h2>
                        <p className="mb-4">{selectedHeroItem.subtitle}</p>
                        <div className="inline-block bg-primary text-white px-4 py-2 rounded">
                          {selectedHeroItem.buttonText}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Preview (approximate)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledStart">Start Date</Label>
                      <Input 
                        id="scheduledStart" 
                        type="date"
                        value={selectedHeroItem.scheduledStart}
                        onChange={(e) => setSelectedHeroItem(prev => ({ ...prev, scheduledStart: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledEnd">End Date</Label>
                      <Input 
                        id="scheduledEnd" 
                        type="date"
                        value={selectedHeroItem.scheduledEnd}
                        onChange={(e) => setSelectedHeroItem(prev => ({ ...prev, scheduledEnd: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="active" 
                      checked={selectedHeroItem.active}
                      onCheckedChange={(checked) => setSelectedHeroItem(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedHeroItem(heroItems.find(item => item.id === selectedHeroItem.id) || heroItems[0])}>
                    Reset Changes
                  </Button>
                  <Button onClick={handleSaveHero} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Banner'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Update your store's contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Store Address</Label>
                  <Textarea 
                    id="address" 
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeHours">Store Hours</Label>
                  <Textarea 
                    id="storeHours" 
                    value={contactInfo.storeHours}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, storeHours: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mapLocation">Map Coordinates</Label>
                  <Input 
                    id="mapLocation" 
                    value={contactInfo.mapLocation}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, mapLocation: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: latitude, longitude (e.g., -1.300701, 36.810555)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="googleMapsLink">Google Maps Link</Label>
                  <Input 
                    id="googleMapsLink" 
                    value={contactInfo.googleMapsLink}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, googleMapsLink: e.target.value }))}
                  />
                </div>
                
                <div className="border rounded-md p-4 bg-gray-800/50">
                  <h3 className="font-medium mb-2">Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">Address</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">{contactInfo.address}</p>
                      
                      <div className="flex items-center gap-2 mt-4 mb-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="font-medium">Contact</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">{contactInfo.phone}</p>
                      <p className="text-sm text-muted-foreground pl-6">{contactInfo.email}</p>
                      
                      <div className="flex items-center gap-2 mt-4 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Hours</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6 whitespace-pre-line">{contactInfo.storeHours}</p>
                    </div>
                    <div className="aspect-video bg-gray-700 rounded-md flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto" onClick={handleSaveContact} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Contact Information'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Connect your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#E1306C]/20 flex items-center justify-center mr-4">
                      <Instagram className="h-5 w-5 text-[#E1306C]" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="instagram">Instagram Username</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          @
                        </span>
                        <Input 
                          id="instagram" 
                          value={socialMedia.instagram}
                          onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram: e.target.value }))}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center mr-4">
                      <Facebook className="h-5 w-5 text-[#1877F2]" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="facebook">Facebook Page Name</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          facebook.com/
                        </span>
                        <Input 
                          id="facebook" 
                          value={socialMedia.facebook}
                          onChange={(e) => setSocialMedia(prev => ({ ...prev, facebook: e.target.value }))}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center mr-4">
                      <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="twitter">Twitter Username</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          @
                        </span>
                        <Input 
                          id="twitter" 
                          value={socialMedia.twitter}
                          onChange={(e) => setSocialMedia(prev => ({ ...prev, twitter: e.target.value }))}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#FF0000]/20 flex items-center justify-center mr-4">
                      <svg
                        className="h-5 w-5 text-[#FF0000]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="youtube">YouTube Channel</Label>
                      <Input 
                        id="youtube" 
                        value={socialMedia.youtube}
                        onChange={(e) => setSocialMedia(prev => ({ ...prev, youtube: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#E60023]/20 flex items-center justify-center mr-4">
                      <svg
                        className="h-5 w-5 text-[#E60023]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 12a4 4 0 1 1 8 0c0 5 4 6 4 6H4s4-1 4-6Z" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="pinterest">Pinterest Username</Label>
                      <Input 
                        id="pinterest" 
                        value={socialMedia.pinterest}
                        onChange={(e) => setSocialMedia(prev => ({ ...prev, pinterest: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 mt-6 bg-gray-800/50">
                  <h3 className="font-medium mb-4">Social Media Preview</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <a href={`https://instagram.com/${socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#E1306C]/20 flex items-center justify-center hover:bg-[#E1306C]/30 transition-colors">
                      <Instagram className="h-6 w-6 text-[#E1306C]" />
                    </a>
                    <a href={`https://facebook.com/${socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2]/20 flex items-center justify-center hover:bg-[#1877F2]/30 transition-colors">
                      <Facebook className="h-6 w-6 text-[#1877F2]" />
                    </a>
                    <a href={`https://twitter.com/${socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center hover:bg-[#1DA1F2]/30 transition-colors">
                      <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                    </a>
                    <a href={`https://youtube.com/c/${socialMedia.youtube}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#FF0000]/20 flex items-center justify-center hover:bg-[#FF0000]/30 transition-colors">
                      <svg
                        className="h-6 w-6 text-[#FF0000]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                      </svg>
                    </a>
                    <a href={`https://pinterest.com/${socialMedia.pinterest}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#E60023]/20 flex items-center justify-center hover:bg-[#E60023]/30 transition-colors">
                      <svg
                        className="h-6 w-6 text-[#E60023]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 12a4 4 0 1 1 8 0c0 5 4 6 4 6H4s4-1 4-6Z" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto" onClick={handleSaveSocial} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Social Media'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pages" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Page Management</CardTitle>
                <CardDescription>
                  Edit website pages and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="about">
                    <AccordionTrigger>About Us Page</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">Edit your about us page content and images.</p>
                      <Button>Edit Page</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq">
                    <AccordionTrigger>FAQ Page</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">Manage frequently asked questions and answers.</p>
                      <Button>Edit FAQs</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="terms">
                    <AccordionTrigger>Terms & Conditions</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">Update your terms and conditions page.</p>
                      <Button>Edit Terms</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="privacy">
                    <AccordionTrigger>Privacy Policy</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">Update your privacy policy page.</p>
                      <Button>Edit Policy</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="shipping">
                    <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">Manage shipping and return policy information.</p>
                      <Button>Edit Policy</Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-8 p-6 border rounded-md bg-gray-800/30 text-center">
                  <h3 className="text-lg font-medium mb-2">Advanced Page Editor</h3>
                  <p className="text-muted-foreground mb-4">
                    Create custom pages with our advanced page builder
                  </p>
                  <Button>Launch Page Builder</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
