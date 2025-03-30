import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

interface RiskAnalysis {
  riskTier: RiskLevel;
  summaryOfFindings: string;
  whatTheDataSays: string[];
  keyPotentialDisruptors: string[];
  researchReferences: string[];
}

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key. Please add OPENAI_API_KEY to your .env.local file');
}

// Initialize OpenAI client with validated API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Non-null assertion is safe here due to validation above
});

async function analyzeRisk(
  jobTitle: string, 
  ageRange: string,
  industry: string, 
  companySize: string, 
  region: string
): Promise<RiskAnalysis> {
  try {
    console.log('Starting risk analysis for:', { jobTitle, ageRange, industry, companySize, region });
    
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

    Return your analysis in JSON format with the following structure:
    {
      "riskTier": "Low/Moderate/High/Very High",
      "summaryOfFindings": "A comprehensive summary of the risk analysis",
      "whatTheDataSays": [
        "Key finding about industry direction",
        "Impact on job roles",
        "Market conditions",
        "Geographic variations"
      ],
      "keyPotentialDisruptors": [
        "Major industry shifts",
        "Competitive pressures",
        "Innovation threats",
        "Economic factors"
      ],
      "researchReferences": [
        "Industry reports",
        "Market analysis",
        "Economic indicators",
        "Regional studies"
      ]
    }`;

    console.log('Sending prompt to OpenAI');
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI specialized in analyzing job market risks and future workforce trends. Provide detailed, well-reasoned analysis based on current market data and technological trends. Consider both technical skills and soft skills when analyzing different age groups. Your analysis should be specific and varied based on all input factors. Return only valid JSON with the exact structure requested. Each array should contain 3-5 detailed points."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const gptContent = completion.choices[0].message.content;
    console.log("Raw GPT Output:", gptContent);

    // Parse the response
    const response = JSON.parse(gptContent!);
    console.log("Parsed response:", response);

    return {
      riskTier: response.riskTier as RiskLevel,
      summaryOfFindings: response.summaryOfFindings,
      whatTheDataSays: response.whatTheDataSays,
      keyPotentialDisruptors: response.keyPotentialDisruptors,
      researchReferences: response.researchReferences
    };
  } catch (error) {
    console.error('Error in analyzeRisk:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    // Provide a fallback response
    return {
      riskTier: 'Moderate',
      summaryOfFindings: `Based on your input as a ${jobTitle} (age ${ageRange}) in the ${industry} industry, working for a ${companySize} company in ${region}, we've assessed your role's displacement risk as moderate. However, we encountered an issue getting detailed analysis. Please try again later.`,
      whatTheDataSays: [
        "Current market conditions suggest moderate disruption risk",
        "Your industry is experiencing ongoing technological changes",
        "Company size may influence adaptation requirements"
      ],
      keyPotentialDisruptors: [
        "Emerging automation technologies",
        "Changing industry dynamics",
        "Economic factors"
      ],
      researchReferences: [
        "Industry trend reports",
        "Market analysis studies",
        "Economic forecasts"
      ]
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RiskAnalysis | { error: string }>
) {
  try {
    // Debug logging
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Validate request body
    const { jobTitle, ageRange, industry, companySize, region } = req.body;
    
    if (!jobTitle || !ageRange || !industry || !companySize || !region) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide jobTitle, ageRange, industry, companySize, and region.' 
      });
    }

    // Log request data
    console.log('Processing request for:', { jobTitle, ageRange, industry, companySize, region });

    // Process the request
    const analysis = await analyzeRisk(
      jobTitle,
      ageRange,
      industry,
      companySize,
      region
    );

    // Log successful response
    console.log('Analysis completed:', analysis);

    return res.status(200).json(analysis);
  } catch (error) {
    // Log the full error for debugging
    console.error('API Error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return a generic error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 