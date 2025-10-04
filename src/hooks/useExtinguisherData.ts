import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateNextRechargeDate } from '../utils/persianUtils';
import { toast } from '@/hooks/use-toast';

export interface Extinguisher {
  id: string;
  code: string;
  location: string;
  type: 'powder' | 'co2' | 'foam' | 'water';
  capacity: string;
  last_recharge_date: string;
  next_recharge_date: string;
  status: 'active' | 'warning' | 'needs_recharge' | 'expired' | 'out_of_order';
  created_at?: string;
  updated_at?: string;
}

// Calculate status based on dates
const calculateStatus = (nextRechargeDate: string): Extinguisher['status'] => {
  if (!nextRechargeDate) return 'active';
  
  try {
    const [year, month, day] = nextRechargeDate.split('/').map(Number);
    const nextDate = new Date(year, month - 1, day);
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
    if (nextDate < today) {
      return 'expired';
    } else if (nextDate < oneMonthFromNow) {
      return 'warning';
    }
    return 'active';
  } catch {
    return 'active';
  }
};

export const useExtinguisherData = () => {
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    loadExtinguishers();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('extinguishers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'extinguishers'
        },
        () => {
          loadExtinguishers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadExtinguishers = async () => {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const extinguishersWithStatus = (data || []).map(ext => ({
        ...ext,
        type: ext.type as 'powder' | 'co2' | 'foam' | 'water',
        status: calculateStatus(ext.next_recharge_date)
      })) as Extinguisher[];

      setExtinguishers(extinguishersWithStatus);
    } catch (error: any) {
      console.error('Error loading extinguishers:', error);
      toast({
        title: 'خطا در بارگذاری',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCode = async (): Promise<string> => {
    const { data } = await supabase
      .from('extinguishers')
      .select('code')
      .order('code', { ascending: false })
      .limit(1);

    const maxNumber = data && data.length > 0 
      ? parseInt(data[0].code.match(/FE-(\d+)/)?.[1] || '0')
      : 0;

    return `FE-${String(maxNumber + 1).padStart(3, '0')}`;
  };

  const addExtinguisher = async (data: Partial<Extinguisher>) => {
    try {
      const code = data.code?.trim() || await generateCode();
      const nextRechargeDate = calculateNextRechargeDate(
        data.last_recharge_date || '', 
        data.type || 'powder'
      );
      
      const status = calculateStatus(nextRechargeDate);

      const { error } = await supabase
        .from('extinguishers')
        .insert({
          code,
          location: data.location || '',
          type: data.type || 'powder',
          capacity: data.capacity || '6',
          last_recharge_date: data.last_recharge_date || '',
          next_recharge_date: nextRechargeDate,
          status,
        });

      if (error) throw error;

      toast({
        title: 'موفقیت',
        description: 'کپسول با موفقیت اضافه شد',
      });
    } catch (error: any) {
      console.error('Error adding extinguisher:', error);
      toast({
        title: 'خطا',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateExtinguisher = async (id: string, data: Partial<Extinguisher>) => {
    try {
      const nextRechargeDate = data.last_recharge_date 
        ? calculateNextRechargeDate(data.last_recharge_date, data.type || 'powder')
        : undefined;
      
      const status = nextRechargeDate ? calculateStatus(nextRechargeDate) : undefined;

      const updateData: any = { ...data };
      if (nextRechargeDate) updateData.next_recharge_date = nextRechargeDate;
      if (status) updateData.status = status;

      const { error } = await supabase
        .from('extinguishers')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'موفقیت',
        description: 'کپسول با موفقیت به‌روزرسانی شد',
      });
    } catch (error: any) {
      console.error('Error updating extinguisher:', error);
      toast({
        title: 'خطا',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteExtinguisher = async (id: string) => {
    try {
      const { error } = await supabase
        .from('extinguishers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'موفقیت',
        description: 'کپسول با موفقیت حذف شد',
      });
    } catch (error: any) {
      console.error('Error deleting extinguisher:', error);
      toast({
        title: 'خطا',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const importExtinguishers = async (data: any[]): Promise<number> => {
    try {
      const code = await generateCode();
      const maxNumber = parseInt(code.match(/FE-(\d+)/)?.[1] || '0');

      const processedEntries = data.map((item, index) => {
        const nextRechargeDate = calculateNextRechargeDate(
          item.lastRechargeDate || item.last_recharge_date,
          item.type || 'powder'
        );
        const status = calculateStatus(nextRechargeDate);

        return {
          code: `FE-${String(maxNumber + index + 1).padStart(3, '0')}`,
          location: item.location,
          type: item.type || 'powder',
          capacity: '6',
          last_recharge_date: item.lastRechargeDate || item.last_recharge_date,
          next_recharge_date: nextRechargeDate,
          status,
        };
      });

      const { error } = await supabase
        .from('extinguishers')
        .insert(processedEntries);

      if (error) throw error;

      toast({
        title: 'موفقیت',
        description: `${processedEntries.length} کپسول با موفقیت وارد شد`,
      });

      return processedEntries.length;
    } catch (error: any) {
      console.error('Error importing extinguishers:', error);
      toast({
        title: 'خطا',
        description: error.message,
        variant: 'destructive',
      });
      return 0;
    }
  };

  const exportToCSV = () => {
    const getTypeLabel = (type: string) => {
      const types = { powder: 'پودری', co2: 'دی اکسید کربن', foam: 'فوم', water: 'آبی' };
      return types[type as keyof typeof types] || type;
    };

    const getStatusLabel = (status: string) => {
      const statuses = { 
        active: 'فعال',
        warning: 'هشدار - یک ماه مانده',
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
      ext.last_recharge_date, 
      ext.next_recharge_date, 
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