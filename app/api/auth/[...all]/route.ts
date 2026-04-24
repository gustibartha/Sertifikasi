import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth will handle all /api/auth routes
export const { GET, POST } = toNextJsHandler(auth);
