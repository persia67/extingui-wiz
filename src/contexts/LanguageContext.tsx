import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fa: {
    // Header
    systemTitle: 'سیستم مدیریت کپسول‌های اطفاء حریق',
    systemDescription: 'مدیریت و پیگیری وضعیت کپسول‌های اطفاء حریق',
    signOut: 'خروج',
    admin: 'مدیر',
    viewer: 'مشاهده‌گر',
    
    // Dashboard
    totalExtinguishers: 'کل کپسول‌ها',
    active: 'فعال',
    warning: 'هشدار',
    expired: 'منقضی',
    
    // Controls
    searchPlaceholder: 'جستجو بر اساس کد یا محل نصب...',
    filterStatus: 'فیلتر وضعیت',
    allStatuses: 'همه وضعیت‌ها',
    exportExcel: 'صادرات اکسل',
    importExcel: 'وارد کردن اکسل',
    addExtinguisher: 'افزودن کپسول',
    
    // Table
    code: 'کد',
    location: 'محل نصب',
    type: 'نوع',
    capacity: 'ظرفیت',
    nextRecharge: 'شارژ بعدی',
    status: 'وضعیت',
    actions: 'عملیات',
    edit: 'ویرایش',
    delete: 'حذف',
    noExtinguishers: 'هیچ کپسولی یافت نشد',
    
    // Types
    powder: 'پودری',
    co2: 'دی اکسید کربن',
    foam: 'فوم',
    water: 'آبی',
    
    // Statuses
    statusActive: 'فعال',
    statusWarning: 'هشدار - یک ماه مانده',
    needsRecharge: 'نیاز به شارژ',
    statusExpired: 'منقضی',
    outOfOrder: 'خارج از سرویس',
    
    // Modal
    addNewExtinguisher: 'افزودن کپسول جدید',
    editExtinguisher: 'ویرایش کپسول',
    extinguisherCode: 'کد کپسول',
    autoGenerate: 'خالی بگذارید تا خودکار تولید شود',
    mainLocation: 'محل اصلی',
    specificAddress: 'آدرس دقیق',
    extinguisherType: 'نوع کپسول',
    capacityKg: 'ظرفیت (کیلوگرم)',
    lastRecharge: 'آخرین شارژ',
    cancel: 'انصراف',
    submit: 'افزودن',
    
    // Auth
    signIn: 'ورود',
    signUp: 'ثبت نام',
    email: 'ایمیل',
    password: 'رمز عبور',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: 'رمز عبور خود را وارد کنید',
    noAccount: 'حساب کاربری ندارید؟',
    haveAccount: 'حساب کاربری دارید؟',
    signUpNow: 'ثبت نام کنید',
    signInNow: 'وارد شوید',
    
    // Toast
    success: 'موفقیت',
    extinguisherAdded: 'کپسول جدید با موفقیت اضافه شد',
    extinguisherUpdated: 'کپسول با موفقیت ویرایش شد',
    deleted: 'حذف شد',
    extinguisherDeleted: 'کپسول حذف شد',
    imported: 'وارد شد',
    extinguishersImported: 'کپسول از فایل وارد شد',
    deleteConfirm: 'آیا از حذف اطمینان دارید؟',
  },
  en: {
    // Header
    systemTitle: 'Fire Extinguisher Management System',
    systemDescription: 'Manage and track fire extinguisher status',
    signOut: 'Sign Out',
    admin: 'Admin',
    viewer: 'Viewer',
    
    // Dashboard
    totalExtinguishers: 'Total Extinguishers',
    active: 'Active',
    warning: 'Warning',
    expired: 'Expired',
    
    // Controls
    searchPlaceholder: 'Search by code or location...',
    filterStatus: 'Filter Status',
    allStatuses: 'All Statuses',
    exportExcel: 'Export Excel',
    importExcel: 'Import Excel',
    addExtinguisher: 'Add Extinguisher',
    
    // Table
    code: 'Code',
    location: 'Location',
    type: 'Type',
    capacity: 'Capacity',
    nextRecharge: 'Next Recharge',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    noExtinguishers: 'No extinguishers found',
    
    // Types
    powder: 'Powder',
    co2: 'CO2',
    foam: 'Foam',
    water: 'Water',
    
    // Statuses
    statusActive: 'Active',
    statusWarning: 'Warning - 1 month left',
    needsRecharge: 'Needs Recharge',
    statusExpired: 'Expired',
    outOfOrder: 'Out of Order',
    
    // Modal
    addNewExtinguisher: 'Add New Extinguisher',
    editExtinguisher: 'Edit Extinguisher',
    extinguisherCode: 'Extinguisher Code',
    autoGenerate: 'Leave empty to auto-generate',
    mainLocation: 'Main Location',
    specificAddress: 'Specific Address',
    extinguisherType: 'Extinguisher Type',
    capacityKg: 'Capacity (kg)',
    lastRecharge: 'Last Recharge',
    cancel: 'Cancel',
    submit: 'Submit',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: 'Enter your password',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUpNow: 'Sign up',
    signInNow: 'Sign in',
    
    // Toast
    success: 'Success',
    extinguisherAdded: 'Extinguisher added successfully',
    extinguisherUpdated: 'Extinguisher updated successfully',
    deleted: 'Deleted',
    extinguisherDeleted: 'Extinguisher deleted',
    imported: 'Imported',
    extinguishersImported: 'extinguishers imported from file',
    deleteConfirm: 'Are you sure you want to delete?',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fa');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fa' ? 'en' : 'fa');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};