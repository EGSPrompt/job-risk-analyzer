import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface InvestmentInsights {
  skillsNeeded: string;
  reskillingOptions: string;
  adjacentRoles: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateInvestmentInsights(
  jobTitle: string,
  industry: string,
  companySize: string,
  ageRange: string,
  region: string,
  riskScore: number,
  riskTier: string
): Promise<InvestmentInsights> {
  try {
    const prompt = `Analyze the following professional profile and provide strategic investment recommendations:

Job Profile:
- Title: ${jobTitle}
- Industry: ${industry}
- Company Size: ${companySize}
- Age Range: ${ageRange}
- Region: ${region}
- Risk Score: ${riskScore}
- Risk Tier: ${riskTier}

Provide three strategic recommendation blocks in JSON format with the following structure:
{
  "skillsNeeded": "List 3-5 specific, strategic skills that will be crucial for future-proofing this role. Focus on emerging technologies, soft skills, and industry-specific competencies that align with automation trends. Format as a clear, bulleted list with brief context.",
  
  "reskillingOptions": "Recommend 2-3 specific learning paths, certifications, or upskilling programs. Consider the professional's age range and current role. Include estimated timeframes and potential impact. Format as clear recommendations with concrete next steps.",
  
  "adjacentRoles": "Suggest 2-3 alternative career paths that leverage existing skills but offer better automation resistance. Include brief rationale for each role and key transition steps. Format as clear role suggestions with strategic context."
}

Each recommendation should be concise, actionable, and professionally formatted.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a senior career strategist and workforce development expert specializing in future-proof career planning.

Your recommendations should:
- Be highly specific and actionable, avoiding generic advice
- Focus on emerging and high-growth areas within the industry
- Consider company size and regional market dynamics
- Account for age-appropriate career progression
- Balance immediate skill gaps with long-term career resilience
- Prioritize skills and roles with strong automation resistance
- Include specific certifications and learning platforms where relevant
- Consider both technical and leadership/strategic capabilities
- Maintain a confident, encouraging, yet realistic tone
- Format recommendations in clear, scannable structures

Your insights should help professionals make strategic decisions about their skill development and career evolution.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content!);
    
    return {
      skillsNeeded: response.skillsNeeded,
      reskillingOptions: response.reskillingOptions,
      adjacentRoles: response.adjacentRoles,
    };
  } catch (error) {
    console.error('Error generating investment insights:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvestmentInsights | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      jobTitle, 
      industry, 
      companySize, 
      ageRange, 
      region,
      riskScore,
      riskTier 
    } = req.body;

    // Validate required fields
    if (!jobTitle || !industry || !companySize || !ageRange || !region || !riskScore || !riskTier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insights = await generateInvestmentInsights(
      jobTitle,
      industry,
      companySize,
      ageRange,
      region,
      riskScore,
      riskTier
    );

    res.status(200).json(insights);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate investment insights' });
  }
} 