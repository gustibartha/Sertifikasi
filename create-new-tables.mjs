import postgres from 'postgres';

const connectionString = "postgresql://postgres:qT9KBvr1EF16aHvW@db.zhfrcsenooyrhiuainso.supabase.co:5432/postgres";
const sql = postgres(connectionString);

async function createNewTables() {
    console.log("Creating new auth tables...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" text PRIMARY KEY,
                "name" text NOT NULL,
                "email" text NOT NULL UNIQUE,
                "emailVerified" boolean NOT NULL,
                "image" text,
                "createdAt" timestamp NOT NULL,
                "updatedAt" timestamp NOT NULL
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS "sessions" (
                "id" text PRIMARY KEY,
                "expiresAt" timestamp NOT NULL,
                "token" text NOT NULL UNIQUE,
                "createdAt" timestamp NOT NULL,
                "updatedAt" timestamp NOT NULL,
                "ipAddress" text,
                "userAgent" text,
                "userId" text NOT NULL REFERENCES "users"("id")
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS "accounts" (
                "id" text PRIMARY KEY,
                "accountId" text NOT NULL,
                "providerId" text NOT NULL,
                "userId" text NOT NULL REFERENCES "users"("id"),
                "accessToken" text,
                "refreshToken" text,
                "idToken" text,
                "accessTokenExpiresAt" timestamp,
                "refreshTokenExpiresAt" timestamp,
                "scope" text,
                "password" text,
                "createdAt" timestamp NOT NULL,
                "updatedAt" timestamp NOT NULL
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS "verifications" (
                "id" text PRIMARY KEY,
                "identifier" text NOT NULL,
                "value" text NOT NULL,
                "expiresAt" timestamp NOT NULL,
                "createdAt" timestamp,
                "updatedAt" timestamp
            );
        `;
        console.log("New tables created!");
    } catch (e) {
        console.error("Failed to create tables:", e.message);
    } finally {
        await sql.end();
    }
}

createNewTables();
