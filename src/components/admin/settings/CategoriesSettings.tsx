
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
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
  Layers, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2,
  ImagePlus,
  Eye,
  BarChart3,
  Tag,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  FileText,
  CheckCircle2,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

// Sample categories for demonstration
const initialCategories = [
  {
    id: '1',
    name: 'Clothing',
    slug: 'clothing',
    description: 'All types of second-hand clothing items',
    parentId: null,
    imageUrl: '/placeholder.svg',
    productCount: 120,
    featured: true,
    visible: true,
    sortOrder: 1
  },
  {
    id: '2',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Bags, jewelry, watches, and more',
    parentId: null,
    imageUrl: '/placeholder.svg',
    productCount: 64,
    featured: true,
    visible: true,
    sortOrder: 2
  },
  {
    id: '3',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Footwear for all occasions',
    parentId: null,
    imageUrl: '/placeholder.svg',
    productCount: 48,
    featured: false,
    visible: true,
    sortOrder: 3
  },
  {
    id: '4',
    name: 'Women\'s Clothing',
    slug: 'womens-clothing',
    description: 'Clothing items for women',
    parentId: '1',
    imageUrl: '/placeholder.svg',
    productCount: 75,
    featured: false,
    visible: true,
    sortOrder: 1
  },
  {
    id: '5',
    name: 'Men\'s Clothing',
    slug: 'mens-clothing',
    description: 'Clothing items for men',
    parentId: '1',
    imageUrl: '/placeholder.svg',
    productCount: 45,
    featured: false,
    visible: true,
    sortOrder: 2
  }
];

