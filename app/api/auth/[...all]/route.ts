import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";

// Better Auth will handle all /api/auth routes
export const { GET, POST } = toNextJsHandler(auth);
