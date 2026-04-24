import postgres from 'postgres';

const connectionString = "postgresql://postgres:qT9KBvr1EF16aHvW@db.zhfrcsenooyrhiuainso.supabase.co:5432/postgres";
const sql = postgres(connectionString);

async function disableRLS() {
    console.log("Disabling RLS for auth tables...");
    try {
        await sql`ALTER TABLE "user" DISABLE ROW LEVEL SECURITY`;
        await sql`ALTER TABLE "session" DISABLE ROW LEVEL SECURITY`;
        await sql`ALTER TABLE "account" DISABLE ROW LEVEL SECURITY`;
        await sql`ALTER TABLE "verification" DISABLE ROW LEVEL SECURITY`;
        console.log("RLS disabled!");
    } catch (e) {
        console.error("Failed to disable RLS:", e.message);
    } finally {
        await sql.end();
    }
}

disableRLS();
