import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface ExplorationInsight {
  riskTier: string;
  summaryOfFindings: string;
  whatTheDataSays: string[];
  keyPotentialDisruptors: string[];
  researchReferences: string[];
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

Provide your analysis in JSON format with the following structure:
{
  "riskTier": "${riskTier}",
  "summaryOfFindings": "A comprehensive summary of the industry analysis and its implications for the role",
  "whatTheDataSays": [
    "Key finding about industry direction and significant changes",
    "Impact on job roles and responsibilities",
    "Market conditions affecting employment",
    "Geographic and regional variations in demand"
  ],
  "keyPotentialDisruptors": [
    "Major industry shifts that could impact the role",
    "Competitive pressures and challenges",
    "Innovation opportunities and threats",
    "Economic factors affecting stability"
  ],
  "researchReferences": [
    "Relevant industry reports and data sources",
    "Market analysis references",
    "Economic indicators and trends",
    "Regional market studies"
  ]
}

Consider their risk score of ${riskScore} and current risk tier in your analysis.`,

    'technology': `Analyze the technological disruptions affecting ${jobTitle} roles in the ${industry} sector.

Provide your analysis in JSON format with the following structure:
{
  "riskTier": "${riskTier}",
  "summaryOfFindings": "A comprehensive summary of technological impacts and future implications",
  "whatTheDataSays": [
    "Current state of technology adoption",
    "Impact on workflows and processes",
    "Required technical adaptations",
    "Digital transformation progress"
  ],
  "keyPotentialDisruptors": [
    "Emerging technologies affecting the role",
    "Automation and AI developments",
    "New tools and platforms",
    "Integration challenges"
  ],
  "researchReferences": [
    "Technology trend reports",
    "Industry automation studies",
    "Digital transformation research",
    "Tech adoption forecasts"
  ]
}

Consider their risk score of ${riskScore} and current risk tier in your analysis.`,

    'role': `Analyze the key considerations for ${jobTitle} roles in the ${industry} sector.

Provide your analysis in JSON format with the following structure:
{
  "riskTier": "${riskTier}",
  "summaryOfFindings": "A comprehensive summary of role evolution and future outlook",
  "whatTheDataSays": [
    "Current role requirements and responsibilities",
    "Emerging skill needs and competencies",
    "Career progression opportunities",
    "Professional development trends"
  ],
  "keyPotentialDisruptors": [
    "Changes in role expectations",
    "New skill requirements",
    "Career path shifts",
    "Market demand changes"
  ],
  "researchReferences": [
    "Job market analysis reports",
    "Skills demand studies",
    "Career trajectory research",
    "Professional development guides"
  ]
}

Consider their risk score of ${riskScore} and current risk tier in your analysis.`
  };

  const categoryKey = category === 'Industry & Market Trends' ? 'industry' 
    : category === 'Technology Disruptors' ? 'technology'
    : 'role';

  try {
    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompts[categoryKey]
    });

    // Run the Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_WUFm7dYA56F9ikZa28OSPt3M",
      instructions: `You are an expert career analyst and industry specialist who provides detailed, 
      data-driven insights about career trajectories and market dynamics. Your analysis should be:
      - Specific and actionable
      - Based on current market realities
      - Focused on practical implications
      - Forward-looking but grounded
      - Tailored to the individual's context
      
      Return your response in the exact JSON format specified in the prompt.`
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
      riskTier: response.riskTier,
      summaryOfFindings: response.summaryOfFindings,
      whatTheDataSays: response.whatTheDataSays,
      keyPotentialDisruptors: response.keyPotentialDisruptors,
      researchReferences: response.researchReferences
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