const CategoriesSettings = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    featured: false,
    visible: true
  });
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const parentCategories = categories.filter(category => category.parentId === null);
  
  const getSubcategories = (parentId: string) => {
    return categories.filter(category => category.parentId === parentId);
  };
  
  const handleCreateCategory = () => {
    const category = {
      ...newCategory,
      id: Date.now().toString(),
      imageUrl: '/placeholder.svg',
      productCount: 0,
      sortOrder: parentCategories.length + 1
    };
    
    setCategories([...categories, category]);
    setIsCreateDialogOpen(false);
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      parentId: '',
      featured: false,
      visible: true
    });
    
    toast.success('Category created successfully');
  };
  
  const handleDeleteCategory = (id: string) => {
    // Check if category has subcategories
    const hasSubcategories = categories.some(category => category.parentId === id);
    
    if (hasSubcategories) {
      toast.error('Cannot delete category with subcategories');
      return;
    }
    
    setCategories(categories.filter(category => category.id !== id));
    toast.success('Category deleted successfully');
  };
  
  const handleToggleFeatured = (id: string) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, featured: !category.featured } : category
    ));
    
    const category = categories.find(c => c.id === id);
    if (category) {
      toast.success(`${category.name} ${category.featured ? 'removed from' : 'added to'} featured categories`);
    }
  };
  
  const handleToggleVisibility = (id: string) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, visible: !category.visible } : category
    ));
    
    const category = categories.find(c => c.id === id);
    if (category) {
      toast.success(`${category.name} is now ${category.visible ? 'hidden' : 'visible'}`);
    }
  };
  
  const handleGenerateSlug = () => {
    if (newCategory.name) {
      const slug = newCategory.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setNewCategory({...newCategory, slug});
    }
  };
  
  const handleMoveCategory = (id: string, direction: 'up' | 'down') => {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    const sameLevel = categories.filter(c => c.parentId === category.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    
    const currentIndex = sameLevel.findIndex(c => c.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === sameLevel.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetCategory = sameLevel[newIndex];
    
    setCategories(categories.map(c => {
      if (c.id === id) {
        return { ...c, sortOrder: targetCategory.sortOrder };
      }
      if (c.id === targetCategory.id) {
        return { ...c, sortOrder: category.sortOrder };
      }
      return c;
    }));
    
    toast.success(`${category.name} moved ${direction}`);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Manage product categories and their hierarchy
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search categories..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>
                      Add a new product category to organize your inventory
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input 
                        id="categoryName"
                        placeholder="e.g., Winter Accessories" 
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="categorySlug">URL Slug</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleGenerateSlug}
                          disabled={!newCategory.name}
                        >
                          Generate
                        </Button>
                      </div>
                      <Input 
                        id="categorySlug"
                        placeholder="e.g., winter-accessories" 
                        value={newCategory.slug}
                        onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">
                        The URL-friendly version of the name. Used in category URLs.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea 
                        id="categoryDescription"
                        rows={3}
                        placeholder="Brief description of the category" 
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parentCategory">Parent Category</Label>
                      <Select 
                        value={newCategory.parentId}
                        onValueChange={(value) => setNewCategory({...newCategory, parentId: value})}
                      >
                        <SelectTrigger id="parentCategory">
                          <SelectValue placeholder="None (Top Level Category)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None (Top Level Category)</SelectItem>
                          {parentCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Leave empty to create a top-level category
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categoryImage">Category Image</Label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <div className="text-sm text-muted-foreground mb-2">
                          Drag & drop an image here, or click to browse
                        </div>
                        <Button variant="outline" size="sm">
                          Upload Image
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 800x600px, max size: 2MB
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="space-y-0.5">
                          <Label htmlFor="featured-status">Featured Category</Label>
                          <p className="text-xs text-muted-foreground">
                            Show on homepage and highlight across site
                          </p>
                        </div>
                        <Switch 
                          id="featured-status"
                          checked={newCategory.featured}
                          onCheckedChange={(checked) => setNewCategory({...newCategory, featured: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div className="space-y-0.5">
                          <Label htmlFor="visibility-status">Visible</Label>
                          <p className="text-xs text-muted-foreground">
                            Show category in navigation menus
                          </p>
                        </div>
                        <Switch 
                          id="visibility-status"
                          checked={newCategory.visible}
                          onCheckedChange={(checked) => setNewCategory({...newCategory, visible: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={handleCreateCategory} 
                      disabled={!newCategory.name || !newCategory.slug}
                    >
                      Create Category
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
                    <TableHead className="w-[250px]">Category Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Products</TableHead>
                    <TableHead className="text-center">Featured</TableHead>
                    <TableHead className="text-center">Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No categories found. Create your first category.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {parentCategories
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .filter(category => 
                          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((category) => (
                        <React.Fragment key={category.id}>
                          <TableRow className={!category.visible ? "opacity-60" : ""}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span>{category.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-md truncate">{category.description}</TableCell>
                            <TableCell className="text-center">{category.productCount}</TableCell>
                            <TableCell className="text-center">
                              <Switch 
                                checked={category.featured}
                                onCheckedChange={() => handleToggleFeatured(category.id)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch 
                                checked={category.visible}
                                onCheckedChange={() => handleToggleVisibility(category.id)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  disabled={parentCategories.findIndex(c => c.id === category.id) === 0}
                                  onClick={() => handleMoveCategory(category.id, 'up')}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                  <span className="sr-only">Move Up</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  disabled={parentCategories.findIndex(c => c.id === category.id) === parentCategories.length - 1}
                                  onClick={() => handleMoveCategory(category.id, 'down')}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                  <span className="sr-only">Move Down</span>
                                </Button>
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
                                      Edit Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Category
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Subcategories */}
                          {getSubcategories(category.id)
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .filter(subcategory => 
                              subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              subcategory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              searchTerm === '' // Show all subcategories if parent is visible
                            )
                            .map((subcategory) => (
                            <TableRow 
                              key={subcategory.id} 
                              className={(!subcategory.visible || !category.visible) ? "opacity-60" : ""}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2 pl-6">
                                  <Tag className="h-4 w-4 text-muted-foreground" />
                                  <span>{subcategory.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-md truncate">{subcategory.description}</TableCell>
                              <TableCell className="text-center">{subcategory.productCount}</TableCell>
                              <TableCell className="text-center">
                                <Switch 
                                  checked={subcategory.featured}
                                  onCheckedChange={() => handleToggleFeatured(subcategory.id)}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Switch 
                                  checked={subcategory.visible}
                                  onCheckedChange={() => handleToggleVisibility(subcategory.id)}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    disabled={getSubcategories(category.id).findIndex(c => c.id === subcategory.id) === 0}
                                    onClick={() => handleMoveCategory(subcategory.id, 'up')}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                    <span className="sr-only">Move Up</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    disabled={getSubcategories(category.id).findIndex(c => c.id === subcategory.id) === getSubcategories(category.id).length - 1}
                                    onClick={() => handleMoveCategory(subcategory.id, 'down')}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                    <span className="sr-only">Move Down</span>
                                  </Button>
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
                                        Edit Category
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDeleteCategory(subcategory.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Category
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </>
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
            <CardTitle>Category Display Options</CardTitle>
            <CardDescription>
              Configure how categories are displayed on the website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="homepage-categories">Homepage Categories</Label>
              <Select defaultValue="featured">
                <SelectTrigger id="homepage-categories">
                  <SelectValue placeholder="Select categories to display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured Categories Only</SelectItem>
                  <SelectItem value="all">All Top-Level Categories</SelectItem>
                  <SelectItem value="selected">Selected Categories</SelectItem>
                  <SelectItem value="none">Don't Show Categories</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Which categories to display on the homepage
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-display-style">Category Display Style</Label>
              <Select defaultValue="grid">
                <SelectTrigger id="category-display-style">
                  <SelectValue placeholder="Select display style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="list">List Layout</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categories-per-row">Categories Per Row</Label>
              <Select defaultValue="4">
                <SelectTrigger id="categories-per-row">
                  <SelectValue placeholder="Select number of categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Categories</SelectItem>
                  <SelectItem value="3">3 Categories</SelectItem>
                  <SelectItem value="4">4 Categories</SelectItem>
                  <SelectItem value="6">6 Categories</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Number of categories to display per row (desktop view)
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-category-image">Show Category Images</Label>
                <p className="text-xs text-muted-foreground">
                  Display category images in category listings
                </p>
              </div>
              <Switch id="show-category-image" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-product-count">Show Product Count</Label>
                <p className="text-xs text-muted-foreground">
                  Display number of products in each category
                </p>
              </div>
              <Switch id="show-product-count" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-subcategories">Show Subcategories</Label>
                <p className="text-xs text-muted-foreground">
                  Display subcategories under parent categories
                </p>
              </div>
              <Switch id="show-subcategories" defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button>
              Save Display Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Analytics</CardTitle>
            <CardDescription>
              View performance metrics for your product categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Most Visited Category</p>
                    <p className="text-sm text-muted-foreground">Women's Clothing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">1,245</p>
                  <p className="text-sm text-muted-foreground">visits this month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Highest Converting</p>
                    <p className="text-sm text-muted-foreground">Accessories</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">8.2%</p>
                  <p className="text-sm text-muted-foreground">conversion rate</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Needs Attention</p>
                    <p className="text-sm text-muted-foreground">Men's Shoes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">-12%</p>
                  <p className="text-sm text-muted-foreground">traffic decrease</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Best Stocked</p>
                    <p className="text-sm text-muted-foreground">Women's Clothing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">120 items</p>
                  <p className="text-sm text-muted-foreground">in inventory</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium">Category Sales Distribution</p>
                <Select defaultValue="month">
                  <SelectTrigger className="w-[130px] h-8">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="text-sm">Women's Clothing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">45%</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Accessories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">28%</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{width: '28%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Men's Clothing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">18%</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{width: '18%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Shoes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">9%</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{width: '9%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button>
              <Eye className="mr-2 h-4 w-4" />
              View Detailed Analysis
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesSettings;
