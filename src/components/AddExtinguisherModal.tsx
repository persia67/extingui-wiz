import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isValidPersianDate } from '../utils/persianUtils';
import type { Extinguisher } from '../hooks/useExtinguisherData';

interface AddExtinguisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Extinguisher>) => void;
  editingExtinguisher?: Extinguisher | null;
  existingCodes: string[];
}

const AddExtinguisherModal: React.FC<AddExtinguisherModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingExtinguisher,
  existingCodes
}) => {
  const [formData, setFormData] = useState<{
    code: string;
    mainArea: string;
    specificLocation: string;
    type: 'powder' | 'co2' | 'foam' | 'water';
    capacity: string;
    lastRechargeDate: string;
    notes: string;
  }>({
    code: '',
    mainArea: '',
    specificLocation: '',
    type: 'powder',
    capacity: '6',
    lastRechargeDate: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExtinguisher) {
      // Split existing location into main area and specific location if possible
      const locationParts = editingExtinguisher.location.split(' - ');
      setFormData({
        code: editingExtinguisher.code,
        mainArea: locationParts[0] || '',
        specificLocation: locationParts[1] || locationParts[0] || '',
        type: editingExtinguisher.type,
        capacity: editingExtinguisher.capacity,
        lastRechargeDate: editingExtinguisher.lastRechargeDate,
        notes: editingExtinguisher.notes
      });
    } else {
      setFormData({
        code: '',
        mainArea: '',
        specificLocation: '',
        type: 'powder',
        capacity: '6',
        lastRechargeDate: '',
        notes: ''
      });
    }
    setError('');
  }, [editingExtinguisher, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mainArea.trim() || !formData.specificLocation.trim() || !formData.lastRechargeDate.trim()) {
      setError('محل اصلی، آدرس دقیق و تاریخ شارژ الزامی است');
      return;
    }

    if (!isValidPersianDate(formData.lastRechargeDate)) {
      setError('فرمت تاریخ نادرست است (1403/01/01)');
      return;
    }

    if (formData.code && existingCodes.includes(formData.code) && !editingExtinguisher) {
      setError('این کد قبلاً استفاده شده است');
      return;
    }

    setError('');
    // Combine mainArea and specificLocation into a single location string
    const combinedLocation = `${formData.mainArea} - ${formData.specificLocation}`;
    onSubmit({
      ...formData,
      location: combinedLocation
    });
  };

  const handleClose = () => {
    setFormData({
      code: '',
      mainArea: '',
      specificLocation: '',
      type: 'powder',
      capacity: '6',
      lastRechargeDate: '',
      notes: ''
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingExtinguisher ? 'ویرایش کپسول' : 'افزودن کپسول جدید'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">کد کپسول</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder="خالی بگذارید تا خودکار تولید شود"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainArea">محل اصلی *</Label>
            <Select
              value={formData.mainArea}
              onValueChange={(value: string) => setFormData({...formData, mainArea: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب محل اصلی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="سالن اسید شویی">سالن اسید شویی</SelectItem>
                <SelectItem value="سالن گالوانیزه">سالن گالوانیزه</SelectItem>
                <SelectItem value="نورد سرد">نورد سرد</SelectItem>
                <SelectItem value="زیر زمین نورد سرد">زیر زمین نورد سرد</SelectItem>
                <SelectItem value="سالن انبار محصول">سالن انبار محصول</SelectItem>
                <SelectItem value="خط قدیم">خط قدیم</SelectItem>
                <SelectItem value="اداری">اداری</SelectItem>
                <SelectItem value="ماشین سازی">ماشین سازی</SelectItem>
                <SelectItem value="تاسیسات">تاسیسات</SelectItem>
                <SelectItem value="سایر مکان‌ها">سایر مکان‌ها</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificLocation">آدرس دقیق *</Label>
            <Input
              id="specificLocation"
              required
              value={formData.specificLocation}
              onChange={(e) => setFormData({...formData, specificLocation: e.target.value})}
              placeholder="مثال: ابتدای خط، مجاورت پست برق"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">نوع کپسول</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({...formData, type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="powder">پودری (سالیانه)</SelectItem>
                <SelectItem value="co2">دی اکسید کربن (۵ ساله)</SelectItem>
                <SelectItem value="foam">فوم (سالیانه)</SelectItem>
                <SelectItem value="water">آبی (سالیانه)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">ظرفیت (کیلوگرم)</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              placeholder="6"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastRechargeDate">آخرین شارژ *</Label>
            <Input
              id="lastRechargeDate"
              required
              value={formData.lastRechargeDate}
              onChange={(e) => setFormData({...formData, lastRechargeDate: e.target.value})}
              placeholder="1403/07/15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">توضیحات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="توضیحات اضافی..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-fire hover:opacity-90">
              {editingExtinguisher ? 'ویرایش' : 'افزودن'}
            </Button>
            <Button type="button" onClick={handleClose} variant="outline" className="flex-1">
              انصراف
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExtinguisherModal;