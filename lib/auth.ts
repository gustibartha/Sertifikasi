import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // Using PostgreSQL via Supabase
    }),
    emailAndPassword: {
        enabled: true, // Enable email and password login
    },
    advanced: {
        trustHost: true,
    },
});
