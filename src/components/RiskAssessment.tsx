import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Loader2, Shield, Flame, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

export const RiskAssessment: React.FC = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    industryType: '',
    buildingSize: '',
    floorCount: '',
    employeeCount: '',
    equipment: '',
    hazardousMaterials: '',
    existingEquipment: '',
    additionalInfo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setAssessment(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('assess-fire-risk', {
        body: { 
          ...formData,
          language 
        }
      });

      if (functionError) throw functionError;
      if (data.error) throw new Error(data.error);

      setAssessment(data.assessment);
    } catch (err: any) {
      console.error('Risk assessment error:', err);
      setError(err.message || 'خطا در ارزیابی ریسک');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    const badges = {
      low: { color: 'bg-success text-success-foreground', label: language === 'fa' ? 'کم' : 'Low' },
      medium: { color: 'bg-warning text-warning-foreground', label: language === 'fa' ? 'متوسط' : 'Medium' },
      high: { color: 'bg-destructive text-destructive-foreground', label: language === 'fa' ? 'بالا' : 'High' }
    };
    const badge = badges[level as keyof typeof badges] || badges.medium;
    return <Badge className={badge.color}>{badge.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="border border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {language === 'fa' ? 'ارزیابی هوشمند ریسک حریق' : 'AI Fire Risk Assessment'}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'fa' 
              ? 'با استفاده از هوش مصنوعی، ریسک حریق محیط کار خود را ارزیابی کنید و پیشنهادات تخصصی برای تجهیزات اطفاء حریق دریافت کنید.'
              : 'Use AI to assess your workplace fire risk and receive expert recommendations for fire safety equipment.'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industryType">
                  {language === 'fa' ? 'نوع صنعت / فعالیت' : 'Industry Type'}
                </Label>
                <Select
                  value={formData.industryType}
                  onValueChange={(value) => setFormData({...formData, industryType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'fa' ? 'انتخاب کنید' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturing">{language === 'fa' ? 'تولیدی / صنعتی' : 'Manufacturing'}</SelectItem>
                    <SelectItem value="warehouse">{language === 'fa' ? 'انبار / لجستیک' : 'Warehouse'}</SelectItem>
                    <SelectItem value="office">{language === 'fa' ? 'اداری' : 'Office'}</SelectItem>
                    <SelectItem value="retail">{language === 'fa' ? 'تجاری / خرده‌فروشی' : 'Retail'}</SelectItem>
                    <SelectItem value="hospital">{language === 'fa' ? 'بیمارستان / درمانی' : 'Healthcare'}</SelectItem>
                    <SelectItem value="restaurant">{language === 'fa' ? 'رستوران / تهیه غذا' : 'Food Service'}</SelectItem>
                    <SelectItem value="chemical">{language === 'fa' ? 'شیمیایی / پتروشیمی' : 'Chemical'}</SelectItem>
                    <SelectItem value="other">{language === 'fa' ? 'سایر' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingSize">
                  {language === 'fa' ? 'مساحت ساختمان (متر مربع)' : 'Building Size (sqm)'}
                </Label>
                <Input
                  id="buildingSize"
                  type="number"
                  required
                  value={formData.buildingSize}
                  onChange={(e) => setFormData({...formData, buildingSize: e.target.value})}
                  placeholder={language === 'fa' ? 'مثال: 500' : 'e.g., 500'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floorCount">
                  {language === 'fa' ? 'تعداد طبقات' : 'Number of Floors'}
                </Label>
                <Input
                  id="floorCount"
                  type="number"
                  required
                  value={formData.floorCount}
                  onChange={(e) => setFormData({...formData, floorCount: e.target.value})}
                  placeholder={language === 'fa' ? 'مثال: 2' : 'e.g., 2'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">
                  {language === 'fa' ? 'تعداد پرسنل' : 'Number of Employees'}
                </Label>
                <Input
                  id="employeeCount"
                  type="number"
                  required
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                  placeholder={language === 'fa' ? 'مثال: 20' : 'e.g., 20'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">
                {language === 'fa' ? 'تجهیزات و دستگاه‌های موجود' : 'Equipment and Machinery'}
              </Label>
              <Textarea
                id="equipment"
                required
                value={formData.equipment}
                onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                placeholder={language === 'fa' ? 'مثال: کوره صنعتی، دستگاه جوش، سیستم برق 3 فاز...' : 'e.g., Industrial furnace, welding equipment, electrical systems...'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hazardousMaterials">
                {language === 'fa' ? 'مواد خطرناک / قابل اشتعال' : 'Hazardous/Flammable Materials'}
              </Label>
              <Textarea
                id="hazardousMaterials"
                value={formData.hazardousMaterials}
                onChange={(e) => setFormData({...formData, hazardousMaterials: e.target.value})}
                placeholder={language === 'fa' ? 'مثال: حلال‌های شیمیایی، رنگ، گاز، مواد قابل اشتعال...' : 'e.g., Chemical solvents, paints, gases, flammable materials...'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingEquipment">
                {language === 'fa' ? 'تجهیزات اطفاء حریق موجود' : 'Existing Fire Safety Equipment'}
              </Label>
              <Textarea
                id="existingEquipment"
                value={formData.existingEquipment}
                onChange={(e) => setFormData({...formData, existingEquipment: e.target.value})}
                placeholder={language === 'fa' ? 'مثال: کپسول آتش‌نشانی پودری، سیستم اسپرینکلر، دتکتور دود...' : 'e.g., Powder extinguishers, sprinkler system, smoke detectors...'}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">
                {language === 'fa' ? 'اطلاعات تکمیلی' : 'Additional Information'}
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                placeholder={language === 'fa' ? 'سایر اطلاعات مرتبط...' : 'Any other relevant information...'}
                rows={2}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className={`h-4 w-4 animate-spin ${language === 'fa' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'fa' ? 'در حال تحلیل...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Flame className={`h-4 w-4 ${language === 'fa' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'fa' ? 'ارزیابی ریسک' : 'Assess Risk'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {assessment && (
        <Card className="border border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              {language === 'fa' ? 'نتایج ارزیابی' : 'Assessment Results'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{language === 'fa' ? 'سطح ریسک:' : 'Risk Level:'}</span>
                {getRiskBadge(assessment.riskLevel)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {assessment.summary}
              </p>
            </div>

            {assessment.recommendations && assessment.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" />
                  {language === 'fa' ? 'تجهیزات پیشنهادی:' : 'Recommended Equipment:'}
                </h4>
                <div className="space-y-3">
                  {assessment.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-4 border border-border rounded-lg bg-card">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium mb-1">{rec.equipment}</h5>
                          <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                          {rec.quantity && (
                            <div className="text-sm">
                              <span className="font-medium">{language === 'fa' ? 'تعداد پیشنهادی:' : 'Suggested Quantity:'}</span>
                              <span className="ml-2">{rec.quantity}</span>
                            </div>
                          )}
                          {rec.location && (
                            <div className="text-sm mt-1">
                              <span className="font-medium">{language === 'fa' ? 'محل نصب:' : 'Location:'}</span>
                              <span className="ml-2">{rec.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {assessment.additionalNotes && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">{language === 'fa' ? 'توصیه‌های ایمنی:' : 'Safety Recommendations:'}</div>
                  <p className="text-sm">{assessment.additionalNotes}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};