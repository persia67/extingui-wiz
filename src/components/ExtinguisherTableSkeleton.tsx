import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ExtinguisherTableSkeletonProps {
  isMobile: boolean;
}

export const ExtinguisherTableSkeleton = ({ isMobile }: ExtinguisherTableSkeletonProps) => {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {[1, 2].map((index) => (
          <Card key={index} className="border border-border shadow-soft">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
              
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="shadow-soft border border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">کد</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">محل نصب</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">نوع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">ظرفیت</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">شارژ بعدی</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">وضعیت</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[1, 2].map((index) => (
                <tr key={index}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};