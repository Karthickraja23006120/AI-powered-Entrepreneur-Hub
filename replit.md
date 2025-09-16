# Entrepreneur Hub - AI-Powered SaaS Platform

## Overview

Entrepreneur Hub is a comprehensive AI-powered SaaS platform designed to support entrepreneurs throughout their business journey. The platform provides personalized business ideation, market analysis, learning roadmaps, funding recommendations, legal compliance assistance, and AI-powered mentorship. Built as a full-stack web application using modern technologies, it integrates Google's Gemini AI for intelligent recommendations and features a subscription-based model with Stripe integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon for serverless PostgreSQL hosting
- **Authentication**: Replit Auth integration with session-based authentication using connect-pg-simple for session storage

### AI Integration
- **Primary AI Service**: Google Gemini AI for business idea generation, market analysis, mentorship chat, and learning roadmap creation
- **AI Capabilities**: 
  - Personalized business idea suggestions based on user skills and preferences
  - Market trend analysis and competitor insights
  - AI mentor chatbot for business guidance
  - Customized learning roadmaps with milestones and resources

### Data Architecture
- **Schema Design**: Comprehensive relational database schema with separate tables for users, business ideas, learning roadmaps, funding opportunities, legal documents, and compliance items
- **Data Relationships**: Well-defined foreign key relationships between entities (users to ideas, roadmaps to phases, phases to milestones)
- **Progress Tracking**: Built-in progress tracking for learning milestones and compliance checkboxes

### Authentication & Security
- **Authentication Provider**: Replit's OpenID Connect (OIDC) integration
- **Session Management**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Route-level protection with middleware for authenticated endpoints
- **Security**: HTTPS enforcement, secure cookie settings, and input validation with Zod schemas

## External Dependencies

### Core Services
- **Database**: Neon PostgreSQL for primary data storage
- **AI Provider**: Google Gemini API for AI-powered features
- **Authentication**: Replit Auth for user authentication and session management
- **Payment Processing**: Stripe for subscription management and payment processing

### Development Tools
- **ORM**: Drizzle Kit for database schema management and migrations
- **Validation**: Zod for runtime type checking and API request validation
- **Code Quality**: TypeScript for compile-time type checking across the entire stack

### UI Libraries
- **Component Library**: Radix UI for accessible, unstyled component primitives
- **Design System**: shadcn/ui for pre-built styled components
- **Visualization**: Recharts for data visualization and market trend charts
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation

### Deployment & Infrastructure
- **Hosting**: Designed for Replit deployment with integrated development tools
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Environment**: Environment-based configuration for development and production modes