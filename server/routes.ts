import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { aiService } from "./services/aiService";
import { stripeService } from "./services/stripeService";
import { insertBusinessIdeaSchema, insertLearningRoadmapSchema, insertMentorMessageSchema, insertLegalDocumentSchema, insertComplianceItemSchema } from "@shared/schema";
import { z } from "zod";

const businessIdeaRequestSchema = z.object({
  industry: z.string(),
  businessModel: z.string(),
  targetMarket: z.string(),
  userSkills: z.array(z.string()).optional().default([]),
  budgetRange: z.string(),
  experienceLevel: z.string(),
});

const learningRoadmapRequestSchema = z.object({
  skills: z.array(z.string()),
  industry: z.string(),
  experienceLevel: z.string(),
  targetRole: z.string(),
});

const mentorMessageRequestSchema = z.object({
  message: z.string().min(1),
});

const onboardingSchema = z.object({
  industry: z.string().optional(),
  experienceLevel: z.string().optional(),
  budgetRange: z.string().optional(),
  businessGoals: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

const legalDocumentRequestSchema = z.object({
  documentType: z.string(),
  businessType: z.string(),
  jurisdiction: z.string(),
  specialRequirements: z.array(z.string()).optional().default([]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User onboarding
  app.post('/api/onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = onboardingSchema.parse(req.body);
      
      const updatedUser = await storage.updateUserOnboarding(userId, {
        ...data,
        onboardingCompleted: true,
      });

      // Create initial compliance checklist
      const complianceItems = [
        {
          userId,
          itemType: 'registration',
          title: 'Business Registration',
          description: 'Register your business entity with the appropriate government authorities',
          status: 'pending',
          order: 1,
        },
        {
          userId,
          itemType: 'tax_id',
          title: 'Tax ID (EIN)',
          description: 'Obtain a Federal Employer Identification Number',
          status: 'pending',
          order: 2,
        },
        {
          userId,
          itemType: 'privacy_policy',
          title: 'Privacy Policy',
          description: 'Create a comprehensive privacy policy for your business',
          status: 'pending',
          order: 3,
        },
        {
          userId,
          itemType: 'terms_of_service',
          title: 'Terms of Service',
          description: 'Draft terms of service for your platform',
          status: 'pending',
          order: 4,
        },
      ];

      for (const item of complianceItems) {
        await storage.createComplianceItem(item);
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating onboarding:", error);
      res.status(500).json({ message: "Failed to update onboarding" });
    }
  });

  // Business Ideas
  app.post('/api/business-ideas/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const request = businessIdeaRequestSchema.parse(req.body);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const ideas = await aiService.generateBusinessIdeas(userId, {
        ...request,
        userSkills: user.skills || [],
      });

      const savedIdeas = [];
      for (const idea of ideas) {
        const savedIdea = await storage.createBusinessIdea(idea as any);
        savedIdeas.push(savedIdea);
      }

      res.json(savedIdeas);
    } catch (error) {
      console.error("Error generating business ideas:", error);
      res.status(500).json({ message: "Failed to generate business ideas" });
    }
  });

  app.get('/api/business-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ideas = await storage.getUserBusinessIdeas(userId);
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching business ideas:", error);
      res.status(500).json({ message: "Failed to fetch business ideas" });
    }
  });

  // Learning Roadmaps
  app.post('/api/roadmaps/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const request = learningRoadmapRequestSchema.parse(req.body);
      
      const { roadmap, phases, milestones } = await aiService.generateLearningRoadmap(userId, request);
      
      const savedRoadmap = await storage.createLearningRoadmap(roadmap as any);
      
      const savedPhases = [];
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        const savedPhase = await storage.createRoadmapPhase({
          ...phase,
          roadmapId: savedRoadmap.id,
        } as any);
        savedPhases.push(savedPhase);

        // Create milestones for this phase
        const phaseMilestones = milestones[i] || [];
        for (const milestone of phaseMilestones) {
          await storage.createRoadmapMilestone({
            ...milestone,
            phaseId: savedPhase.id,
          } as any);
        }
      }

      res.json(savedRoadmap);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      res.status(500).json({ message: "Failed to generate roadmap" });
    }
  });

  app.get('/api/roadmaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const roadmaps = await storage.getUserRoadmaps(userId);
      res.json(roadmaps);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
  });

  app.get('/api/roadmaps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const roadmapId = req.params.id;
      const roadmap = await storage.getRoadmapWithPhases(roadmapId);
      
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      res.json(roadmap);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      res.status(500).json({ message: "Failed to fetch roadmap" });
    }
  });

  app.post('/api/roadmaps/:id/milestone/:milestoneId/complete', isAuthenticated, async (req: any, res) => {
    try {
      const milestoneId = req.params.milestoneId;
      const milestone = await storage.completeMilestone(milestoneId);
      res.json(milestone);
    } catch (error) {
      console.error("Error completing milestone:", error);
      res.status(500).json({ message: "Failed to complete milestone" });
    }
  });

  // AI Mentor Chat
  app.post('/api/mentor/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = mentorMessageRequestSchema.parse(req.body);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save user message
      await storage.createMentorMessage({
        userId,
        message,
        isUser: true,
      });

      // Generate AI response
      const aiResponse = await aiService.generateMentorResponse(message, {
        industry: user.industry,
        experienceLevel: user.experienceLevel,
        businessGoals: user.businessGoals,
      });

      // Save AI response
      const savedResponse = await storage.createMentorMessage({
        userId,
        message: aiResponse,
        isUser: false,
      });

      res.json({ response: aiResponse, message: savedResponse });
    } catch (error) {
      console.error("Error in mentor chat:", error);
      res.status(500).json({ message: "Failed to process mentor chat" });
    }
  });

  app.get('/api/mentor/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserMentorMessages(userId);
      res.json(messages.reverse()); // Show oldest first
    } catch (error) {
      console.error("Error fetching mentor messages:", error);
      res.status(500).json({ message: "Failed to fetch mentor messages" });
    }
  });

  // Market Analysis
  app.post('/api/market-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const { industry, businessIdea, targetMarket } = req.body;
      
      const analysis = await aiService.generateMarketAnalysis({
        industry,
        businessIdea,
        targetMarket,
      });

      res.json(analysis);
    } catch (error) {
      console.error("Error generating market analysis:", error);
      res.status(500).json({ message: "Failed to generate market analysis" });
    }
  });

  // Funding Opportunities
  app.get('/api/funding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const matches = await storage.getUserFundingMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching funding opportunities:", error);
      res.status(500).json({ message: "Failed to fetch funding opportunities" });
    }
  });

  // Legal Documents
  app.post('/api/legal/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const request = legalDocumentRequestSchema.parse(req.body);
      
      const documentContent = await aiService.generateLegalDocument(
        request.documentType,
        request.businessType,
        request.jurisdiction,
        request.specialRequirements
      );

      const document = await storage.createLegalDocument({
        userId,
        documentType: request.documentType,
        title: `${request.documentType} v1.0`,
        content: documentContent,
        jurisdiction: request.jurisdiction,
        businessType: request.businessType,
        specialRequirements: request.specialRequirements,
      });

      res.json(document);
    } catch (error) {
      console.error("Error generating legal document:", error);
      res.status(500).json({ message: "Failed to generate legal document" });
    }
  });

  app.get('/api/legal/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserLegalDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching legal documents:", error);
      res.status(500).json({ message: "Failed to fetch legal documents" });
    }
  });

  app.get('/api/legal/compliance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getUserComplianceItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching compliance items:", error);
      res.status(500).json({ message: "Failed to fetch compliance items" });
    }
  });

  app.post('/api/legal/compliance/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const itemId = req.params.id;
      const item = await storage.updateComplianceItemStatus(itemId, 'completed', new Date());
      res.json(item);
    } catch (error) {
      console.error("Error updating compliance item:", error);
      res.status(500).json({ message: "Failed to update compliance item" });
    }
  });

  // Stripe/Subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripeService.getSubscription(user.stripeSubscriptionId);
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
      }

      if (!user.email) {
        return res.status(400).json({ message: 'No user email on file' });
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(
          user.email,
          `${user.firstName || ''} ${user.lastName || ''}`.trim()
        );
        customerId = customer.id;
      }

      // Use Pro plan price ID - this should be set in environment variables
      const priceId = process.env.STRIPE_PRICE_ID || 'price_1234567890'; // Replace with actual price ID
      
      const subscription = await stripeService.createSubscription(customerId, priceId);
      
      await storage.updateUserStripeInfo(userId, customerId, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // User badges
  app.get('/api/badges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
