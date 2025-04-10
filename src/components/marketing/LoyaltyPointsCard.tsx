
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Star, Info, Clock, Sparkles } from 'lucide-react';

const LoyaltyPointsCard = () => {
  // Mock data for the loyalty program
  const currentPoints = 250;
  const nextRewardThreshold = 500;
  const progress = (currentPoints / nextRewardThreshold) * 100;
  const memberSince = new Date(2023, 5, 15); // June 15, 2023
  const membershipLevel = 'Silver';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Loyalty Rewards
          </CardTitle>
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700">
            {membershipLevel} Member
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{currentPoints} points</h3>
            <p className="text-sm text-muted-foreground">
              Next reward: {nextRewardThreshold} points
            </p>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {nextRewardThreshold - currentPoints} more points needed for KSh 500 discount
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Available Rewards
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="border rounded-md p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">10% Off Next Purchase</p>
                <p className="text-xs text-muted-foreground">Valid for 30 days</p>
              </div>
              <Button size="sm" variant="outline">Redeem</Button>
            </div>
            
            <div className="border rounded-md p-3 flex justify-between items-center bg-muted/50">
              <div>
                <p className="font-medium">Free Delivery</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>Silver benefit</span>
                </div>
              </div>
              <Button size="sm" variant="outline">Redeem</Button>
            </div>
            
            <div className="border rounded-md p-3 flex justify-between items-center opacity-60">
              <div>
                <p className="font-medium">KSh 500 Discount</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Need {nextRewardThreshold - currentPoints} more points</span>
                </div>
              </div>
              <Button size="sm" variant="outline" disabled>Redeem</Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Member since {memberSince.toLocaleDateString()}
            </span>
          </div>
          <Button variant="link" size="sm" className="p-0 h-auto">
            View History
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          <Info className="mr-2 h-4 w-4" />
          Loyalty Program Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoyaltyPointsCard;
