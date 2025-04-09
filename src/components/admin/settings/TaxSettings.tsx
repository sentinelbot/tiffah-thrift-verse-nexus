
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertCircle,
  Percent,
  Calculator,
  FileText,
  Check,
  Download,
  Plus,
  Edit,
  Trash2,
  Info,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

// Tax categories for different product types
const taxCategories = [
  { id: '1', name: 'Standard Rate', rate: 16, description: 'General goods and services' },
  { id: '2', name: 'Zero Rated', rate: 0, description: 'Essential goods and exports' },
  { id: '3', name: 'Exempt', rate: 0, description: 'Items exempt from VAT' },
  { id: '4', name: 'Digital Services', rate: 16, description: 'Online services and digital products' }
];

const TaxSettings = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [taxConfig, setTaxConfig] = useState({
    vatRate: 16,
    calculationMethod: 'inclusive',
    roundingRule: 'nearest',
    defaultRegion: 'Kenya',
    displayInCheckout: true,
    separateTaxLine: true,
    enableExemptions: true
  });
  
  const [categories, setCategories] = useState(taxCategories);
  
  const handleSaveBasicSettings = () => {
    toast.loading('Saving tax settings...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Tax settings saved successfully');
    }, 1500);
  };
  
  const handleSaveTaxCategories = () => {
    toast.loading('Saving tax categories...');
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Tax categories saved successfully');
    }, 1500);
  };
  
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    toast.success('Tax category deleted');
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="categories">Tax Categories</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Tax Settings</CardTitle>
              <CardDescription>
                Configure how taxes are calculated and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vat-rate">VAT Rate (%)</Label>
                    <div className="relative">
                      <Input 
                        id="vat-rate"
                        type="number" 
                        value={taxConfig.vatRate}
                        onChange={(e) => setTaxConfig({...taxConfig, vatRate: Number(e.target.value)})}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current standard VAT rate in Kenya (16%)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="calculation-method">Tax Calculation Method</Label>
                    <Select 
                      value={taxConfig.calculationMethod}
                      onValueChange={(value) => setTaxConfig({...taxConfig, calculationMethod: value})}
                    >
                      <SelectTrigger id="calculation-method">
                        <SelectValue placeholder="Select calculation method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inclusive">Tax Inclusive (Prices include tax)</SelectItem>
                        <SelectItem value="exclusive">Tax Exclusive (Tax added at checkout)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {taxConfig.calculationMethod === 'inclusive' 
                        ? 'Prices shown to customers already include tax' 
                        : 'Tax will be added to prices at checkout'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rounding-rule">Tax Rounding Rule</Label>
                    <Select 
                      value={taxConfig.roundingRule}
                      onValueChange={(value) => setTaxConfig({...taxConfig, roundingRule: value})}
                    >
                      <SelectTrigger id="rounding-rule">
                        <SelectValue placeholder="Select rounding rule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nearest">Round to nearest</SelectItem>
                        <SelectItem value="up">Always round up</SelectItem>
                        <SelectItem value="down">Always round down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-region">Default Tax Region</Label>
                    <Select 
                      value={taxConfig.defaultRegion}
                      onValueChange={(value) => setTaxConfig({...taxConfig, defaultRegion: value})}
                    >
                      <SelectTrigger id="default-region">
                        <SelectValue placeholder="Select default region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="EastAfrica">East Africa</SelectItem>
                        <SelectItem value="International">International</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Default region for tax calculations
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="display-tax">Display Tax in Checkout</Label>
                        <p className="text-xs text-muted-foreground">
                          Show tax calculations during checkout process
                        </p>
                      </div>
                      <Switch 
                        id="display-tax"
                        checked={taxConfig.displayInCheckout}
                        onCheckedChange={(checked) => setTaxConfig({...taxConfig, displayInCheckout: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="separate-tax-line">Show Tax as Separate Line</Label>
                        <p className="text-xs text-muted-foreground">
                          Display tax as a separate line item in cart and orders
                        </p>
                      </div>
                      <Switch 
                        id="separate-tax-line"
                        checked={taxConfig.separateTaxLine}
                        onCheckedChange={(checked) => setTaxConfig({...taxConfig, separateTaxLine: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-exemptions">Enable Tax Exemptions</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow for tax-exempt products and customers
                        </p>
                      </div>
                      <Switch 
                        id="enable-exemptions"
                        checked={taxConfig.enableExemptions}
                        onCheckedChange={(checked) => setTaxConfig({...taxConfig, enableExemptions: checked})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSaveBasicSettings}>
                Save Basic Tax Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tax Display Options</CardTitle>
              <CardDescription>
                Configure how taxes are displayed to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tax-label">Tax Label</Label>
                <Input 
                  id="tax-label"
                  defaultValue="VAT (16%)" 
                  placeholder="e.g., VAT, Tax, GST"
                />
                <p className="text-xs text-muted-foreground">
                  Label shown to customers for tax charges
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price-display">Price Display Format</Label>
                <Select defaultValue="taxIncluded">
                  <SelectTrigger id="price-display">
                    <SelectValue placeholder="Select price display format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taxIncluded">KSh 1,160 (incl. VAT)</SelectItem>
                    <SelectItem value="taxExcluded">KSh 1,000 + KSh 160 VAT</SelectItem>
                    <SelectItem value="bothPrices">KSh 1,000 (KSh 1,160 incl. VAT)</SelectItem>
                    <SelectItem value="noTaxInfo">KSh 1,160</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How prices and tax information are displayed on product pages
                </p>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-zero-tax">Show Zero Tax Items</Label>
                  <Switch id="show-zero-tax" defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="tax-breakdown">Show Tax Breakdown</Label>
                  <Switch id="tax-breakdown" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>
                Save Display Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Tax Categories</CardTitle>
                  <CardDescription>
                    Manage tax categories for different product types
                  </CardDescription>
                </div>
                <Button className="md:self-end">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead className="text-right">Tax Rate (%)</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">{category.rate}%</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSaveTaxCategories}>
                Save Tax Categories
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product-Specific Tax Rules</CardTitle>
              <CardDescription>
                Configure tax settings for specific product types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Clothing & Accessories</p>
                    <p className="text-sm text-muted-foreground">Standard rate (16%)</p>
                  </div>
                  <Select defaultValue="standard">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select tax category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rate (16%)</SelectItem>
                      <SelectItem value="zero">Zero Rated (0%)</SelectItem>
                      <SelectItem value="exempt">Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Books & Educational Materials</p>
                    <p className="text-sm text-muted-foreground">Zero rated (0%)</p>
                  </div>
                  <Select defaultValue="zero">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select tax category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rate (16%)</SelectItem>
                      <SelectItem value="zero">Zero Rated (0%)</SelectItem>
                      <SelectItem value="exempt">Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Electronics & Gadgets</p>
                    <p className="text-sm text-muted-foreground">Standard rate (16%)</p>
                  </div>
                  <Select defaultValue="standard">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select tax category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rate (16%)</SelectItem>
                      <SelectItem value="zero">Zero Rated (0%)</SelectItem>
                      <SelectItem value="exempt">Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Digital Services</p>
                    <p className="text-sm text-muted-foreground">Digital services tax (16%)</p>
                  </div>
                  <Select defaultValue="digital">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select tax category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rate (16%)</SelectItem>
                      <SelectItem value="digital">Digital Services (16%)</SelectItem>
                      <SelectItem value="zero">Zero Rated (0%)</SelectItem>
                      <SelectItem value="exempt">Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>
                Save Product Tax Rules
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Reporting</CardTitle>
              <CardDescription>
                Generate tax reports for accounting and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Report Period</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                      <Input 
                        id="start-date"
                        type="date" 
                        defaultValue="2023-01-01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date" className="text-xs">End Date</Label>
                      <Input 
                        id="end-date"
                        type="date" 
                        defaultValue="2023-03-31"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select defaultValue="summary">
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Tax Summary</SelectItem>
                        <SelectItem value="detailed">Detailed Tax Report</SelectItem>
                        <SelectItem value="vat">VAT Return Report</SelectItem>
                        <SelectItem value="category">Tax by Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Calculator className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Q1 2023 Tax Summary
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm">Taxable Sales (16%)</span>
                      <span className="text-sm font-medium">KSh 842,560</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm">Zero Rated Sales</span>
                      <span className="text-sm font-medium">KSh 124,800</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm">Exempt Sales</span>
                      <span className="text-sm font-medium">KSh 36,450</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm font-medium">Total Sales</span>
                      <span className="text-sm font-medium">KSh 1,003,810</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm font-medium">Output VAT (Collected)</span>
                      <span className="text-sm font-medium">KSh 134,810</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm">Input VAT (Paid)</span>
                      <span className="text-sm font-medium">KSh 52,640</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-base font-bold">VAT Payable</span>
                      <span className="text-base font-bold">KSh 82,170</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download KRA-Compatible Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historical Tax Rates</CardTitle>
              <CardDescription>
                Track changes to tax rates over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead>Effective From</TableHead>
                      <TableHead>Effective To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">16%</TableCell>
                      <TableCell>Jan 1, 2023</TableCell>
                      <TableCell>Present</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Current
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">14%</TableCell>
                      <TableCell>Apr 1, 2020</TableCell>
                      <TableCell>Dec 31, 2022</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          Historical
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">16%</TableCell>
                      <TableCell>Sep 1, 2016</TableCell>
                      <TableCell>Mar 31, 2020</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          Historical
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>KRA Compliance</CardTitle>
              <CardDescription>
                Kenya Revenue Authority compliance settings and verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="kra-pin">KRA PIN</Label>
                    <Input 
                      id="kra-pin"
                      placeholder="e.g., A012345678Z" 
                      defaultValue="P051234567Q"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your business Kenya Revenue Authority PIN
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-reg-number">VAT Registration Number</Label>
                    <Input 
                      id="tax-reg-number"
                      placeholder="e.g., 0123456789" 
                      defaultValue="0123456789"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-filing-frequency">Tax Filing Frequency</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="tax-filing-frequency">
                        <SelectValue placeholder="Select filing frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button>
                      Verify KRA PIN
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="etr-compliance">Electronic Tax Register Compliance</Label>
                    <Select defaultValue="compliant">
                      <SelectTrigger id="etr-compliance">
                        <SelectValue placeholder="Select ETR status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="exempt">Exempt</SelectItem>
                        <SelectItem value="pending">Pending Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="etr-number">ETR Serial Number</Label>
                    <Input 
                      id="etr-number"
                      placeholder="e.g., ETR123456789" 
                      defaultValue="ETR987654321"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="digital-receipts">Digital Receipts</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable KRA-compliant digital receipts
                      </p>
                    </div>
                    <Switch id="digital-receipts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="tax-alerts">Tax Filing Reminders</Label>
                      <p className="text-xs text-muted-foreground">
                        Get reminded of upcoming tax filing deadlines
                      </p>
                    </div>
                    <Switch id="tax-alerts" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button>
                Save Compliance Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tax Regulation Updates</CardTitle>
              <CardDescription>
                Stay informed about changes to tax regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950 p-4 rounded-r-md">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Digital Service Tax Rate Update</p>
                    <p className="text-sm text-muted-foreground">
                      Effective July 1, 2023, the Digital Service Tax rate remains at 1.5% of gross transaction value.
                    </p>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mt-2">
                      Action needed: No changes required.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950 p-4 rounded-r-md">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">New KRA Electronic Invoicing Requirements</p>
                    <p className="text-sm text-muted-foreground">
                      Starting January 1, 2024, all VAT-registered businesses must comply with the new electronic invoicing system.
                    </p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                      Action needed: Update your receipt format by December 31, 2023.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-green-400 bg-green-50 dark:bg-green-950 p-4 rounded-r-md">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Standard VAT Rate Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      The 2023 Finance Act has maintained the standard VAT rate at 16% with no changes to the main categories.
                    </p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                      Action needed: None, your settings are up to date.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Notification Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxSettings;
