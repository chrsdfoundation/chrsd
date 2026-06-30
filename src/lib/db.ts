import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "../../drizzle/schema/auth";
import * as contentSchema from "../../drizzle/schema/content";
import * as mediaSchema from "../../drizzle/schema/media";
import * as peopleSchema from "../../drizzle/schema/people";

const client = postgres(import.meta.env.DATABASE_URL);

export const db = drizzle(client, {
  schema: {
    ...authSchema,
    ...contentSchema,
    ...mediaSchema,
    ...peopleSchema,
  },
});
