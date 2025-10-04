-- Create extinguishers table
CREATE TABLE public.extinguishers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity TEXT NOT NULL,
  last_recharge_date TEXT NOT NULL,
  next_recharge_date TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.extinguishers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is implemented)
CREATE POLICY "Enable read access for all users" 
ON public.extinguishers 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.extinguishers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.extinguishers 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete access for all users" 
ON public.extinguishers 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_extinguishers_updated_at
BEFORE UPDATE ON public.extinguishers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.extinguishers;