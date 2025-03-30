import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface PathwayInsight {
  analysis: string;
  keyFactors: string;
  nextSteps: string;
  reflection: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateBusinessInsight(
  businessIdea: string,
  jobTitle: string,
  industry: string,
  ageRange: string,
  region: string
): Promise<PathwayInsight> {
  const prompt = `Analyze the following business idea and provide strategic guidance:

Profile:
- Current Role: ${jobTitle}
- Industry Experience: ${industry}
- Age Range: ${ageRange}
- Region: ${region}
- Business Idea: ${businessIdea}

Provide strategic analysis in JSON format with the following structure:
{
  "analysis": "A balanced risk/reward assessment of the business idea, considering market potential and the individual's background. Be specific about both opportunities and challenges.",
  
  "keyFactors": "List 4-5 critical success factors to consider, including market dynamics, required skillset, funding needs, and timing. Format as bullet points with brief explanations.",
  
  "nextSteps": "Recommend 2-3 concrete next steps to validate or prepare for this venture. Include specific actions, potential resources, and rough timeframes.",
  
  "reflection": "Provide 2-3 strategic questions the individual should deeply consider before proceeding. Frame these to provoke meaningful insight about their readiness and strategic fit."
}`;

  return await getGPTResponse(prompt, 'business advisor');
}

async function generateCareerInsight(
  targetCareer: string,
  jobTitle: string,
  industry: string,
  ageRange: string,
  region: string
): Promise<PathwayInsight> {
  const prompt = `Analyze the following career transition and provide strategic guidance:

Profile:
- Current Role: ${jobTitle}
- Current Industry: ${industry}
- Age Range: ${ageRange}
- Region: ${region}
- Target Career: ${targetCareer}

Provide strategic analysis in JSON format with the following structure:
{
  "analysis": "Analyze how their current experience and skills could transfer to ${targetCareer}. Highlight specific aspects of their background that could be valuable in the new role.",
  
  "keyFactors": "Identify the main gaps they'll need to close, including skills, certifications, or experience. Format as a clear list with specific examples and learning objectives.",
  
  "nextSteps": "Outline specific training paths, certifications, or learning resources they should pursue. Include concrete recommendations with timeframes and expected outcomes.",
  
  "reflection": "Provide a structured 3-6 month transition plan, broken down into key phases or milestones. Include both preparation and active transition activities."
}`;

  return await getGPTResponse(prompt, 'career coach');
}

async function getGPTResponse(prompt: string, role: 'business advisor' | 'career coach'): Promise<PathwayInsight> {
  try {
    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt
    });

    const systemPrompt = role === 'business advisor' 
      ? `You are a seasoned business advisor and entrepreneurship expert who helps professionals evaluate and launch new ventures.

Your guidance should:
- Be specific and actionable, avoiding generic advice
- Consider the individual's background and resources
- Balance enthusiasm with practical realism
- Focus on validation and risk mitigation
- Include both strategic and tactical considerations
- Reference relevant market and industry factors
- Maintain a supportive yet analytical tone
- Format recommendations in clear, structured points

Your insights should help individuals make informed decisions about entrepreneurship and take concrete steps forward.`
      : `You are an experienced career coach and transition specialist who helps professionals navigate strategic career changes.

Your guidance should:
- Be specific and actionable, avoiding generic advice
- Leverage the individual's existing experience
- Focus on practical transition strategies
- Identify specific skill transfer opportunities
- Consider industry-specific requirements
- Include both short and long-term planning
- Maintain an encouraging yet realistic tone
- Format recommendations in clear, structured points

Your insights should help individuals make informed decisions about career transitions and take concrete steps forward.`;

    // Run the Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_WUFm7dYA56F9ikZa28OSPt3M",
      instructions: systemPrompt
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
      analysis: response.analysis,
      keyFactors: response.keyFactors,
      nextSteps: response.nextSteps,
      reflection: response.reflection,
    };
  } catch (error) {
    console.error('Error generating pathway insight:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PathwayInsight | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      pathwayType,
      input,
      jobTitle, 
      industry, 
      ageRange, 
      region 
    } = req.body;

    // Validate required fields
    if (!pathwayType || !input || !jobTitle || !industry || !ageRange || !region) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insight = pathwayType === 'business'
      ? await generateBusinessInsight(input, jobTitle, industry, ageRange, region)
      : await generateCareerInsight(input, jobTitle, industry, ageRange, region);

    res.status(200).json(insight);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate pathway insight' });
  }
} 