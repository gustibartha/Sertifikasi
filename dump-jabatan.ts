import { db } from "./lib/db";
import { employees } from "./lib/schema";
import { sql } from "drizzle-orm";

async function dump() {
  try {
    const list = await db
      .select({
        jabatan: employees.jabatan,
        count: sql<number>`count(*)`
      })
      .from(employees)
      .groupBy(employees.jabatan)
      .orderBy(sql`count(*) desc`)
      .limit(50);

    console.log("Top 50 jabatans in DB:");
    console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

dump();
