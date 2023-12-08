import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config } from "drizzle-kit";
import { DATABASE_URL } from "./env";


const connection = connect({
    url: DATABASE_URL,
});

export const db = drizzle(connection, {});

export * from './schema'