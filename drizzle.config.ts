import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.ezero_TURSO_DATABASE_URL || "",
    authToken: process.env.ezero_TURSO_AUTH_TOKEN || "",
  },
});
