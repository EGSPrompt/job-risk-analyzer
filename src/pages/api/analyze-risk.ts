import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type RiskTier = 'Low' | 'Moderate' | 'High' | 'Critical';

interface RiskAnalysis {
  riskScore: number;
  riskTier: RiskTier;
  summary: string;
}

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key. Please add OPENAI_API_KEY to your .env.local file');
}

// Initialize OpenAI client with validated API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Non-null assertion is safe here due to validation above
});

async function calculateRiskScore(
  jobTitle: string, 
  ageRange: string,
  industry: string, 
  companySize: string, 
  region: string
): Promise<RiskAnalysis> {
  try {
    // Prepare the prompt for GPT
    const prompt = `Analyze the automation and AI displacement risk for the following job:
    - Job Title: ${jobTitle}
    - Age Range: ${ageRange}
    - Industry: ${industry}
    - Company Size: ${companySize}
    - Region: ${region}

    Consider factors like:
    - Current automation technologies
    - AI capabilities and trends
    - Industry stability
    - Company size impact
    - Regional market conditions
    - Age-related factors and adaptability
    - Career stage implications

    Provide:
    1. A risk score from 0-100
    2. A risk tier (Low, Moderate, High, or Critical)
    3. A brief analysis summary that includes age-specific considerations
    
    Format the response as JSON with fields: riskScore, riskTier, summary`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI specialized in analyzing job market risks and future workforce trends. Provide detailed, well-reasoned analysis based on current market data and technological trends. Consider both technical skills and soft skills when analyzing different age groups. Respond only in valid JSON format using double quotes. Do not include code blocks or markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const gptContent = completion.choices[0].message.content;
    console.log("Raw GPT Output:", gptContent);

    // Parse the response
    const response = JSON.parse(gptContent!);

    // Validate and normalize the response
    const riskScore = Math.max(0, Math.min(100, response.riskScore));
    const riskTier = response.riskTier as RiskTier;
    
    return {
      riskScore,
      riskTier,
      summary: response.summary,
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    // Fallback to a basic response if API call fails
    return {
      riskScore: 50,
      riskTier: 'Moderate',
      summary: `Based on your input as a ${jobTitle} (age ${ageRange}) in the ${industry} industry, working for a ${companySize} company in ${region}, we've assessed your role's displacement risk as moderate. However, we encountered an issue getting detailed analysis. Please try again later.`,
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RiskAnalysis | { error: string }>
) {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
    }

    // Validate request body
    const { jobTitle, ageRange, industry, companySize, region } = req.body;
    
    if (!jobTitle || !ageRange || !industry || !companySize || !region) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide jobTitle, ageRange, industry, companySize, and region.' 
      });
    }

    // Process the request
    const analysis = await calculateRiskScore(
      jobTitle,
      ageRange,
      industry,
      companySize,
      region
    );

    return res.status(200).json(analysis);
  } catch (error) {
    // Log the error for debugging
    console.error('API Error:', error);
    
    // Return a generic error response
    return res.status(500).json({ 
      error: 'Internal Server Error. Please try again later.' 
    });
  }
} 