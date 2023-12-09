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
        id: varchar("id", { length: 31 }).notNull(),
        email: varchar("email", { length: 319 }).notNull().unique(),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (users) => ({
        emailIndex: uniqueIndex("email_idx").on(users.email),
    })
);

export const conversations = mysqlTable(
    "conversations",
    {
        id: varchar("id", { length: 6 }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        title: varchar("title", { length: 255 }),
        userId: varchar("user_id", { length: 31 }).notNull(),
    },
    (conversations) => ({
        createdAtIndex: uniqueIndex("created_at_idx").on(
            conversations.createdAt
        ),
    })
)

export const messages = mysqlTable("messages", {
    id: varchar("id", { length: 6 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    content: varchar("content", { length: 255 }).notNull(),
    conversationId: int("conversation_id").notNull(),
    userId: int("user_id").notNull(),
}, (messages) => {
    return {
        createdAtIndex: uniqueIndex("created_at_idx").on(messages.createdAt),
        conversationIdIndex: uniqueIndex("conversation_id_idx").on(messages.conversationId),
    }
})