import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Using relative URL is safer in Vercel to avoid host mismatches
    baseURL: typeof window !== "undefined" ? undefined : process.env.BETTER_AUTH_URL,
});
