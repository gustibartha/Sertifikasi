import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { ssl: 'require' });

async function check() {
    try {
        console.log("Checking for user 'bartha@pln.co.id'...");
        
        // Try both singular and plural table names
        let user;
        try {
            user = await sql`SELECT * FROM users WHERE email = 'bartha@pln.co.id'`;
            console.log("Plural 'users' table results:", user);
        } catch (e) {
            console.log("Plural 'users' table not found.");
        }

        try {
            user = await sql`SELECT * FROM "user" WHERE email = 'bartha@pln.co.id'`;
            console.log("Singular 'user' table results:", user);
        } catch (e) {
            console.log("Singular 'user' table not found.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await sql.end();
    }
}

check();
