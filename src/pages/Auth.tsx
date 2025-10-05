import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Flame } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' }),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمز عبور و تکرار آن یکسان نیستند',
  path: ['confirmPassword'],
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Validate login
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          setError(result.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('ایمیل یا رمز عبور اشتباه است');
          } else if (signInError.message.includes('Email not confirmed')) {
            setError('لطفا ابتدا ایمیل خود را تایید کنید');
          } else {
            setError('خطا در ورود: ' + signInError.message);
          }
        }
      } else {
        // Validate signup
        const result = signupSchema.safeParse({ email, password, confirmPassword, fullName });
        if (!result.success) {
          setError(result.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            setError('این ایمیل قبلا ثبت شده است');
          } else if (signUpError.message.includes('Password should be at least')) {
            setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
          } else {
            setError('خطا در ثبت‌نام: ' + signUpError.message);
          }
        } else {
          setSuccess('ثبت‌نام با موفقیت انجام شد! در حال ورود...');
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        }
      }
    } catch (err: any) {
      setError('خطای غیرمنتظره: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Flame className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'ورود به سیستم' : 'ثبت‌نام'}
          </CardTitle>
          <CardDescription>
            مدیریت کپسول‌های آتش‌نشانی
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">نام کامل</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="نام و نام خانوادگی"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                required
                disabled={isLoading}
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="تکرار رمز عبور"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'در حال پردازش...' : (isLogin ? 'ورود' : 'ثبت‌نام')}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              {isLogin ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'حساب دارید؟ وارد شوید'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}