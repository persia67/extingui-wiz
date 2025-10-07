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
    const { 
      industryType, 
      buildingSize, 
      floorCount, 
      employeeCount, 
      equipment, 
      hazardousMaterials, 
      existingEquipment, 
      additionalInfo,
      language = 'fa'
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = language === 'fa' 
      ? `شما یک کارشناس ایمنی و اطفاء حریق هستید که بر اساس استانداردهای بین‌المللی NFPA و استانداردهای ملی ایران، ارزیابی ریسک حریق انجام می‌دهید.

وظیفه شما:
1. سطح ریسک حریق را ارزیابی کنید (low, medium, high)
2. تجهیزات اطفاء حریق مورد نیاز را با توجه به نوع صنعت، مواد موجود و ابعاد ساختمان مشخص کنید
3. تعداد و ظرفیت دقیق هر تجهیز را براساس محاسبات استاندارد بیان کنید
4. محل نصب بهینه را پیشنهاد دهید

پاسخ را به فارسی و در قالب JSON زیر ارائه دهید:
{
  "riskLevel": "low|medium|high",
  "summary": "خلاصه ارزیابی به فارسی",
  "recommendations": [
    {
      "equipment": "نام تجهیز (مثال: کپسول آتش‌نشانی پودری ۶ کیلویی)",
      "quantity": "تعداد مورد نیاز",
      "reason": "دلیل نیاز به این تجهیز",
      "location": "محل نصب پیشنهادی"
    }
  ],
  "additionalNotes": "توصیه‌های تکمیلی ایمنی"
}`
      : `You are a fire safety expert who conducts fire risk assessments based on international NFPA standards and Iranian national standards.

Your task:
1. Assess the fire risk level (low, medium, high)
2. Specify required fire safety equipment based on industry type, materials, and building dimensions
3. State the exact quantity and capacity of each equipment based on standard calculations
4. Suggest optimal installation locations

Provide response in English in the following JSON format:
{
  "riskLevel": "low|medium|high",
  "summary": "Assessment summary in English",
  "recommendations": [
    {
      "equipment": "Equipment name (e.g., 6kg Powder Fire Extinguisher)",
      "quantity": "Required quantity",
      "reason": "Reason for this equipment",
      "location": "Suggested installation location"
    }
  ],
  "additionalNotes": "Additional safety recommendations"
}`;

    const userPrompt = language === 'fa'
      ? `لطفاً ریسک حریق را بر اساس اطلاعات زیر ارزیابی کنید:

نوع صنعت: ${industryType}
مساحت ساختمان: ${buildingSize} متر مربع
تعداد طبقات: ${floorCount}
تعداد پرسنل: ${employeeCount}
تجهیزات و دستگاه‌ها: ${equipment}
مواد خطرناک: ${hazardousMaterials || 'ندارد'}
تجهیزات موجود: ${existingEquipment || 'ندارد'}
${additionalInfo ? `اطلاعات تکمیلی: ${additionalInfo}` : ''}

لطفاً ارزیابی کامل و دقیق ارائه دهید.`
      : `Please assess fire risk based on the following information:

Industry Type: ${industryType}
Building Size: ${buildingSize} sqm
Number of Floors: ${floorCount}
Number of Employees: ${employeeCount}
Equipment and Machinery: ${equipment}
Hazardous Materials: ${hazardousMaterials || 'None'}
Existing Equipment: ${existingEquipment || 'None'}
${additionalInfo ? `Additional Info: ${additionalInfo}` : ''}

Please provide a complete and accurate assessment.`;

    console.log('Calling Lovable AI for fire risk assessment...');

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
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
    const assessment = JSON.parse(content);

    return new Response(JSON.stringify({ assessment }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in assess-fire-risk function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});