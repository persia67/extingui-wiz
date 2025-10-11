import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'fa' } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = language === 'fa'
      ? `شما یک کارشناس ایمنی و اطفاء حریق هستید با تخصص در:
- استانداردهای بین‌المللی NFPA
- استانداردهای ملی ایران
- انواع کپسول‌های اطفاء حریق (پودری، گازی، فوم، آبی)
- سیستم‌های اطفاء حریق خودکار
- ارزیابی ریسک حریق
- تجهیزات ایمنی و اعلام حریق
- پروتکل‌های ایمنی صنعتی

وظایف شما:
1. پاسخ‌های دقیق و تخصصی به سوالات ایمنی و اطفاء حریق
2. راهنمایی در انتخاب تجهیزات مناسب
3. توضیح استانداردها و مقررات
4. ارائه راهکارهای عملی برای افزایش ایمنی

همیشه پاسخ‌های خود را به زبان فارسی و به صورت واضح و کاربردی ارائه دهید.`
      : `You are a fire safety and fire suppression expert specializing in:
- International NFPA standards
- Iranian national standards
- Types of fire extinguishers (powder, gas, foam, water)
- Automatic fire suppression systems
- Fire risk assessment
- Safety and fire alarm equipment
- Industrial safety protocols

Your responsibilities:
1. Provide accurate and professional answers to fire safety questions
2. Guide in selecting appropriate equipment
3. Explain standards and regulations
4. Offer practical solutions to enhance safety

Always provide clear and practical responses in English.`;

    console.log('Calling Lovable AI for fire safety chat...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error(language === 'fa'
          ? 'محدودیت تعداد درخواست. لطفاً کمی صبر کنید.'
          : 'Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error(language === 'fa'
          ? 'نیاز به شارژ اعتبار. لطفاً به تنظیمات مراجعه کنید.'
          : 'Payment required. Please add credits to your workspace.');
      }
      
      throw new Error('AI service error');
    }

    const data = await response.json();
    console.log('AI response received');

    const content = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fire-safety-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
