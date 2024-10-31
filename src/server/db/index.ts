import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/src/env.mjs"

neonConfig.fetchConnectionCache = true;

const sql = neon(`postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}/${env.DATABASE}?sslmode=require`);
export const db = drizzle(sql);
