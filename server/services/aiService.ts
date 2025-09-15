import { GoogleGenerativeAI } from "@google/generative-ai";
import type { InsertBusinessIdea, InsertLearningRoadmap, InsertRoadmapPhase, InsertRoadmapMilestone } from "@shared/schema";

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing required Gemini API key: GEMINI_API_KEY');
}

// the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface BusinessIdeaRequest {
  industry: string;
  businessModel: string;
  targetMarket: string;
  userSkills: string[];
  budgetRange: string;
  experienceLevel: string;
}

export interface LearningRoadmapRequest {
  skills: string[];
  industry: string;
  experienceLevel: string;
  targetRole: string;
}

export interface MarketAnalysisRequest {
  industry: string;
  businessIdea: string;
  targetMarket: string;
}

export interface FundingRecommendationRequest {
  businessStage: string;
  industry: string;
  fundingAmount: string;
  location: string;
}

export class AIService {
  async generateBusinessIdeas(userId: string, request: BusinessIdeaRequest): Promise<Partial<InsertBusinessIdea>[]> {
    try {
      const prompt = `
You are a business strategy expert. Generate 3 personalized business ideas for an entrepreneur with the following profile:

- Industry Interest: ${request.industry}
- Preferred Business Model: ${request.businessModel}
- Target Market: ${request.targetMarket}
- Skills: ${request.userSkills.join(', ')}
- Budget Range: ${request.budgetRange}
- Experience Level: ${request.experienceLevel}

For each business idea, provide:
- title: A catchy business name/concept
- description: 2-3 sentences explaining the business
- industry: The primary industry
- businessModel: The business model type
- targetMarket: The target customer segment
- matchScore: A score from 1-10 based on how well it matches the user's profile
- marketSize: Estimated market size (e.g., "$350B", "$45B")
- competitionLevel: "Low", "Medium", or "High"

Respond with JSON in this format:
{
  "ideas": [
    {
      "title": "string",
      "description": "string",
      "industry": "string",
      "businessModel": "string",
      "targetMarket": "string",
      "matchScore": "number",
      "marketSize": "string",
      "competitionLevel": "string"
    }
  ]
}
`;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const response = await model.generateContent(prompt);
      const result = JSON.parse(response.response.text() || '{}');
      
      return result.ideas?.map((idea: any) => ({
        userId,
        title: idea.title,
        description: idea.description,
        industry: idea.industry,
        businessModel: idea.businessModel,
        targetMarket: idea.targetMarket,
        matchScore: idea.matchScore?.toString(),
        marketSize: idea.marketSize,
        competitionLevel: idea.competitionLevel,
        aiGenerated: true,
      })) || [];
    } catch (error) {
      console.error('Error generating business ideas:', error);
      throw new Error('Failed to generate business ideas');
    }
  }

  async generateLearningRoadmap(userId: string, request: LearningRoadmapRequest): Promise<{
    roadmap: Partial<InsertLearningRoadmap>;
    phases: Partial<InsertRoadmapPhase>[];
    milestones: Partial<InsertRoadmapMilestone>[][];
  }> {
    try {
      const prompt = `
You are a learning and development expert. Create a comprehensive learning roadmap for someone with this profile:

- Current Skills: ${request.skills.join(', ')}
- Target Industry: ${request.industry}
- Experience Level: ${request.experienceLevel}
- Target Role: ${request.targetRole}

Create a roadmap with 3 phases, each containing 2-4 milestones. Structure it as:

Roadmap:
- title: Main roadmap title
- description: Brief overview
- category: Learning category
- estimatedDuration: Total time estimate

Phases (3 phases):
- phaseNumber: 1, 2, or 3
- title: Phase title
- description: What this phase covers
- status: "unlocked" for phase 1, "locked" for others

Milestones (2-4 per phase):
- title: Milestone title
- description: What will be learned
- resourceType: "course", "book", "certification", "project"
- resourceProvider: "Coursera", "Udemy", "EdX", "LinkedIn Learning", etc.
- estimatedHours: Number of hours
- order: Order within the phase (1, 2, 3, 4)

Respond with JSON in this format:
{
  "roadmap": {
    "title": "string",
    "description": "string", 
    "category": "string",
    "estimatedDuration": "string"
  },
  "phases": [
    {
      "phaseNumber": 1,
      "title": "string",
      "description": "string",
      "status": "string"
    }
  ],
  "milestones": [
    [
      {
        "title": "string",
        "description": "string",
        "resourceType": "string",
        "resourceProvider": "string",
        "estimatedHours": number,
        "order": number
      }
    ]
  ]
}
`;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const response = await model.generateContent(prompt);
      const result = JSON.parse(response.response.text() || '{}');
      
      return {
        roadmap: {
          userId,
          title: result.roadmap?.title,
          description: result.roadmap?.description,
          category: result.roadmap?.category,
          estimatedDuration: result.roadmap?.estimatedDuration,
          totalPhases: 3,
          currentPhase: 1,
          progressPercentage: "0",
        },
        phases: result.phases?.map((phase: any) => ({
          phaseNumber: phase.phaseNumber,
          title: phase.title,
          description: phase.description,
          status: phase.status,
          progressPercentage: "0",
        })) || [],
        milestones: result.milestones || [],
      };
    } catch (error) {
      console.error('Error generating learning roadmap:', error);
      throw new Error('Failed to generate learning roadmap');
    }
  }

