import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const email = "bartha@pln.co.id";
    const password = "M@sterx20";
    const name = "Bartha Admin";

    console.log("Resetting admin user...");

    // 1. Get user ID first
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.email, email)
    });

    if (existingUser) {
      // 2. Delete from accounts and users (Better Auth tables)
      await db.delete(schema.account).where(eq(schema.account.userId, existingUser.id));
      await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id));
      await db.delete(schema.user).where(eq(schema.user.id, existingUser.id));
    }

    // 3. Create fresh via Auth API
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin user RESET and created successfully via Auth API",
      user 
    });
  } catch (error: any) {
    console.error("Error resetting admin:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Unknown error",
      error 
    }, { status: 500 });
  }
}
