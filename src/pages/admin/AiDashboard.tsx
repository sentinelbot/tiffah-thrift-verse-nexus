
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Zap, PenLine, Image as ImageIcon, TagIcon, DollarSign, Bot, Settings, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import AIProductDescriptionGenerator from '@/components/ai/AIProductDescriptionGenerator';
import AIImageEnhancer from '@/components/ai/AIImageEnhancer';
import { 
  AIPriceRecommendation, 
  AIProductRecommendation,
  suggestProductPrice,
  getSimilarProducts,
  getCompleteTheLookProducts
} from '@/services/aiService';

const AiDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [priceRecommendation, setPriceRecommendation] = useState<AIPriceRecommendation | null>(null);
  const [similarProducts, setSimilarProducts] = useState<string[]>([]);
  const [completeLookProducts, setCompleteLookProducts] = useState<string[]>([]);

  const runAiBatch = async (type: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success(`${type} batch processing started successfully`);
    } catch (error) {
      toast.error(`Failed to start ${type} batch processing`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriceRecommendation = async () => {
    setIsProcessing(true);
    try {
      // This is a mock call for demo purposes
      const result = await suggestProductPrice('good', 'Dresses', 'Zara', 3500);
      setPriceRecommendation(result);
      toast.success('Price recommendation generated');
    } catch (error) {
      toast.error('Failed to generate price recommendation');
    } finally {
      setIsProcessing(false);
    }
  };

  const getProductRecommendations = async () => {
    setIsProcessing(true);
    try {
      // These are mock calls for demo purposes
      const similarResult = await getSimilarProducts('prod123', 4);
      const completeLookResult = await getCompleteTheLookProducts('prod123', 3);
      
      setSimilarProducts(similarResult);
      setCompleteLookProducts(completeLookResult);
      
      toast.success('Product recommendations generated');
    } catch (error) {
      toast.error('Failed to generate product recommendations');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Dashboard</h1>
            <p className="text-muted-foreground">
              Manage AI-powered features and automation
            </p>
          </div>
          <Button onClick={() => runAiBatch('All AI')} disabled={isProcessing}>
            <Zap className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Run All AI Features'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <PenLine className="mr-2 h-5 w-5 text-primary" />
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">243</div>
                  <p className="text-xs text-muted-foreground">Items with AI descriptions</p>
                  <Button size="sm" variant="outline" className="mt-4 w-full">
                    Generate more
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5 text-primary" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">Enhanced product images</p>
                  <Button size="sm" variant="outline" className="mt-4 w-full">
                    Process images
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <TagIcon className="mr-2 h-5 w-5 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">Products with recommendations</p>
                  <Button size="sm" variant="outline" className="mt-4 w-full">
                    Optimize recommendations
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-primary" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68</div>
                  <p className="text-xs text-muted-foreground">Items with optimized pricing</p>
                  <Button size="sm" variant="outline" className="mt-4 w-full">
                    Optimize prices
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent AI Activity</CardTitle>
                <CardDescription>
                  AI-powered features and their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Description Optimization</p>
                      <p className="text-xs text-muted-foreground">
                        Generated 18 new product descriptions with 92% acceptance rate
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Image Background Removal</p>
                      <p className="text-xs text-muted-foreground">
                        Processed 24 product images with 100% success rate
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Price Optimization</p>
                      <p className="text-xs text-muted-foreground">
                        Adjusted prices for 36 products based on market trends and condition
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <AIProductDescriptionGenerator />

            <Card>
              <CardHeader>
                <CardTitle>Batch Content Generation</CardTitle>
                <CardDescription>
                  Generate descriptions for multiple products at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Automatically generate engaging product descriptions for your
                    inventory items using AI. The system analyzes product attributes
                    like category, condition, and brand to create compelling content.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => runAiBatch('Description')} 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <PenLine className="mr-2 h-4 w-4" />
                      Generate Descriptions
                    </Button>
                    
                    <Button 
                      onClick={() => runAiBatch('SEO')} 
                      variant="outline" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <TagIcon className="mr-2 h-4 w-4" />
                      Generate SEO Tags
                    </Button>
                    
                    <Button 
                      onClick={() => runAiBatch('Key Points')} 
                      variant="outline" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Key Points
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <AIImageEnhancer />

            <Card>
              <CardHeader>
                <CardTitle>Batch Image Processing</CardTitle>
                <CardDescription>
                  Process and optimize multiple product images at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Enhance your product images using AI technology. Remove backgrounds,
                    improve image quality, and create consistent product presentations
                    across your inventory.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => runAiBatch('Background Removal')} 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Remove Backgrounds
                    </Button>
                    
                    <Button 
                      onClick={() => runAiBatch('Image Enhancement')} 
                      variant="outline" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Enhance Images
                    </Button>
                    
                    <Button 
                      onClick={() => runAiBatch('Image Optimization')} 
                      variant="outline" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Optimize Images
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Optimization</CardTitle>
                  <CardDescription>
                    AI-powered price recommendations based on market data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p>
                      Our AI analyzes market trends, product condition, and sales data
                      to recommend optimal pricing for your second-hand items.
                    </p>
                    
                    {priceRecommendation ? (
                      <div className="space-y-4 mt-4 p-4 border rounded-md">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">
                              KSh {priceRecommendation.minPrice}
                            </div>
                            <div className="text-xs text-muted-foreground">Minimum</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              KSh {priceRecommendation.recommendedPrice}
                            </div>
                            <div className="text-xs text-muted-foreground">Recommended</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">
                              KSh {priceRecommendation.maxPrice}
                            </div>
                            <div className="text-xs text-muted-foreground">Maximum</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {priceRecommendation.reasoning}
                        </p>
                      </div>
                    ) : null}
                    
                    <Button 
                      onClick={getPriceRecommendation} 
                      className="w-full mt-2" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Get Price Recommendation
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Recommendations</CardTitle>
                  <CardDescription>
                    Generate "Similar Items" and "Complete the Look" recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p>
                      Our AI analyzes product attributes to suggest similar items and complementary
                      products that complete an outfit or collection.
                    </p>
                    
                    {(similarProducts.length > 0 || completeLookProducts.length > 0) && (
                      <div className="space-y-4 mt-4">
                        {similarProducts.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Similar Products</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {similarProducts.map((productId, index) => (
                                <div 
                                  key={index} 
                                  className="p-2 border rounded-md text-center text-sm"
                                >
                                  Product {productId}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {completeLookProducts.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Complete the Look</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {completeLookProducts.map((productId, index) => (
                                <div 
                                  key={index} 
                                  className="p-2 border rounded-md text-center text-sm"
                                >
                                  Product {productId}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      onClick={getProductRecommendations} 
                      className="w-full mt-2" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <TagIcon className="mr-2 h-4 w-4" />
                          Generate Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Batch Recommendation Processing</CardTitle>
                <CardDescription>
                  Generate recommendations for multiple products at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Leverage AI to create product recommendations and optimize pricing
                    based on market trends, product condition, and customer behavior.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => runAiBatch('Similar Products')} 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <TagIcon className="mr-2 h-4 w-4" />
                      Generate Similar Products
                    </Button>
                    
                    <Button 
                      onClick={() => runAiBatch('Complete the Look')} 
                      variant="outline" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create "Complete the Look"
                    </Button>
                    
                    <Button 
                      onClick={() => runAiBatch('Price Optimization')} 
                      variant="outline" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Optimize Pricing
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>AI Settings</CardTitle>
                <CardDescription>
                  Configure AI behavior and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">API Configuration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure the OpenAI API connection for AI features
                    </p>
                    <Button>
                      <Settings className="mr-2 h-4 w-4" />
                      Update API Settings
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">AI Behavior</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Customize AI tone, style, and behavior
                    </p>
                    <Button variant="outline">
                      <Bot className="mr-2 h-4 w-4" />
                      Customize AI Behavior
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Automation Schedule</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up automated AI processing schedules
                    </p>
                    <Button variant="outline">
                      <Zap className="mr-2 h-4 w-4" />
                      Configure Automation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AiDashboard;
