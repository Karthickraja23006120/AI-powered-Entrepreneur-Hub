-- Seed data for Entrepreneur Hub

-- Sample funding opportunities
INSERT INTO funding_opportunities (name, description, type, stage, min_amount, max_amount, equity_required, location, industries, website) VALUES
('TechStars Accelerator', 'Leading startup accelerator program providing mentorship and funding', 'accelerator', 'pre-seed', 20000, 120000, 6, 'Global', ARRAY['technology', 'saas'], 'https://techstars.com'),
('Y Combinator', 'Famous startup accelerator that has funded companies like Airbnb and Dropbox', 'accelerator', 'seed', 125000, 250000, 7, 'San Francisco', ARRAY['technology', 'consumer'], 'https://ycombinator.com'),
('Andreessen Horowitz', 'Top-tier venture capital firm investing in technology companies', 'vc', 'series-a', 1000000, 15000000, 20, 'Silicon Valley', ARRAY['technology', 'fintech'], 'https://a16z.com'),
('First Round Capital', 'Early-stage venture capital firm focused on technology startups', 'vc', 'seed', 500000, 5000000, 15, 'New York', ARRAY['technology', 'b2b'], 'https://firstround.com'),
('SBIR Grant Program', 'Federal grant program for small businesses in research and development', 'grant', 'any', 50000, 1500000, 0, 'United States', ARRAY['technology', 'healthcare', 'defense'], 'https://sbir.gov'),
('Kickstarter', 'Crowdfunding platform for creative projects and innovative products', 'crowdfunding', 'pre-seed', 1000, 100000, 0, 'Global', ARRAY['consumer', 'hardware', 'creative'], 'https://kickstarter.com'),
('AngelList Syndicates', 'Platform connecting startups with angel investors', 'angel', 'seed', 25000, 500000, 10, 'Global', ARRAY['technology', 'saas'], 'https://angellist.com'),
('500 Startups', 'Global venture capital seed fund and startup accelerator', 'accelerator', 'seed', 100000, 250000, 6, 'Global', ARRAY['technology', 'fintech'], 'https://500.co');

-- Sample user for demo (will be replaced by real users via auth)
INSERT INTO users (id, email, first_name, last_name, onboarding_completed, industry, experience_level, budget_range, business_goals, skills) VALUES
('demo-user-123', 'demo@example.com', 'Demo', 'User', true, 'technology', 'first-time', '10k-50k', 'Build a successful SaaS product', ARRAY['programming', 'marketing', 'design']);

-- Sample business ideas for demo user
INSERT INTO business_ideas (user_id, title, description, industry, business_model, target_market, match_score, market_size, competition_level) VALUES
('demo-user-123', 'AI-Powered Task Manager', 'Smart task management app that uses AI to prioritize and schedule tasks automatically', 'technology', 'saas', 'professionals', 8.5, '$2.3B', 'Medium'),
('demo-user-123', 'Local Service Marketplace', 'Platform connecting local service providers with customers in their area', 'technology', 'marketplace', 'consumers', 7.2, '$150B', 'High'),
('demo-user-123', 'Sustainable Fashion Platform', 'E-commerce platform focused on eco-friendly and sustainable fashion brands', 'retail', 'ecommerce', 'consumers', 6.8, '$6.2B', 'Medium');

-- Sample learning roadmap for demo user
INSERT INTO learning_roadmaps (user_id, title, description, category, estimated_duration) VALUES
('demo-user-123', 'Full-Stack Developer Mastery', 'Complete roadmap to become a proficient full-stack developer', 'Programming', '6 months');

-- Get the roadmap ID for phases
DO $$
DECLARE
    roadmap_id VARCHAR;
