-- Initial schema for Entrepreneur Hub

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  subscription_status VARCHAR DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT false,
  industry VARCHAR,
  experience_level VARCHAR,
  budget_range VARCHAR,
  business_goals TEXT,
  skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Business Ideas
CREATE TABLE IF NOT EXISTS business_ideas (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  industry VARCHAR NOT NULL,
  business_model VARCHAR NOT NULL,
  target_market VARCHAR NOT NULL,
  match_score DECIMAL(3,1),
  market_size VARCHAR,
  competition_level VARCHAR,
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning Roadmaps
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  total_phases INTEGER NOT NULL DEFAULT 3,
  current_phase INTEGER NOT NULL DEFAULT 1,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  estimated_duration VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roadmap Phases
CREATE TABLE IF NOT EXISTS roadmap_phases (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id VARCHAR NOT NULL REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR NOT NULL DEFAULT 'locked',
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Roadmap Milestones
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id VARCHAR NOT NULL REFERENCES roadmap_phases(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  resource_type VARCHAR,
  resource_provider VARCHAR,
  resource_url VARCHAR,
  estimated_hours INTEGER,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR NOT NULL,
  badge_name VARCHAR NOT NULL,
  description TEXT,
  earned_at TIMESTAMP DEFAULT NOW()
);

-- Funding Opportunities
CREATE TABLE IF NOT EXISTS funding_opportunities (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR NOT NULL,
  stage VARCHAR,
  min_amount DECIMAL(12,2),
  max_amount DECIMAL(12,2),
  equity_required DECIMAL(5,2),
  location VARCHAR,
  industries TEXT[],
  application_deadline TIMESTAMP,
  website VARCHAR,
  contact_email VARCHAR,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Funding Matches
CREATE TABLE IF NOT EXISTS user_funding_matches (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  funding_id VARCHAR NOT NULL REFERENCES funding_opportunities(id) ON DELETE CASCADE,
  match_score DECIMAL(3,1),
  priority VARCHAR NOT NULL DEFAULT 'medium',
  status VARCHAR NOT NULL DEFAULT 'matched',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Legal Documents
CREATE TABLE IF NOT EXISTS legal_documents (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  jurisdiction VARCHAR,
  business_type VARCHAR,
  special_requirements TEXT[],
  version VARCHAR DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Compliance Items
CREATE TABLE IF NOT EXISTS compliance_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mentor Messages
CREATE TABLE IF NOT EXISTS mentor_messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);