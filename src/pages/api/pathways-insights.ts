import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface PathwaysInsight {
  sections: {
    title: string;
    content: string;
  }[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generatePathwaysInsight(
  category: string,
  jobTitle: string,
  industry: string,
  riskScore: number,
  riskTier: string,
  targetCareer?: string
): Promise<PathwaysInsight> {
  const prompts = {
    'business': `Analyze the potential for starting a business related to ${jobTitle} expertise in the ${industry} sector.

Your response should be structured with the following sections:

1. "Business Opportunity Analysis"
- Market gaps and needs
- Target customer segments
- Revenue potential
- Competitive landscape

2. "Required Resources"
- Initial investment needs
- Essential equipment/tools
- Key partnerships
- Legal requirements

3. "Risk Assessment"
- Market risks
- Financial considerations
- Regulatory challenges
- Mitigation strategies

4. "Implementation Roadmap"
- Launch timeline
- Key milestones
- Growth strategy
- Success metrics

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`,

    'freelance': `Analyze freelancing opportunities for someone with ${jobTitle} expertise in the ${industry} sector.

Your response should be structured with the following sections:

1. "Market Demand Analysis"
- High-demand services
- Target client segments
- Pricing strategies
- Competition overview

2. "Platform and Marketing"
- Best freelance platforms
- Portfolio requirements
- Marketing strategies
- Client acquisition

3. "Business Setup"
- Legal considerations
- Financial planning
- Tools and resources
- Professional network

4. "Growth Strategy"
- Scaling opportunities
- Specialization options
- Client retention
- Long-term sustainability

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`,

    'teaching': `Analyze opportunities for teaching or mentoring with ${jobTitle} expertise in the ${industry} sector.

Your response should be structured with the following sections:

1. "Teaching Opportunities"
- Educational institutions
- Online platforms
- Corporate training
- Mentorship programs

2. "Content Development"
- Course curriculum
- Teaching materials
- Delivery methods
- Assessment strategies

3. "Market Positioning"
- Target audience
- Unique value proposition
- Competition analysis
- Pricing structure

4. "Growth Path"
- Career progression
- Income potential
- Brand building
- Impact measurement

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`,

    'career': `Analyze the career transition from ${jobTitle} in ${industry} to ${targetCareer}.

Your response should be structured with the following sections:

1. "Transition Feasibility Analysis"
- Skill transferability assessment
- Market demand in target field
- Entry barriers and requirements
- Competitive advantages

2. "Required Preparation"
- Essential qualifications needed
- Key skills to develop
- Training and certification paths
- Timeline estimation

3. "Transition Strategy"
- Step-by-step transition plan
- Networking opportunities
- Portfolio development
- Interview preparation

4. "Risk and Opportunity Assessment"
- Financial implications
- Career growth potential
- Market stability comparison
- Success factors

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`
  };

  const categoryKey = category === 'Start Your Own Business' ? 'business'
    : category === 'Freelancing Opportunities' ? 'freelance'
    : category === 'Switch Careers' ? 'career'
    : 'teaching';

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert business and career strategist who provides detailed guidance on alternative career paths. 
          Your analysis should be:
          - Market-driven and practical
          - Focused on financial viability
          - Risk-aware and strategic
          - Action-oriented
          - Tailored to the individual's expertise
          
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
    console.error('Error generating pathways insight:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PathwaysInsight | { error: string }>
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
      riskTier,
      targetCareer
    } = req.body;

    if (!category || !jobTitle || !industry || riskScore === undefined || !riskTier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (category === 'Switch Careers' && !targetCareer) {
      return res.status(400).json({ error: 'Target career is required for career switch analysis' });
    }

    const insight = await generatePathwaysInsight(
      category,
      jobTitle,
      industry,
      riskScore,
      riskTier,
      targetCareer
    );

    res.status(200).json(insight);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate pathways insight' });
  }
} 