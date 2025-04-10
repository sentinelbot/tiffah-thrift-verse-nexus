
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Info } from 'lucide-react';
import { toast } from 'sonner';

const LoyaltyPointsCard = () => {
  // Mock loyalty points data
  const points = 150;
  const nextRewardAt = 200;
  const progress = (points / nextRewardAt) * 100;
  
  const showRewardsInfo = () => {
    toast.info(
      'Loyalty Program',
      {
        description: 'Earn 10 points for every KSh 1,000 spent. Redeem points for discounts and free gifts!'
      }
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Loyalty Points</CardTitle>
          <Button variant="ghost" size="icon" onClick={showRewardsInfo}>
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Earn points with every purchase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current points</span>
          <span className="text-2xl font-bold">{points}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next reward</span>
            <span>{points}/{nextRewardAt}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="bg-primary/10 rounded-lg p-3 flex items-start gap-3">
          <Gift className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Next reward: KSh 200 discount</p>
            <p className="text-xs text-muted-foreground">
              Just {nextRewardAt - points} more points to go!
            </p>
          </div>
        </div>
        
        <Button className="w-full" variant="outline">
          View All Rewards
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
