import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Plus, Download, Upload, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { DashboardSkeleton } from './DashboardSkeleton';
import { ExtinguisherTable } from './ExtinguisherTable';
import { ExtinguisherTableSkeleton } from './ExtinguisherTableSkeleton';
import { useExtinguisherData } from '../hooks/useExtinguisherData';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load modal components
const AddExtinguisherModal = lazy(() => import('./AddExtinguisherModal'));
const ImportModal = lazy(() => import('./ImportModal'));
const PWAInstallPrompt = lazy(() => import('./PWAInstallPrompt'));

const FireExtinguisherManagement = () => {
  const {
    extinguishers,
    isLoading,
    addExtinguisher,
    updateExtinguisher,
    deleteExtinguisher,
    importExtinguishers,
    exportToCSV
  } = useExtinguisherData();
  
  const { toast } = useToast();
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const isAdmin = userRole === 'admin';
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingExtinguisher, setEditingExtinguisher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredExtinguishers = extinguishers.filter(ext => {
    const matchesSearch = ext.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ext.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ext.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddExtinguisher = (data) => {
    addExtinguisher(data);
    setShowAddModal(false);
    toast({
      title: "موفقیت",
      description: "کپسول جدید با موفقیت اضافه شد",
    });
  };

  const handleUpdateExtinguisher = (data) => {
    updateExtinguisher(editingExtinguisher.id, data);
    setEditingExtinguisher(null);
    setShowAddModal(false);
    toast({
      title: "موفقیت", 
      description: "کپسول با موفقیت ویرایش شد",
    });
  };

  const handleDeleteExtinguisher = (id) => {
    if (window.confirm('آیا از حذف اطمینان دارید؟')) {
      deleteExtinguisher(id);
      toast({
        title: "حذف شد",
        description: "کپسول حذف شد",
        variant: "destructive",
      });
    }
  };

  const handleEditExtinguisher = (extinguisher) => {
    setEditingExtinguisher(extinguisher);
    setShowAddModal(true);
  };

  const handleImport = (data) => {
    const count = importExtinguishers(data);
    setShowImportModal(false);
    toast({
      title: "وارد شد",
      description: `${count} کپسول از فایل وارد شد`,
    });
  };

  const getCurrentPersianDate = () => {
    const today = new Date();
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(today);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'p-2' : 'p-4 md:p-6'}`} dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-soft p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`font-bold text-foreground ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                سیستم مدیریت کپسول‌های اطفاء حریق
              </h1>
              <p className="text-muted-foreground mt-2">
                مدیریت و پیگیری وضعیت کپسول‌های اطفاء حریق
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user?.email}</span>
                {userRole && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    userRole === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {userRole === 'admin' ? 'مدیر' : 'مشاهده‌گر'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                  {getCurrentPersianDate()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  خروج
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dashboard Stats */}
          {isLoading ? (
            <DashboardSkeleton isMobile={isMobile} />
          ) : (
            <Dashboard extinguishers={extinguishers} isMobile={isMobile} />
          )}
        </div>

        {/* Controls */}
        <div className="bg-card rounded-xl shadow-soft p-6 border border-border">
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
              <Input
                type="text"
                placeholder="جستجو بر اساس کد یا محل نصب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="فیلتر وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="warning">هشدار</SelectItem>
                  <SelectItem value="needs_recharge">نیاز به شارژ</SelectItem>
                  <SelectItem value="expired">منقضی</SelectItem>
                  <SelectItem value="out_of_order">خارج از سرویس</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Action Buttons */}
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row flex-wrap'}`}>
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="flex items-center gap-2 bg-success text-success-foreground hover:bg-success/90"
              >
                <Download className="w-4 h-4" />
                صادرات اکسل
              </Button>
              
              {isAdmin && (
                <>
                  <Button
                    onClick={() => setShowImportModal(true)}
                    variant="outline"
                    className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Upload className="w-4 h-4" />
                    وارد کردن اکسل
                  </Button>

                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-gradient-fire hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن کپسول
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Extinguisher Table */}
        {isLoading ? (
          <ExtinguisherTableSkeleton isMobile={isMobile} />
        ) : (
          <ExtinguisherTable
            extinguishers={filteredExtinguishers}
            onEdit={isAdmin ? handleEditExtinguisher : undefined}
            onDelete={isAdmin ? handleDeleteExtinguisher : undefined}
            isMobile={isMobile}
          />
        )}

        {/* Modals */}
        {isAdmin && (
          <>
            <Suspense fallback={null}>
              <AddExtinguisherModal
                isOpen={showAddModal}
                onClose={() => {
                  setShowAddModal(false);
                  setEditingExtinguisher(null);
                }}
                onSubmit={editingExtinguisher ? handleUpdateExtinguisher : handleAddExtinguisher}
                editingExtinguisher={editingExtinguisher}
                existingCodes={extinguishers.map(e => e.code)}
              />
            </Suspense>

            <Suspense fallback={null}>
              <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImport}
              />
            </Suspense>
          </>
        )}

        {/* PWA Install Prompt */}
        <Suspense fallback={null}>
          <PWAInstallPrompt />
        </Suspense>
      </div>
    </div>
  );
};

export default FireExtinguisherManagement;