// Mock AI service for development when Gemini API is not available
import type { InsertBusinessIdea, InsertLearningRoadmap, InsertRoadmapPhase, InsertRoadmapMilestone } from "@shared/schema";

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

export class MockAIService {
  async generateBusinessIdeas(userId: string, request: BusinessIdeaRequest): Promise<Partial<InsertBusinessIdea>[]> {
    // Mock business ideas based on industry
    const mockIdeas = {
      technology: [
        {
          title: "AI-Powered Code Review Tool",
          description: "Automated code review system that uses machine learning to detect bugs and suggest improvements.",
          industry: "technology",
          businessModel: "saas",
          targetMarket: "developers",
          matchScore: "8.5",
          marketSize: "$4.2B",
          competitionLevel: "Medium"
        },
        {
          title: "Smart Home Energy Manager",
          description: "IoT platform that optimizes home energy consumption using AI and real-time data.",
          industry: "technology",
          businessModel: "saas",
          targetMarket: "homeowners",
          matchScore: "7.8",
          marketSize: "$12.8B",
          competitionLevel: "High"
        }
      ],
      healthcare: [
        {
          title: "Telemedicine Platform for Rural Areas",
          description: "Healthcare platform connecting rural patients with specialists through video consultations.",
          industry: "healthcare",
          businessModel: "subscription",
          targetMarket: "rural communities",
          matchScore: "9.1",
          marketSize: "$55.6B",
          competitionLevel: "Medium"
        }
      ],
      finance: [
        {
          title: "Personal Finance AI Assistant",
          description: "AI-powered app that provides personalized financial advice and budget optimization.",
          industry: "finance",
          businessModel: "freemium",
          targetMarket: "young professionals",
          matchScore: "8.2",
          marketSize: "$8.9B",
          competitionLevel: "High"
        }
      ]
    };

    const industryIdeas = mockIdeas[request.industry as keyof typeof mockIdeas] || mockIdeas.technology;
    
    return industryIdeas.slice(0, 3).map(idea => ({
      userId,
      ...idea,
      aiGenerated: true,
    }));
  }

  async generateLearningRoadmap(userId: string, request: LearningRoadmapRequest): Promise<{
    roadmap: Partial<InsertLearningRoadmap>;
    phases: Partial<InsertRoadmapPhase>[];
    milestones: Partial<InsertRoadmapMilestone>[][];
  }> {
    const roadmapTemplates = {
      "Digital Marketing Manager": {
        title: "Digital Marketing Mastery Roadmap",
        description: "Complete path to becoming a skilled digital marketing manager",
        category: "Marketing",
        estimatedDuration: "4 months",
        phases: [
          {
            phaseNumber: 1,
            title: "Marketing Fundamentals",
            description: "Learn core marketing principles and digital landscape",
            status: "unlocked"
          },
          {
            phaseNumber: 2,
            title: "Digital Channels & Analytics",
            description: "Master social media, SEO, PPC, and analytics tools",
            status: "locked"
          },
          {
            phaseNumber: 3,
            title: "Strategy & Leadership",
            description: "Develop strategic thinking and team management skills",
            status: "locked"
          }
        ],
        milestones: [
          [
            {
              title: "Marketing Fundamentals Course",
              description: "Complete comprehensive marketing basics course",
              resourceType: "course",
              resourceProvider: "Coursera",
              estimatedHours: 25,
              order: 1
            },
            {
              title: "Consumer Psychology",
              description: "Understand customer behavior and decision-making",
              resourceType: "book",
              resourceProvider: "Amazon",
              estimatedHours: 15,
              order: 2
            }
          ],
          [
            {
              title: "Google Analytics Certification",
              description: "Get certified in Google Analytics",
              resourceType: "certification",
              resourceProvider: "Google",
              estimatedHours: 20,
              order: 1
            },
            {
              title: "Social Media Marketing",
              description: "Master Facebook, Instagram, and LinkedIn advertising",
              resourceType: "course",
              resourceProvider: "Udemy",
              estimatedHours: 30,
              order: 2
            }
          ],
          [
            {
              title: "Marketing Strategy Project",
              description: "Create a complete marketing strategy for a real business",
              resourceType: "project",
              resourceProvider: "Self-directed",
              estimatedHours: 40,
              order: 1
            }
          ]
        ]
      }
    };

    const template = roadmapTemplates[request.targetRole as keyof typeof roadmapTemplates] || roadmapTemplates["Digital Marketing Manager"];

    return {
      roadmap: {
        userId,
        title: template.title,
        description: template.description,
        category: template.category,
        estimatedDuration: template.estimatedDuration,
        totalPhases: 3,
        currentPhase: 1,
        progressPercentage: "0",
      },
      phases: template.phases,
      milestones: template.milestones,
    };
  }

