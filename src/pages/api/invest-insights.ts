import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface InvestmentInsight {
  sections: {
    title: string;
    content: string;
  }[];
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateInvestmentInsight(
  jobTitle: string,
  industry: string,
  riskScore: number,
  riskTier: string,
  skills: string[]
): Promise<InvestmentInsight> {
  const prompt = `Analyze investment opportunities and skill development paths for a ${jobTitle} in the ${industry} sector.

Your response should be structured with the following sections:

1. "Critical Skills Analysis"
- Assessment of current skill set: ${skills.join(', ')}
- Identification of skill gaps
- Priority areas for improvement
- Industry-specific requirements

2. "Strategic Learning Paths"
- Recommended certifications
- Training programs and courses
- Self-learning resources
- Estimated timelines

3. "Career Transition Options"
- Adjacent roles leveraging current skills
- Growth potential in alternative paths
- Required transitions steps
- Risk vs. reward analysis

4. "Investment Priorities"
- High-impact learning investments
- Cost-benefit analysis of options
- Short-term vs long-term returns
- Resource allocation strategy

Consider their risk score of ${riskScore} and ${riskTier} risk tier in your analysis.

Format the response as a JSON object with an array of sections, each having a "title" and "content" field.`;

  try {
    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt
    });

    // Run the Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_WUFm7dYA56F9ikZa28OSPt3M",
      instructions: `You are an expert career development advisor who provides strategic guidance on skill development 
      and career investments. Your recommendations should be:
      - Specific and actionable
      - Based on market demand
      - Cost-conscious but impactful
      - Focused on ROI
      - Tailored to the individual's context
      
      Format your response as a JSON object with an array of sections, each containing a title and detailed content.`
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (runStatus.status === "failed" || runStatus.status === "cancelled") {
        throw new Error(`Run ended with status: ${runStatus.status}`);
      }
    }

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessageContent = messages.data[0].content[0];
    
    if (lastMessageContent.type !== 'text') {
      throw new Error('Expected text response from assistant');
    }

    const response = JSON.parse(lastMessageContent.text.value);
    
    return {
      sections: response.sections || []
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
      jobTitle,
      industry,
      riskScore,
      riskTier,
      skills
    } = req.body;

    if (!jobTitle || !industry || riskScore === undefined || !riskTier || !skills) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insight = await generateInvestmentInsight(
      jobTitle,
      industry,
      riskScore,
      riskTier,
      skills
    );

    res.status(200).json(insight);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate investment insight' });
  }
} 