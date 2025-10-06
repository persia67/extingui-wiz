import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toPersianNumbers } from '../utils/persianUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExtinguisherTableProps {
  extinguishers: any[];
  onEdit?: (extinguisher: any) => void;
  onDelete?: (id: string) => void;
  isMobile: boolean;
}

export const ExtinguisherTable: React.FC<ExtinguisherTableProps> = ({
  extinguishers,
  onEdit,
  onDelete,
  isMobile
}) => {
  const { t, language } = useLanguage();
  
  const getTypeLabel = (type: string) => {
    return t(type);
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      active: 'statusActive',
      warning: 'statusWarning',
      needs_recharge: 'needsRecharge',
      expired: 'statusExpired',
      out_of_order: 'outOfOrder'
    };
    return t(statusMap[status] || status);
  };

  const getStatusVariant = (status: string) => {
    const variants = {
      active: 'default',
      warning: 'secondary',
      needs_recharge: 'secondary',
      expired: 'destructive',
      out_of_order: 'outline'
    };
    return variants[status] || 'outline';
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {extinguishers.map((extinguisher) => (
          <Card key={extinguisher.id} className="border border-border shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{extinguisher.code}</h3>
                  <p className="text-muted-foreground">{extinguisher.location}</p>
                </div>
                <Badge variant={getStatusVariant(extinguisher.status)}>
                  {getStatusLabel(extinguisher.status)}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div>{t('type')}: {getTypeLabel(extinguisher.type)}</div>
                <div>{t('capacity')}: {language === 'fa' ? toPersianNumbers(extinguisher.capacity) : extinguisher.capacity} {language === 'fa' ? 'کیلوگرم' : 'kg'}</div>
                <div>{t('nextRecharge')}: {language === 'fa' ? toPersianNumbers(extinguisher.next_recharge_date) : extinguisher.next_recharge_date}</div>
              </div>
              
              {(onEdit || onDelete) && (
                <div className="flex gap-2">
                  {onEdit && (
                    <Button 
                      onClick={() => onEdit(extinguisher)} 
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className={`w-4 h-4 ${language === 'fa' ? 'ml-1' : 'mr-1'}`} />
                      {t('edit')}
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      onClick={() => onDelete(extinguisher.id)} 
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash2 className={`w-4 h-4 ${language === 'fa' ? 'ml-1' : 'mr-1'}`} />
                      {t('delete')}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {extinguishers.length === 0 && (
          <Card className="border-dashed border-2 border-muted">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{t('noExtinguishers')}</p>
            </CardContent>
          </Card>
        )}
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
                <th className={`px-6 py-4 ${language === 'fa' ? 'text-right' : 'text-left'} text-sm font-semibold text-foreground`}>{t('code')}</th>
                <th className={`px-6 py-4 ${language === 'fa' ? 'text-right' : 'text-left'} text-sm font-semibold text-foreground`}>{t('location')}</th>
                <th className={`px-6 py-4 ${language === 'fa' ? 'text-right' : 'text-left'} text-sm font-semibold text-foreground`}>{t('type')}</th>
                <th className={`px-6 py-4 ${language === 'fa' ? 'text-right' : 'text-left'} text-sm font-semibold text-foreground`}>{t('capacity')}</th>
                <th className={`px-6 py-4 ${language === 'fa' ? 'text-right' : 'text-left'} text-sm font-semibold text-foreground`}>{t('nextRecharge')}</th>
                <th className={`px-6 py-4 ${language === 'fa' ? 'text-right' : 'text-left'} text-sm font-semibold text-foreground`}>{t('status')}</th>
                <th className={`px-6 py-4 ${language === 'fa' ? 'text-right' : 'text-left'} text-sm font-semibold text-foreground`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {extinguishers.map((extinguisher) => (
                <tr key={extinguisher.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{extinguisher.code}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{extinguisher.location}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{getTypeLabel(extinguisher.type)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {language === 'fa' ? toPersianNumbers(extinguisher.capacity) : extinguisher.capacity} {language === 'fa' ? 'کیلوگرم' : 'kg'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {language === 'fa' ? toPersianNumbers(extinguisher.next_recharge_date) : extinguisher.next_recharge_date}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(extinguisher.status)}>
                      {getStatusLabel(extinguisher.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {(onEdit || onDelete) && (
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button 
                            onClick={() => onEdit(extinguisher)} 
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            onClick={() => onDelete(extinguisher.id)} 
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {extinguishers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t('noExtinguishers')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};