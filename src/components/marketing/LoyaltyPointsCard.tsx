
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Gift, ShoppingBag, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserPoints {
  userId: string;
  totalPoints: number;
  pointsToNextTier: number;
  currentTier: string;
  nextTier: string;
  tierProgress: number;
  recentActivity: {
    date: string;
    action: string;
    points: number;
  }[];
  rewards: {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    isAvailable: boolean;
  }[];
}

const mockPointsData: UserPoints = {
  userId: 'user123',
  totalPoints: 750,
  pointsToNextTier: 250,
  currentTier: 'Silver',
  nextTier: 'Gold',
  tierProgress: 75,
  recentActivity: [
    { date: '2025-04-08', action: 'Purchase', points: 50 },
    { date: '2025-04-01', action: 'Review', points: 10 },
    { date: '2025-03-25', action: 'Purchase', points: 75 },
  ],
  rewards: [
    { id: 'reward1', name: '15% Off', description: '15% discount on your next purchase', pointsCost: 200, isAvailable: true },
    { id: 'reward2', name: 'Free Shipping', description: 'Free shipping on any order', pointsCost: 150, isAvailable: true },
    { id: 'reward3', name: '50% Off', description: '50% discount on any one item', pointsCost: 1000, isAvailable: false },
  ],
};

const LoyaltyPointsCard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserPoints = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from the database
        // const { data, error } = await supabase
        //   .from('user_loyalty')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .single();
        //
        // if (error) throw error;
        // setUserData(data);

        // Mock delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 800));
        setUserData(mockPointsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user loyalty data:', error);
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [user]);

  const claimReward = async (rewardId: string, pointsCost: number) => {
    if (!user || !userData) return;

    try {
      // In a real app, you would update the database
      // const { error } = await supabase.rpc('redeem_loyalty_reward', {
      //   user_id: user.id,
      //   reward_id: rewardId,
      //   points_cost: pointsCost
      // });
      //
      // if (error) throw error;

      // Update local state
      setUserData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalPoints: prev.totalPoints - pointsCost,
          rewards: prev.rewards.map(reward =>
            reward.id === rewardId
              ? { ...reward, isAvailable: false }
              : reward
          ),
        };
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Loyalty Program
          </CardTitle>
          <CardDescription>Loading loyalty data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Loyalty Program
          </CardTitle>
          <CardDescription>Join our loyalty program to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Join Now</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Loyalty Program
        </CardTitle>
        <CardDescription>
          {userData.currentTier} Member · {userData.totalPoints} Points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">{userData.currentTier}</span>
            <span className="text-sm">{userData.nextTier}</span>
          </div>
          <Progress value={userData.tierProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {userData.pointsToNextTier} more points to reach {userData.nextTier}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Gift className="h-4 w-4" /> Available Rewards
          </h4>
          <div className="grid gap-3">
            {userData.rewards.map(reward => (
              <div key={reward.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={userData.totalPoints >= reward.pointsCost ? "default" : "outline"}
                  disabled={userData.totalPoints < reward.pointsCost || !reward.isAvailable}
                  onClick={() => claimReward(reward.id, reward.pointsCost)}
                >
                  {reward.isAvailable ? `${reward.pointsCost} pts` : 'Claimed'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" /> Recent Activity
          </h4>
          <div className="space-y-2">
            {userData.recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span>{activity.action}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-primary">+{activity.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <h4 className="text-sm font-medium flex items-center gap-1">
          <CreditCard className="h-4 w-4" /> Ways to Earn Points
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-medium">Make a Purchase</p>
            <p className="text-muted-foreground">1 point per KSh 10</p>
          </div>
          <div>
            <p className="font-medium">Write a Review</p>
            <p className="text-muted-foreground">10 points per review</p>
          </div>
          <div>
            <p className="font-medium">Refer a Friend</p>
            <p className="text-muted-foreground">100 points per referral</p>
          </div>
          <div>
            <p className="font-medium">Birthday Bonus</p>
            <p className="text-muted-foreground">200 points on your birthday</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
