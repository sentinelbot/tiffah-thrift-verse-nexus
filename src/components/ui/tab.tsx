
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  active?: boolean;
}

export const TabItem = React.forwardRef<HTMLDivElement, TabProps>(
  ({ className, children, value, active, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabItem.displayName = 'TabItem';

export const TabValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex', className)}
    {...props}
  />
));
TabValue.displayName = 'TabValue';

export const TabOffset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-center items-center px-2', className)}
    {...props}
  />
));
TabOffset.displayName = 'TabOffset';

export const TabIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('absolute bottom-0 h-0.5 bg-primary transition-all', className)}
    {...props}
  />
));
TabIndicator.displayName = 'TabIndicator';

export const TabList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative flex overflow-x-auto', className)}
    {...props}
  />
));
TabList.displayName = 'TabList';
