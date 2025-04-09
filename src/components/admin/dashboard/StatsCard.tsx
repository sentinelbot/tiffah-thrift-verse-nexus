
import { Card, CardContent } from '@/components/ui/card';
import { IconProps } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<IconProps>;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="rounded-full p-2 bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          {trend ? (
            <p className="text-xs flex items-center">
              <span className={trend.positive ? 'text-green-500' : 'text-red-500'}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-muted-foreground ml-1">{description}</span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
