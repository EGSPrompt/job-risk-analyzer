import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface ExplorationInsight {
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateExplorationInsight(
  category: string,
  jobTitle: string,
  industry: string,
  riskScore: number,
  riskTier: string
): Promise<ExplorationInsight> {
  const prompts = {
    'industry': `Analyze the industry trends and market dynamics affecting ${jobTitle} roles in the ${industry} sector:

Key points to address:
- Current industry trajectory and major shifts
- Economic factors impacting job stability
- Emerging opportunities and potential threats
- Regional market variations
- Industry-specific risk factors (considering their risk score of ${riskScore} and ${riskTier} risk tier)

Format the response as a detailed analysis with clear sections and bullet points where appropriate.`,

    'technology': `Analyze the technological disruptions affecting ${jobTitle} roles in the ${industry} sector:

Key points to address:
- Emerging technologies impacting the role
- Automation and AI developments
- Required technical adaptations
- Digital transformation trends
- Technology-driven opportunities and threats (considering their risk score of ${riskScore} and ${riskTier} risk tier)

Format the response as a detailed analysis with clear sections and bullet points where appropriate.`,

    'role': `Analyze the key considerations for ${jobTitle} roles in the ${industry} sector:

Key points to address:
- Evolution of role responsibilities
- Changing skill requirements
- Career path trajectories
- Role-specific risk factors
- Adaptation strategies (considering their risk score of ${riskScore} and ${riskTier} risk tier)

Format the response as a detailed analysis with clear sections and bullet points where appropriate.`
  };

  const categoryKey = category === 'Industry & Market Trends' ? 'industry' 
    : category === 'Technology Disruptors' ? 'technology'
    : 'role';

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert career analyst and industry specialist who provides detailed, 
          data-driven insights about career trajectories and market dynamics. Your analysis should be:
          - Specific and actionable
          - Based on current market realities
          - Focused on practical implications
          - Forward-looking but grounded
          - Tailored to the individual's context`
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
    console.error('Error generating exploration insight:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExplorationInsight | { error: string }>
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

    const insight = await generateExplorationInsight(
      category,
      jobTitle,
      industry,
      riskScore,
      riskTier
    );

    res.status(200).json(insight);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate exploration insight' });
  }
} 