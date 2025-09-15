import {
  users,
  businessIdeas,
  learningRoadmaps,
  roadmapPhases,
  roadmapMilestones,
  userBadges,
  fundingOpportunities,
  userFundingMatches,
  legalDocuments,
  complianceItems,
  mentorMessages,
  type User,
  type UpsertUser,
  type InsertBusinessIdea,
  type BusinessIdea,
  type InsertLearningRoadmap,
  type LearningRoadmap,
  type InsertRoadmapPhase,
  type RoadmapPhase,
  type InsertRoadmapMilestone,
  type RoadmapMilestone,
  type InsertUserBadge,
  type UserBadge,
  type InsertFundingOpportunity,
  type FundingOpportunity,
  type InsertUserFundingMatch,
  type UserFundingMatch,
  type InsertLegalDocument,
  type LegalDocument,
  type InsertComplianceItem,
  type ComplianceItem,
  type InsertMentorMessage,
  type MentorMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserOnboarding(userId: string, data: Partial<User>): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;

  // Business Ideas
  createBusinessIdea(idea: InsertBusinessIdea): Promise<BusinessIdea>;
  getUserBusinessIdeas(userId: string): Promise<BusinessIdea[]>;
  getBusinessIdea(id: string): Promise<BusinessIdea | undefined>;

  // Learning Roadmaps
  createLearningRoadmap(roadmap: InsertLearningRoadmap): Promise<LearningRoadmap>;
  getUserRoadmaps(userId: string): Promise<LearningRoadmap[]>;
  getRoadmapWithPhases(roadmapId: string): Promise<(LearningRoadmap & { phases: (RoadmapPhase & { milestones: RoadmapMilestone[] })[] }) | undefined>;
  updateRoadmapProgress(roadmapId: string, progressPercentage: number, currentPhase: number): Promise<LearningRoadmap>;
  
  // Roadmap Phases & Milestones
  createRoadmapPhase(phase: InsertRoadmapPhase): Promise<RoadmapPhase>;
  createRoadmapMilestone(milestone: InsertRoadmapMilestone): Promise<RoadmapMilestone>;
  completeMilestone(milestoneId: string): Promise<RoadmapMilestone>;
  updatePhaseProgress(phaseId: string, progressPercentage: number, status: string): Promise<RoadmapPhase>;

  // User Badges
  createUserBadge(badge: InsertUserBadge): Promise<UserBadge>;
  getUserBadges(userId: string): Promise<UserBadge[]>;

  // Funding
  getFundingOpportunities(): Promise<FundingOpportunity[]>;
  createFundingOpportunity(funding: InsertFundingOpportunity): Promise<FundingOpportunity>;
  getUserFundingMatches(userId: string): Promise<(UserFundingMatch & { funding: FundingOpportunity })[]>;
  createUserFundingMatch(match: InsertUserFundingMatch): Promise<UserFundingMatch>;

  // Legal
  createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument>;
  getUserLegalDocuments(userId: string): Promise<LegalDocument[]>;
  getUserComplianceItems(userId: string): Promise<ComplianceItem[]>;
  createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem>;
  updateComplianceItemStatus(itemId: string, status: string, completedAt?: Date): Promise<ComplianceItem>;

  // AI Mentor Chat
  createMentorMessage(message: InsertMentorMessage): Promise<MentorMessage>;
  getUserMentorMessages(userId: string, limit?: number): Promise<MentorMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserOnboarding(userId: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId, 
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: "active",
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Business Ideas
  async createBusinessIdea(idea: InsertBusinessIdea): Promise<BusinessIdea> {
    const [newIdea] = await db.insert(businessIdeas).values(idea).returning();
    return newIdea;
  }

  async getUserBusinessIdeas(userId: string): Promise<BusinessIdea[]> {
    return await db
      .select()
      .from(businessIdeas)
      .where(eq(businessIdeas.userId, userId))
      .orderBy(desc(businessIdeas.createdAt));
  }

  async getBusinessIdea(id: string): Promise<BusinessIdea | undefined> {
    const [idea] = await db.select().from(businessIdeas).where(eq(businessIdeas.id, id));
    return idea;
  }

  // Learning Roadmaps
  async createLearningRoadmap(roadmap: InsertLearningRoadmap): Promise<LearningRoadmap> {
    const [newRoadmap] = await db.insert(learningRoadmaps).values(roadmap).returning();
    return newRoadmap;
  }

  async getUserRoadmaps(userId: string): Promise<LearningRoadmap[]> {
    return await db
      .select()
      .from(learningRoadmaps)
      .where(eq(learningRoadmaps.userId, userId))
      .orderBy(desc(learningRoadmaps.createdAt));
  }

  async getRoadmapWithPhases(roadmapId: string): Promise<(LearningRoadmap & { phases: (RoadmapPhase & { milestones: RoadmapMilestone[] })[] }) | undefined> {
    const roadmap = await db.query.learningRoadmaps.findFirst({
      where: eq(learningRoadmaps.id, roadmapId),
      with: {
        phases: {
          with: {
            milestones: true,
          },
          orderBy: [roadmapPhases.phaseNumber],
        },
      },
    });
    return roadmap as any;
  }

  async updateRoadmapProgress(roadmapId: string, progressPercentage: number, currentPhase: number): Promise<LearningRoadmap> {
    const [updated] = await db
      .update(learningRoadmaps)
      .set({ progressPercentage: progressPercentage.toString(), currentPhase, updatedAt: new Date() })
      .where(eq(learningRoadmaps.id, roadmapId))
      .returning();
    return updated;
  }

  // Roadmap Phases & Milestones
  async createRoadmapPhase(phase: InsertRoadmapPhase): Promise<RoadmapPhase> {
    const [newPhase] = await db.insert(roadmapPhases).values(phase).returning();
    return newPhase;
  }

  async createRoadmapMilestone(milestone: InsertRoadmapMilestone): Promise<RoadmapMilestone> {
    const [newMilestone] = await db.insert(roadmapMilestones).values(milestone).returning();
    return newMilestone;
  }

  async completeMilestone(milestoneId: string): Promise<RoadmapMilestone> {
    const [updated] = await db
      .update(roadmapMilestones)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(roadmapMilestones.id, milestoneId))
      .returning();
    return updated;
  }

  async updatePhaseProgress(phaseId: string, progressPercentage: number, status: string): Promise<RoadmapPhase> {
    const [updated] = await db
      .update(roadmapPhases)
      .set({ progressPercentage: progressPercentage.toString(), status })
      .where(eq(roadmapPhases.id, phaseId))
      .returning();
    return updated;
  }

  // User Badges
  async createUserBadge(badge: InsertUserBadge): Promise<UserBadge> {
    const [newBadge] = await db.insert(userBadges).values(badge).returning();
    return newBadge;
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));
  }

  // Funding
  async getFundingOpportunities(): Promise<FundingOpportunity[]> {
    return await db
      .select()
      .from(fundingOpportunities)
      .where(eq(fundingOpportunities.active, true))
      .orderBy(desc(fundingOpportunities.createdAt));
  }

  async createFundingOpportunity(funding: InsertFundingOpportunity): Promise<FundingOpportunity> {
    const [newFunding] = await db.insert(fundingOpportunities).values(funding).returning();
    return newFunding;
  }

  async getUserFundingMatches(userId: string): Promise<(UserFundingMatch & { funding: FundingOpportunity })[]> {
    const matches = await db.query.userFundingMatches.findMany({
      where: eq(userFundingMatches.userId, userId),
      with: {
        funding: true,
      },
      orderBy: [desc(userFundingMatches.matchScore)],
    });
    return matches as any;
  }

  async createUserFundingMatch(match: InsertUserFundingMatch): Promise<UserFundingMatch> {
    const [newMatch] = await db.insert(userFundingMatches).values(match).returning();
    return newMatch;
  }

  // Legal
  async createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument> {
    const [newDocument] = await db.insert(legalDocuments).values(document).returning();
    return newDocument;
  }

  async getUserLegalDocuments(userId: string): Promise<LegalDocument[]> {
    return await db
      .select()
      .from(legalDocuments)
      .where(eq(legalDocuments.userId, userId))
      .orderBy(desc(legalDocuments.createdAt));
  }

  async getUserComplianceItems(userId: string): Promise<ComplianceItem[]> {
    return await db
      .select()
      .from(complianceItems)
      .where(eq(complianceItems.userId, userId))
      .orderBy(complianceItems.order);
  }

  async createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem> {
    const [newItem] = await db.insert(complianceItems).values(item).returning();
    return newItem;
  }

  async updateComplianceItemStatus(itemId: string, status: string, completedAt?: Date): Promise<ComplianceItem> {
    const [updated] = await db
      .update(complianceItems)
      .set({ status, completedAt })
      .where(eq(complianceItems.id, itemId))
      .returning();
    return updated;
  }

  // AI Mentor Chat
  async createMentorMessage(message: InsertMentorMessage): Promise<MentorMessage> {
    const [newMessage] = await db.insert(mentorMessages).values(message).returning();
    return newMessage;
  }

  async getUserMentorMessages(userId: string, limit: number = 50): Promise<MentorMessage[]> {
    return await db
      .select()
      .from(mentorMessages)
      .where(eq(mentorMessages.userId, userId))
      .orderBy(desc(mentorMessages.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