  async generateMarketAnalysis(request: MarketAnalysisRequest): Promise<any> {
    return {
      marketSize: "$45.2B",
      growthRate: "12.5%",
      keyTrends: [
        "Increased adoption of AI and automation",
        "Growing demand for remote solutions",
        "Focus on sustainability and green technology",
        "Rise of subscription-based business models"
      ],
      opportunities: [
        "Underserved small business market",
        "Integration with emerging technologies",
        "International expansion potential"
      ],
      challenges: [
        "High customer acquisition costs",
        "Regulatory compliance requirements",
        "Intense competition from established players"
      ],
      competitorCount: 15,
      topCompetitors: [
        {
          name: "Market Leader Inc",
          description: "Established player with 30% market share",
          stage: "Public Company"
        },
        {
          name: "Innovation Startup",
          description: "Fast-growing startup with innovative approach",
          stage: "Series B"
        },
        {
          name: "Traditional Corp",
          description: "Legacy company adapting to digital transformation",
          stage: "Fortune 500"
        }
      ]
    };
  }

  async generateMentorResponse(userMessage: string, userContext: any): Promise<string> {
    const responses = [
      "That's a great question! Based on your experience in " + (userContext.industry || "your field") + ", I'd recommend focusing on validating your idea with potential customers first. Start by conducting interviews with 10-15 people in your target market to understand their pain points.",
      
      "I understand your concern. Many entrepreneurs face this challenge. The key is to start small and iterate quickly. Consider building a minimum viable product (MVP) to test your assumptions before investing heavily in development.",
      
      "Excellent point! For someone at your experience level, I'd suggest partnering with someone who complements your skills. Look for co-founders through networking events, online communities, or startup incubators in your area.",
      
      "That's a common challenge in entrepreneurship. I recommend creating a detailed business plan that includes market research, financial projections, and a clear value proposition. This will help you communicate your vision to potential investors or partners.",
      
      "Great thinking! Customer acquisition is crucial for any business. Consider starting with organic marketing strategies like content marketing, social media engagement, and building partnerships. These approaches can be cost-effective while you're getting started."
    ];

    // Simple keyword matching for more relevant responses
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('funding') || lowerMessage.includes('money') || lowerMessage.includes('investment')) {
      return "Funding is a critical aspect of growing your business. Based on your budget range of " + (userContext.budgetRange || "your current situation") + ", I'd recommend exploring multiple funding options. Start with bootstrapping and revenue-based funding, then consider angel investors or venture capital as you scale. Make sure you have a solid business plan and clear metrics to show potential investors.";
    }
    
    if (lowerMessage.includes('marketing') || lowerMessage.includes('customers') || lowerMessage.includes('sales')) {
      return "Marketing and customer acquisition are essential for business success. Given your background, I'd suggest starting with digital marketing strategies that align with your budget. Focus on understanding your target audience deeply, create valuable content that addresses their pain points, and build relationships through social media and networking. Remember, the best marketing is often word-of-mouth from satisfied customers.";
    }

    // Return a random response for general questions
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async generateLegalDocument(documentType: string, businessType: string, jurisdiction: string, specialRequirements: string[]): Promise<string> {
    const templates = {
      privacy_policy: `PRIVACY POLICY

Last updated: ${new Date().toLocaleDateString()}

This Privacy Policy describes how [COMPANY NAME] ("we," "our," or "us") collects, uses, and shares your personal information when you use our ${businessType} service.

INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

HOW WE USE YOUR INFORMATION
We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send you technical notices and support messages
- Respond to your comments and questions

INFORMATION SHARING
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

CONTACT US
If you have any questions about this Privacy Policy, please contact us at [CONTACT EMAIL].

This policy is governed by the laws of ${jurisdiction}.`,

      terms_of_service: `TERMS OF SERVICE

Last updated: ${new Date().toLocaleDateString()}

These Terms of Service ("Terms") govern your use of [COMPANY NAME]'s ${businessType} service.

ACCEPTANCE OF TERMS
By accessing or using our service, you agree to be bound by these Terms.

DESCRIPTION OF SERVICE
[COMPANY NAME] provides [DESCRIPTION OF YOUR SERVICE].

USER ACCOUNTS
You are responsible for maintaining the confidentiality of your account credentials.

PROHIBITED USES
You may not use our service for any illegal or unauthorized purpose.

INTELLECTUAL PROPERTY
The service and its original content are and will remain the exclusive property of [COMPANY NAME].

TERMINATION
We may terminate or suspend your account at any time for violations of these Terms.

LIMITATION OF LIABILITY
In no event shall [COMPANY NAME] be liable for any indirect, incidental, special, or consequential damages.

GOVERNING LAW
These Terms are governed by the laws of ${jurisdiction}.

CONTACT INFORMATION
For questions about these Terms, contact us at [CONTACT EMAIL].`
    };

    return templates[documentType as keyof typeof templates] || "Document template not available.";
  }
}

export const mockAiService = new MockAIService();