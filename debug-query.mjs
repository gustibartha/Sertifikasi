import postgres from 'postgres';

const connectionString = "postgresql://postgres:qT9KBvr1EF16aHvW@db.zhfrcsenooyrhiuainso.supabase.co:5432/postgres";
const sql = postgres(connectionString);

async function testQuery() {
    console.log("Testing direct query on 'users'...");
    try {
        const result = await sql`SELECT * FROM "users" LIMIT 1`;
        console.log("Query success!", result);
    } catch (e) {
        console.error("Query failed with error:", e);
    } finally {
        await sql.end();
    }
}

testQuery();
