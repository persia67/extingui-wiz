import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toPersianNumbers } from '../utils/persianUtils';
import { useLanguage } from '@/contexts/LanguageContext';

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

  return (
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
  );
};