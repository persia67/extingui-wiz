-- Update user role to admin
UPDATE public.user_roles 
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('rafiyanhamid@gmail.com', 'rafiyanhamid1989@gmail.com')
);