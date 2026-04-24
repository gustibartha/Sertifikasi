import postgres from 'postgres';

const connectionString = "postgresql://postgres:qT9KBvr1EF16aHvW@db.zhfrcsenooyrhiuainso.supabase.co:5432/postgres";
const sql = postgres(connectionString);

async function clean() {
    console.log("Cleaning up old user...");
    try {
        const email = 'bartha@pln.co.id';
        // Delete from account first (foreign key)
        await sql`DELETE FROM account WHERE "accountId" = ${email}`;
        // Delete from user
        await sql`DELETE FROM "user" WHERE email = ${email}`;
        console.log("Cleanup success!");
    } catch (e) {
        console.error("Cleanup failed:", e.message);
    } finally {
        await sql.end();
    }
}

clean();