BEGIN
    SELECT id INTO roadmap_id FROM learning_roadmaps WHERE user_id = 'demo-user-123' LIMIT 1;
    
    -- Insert phases
    INSERT INTO roadmap_phases (roadmap_id, phase_number, title, description, status) VALUES
    (roadmap_id, 1, 'Frontend Fundamentals', 'Master HTML, CSS, and JavaScript basics', 'unlocked'),
    (roadmap_id, 2, 'React & Modern Frontend', 'Learn React, state management, and modern tools', 'locked'),
    (roadmap_id, 3, 'Backend & Database', 'Node.js, APIs, and database management', 'locked');
    
    -- Insert milestones for Phase 1
    INSERT INTO roadmap_milestones (phase_id, title, description, resource_type, resource_provider, resource_url, estimated_hours, "order") 
    SELECT p.id, 'HTML & CSS Basics', 'Learn fundamental web technologies', 'course', 'freeCodeCamp', 'https://freecodecamp.org', 20, 1
    FROM roadmap_phases p WHERE p.roadmap_id = roadmap_id AND p.phase_number = 1;
    
    INSERT INTO roadmap_milestones (phase_id, title, description, resource_type, resource_provider, resource_url, estimated_hours, "order")
    SELECT p.id, 'JavaScript Fundamentals', 'Master JavaScript programming concepts', 'course', 'MDN Web Docs', 'https://developer.mozilla.org', 30, 2
    FROM roadmap_phases p WHERE p.roadmap_id = roadmap_id AND p.phase_number = 1;
    
    -- Insert milestones for Phase 2
    INSERT INTO roadmap_milestones (phase_id, title, description, resource_type, resource_provider, resource_url, estimated_hours, "order")
    SELECT p.id, 'React Basics', 'Learn React components and state management', 'course', 'React Documentation', 'https://react.dev', 25, 1
    FROM roadmap_phases p WHERE p.roadmap_id = roadmap_id AND p.phase_number = 2;
    
    INSERT INTO roadmap_milestones (phase_id, title, description, resource_type, resource_provider, resource_url, estimated_hours, "order")
    SELECT p.id, 'State Management', 'Learn Redux and Context API', 'course', 'Redux Toolkit', 'https://redux-toolkit.js.org', 20, 2
    FROM roadmap_phases p WHERE p.roadmap_id = roadmap_id AND p.phase_number = 2;
END $$;

-- Sample funding matches for demo user
INSERT INTO user_funding_matches (user_id, funding_id, match_score, priority) 
SELECT 'demo-user-123', f.id, 
  CASE 
    WHEN f.name = 'TechStars Accelerator' THEN 9.2
    WHEN f.name = 'Y Combinator' THEN 8.7
    WHEN f.name = 'SBIR Grant Program' THEN 7.5
    ELSE 6.0
  END,
  CASE 
    WHEN f.name IN ('TechStars Accelerator', 'Y Combinator') THEN 'high'
    WHEN f.name = 'SBIR Grant Program' THEN 'medium'
    ELSE 'low'
  END
FROM funding_opportunities f 
WHERE f.name IN ('TechStars Accelerator', 'Y Combinator', 'SBIR Grant Program', 'AngelList Syndicates');

-- Sample badges for demo user
INSERT INTO user_badges (user_id, badge_type, badge_name, description) VALUES
('demo-user-123', 'starter', 'Getting Started', 'Completed onboarding and set up profile'),
('demo-user-123', 'ideator', 'Idea Generator', 'Generated first business idea using AI');

-- Sample compliance items for demo user
INSERT INTO compliance_items (user_id, item_type, title, description, status, "order") VALUES
('demo-user-123', 'registration', 'Business Registration', 'Register your business entity with the appropriate government authorities', 'pending', 1),
('demo-user-123', 'tax_id', 'Tax ID (EIN)', 'Obtain a Federal Employer Identification Number', 'pending', 2),
('demo-user-123', 'privacy_policy', 'Privacy Policy', 'Create a comprehensive privacy policy for your business', 'pending', 3),
('demo-user-123', 'terms_of_service', 'Terms of Service', 'Draft terms of service for your platform', 'pending', 4);

-- Sample mentor messages for demo user
INSERT INTO mentor_messages (user_id, message, is_user) VALUES
('demo-user-123', 'Hello! I''m your AI business mentor. I''m here to help you with any questions about entrepreneurship, business strategy, funding, and more. What would you like to discuss?', false);