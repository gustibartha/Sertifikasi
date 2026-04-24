import postgres from 'postgres';

const connectionString = "postgresql://postgres:qT9KBvr1EF16aHvW@db.zhfrcsenooyrhiuainso.supabase.co:5432/postgres";
const sql = postgres(connectionString);

async function checkAccount() {
    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'account'
        `;
        console.log("Columns in 'account' table:");
        console.table(columns);
    } catch (e) {
        console.error("Check failed:", e.message);
    } finally {
        await sql.end();
    }
}

checkAccount();
