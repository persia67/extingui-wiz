import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Plus, Download, Upload, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { DashboardSkeleton } from './DashboardSkeleton';
import { ExtinguisherTable } from './ExtinguisherTable';
import { ExtinguisherTableSkeleton } from './ExtinguisherTableSkeleton';
import { RiskAssessment } from './RiskAssessment';
import { FireSafetyChat } from './FireSafetyChat';
import { useExtinguisherData } from '../hooks/useExtinguisherData';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const { language, t } = useLanguage();
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
      title: t('success'),
      description: t('extinguisherAdded'),
    });
  };

  const handleUpdateExtinguisher = (data) => {
    updateExtinguisher(editingExtinguisher.id, data);
    setEditingExtinguisher(null);
    setShowAddModal(false);
    toast({
      title: t('success'), 
      description: t('extinguisherUpdated'),
    });
  };

  const handleDeleteExtinguisher = (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      deleteExtinguisher(id);
      toast({
        title: t('deleted'),
        description: t('extinguisherDeleted'),
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
      title: t('imported'),
      description: `${count} ${t('extinguishersImported')}`,
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
    <div className={`min-h-screen bg-background ${isMobile ? 'p-2' : 'p-4 md:p-6'}`} dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-soft p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`font-bold text-foreground ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                {t('systemTitle')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('systemDescription')}
              </p>
            </div>
            <div className={`flex flex-col ${language === 'fa' ? 'items-end' : 'items-start'} gap-2`}>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user?.email}</span>
                {userRole && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    userRole === 'admin' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                  }`}>
                    {t(userRole)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {language === 'fa' && (
                  <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                    {getCurrentPersianDate()}
                  </div>
                )}
                <ThemeToggle />
                <LanguageToggle />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className={`h-4 w-4 ${language === 'fa' ? 'ml-2' : 'mr-2'}`} />
                  {t('signOut')}
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

        {/* Main Content with Tabs */}
        <Tabs defaultValue="extinguishers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="extinguishers">
              {language === 'fa' ? 'مدیریت کپسول‌ها' : 'Manage Extinguishers'}
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="risk">
                {language === 'fa' ? 'ارزیابی ریسک' : 'Risk Assessment'}
              </TabsTrigger>
            )}
            <TabsTrigger value="chat">
              {language === 'fa' ? 'مشاور هوشمند' : 'AI Advisor'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="extinguishers" className="space-y-6">
            {/* Controls */}
            <div className="bg-card rounded-xl shadow-soft p-6 border border-border">
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                  <Input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('filterStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allStatuses')}</SelectItem>
                      <SelectItem value="active">{t('active')}</SelectItem>
                      <SelectItem value="warning">{t('warning')}</SelectItem>
                      <SelectItem value="needs_recharge">{t('needsRecharge')}</SelectItem>
                      <SelectItem value="expired">{t('expired')}</SelectItem>
                      <SelectItem value="out_of_order">{t('outOfOrder')}</SelectItem>
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
                    {t('exportExcel')}
                  </Button>
                  
                  {isAdmin && (
                    <>
                      <Button
                        onClick={() => setShowImportModal(true)}
                        variant="outline"
                        className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Upload className="w-4 h-4" />
                        {t('importExcel')}
                      </Button>

                      <Button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4" />
                        {t('addExtinguisher')}
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
          </TabsContent>

          {isAdmin && (
            <TabsContent value="risk">
              <RiskAssessment />
            </TabsContent>
          )}

          <TabsContent value="chat">
            <FireSafetyChat />
          </TabsContent>
        </Tabs>

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