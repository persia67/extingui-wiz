import React, { useState } from 'react';
import { Download, Upload, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { isValidPersianDate, toPersianNumbers } from '../utils/persianUtils';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [error, setError] = useState('');

  const downloadTemplate = () => {
    const headers = ['محل نصب', 'تاریخ شارژ مجدد', 'نوع کپسول'];
    const sample = ['ورودی اصلی', '1403/06/20', 'powder'];
    const csvContent = [headers, sample].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const lines = content.split('\n');
        
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const errors = [];
            
            if (!values[0]) errors.push('محل نصب ضروری است');
            if (!values[1]) errors.push('تاریخ شارژ ضروری است');
            else if (!isValidPersianDate(values[1])) errors.push('فرمت تاریخ نادرست است');
            
            return {
              rowIndex: index + 2,
              location: values[0] || '',
              lastRechargeDate: values[1] || '',
              type: values[2] || 'powder',
              errors,
              isValid: errors.length === 0
            };
          });
        
        setImportPreview(data);
        setError('');
      } catch (error) {
        setError('خطا در خواندن فایل');
      }
    };
    
    reader.readAsText(file, 'utf-8');
  };

  const handleImport = () => {
    const validItems = importPreview.filter(item => item.isValid);
    if (validItems.length === 0) {
      setError('هیچ ردیف معتبری وجود ندارد');
      return;
    }

    onImport(validItems);
    handleClose();
  };

  const handleClose = () => {
    setExcelFile(null);
    setImportPreview([]);
    setError('');
    onClose();
  };

  const getTypeLabel = (type: string) => {
    const types = { powder: 'پودری', co2: 'دی اکسید کربن', foam: 'فوم', water: 'آبی' };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">وارد کردن کپسول‌ها از فایل اکسل</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              دانلود قالب اکسل
            </Button>
            
            <div className="flex-1">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <label
                htmlFor="excel-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {excelFile ? excelFile.name : 'انتخاب فایل اکسل'}
                </span>
              </label>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">راهنمای استفاده:</div>
                <ul className="text-sm space-y-1">
                  <li>• ابتدا قالب اکسل را دانلود کنید</li>
                  <li>• ستون‌های ضروری: محل نصب، تاریخ شارژ مجدد</li>
                  <li>• فرمت تاریخ: 1403/06/20 (سال/ماه/روز)</li>
                  <li>• نوع کپسول: powder، co2، foam، water</li>
                  <li>• کد کپسول خودکار تولید می‌شود</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {importPreview.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">
                  پیش‌نمایش ({importPreview.length} ردیف)
                </h4>
                <div className="text-sm space-x-4">
                  <span className="text-success">
                    معتبر: {importPreview.filter(item => item.isValid).length}
                  </span>
                  <span className="text-destructive">
                    نامعتبر: {importPreview.filter(item => !item.isValid).length}
                  </span>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-right font-medium">ردیف</th>
                      <th className="px-3 py-2 text-right font-medium">وضعیت</th>
                      <th className="px-3 py-2 text-right font-medium">محل نصب</th>
                      <th className="px-3 py-2 text-right font-medium">تاریخ شارژ</th>
                      <th className="px-3 py-2 text-right font-medium">نوع</th>
                      <th className="px-3 py-2 text-right font-medium">خطاها</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {importPreview.map((item, index) => (
                      <tr key={index} className={item.isValid ? 'bg-success-background/20' : 'bg-destructive/10'}>
                        <td className="px-3 py-2">{toPersianNumbers(item.rowIndex)}</td>
                        <td className="px-3 py-2">
                          <Badge variant={item.isValid ? 'default' : 'destructive'}>
                            {item.isValid ? 'معتبر' : 'نامعتبر'}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">{item.location}</td>
                        <td className="px-3 py-2">{toPersianNumbers(item.lastRechargeDate)}</td>
                        <td className="px-3 py-2">{getTypeLabel(item.type)}</td>
                        <td className="px-3 py-2">
                          {item.errors.length > 0 && (
                            <div className="text-destructive text-xs space-y-1">
                              {item.errors.map((error: string, i: number) => (
                                <div key={i}>• {error}</div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            {importPreview.length > 0 && (
              <Button
                onClick={handleImport}
                disabled={importPreview.filter(item => item.isValid).length === 0}
                className="bg-gradient-safety hover:opacity-90"
              >
                وارد کردن ({importPreview.filter(item => item.isValid).length} ردیف معتبر)
              </Button>
            )}
            <Button onClick={handleClose} variant="outline">
              انصراف
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;