  async generateMarketAnalysis(request: MarketAnalysisRequest): Promise<any> {
    try {
      const prompt = `
You are a market research analyst. Provide a comprehensive market analysis for:

- Industry: ${request.industry}
- Business Idea: ${request.businessIdea}
- Target Market: ${request.targetMarket}

Provide analysis including:
- marketSize: Total addressable market size
- growthRate: Annual growth percentage
- keyTrends: 3-4 major market trends
- opportunities: 2-3 key opportunities
- challenges: 2-3 main challenges
- competitorCount: Estimated number of competitors
- topCompetitors: 3-5 major competitors with brief descriptions

Respond with JSON in this format:
{
  "marketSize": "string",
  "growthRate": "string", 
  "keyTrends": ["string"],
  "opportunities": ["string"],
  "challenges": ["string"],
  "competitorCount": number,
  "topCompetitors": [
    {
      "name": "string",
      "description": "string",
      "stage": "string"
    }
  ]
}
`;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const response = await model.generateContent(prompt);
      return JSON.parse(response.response.text() || '{}');
    } catch (error) {
      console.error('Error generating market analysis:', error);
      throw new Error('Failed to generate market analysis');
    }
  }

  async generateMentorResponse(userMessage: string, userContext: any): Promise<string> {
    try {
      const prompt = `
You are an experienced business mentor and entrepreneur. You're helping an entrepreneur with their business journey.

User Context:
- Industry: ${userContext.industry || 'Not specified'}
- Experience Level: ${userContext.experienceLevel || 'Not specified'}
- Business Goals: ${userContext.businessGoals || 'Not specified'}

User Question: ${userMessage}

Provide a helpful, actionable, and encouraging response as a mentor would. Keep it conversational but professional. Limit to 2-3 paragraphs.
`;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "You are an experienced business mentor who provides practical, actionable advice to entrepreneurs. Be encouraging but realistic.",
      });

      const response = await model.generateContent(prompt);
      return response.response.text() || 'I apologize, but I cannot provide a response at the moment. Please try again.';
    } catch (error) {
      console.error('Error generating mentor response:', error);
      throw new Error('Failed to generate mentor response');
    }
  }

  async generateLegalDocument(documentType: string, businessType: string, jurisdiction: string, specialRequirements: string[]): Promise<string> {
    try {
      const prompt = `
You are a legal document expert. Generate a comprehensive ${documentType} for:

- Business Type: ${businessType}
- Jurisdiction: ${jurisdiction}
- Special Requirements: ${specialRequirements.join(', ')}

Create a professional, legally-structured document that includes all necessary sections and clauses appropriate for the specified business type and jurisdiction. Include placeholders for company-specific information like [COMPANY NAME], [ADDRESS], etc.

Make sure to include appropriate disclaimers and ensure the document follows best practices for ${documentType} in ${jurisdiction}.
`;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "You are a legal expert who creates professional legal documents. Ensure all documents are comprehensive and follow legal best practices.",
      });

      const response = await model.generateContent(prompt);
      return response.response.text() || 'Failed to generate legal document.';
    } catch (error) {
      console.error('Error generating legal document:', error);
      throw new Error('Failed to generate legal document');
    }
  }
}

export const aiService = new AIService();