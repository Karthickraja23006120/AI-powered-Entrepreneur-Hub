import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("free"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  industry: varchar("industry"),
  experienceLevel: varchar("experience_level"),
  budgetRange: varchar("budget_range"),
  businessGoals: text("business_goals"),
  skills: text("skills").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Ideas
export const businessIdeas = pgTable("business_ideas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  industry: varchar("industry").notNull(),
  businessModel: varchar("business_model").notNull(),
  targetMarket: varchar("target_market").notNull(),
  matchScore: decimal("match_score", { precision: 3, scale: 1 }),
  marketSize: varchar("market_size"),
  competitionLevel: varchar("competition_level"),
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning Roadmaps
export const learningRoadmaps = pgTable("learning_roadmaps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  totalPhases: integer("total_phases").notNull().default(3),
  currentPhase: integer("current_phase").notNull().default(1),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0"),
  estimatedDuration: varchar("estimated_duration"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Roadmap Phases
export const roadmapPhases = pgTable("roadmap_phases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roadmapId: varchar("roadmap_id").notNull().references(() => learningRoadmaps.id, { onDelete: "cascade" }),
  phaseNumber: integer("phase_number").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("locked"), // locked, unlocked, in_progress, completed
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Roadmap Milestones
export const roadmapMilestones = pgTable("roadmap_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phaseId: varchar("phase_id").notNull().references(() => roadmapPhases.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  resourceType: varchar("resource_type"), // course, book, video, etc.
  resourceProvider: varchar("resource_provider"), // Coursera, Udemy, etc.
  resourceUrl: varchar("resource_url"),
  estimatedHours: integer("estimated_hours"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Progress & Badges
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeType: varchar("badge_type").notNull(), // expert, fast, streak, etc.
  badgeName: varchar("badge_name").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Funding Opportunities
export const fundingOpportunities = pgTable("funding_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // vc, angel, grant, crowdfunding, accelerator
  stage: varchar("stage"), // pre-seed, seed, series-a, etc.
  minAmount: decimal("min_amount", { precision: 12, scale: 2 }),
  maxAmount: decimal("max_amount", { precision: 12, scale: 2 }),
  equityRequired: decimal("equity_required", { precision: 5, scale: 2 }),
  location: varchar("location"),
  industries: text("industries").array(),
  applicationDeadline: timestamp("application_deadline"),
  website: varchar("website"),
  contactEmail: varchar("contact_email"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Funding Matches
export const userFundingMatches = pgTable("user_funding_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fundingId: varchar("funding_id").notNull().references(() => fundingOpportunities.id, { onDelete: "cascade" }),
  matchScore: decimal("match_score", { precision: 3, scale: 1 }),
  priority: varchar("priority").notNull().default("medium"), // high, medium, low
  status: varchar("status").notNull().default("matched"), // matched, applied, interested, dismissed
  createdAt: timestamp("created_at").defaultNow(),
});

// Legal Documents
export const legalDocuments = pgTable("legal_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentType: varchar("document_type").notNull(), // privacy_policy, terms_of_service, nda, etc.
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  jurisdiction: varchar("jurisdiction"),
  businessType: varchar("business_type"),
  specialRequirements: text("special_requirements").array(),
  version: varchar("version").default("1.0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Legal Compliance Checklist
export const complianceItems = pgTable("compliance_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  itemType: varchar("item_type").notNull(), // registration, tax_id, privacy_policy, etc.
  title: varchar("title").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("pending"), // pending, in_progress, completed
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Mentor Chat Messages
export const mentorMessages = pgTable("mentor_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isUser: boolean("is_user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  businessIdeas: many(businessIdeas),
  learningRoadmaps: many(learningRoadmaps),
  userBadges: many(userBadges),
  fundingMatches: many(userFundingMatches),
  legalDocuments: many(legalDocuments),
  complianceItems: many(complianceItems),
  mentorMessages: many(mentorMessages),
}));

export const businessIdeasRelations = relations(businessIdeas, ({ one }) => ({
  user: one(users, {
    fields: [businessIdeas.userId],
    references: [users.id],
  }),
}));

export const learningRoadmapsRelations = relations(learningRoadmaps, ({ one, many }) => ({
  user: one(users, {
    fields: [learningRoadmaps.userId],
    references: [users.id],
  }),
  phases: many(roadmapPhases),
}));

export const roadmapPhasesRelations = relations(roadmapPhases, ({ one, many }) => ({
  roadmap: one(learningRoadmaps, {
    fields: [roadmapPhases.roadmapId],
    references: [learningRoadmaps.id],
  }),
  milestones: many(roadmapMilestones),
}));

export const roadmapMilestonesRelations = relations(roadmapMilestones, ({ one }) => ({
  phase: one(roadmapPhases, {
    fields: [roadmapMilestones.phaseId],
    references: [roadmapPhases.id],
  }),
}));

export const userFundingMatchesRelations = relations(userFundingMatches, ({ one }) => ({
  user: one(users, {
    fields: [userFundingMatches.userId],
    references: [users.id],
  }),
  funding: one(fundingOpportunities, {
    fields: [userFundingMatches.fundingId],
    references: [fundingOpportunities.id],
  }),
}));

// Insert Schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessIdeaSchema = createInsertSchema(businessIdeas).omit({
  id: true,
  createdAt: true,
});

export const insertLearningRoadmapSchema = createInsertSchema(learningRoadmaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoadmapPhaseSchema = createInsertSchema(roadmapPhases).omit({
  id: true,
  createdAt: true,
});

export const insertRoadmapMilestoneSchema = createInsertSchema(roadmapMilestones).omit({
  id: true,
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertFundingOpportunitySchema = createInsertSchema(fundingOpportunities).omit({
  id: true,
  createdAt: true,
});

export const insertUserFundingMatchSchema = createInsertSchema(userFundingMatches).omit({
  id: true,
  createdAt: true,
});

export const insertLegalDocumentSchema = createInsertSchema(legalDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertComplianceItemSchema = createInsertSchema(complianceItems).omit({
  id: true,
  createdAt: true,
});

export const insertMentorMessageSchema = createInsertSchema(mentorMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBusinessIdea = z.infer<typeof insertBusinessIdeaSchema>;
export type BusinessIdea = typeof businessIdeas.$inferSelect;
export type InsertLearningRoadmap = z.infer<typeof insertLearningRoadmapSchema>;
export type LearningRoadmap = typeof learningRoadmaps.$inferSelect;
export type InsertRoadmapPhase = z.infer<typeof insertRoadmapPhaseSchema>;
export type RoadmapPhase = typeof roadmapPhases.$inferSelect;
export type InsertRoadmapMilestone = z.infer<typeof insertRoadmapMilestoneSchema>;
export type RoadmapMilestone = typeof roadmapMilestones.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertFundingOpportunity = z.infer<typeof insertFundingOpportunitySchema>;
export type FundingOpportunity = typeof fundingOpportunities.$inferSelect;
export type InsertUserFundingMatch = z.infer<typeof insertUserFundingMatchSchema>;
export type UserFundingMatch = typeof userFundingMatches.$inferSelect;
export type InsertLegalDocument = z.infer<typeof insertLegalDocumentSchema>;
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertComplianceItem = z.infer<typeof insertComplianceItemSchema>;
export type ComplianceItem = typeof complianceItems.$inferSelect;
export type InsertMentorMessage = z.infer<typeof insertMentorMessageSchema>;
export type MentorMessage = typeof mentorMessages.$inferSelect;
