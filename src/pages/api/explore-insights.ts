import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface ExplorationInsight {
  sections: {
    title: string;
    content: string;
  }[];
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
    'industry': `Analyze the industry trends and market dynamics affecting ${jobTitle} roles in the ${industry} sector.

Your response should be structured with the following sections:

1. "Current Industry Trajectory and Major Shifts"
- Analyze current industry direction and significant changes
- Impact on job roles and responsibilities
- Key growth areas and declining segments

2. "Economic Factors Impacting Job Stability"
- Market conditions affecting employment
- Budget trends and spending patterns
- Economic indicators and their implications

3. "Emerging Opportunities and Potential Threats"
- New market segments and role expansions
- Competitive pressures and challenges
- Innovation opportunities

4. "Regional Market Variations"
- Geographic differences in demand
- Location-specific trends
- Market maturity by region

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`,

    'technology': `Analyze the technological disruptions affecting ${jobTitle} roles in the ${industry} sector.

Your response should be structured with the following sections:

1. "Emerging Technologies Impact"
- Key technological trends
- Direct impact on current role
- Future technology adoption timeline

2. "Automation and AI Developments"
- Current automation capabilities
- AI integration in workflows
- Future automation projections

3. "Required Technical Adaptations"
- Essential technical skills
- Learning priorities
- Implementation challenges

4. "Digital Transformation Trends"
- Industry-specific digital shifts
- New tools and platforms
- Integration challenges and opportunities

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`,

    'role': `Analyze the key considerations for ${jobTitle} roles in the ${industry} sector.

Your response should be structured with the following sections:

1. "Role Evolution and Future Outlook"
- Changes in responsibilities
- Emerging role variations
- Future role projections

2. "Critical Skills and Competencies"
- Current skill requirements
- Emerging skill needs
- Core competency shifts

3. "Career Path Trajectories"
- Typical progression paths
- Alternative career routes
- Growth opportunities

4. "Adaptation Strategies"
- Key areas for development
- Risk mitigation approaches
- Professional positioning

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`
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
          - Tailored to the individual's context
          
          Format your response as a JSON object with an array of sections, each containing a title and detailed content.`
        },
        {
          role: "user",
          content: prompts[categoryKey]
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content!);
    
    return {
      sections: response.sections || []
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