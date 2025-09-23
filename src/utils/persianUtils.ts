export const toPersianNumbers = (str: string | number): string => {
  if (!str && str !== 0) return '';
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishDigits = '0123456789';
  return str.toString().replace(/[0-9]/g, w => persianDigits[englishDigits.indexOf(w)]);
};

export const toEnglishNumbers = (str: string): string => {
  if (!str) return '';
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishDigits = '0123456789';
  return str.replace(/[۰-۹]/g, w => englishDigits[persianDigits.indexOf(w)]);
};

export const isValidPersianDate = (dateStr: string): boolean => {
  return /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr);
};

export const getCurrentPersianDate = (): string => {
  const today = new Date();
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(today);
};

export const calculateNextRechargeDate = (lastDate: string, type: string): string => {
  if (!lastDate) return '';
  
  const intervals = { 
    powder: 12, 
    co2: 60, 
    foam: 12, 
    water: 12 
  };
  
  const interval = intervals[type as keyof typeof intervals] || 12;
  const date = new Date(lastDate.replace(/\//g, '-'));
  date.setMonth(date.getMonth() + interval);
  
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};