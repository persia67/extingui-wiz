import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardSkeletonProps {
  isMobile: boolean;
}

export const DashboardSkeleton = ({ isMobile }: DashboardSkeletonProps) => {
  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
      {[1, 2, 3, 4].map((index) => (
        <Card key={index} className="border-0 shadow-soft">
          <CardContent className="p-4 text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};