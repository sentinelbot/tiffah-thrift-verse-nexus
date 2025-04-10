
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductUploadForm } from '@/components/staff/ProductUploadForm';

const ProductManager = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        {!showUploadForm && (
          <Button onClick={() => setShowUploadForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        )}
      </div>
      
      {showUploadForm ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Fill in the details to add a new product to inventory</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                Back to Inventory
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductUploadForm />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="inventory">
              Inventory
              <Badge variant="outline" className="ml-2">120</Badge>
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts
              <Badge variant="outline" className="ml-2">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="outOfStock">
              Out of Stock
              <Badge variant="outline" className="ml-2">15</Badge>
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>Manage your available products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Sample product cards */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-40 bg-muted relative">
                        <img 
                          src={index % 2 === 0 
                            ? "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop" 
                            : "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=150&auto=format&fit=crop"
                          }
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-primary">
                          KSh {Math.floor(Math.random() * 10000) + 500}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {index % 2 === 0 ? "Vintage Denim Jacket" : "Floral Summer Dress"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {index % 3 === 0 ? "Women's Clothing" : index % 3 === 1 ? "Men's Clothing" : "Accessories"}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">
                            {index % 4 === 0 ? "New" : index % 4 === 1 ? "Like New" : index % 4 === 2 ? "Good" : "Fair"}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            ID: TTS-{10000 + index}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drafts">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Draft products will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outOfStock">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Out of stock products will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="archived">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Archived products will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProductManager;
