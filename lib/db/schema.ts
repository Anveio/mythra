import {
    mysqlTable,
    serial,
    varchar,
    timestamp,
    uniqueIndex,
    int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
    "users",
    {
        id: serial("id").primaryKey().autoincrement(),
        privateId: varchar("private_id", { length: 31 }).notNull(),
        publicId: varchar("public_id", { length: 6 }).notNull(),
        email: varchar("email", { length: 319 }).notNull().unique(),
        createdAt: timestamp("created_at").defaultNow(),
        emailVerifiedAt: timestamp("email_verified_at"),
    },
    (users) => ({
        emailIndex: uniqueIndex("email_idx").on(users.email),
        publicId: uniqueIndex("public_id_idx").on(users.publicId),
    })
);

export const conversations = mysqlTable(
    "conversations",
    {
        id: serial("id").primaryKey().autoincrement(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        publicId: varchar("public_id", { length: 6 }).notNull(),
        title: varchar("title", { length: 255 }),
        userId: int("user_id").notNull(),
        userPrivateId: varchar("private_id", { length: 31 }).notNull()
    },
    (conversations) => ({
        createdAtIndex: uniqueIndex("created_at_idx").on(
            conversations.createdAt
        ),
    })
)