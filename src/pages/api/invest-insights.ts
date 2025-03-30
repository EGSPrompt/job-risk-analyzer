import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface InvestmentInsight {
  content: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateInvestmentInsight(
  category: string,
  jobTitle: string,
  industry: string,
  riskScore: number,
  riskTier: string
): Promise<InvestmentInsight> {
  const prompts = {
    'skills': `Analyze the essential skills needed for ${jobTitle} roles in the ${industry} sector to enhance career resilience:

Key points to address:
- Critical technical skills for future-proofing
- Essential soft skills and leadership capabilities
- Emerging skill requirements in the industry
- Skills that address current vulnerabilities (considering risk score: ${riskScore}, tier: ${riskTier})
- Priority areas for immediate skill development

Format the response as a detailed analysis with clear sections and bullet points where appropriate.`,

    'reskilling': `Provide specific reskilling recommendations for a ${jobTitle} in the ${industry} sector:

Key points to address:
- Recommended training programs and certifications
- Online learning platforms and resources
- Estimated time investment and costs
- Priority order for skill acquisition
- ROI considerations for different learning paths (considering risk score: ${riskScore}, tier: ${riskTier})

Format the response as a detailed analysis with clear sections and bullet points where appropriate.`,

    'adjacent': `Identify and analyze adjacent career roles for a ${jobTitle} in the ${industry} sector:

Key points to address:
- Closely related roles leveraging existing skills
- Growth potential in adjacent positions
- Required transitions and skill gaps
- Market demand for alternative roles
- Risk mitigation through role diversity (considering risk score: ${riskScore}, tier: ${riskTier})

Format the response as a detailed analysis with clear sections and bullet points where appropriate.`
  };

  const categoryKey = category === 'Skills Needed' ? 'skills'
    : category === 'Reskilling Options' ? 'reskilling'
    : 'adjacent';

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert career development advisor who specializes in skill development and career transitions.
          Your recommendations should be:
          - Specific and actionable
          - Focused on practical skill development
          - Based on current market demands
          - Prioritized by impact and urgency
          - Tailored to the individual's context and risk profile
          - Include specific resources and next steps`
        },
        {
          role: "user",
          content: prompts[categoryKey]
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    return {
      content: completion.choices[0].message.content || "No insight generated"
    };
  } catch (error) {
    console.error('Error generating investment insight:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvestmentInsight | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      category,
      jobTitle,
      industry,
      riskScore,
      riskTier
    } = req.body;

    if (!category || !jobTitle || !industry || riskScore === undefined || !riskTier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insight = await generateInvestmentInsight(
      category,
      jobTitle,
      industry,
      riskScore,
      riskTier
    );

    res.status(200).json(insight);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate investment insight' });
  }
} 