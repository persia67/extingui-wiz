import { useState, useEffect } from 'react';
import { calculateNextRechargeDate } from '../utils/persianUtils';

export interface Extinguisher {
  id: number;
  code: string;
  location: string;
  type: 'powder' | 'co2' | 'foam' | 'water';
  capacity: string;
  lastRechargeDate: string;
  nextRechargeDate: string;
  status: 'active' | 'needs_recharge' | 'expired' | 'out_of_order';
  notes: string;
  created_at: string;
  updated_at: string;
}

export const useExtinguisherData = () => {
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    const sampleData: Extinguisher[] = [
      {
        id: 1,
        code: 'FE-001',
        location: 'ورودی اصلی',
        type: 'powder',
        capacity: '6',
        lastRechargeDate: '1403/06/20',
        nextRechargeDate: '1404/06/20',
        status: 'active',
        notes: 'وضعیت مطلوب',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        code: 'FE-002',
        location: 'انبار مواد',
        type: 'co2',
        capacity: '5',
        lastRechargeDate: '1400/08/10',
        nextRechargeDate: '1405/08/10',
        status: 'needs_recharge',
        notes: 'نیاز به شارژ',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    setExtinguishers(sampleData);
    setIsLoading(false);
  }, []);

  const generateCode = (): string => {
    const maxNumber = extinguishers
      .map(ext => {
        const match = ext.code.match(/FE-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .reduce((max, num) => Math.max(max, num), 0);
    return `FE-${String(maxNumber + 1).padStart(3, '0')}`;
  };

  const addExtinguisher = (data: Partial<Extinguisher>) => {
    const code = data.code?.trim() || generateCode();
    const nextRechargeDate = calculateNextRechargeDate(data.lastRechargeDate || '', data.type || 'powder');
    
    const newExtinguisher: Extinguisher = {
      id: Date.now(),
      code,
      location: data.location || '',
      type: data.type || 'powder',
      capacity: data.capacity || '6',
      lastRechargeDate: data.lastRechargeDate || '',
      nextRechargeDate,
      status: 'active',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setExtinguishers(prev => [...prev, newExtinguisher]);
  };

  const updateExtinguisher = (id: number, data: Partial<Extinguisher>) => {
    setExtinguishers(prev => prev.map(ext => 
      ext.id === id 
        ? { 
            ...ext, 
            ...data, 
            nextRechargeDate: calculateNextRechargeDate(data.lastRechargeDate || ext.lastRechargeDate, data.type || ext.type),
            updated_at: new Date().toISOString() 
          }
        : ext
    ));
  };

  const deleteExtinguisher = (id: number) => {
    setExtinguishers(prev => prev.filter(ext => ext.id !== id));
  };

  const importExtinguishers = (data: any[]): number => {
    const maxNumber = extinguishers
      .map(ext => {
        const match = ext.code.match(/FE-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .reduce((max, num) => Math.max(max, num), 0);

    const processedEntries = data.map((item, index) => ({
      id: Date.now() + index,
      code: `FE-${String(maxNumber + index + 1).padStart(3, '0')}`,
      location: item.location,
      type: item.type || 'powder',
      capacity: '6',
      lastRechargeDate: item.lastRechargeDate,
      nextRechargeDate: calculateNextRechargeDate(item.lastRechargeDate, item.type || 'powder'),
      status: 'active' as const,
      notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    setExtinguishers(prev => [...prev, ...processedEntries]);
    return processedEntries.length;
  };

  const exportToCSV = () => {
    const getTypeLabel = (type: string) => {
      const types = { powder: 'پودری', co2: 'دی اکسید کربن', foam: 'فوم', water: 'آبی' };
      return types[type as keyof typeof types] || type;
    };

    const getStatusLabel = (status: string) => {
      const statuses = { 
        active: 'فعال', 
        needs_recharge: 'نیاز به شارژ', 
        expired: 'منقضی', 
        out_of_order: 'خارج از سرویس' 
      };
      return statuses[status as keyof typeof statuses] || status;
    };

    const headers = ['کد', 'محل نصب', 'نوع', 'ظرفیت', 'آخرین شارژ', 'شارژ بعدی', 'وضعیت'];
    const data = extinguishers.map(ext => [
      ext.code, 
      ext.location, 
      getTypeLabel(ext.type),
      ext.capacity + ' کیلوگرم', 
      ext.lastRechargeDate, 
      ext.nextRechargeDate, 
      getStatusLabel(ext.status)
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extinguishers_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    extinguishers,
    isLoading,
    addExtinguisher,
    updateExtinguisher,
    deleteExtinguisher,
    importExtinguishers,
    exportToCSV
  };
};