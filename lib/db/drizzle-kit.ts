import { DATABASE_URL } from "./env";
import { Config } from "drizzle-kit";

export default {
    schema: "./lib/db/schema.ts",
    driver: "mysql2",
    dbCredentials: {
        uri: DATABASE_URL,
    },
    out: "./lib/db/__generated__/migrations",
} satisfies Config;
