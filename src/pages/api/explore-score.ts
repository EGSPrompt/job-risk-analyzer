import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface ExplorationInsights {
  industryTrends: string;
  techDisruptors: string;
  roleConsiderations: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateInsights(
  jobTitle: string,
  industry: string,
  companySize: string,
  ageRange: string,
  region: string,
  riskScore: number,
  riskTier: string
): Promise<ExplorationInsights> {
  try {
    const prompt = `Analyze the following professional profile and provide strategic insights:

Job Profile:
- Title: ${jobTitle}
- Industry: ${industry}
- Company Size: ${companySize}
- Age Range: ${ageRange}
- Region: ${region}
- Risk Score: ${riskScore}
- Risk Tier: ${riskTier}

Provide three strategic insight blocks in JSON format with the following structure:
{
  "industryTrends": "Analysis of current and emerging industry trends, market dynamics, and sector-specific disruptions that could impact this role. Focus on strategic implications and future outlook.",
  "techDisruptors": "Analysis of specific technologies, automation trends, and digital transformations affecting this role. Include both threats and opportunities.",
  "roleConsiderations": "Strategic analysis of role-specific factors, including key skills to develop, potential career pivots, and ways to increase value proposition."
}

Each insight should be 2-3 sentences, written in a confident, professional tone with actionable strategic implications.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a senior strategic workforce analyst specializing in future of work trends and career strategy. 
          
Your analysis should:
- Be data-driven and specific to the provided profile
- Focus on actionable insights and strategic implications
- Consider both immediate impacts and longer-term trends
- Balance challenges with opportunities
- Maintain a confident, authoritative tone while being constructive
- Provide concrete examples and specific technologies where relevant
- Consider how company size and industry dynamics intersect
- Account for age-specific career stage implications
- Reference relevant market conditions for the specified region

Your insights should help professionals make informed decisions about their career trajectory in the context of technological disruption.`
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
      industryTrends: response.industryTrends,
      techDisruptors: response.techDisruptors,
      roleConsiderations: response.roleConsiderations,
    };
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExplorationInsights | { error: string }>
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

    const insights = await generateInsights(
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
    res.status(500).json({ error: 'Failed to generate insights' });
  }
} 