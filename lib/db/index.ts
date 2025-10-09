import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.ezero_TURSO_DATABASE_URL || "file:sqlite.db",
  authToken: process.env.ezero_TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
