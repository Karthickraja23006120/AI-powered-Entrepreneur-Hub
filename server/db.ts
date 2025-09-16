import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use a default database URL for development if not provided
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL not set, using default development database");
  // Default to a local PostgreSQL instance for development
  databaseUrl = "postgresql://postgres:password@localhost:5432/entrepreneur_hub";
}

// Validate the database URL format
try {
  new URL(databaseUrl);
} catch (error) {
  console.error("Invalid DATABASE_URL format:", databaseUrl);
  throw new Error("DATABASE_URL must be a valid PostgreSQL connection string");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });