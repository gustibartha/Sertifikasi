import { db } from "./lib/db";
import { employees } from "./lib/schema";
import { eq, sql, or, like } from "drizzle-orm";

async function check() {
  try {
    const list = await db
      .select({
        jabatan: employees.jabatan,
        count: sql<number>`count(*)`
      })
      .from(employees)
      .where(or(
        like(employees.jabatan, '%LISTRIK%'),
        like(employees.jabatan, '%KONTROL%'),
        like(employees.jabatan, '%MESIN%'),
        like(employees.jabatan, '%INSTRUMEN%')
      ))
      .groupBy(employees.jabatan);

    console.log("Found jabatans:");
    console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

check();
