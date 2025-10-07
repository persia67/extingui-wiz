import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toPersianNumbers } from '../utils/persianUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardProps {
  extinguishers: any[];
  isMobile: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ extinguishers, isMobile }) => {
  const { t, language } = useLanguage();
  
  const stats = [
    {
      title: t('totalExtinguishers'),
      value: extinguishers.length,
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    {
      title: t('active'),
      value: extinguishers.filter(e => e.status === 'active').length,
      color: 'bg-success',
      textColor: 'text-success-foreground'
    },
    {
      title: t('warning'),
      value: extinguishers.filter(e => e.status === 'warning').length,
      color: 'bg-warning',
      textColor: 'text-warning-foreground'
    },
    {
      title: t('expired'),
      value: extinguishers.filter(e => e.status === 'expired').length,
      color: 'bg-destructive',
      textColor: 'text-destructive-foreground'
    }
  ];

  const chartData = [
    { name: t('active'), value: stats[1].value, color: 'hsl(var(--success))' },
    { name: t('warning'), value: stats[2].value, color: 'hsl(var(--warning))' },
    { name: t('expired'), value: stats[3].value, color: 'hsl(var(--destructive))' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {language === 'fa' ? toPersianNumbers(payload[0].value) : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-0 shadow-soft transition-all duration-300 hover:scale-105`}>
            <CardContent className="p-4 text-center">
              <div className={`font-bold text-2xl ${stat.textColor} mb-1`}>
                {language === 'fa' ? toPersianNumbers(stat.value) : stat.value}
              </div>
              <div className={`text-sm ${stat.textColor} opacity-90`}>
                {stat.title}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card className="border border-border shadow-soft">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-center">{t('statusDistribution')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${language === 'fa' ? toPersianNumbers(entry.value) : entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};