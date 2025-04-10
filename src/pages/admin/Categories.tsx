
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
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
import { Textarea } from '@/components/ui/textarea';
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Folder, 
  FolderPlus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Search,
  XCircle,
  CheckCircle,
  ArrowUpDown,
  FolderTree
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  productCount: number;
  createdAt: string;
}

// Mock categories data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Clothing',
    description: 'All types of clothing items',
    parentId: null,
    productCount: 145,
    createdAt: '2023-06-12T10:00:00Z'
  },
  {
    id: '2',
    name: 'Women\'s Clothing',
    description: 'Clothing items for women',
    parentId: '1',
    productCount: 89,
    createdAt: '2023-06-12T10:05:00Z'
  },
  {
    id: '3',
    name: 'Men\'s Clothing',
    description: 'Clothing items for men',
    parentId: '1',
    productCount: 56,
    createdAt: '2023-06-12T10:10:00Z'
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Fashion accessories',
    parentId: null,
    productCount: 78,
    createdAt: '2023-06-13T09:30:00Z'
  },
  {
    id: '5',
    name: 'Jewelry',
    description: 'Necklaces, bracelets, earrings, etc.',
    parentId: '4',
    productCount: 42,
    createdAt: '2023-06-13T09:35:00Z'
  },
  {
    id: '6',
    name: 'Bags',
    description: 'Handbags, backpacks, wallets, etc.',
    parentId: '4',
    productCount: 36,
    createdAt: '2023-06-13T09:40:00Z'
  },
  {
    id: '7',
    name: 'Shoes',
    description: 'All types of footwear',
    parentId: null,
    productCount: 64,
    createdAt: '2023-06-14T11:20:00Z'
  },
  {
    id: '8',
    name: 'Women\'s Shoes',
    description: 'Footwear for women',
    parentId: '7',
    productCount: 40,
    createdAt: '2023-06-14T11:25:00Z'
  },
  {
    id: '9',
    name: 'Men\'s Shoes',
    description: 'Footwear for men',
    parentId: '7',
    productCount: 24,
    createdAt: '2023-06-14T11:30:00Z'
  },
  {
    id: '10',
    name: 'Home & Living',
    description: 'Home decor, kitchenware, etc.',
    parentId: null,
    productCount: 52,
    createdAt: '2023-06-15T14:15:00Z'
  }
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filter categories based on search
  const filteredCategories = categories.filter(
    category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Sort categories based on current sort settings
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'productCount') {
      return sortOrder === 'asc' 
        ? a.productCount - b.productCount 
        : b.productCount - a.productCount;
    } else if (sortBy === 'createdAt') {
      return sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
  
  // Get parent categories only (for dropdown)
  const parentCategories = categories.filter(cat => !cat.parentId);
  
  // Get category name by ID
  const getCategoryNameById = (id: string | null) => {
    if (!id) return 'None';
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  };
  
  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Handle adding a new category
  const handleAddCategory = () => {
    const newId = (Math.max(...categories.map(c => Number(c.id))) + 1).toString();
    const categoryToAdd: Category = {
      id: newId,
      name: newCategory.name,
      description: newCategory.description || null,
      parentId: newCategory.parentId || null,
      productCount: 0,
      createdAt: new Date().toISOString()
    };
    
    setCategories([...categories, categoryToAdd]);
    setNewCategory({ name: '', description: '', parentId: '' });
    setIsAddDialogOpen(false);
    toast.success(`Category "${newCategory.name}" added successfully`);
  };
  
  // Handle editing a category
  const handleEditCategory = () => {
    if (!currentCategory) return;
    
    const updatedCategories = categories.map(category => 
      category.id === currentCategory.id ? currentCategory : category
    );
    
    setCategories(updatedCategories);
    setIsEditDialogOpen(false);
    toast.success(`Category "${currentCategory.name}" updated successfully`);
  };
  
  // Handle deleting a category
  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    
    const updatedCategories = categories.filter(category => category.id !== currentCategory.id);
    
    setCategories(updatedCategories);
    setIsDeleteDialogOpen(false);
    toast.success(`Category "${currentCategory.name}" deleted successfully`);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage product categories and subcategories</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for organizing products
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Summer Collection" 
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Brief description of this category" 
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category (Optional)</Label>
                  <Select 
                    value={newCategory.parentId} 
                    onValueChange={(value) => setNewCategory({...newCategory, parentId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top-level category)</SelectItem>
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} disabled={!newCategory.name.trim()}>
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Category Management</CardTitle>
            <CardDescription>
              Organize your products with categories and subcategories
            </CardDescription>
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setSearchQuery('')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Select defaultValue="tree">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View as" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tree">Tree View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <button 
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => toggleSort('name')}
                    >
                      Category
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>Parent Category</TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => toggleSort('productCount')}
                    >
                      Products
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => toggleSort('createdAt')}
                    >
                      Created
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery 
                        ? "No categories found matching your search" 
                        : "No categories found. Create your first category to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {category.parentId ? (
                            <span className="ml-4">└─</span>
                          ) : null}
                          <Folder className="h-5 w-5 text-primary" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        {category.description && (
                          <p className="text-xs text-muted-foreground ml-7">
                            {category.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {category.parentId ? getCategoryNameById(category.parentId) : '-'}
                      </TableCell>
                      <TableCell>{category.productCount}</TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentCategory(category);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentCategory(category);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              {filteredCategories.length} categories total
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details
            </DialogDescription>
          </DialogHeader>
          
          {currentCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentCategory.description || ''}
                  onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-parent">Parent Category (Optional)</Label>
                <Select 
                  value={currentCategory.parentId || 'none'} 
                  onValueChange={(value) => setCurrentCategory({...currentCategory, parentId: value === 'none' ? null : value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top-level category)</SelectItem>
                    {parentCategories
                      .filter(cat => cat.id !== currentCategory.id) // Prevent self-parent
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={!currentCategory?.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentCategory && (
            <div className="py-4">
              <div className="flex items-center p-4 rounded-md bg-muted mb-4">
                <Folder className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h4 className="font-medium">{currentCategory.name}</h4>
                  {currentCategory.description && (
                    <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-destructive">
                <p>This will also delete any products associated with this category.</p>
                {currentCategory.productCount > 0 && (
                  <p className="font-medium mt-2">
                    {currentCategory.productCount} products will be affected.
                  </p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Categories;
