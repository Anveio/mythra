import { and, eq } from "drizzle-orm";
import { conversations, db } from ".";

export const getConversationsByUserId = async (privateId: string) => {
    return db
        .select({
            id: conversations.id,
            userId: conversations.userId,
            title: conversations.title,
            createdAt: conversations.createdAt,
        })
        .from(conversations)
        .where(eq(conversations.userId, privateId));
};

export const getMessagesInConversation = async (
    userId: string,
    conversationid: string
) => {
    return db
        .select({
            id: conversations.id,
            userId: conversations.userId,
            title: conversations.title,
            createdAt: conversations.createdAt,
        })
        .from(conversations)
        .where(
            and(
                eq(conversations.userId, userId),
                eq(conversations.id, conversationid)
            )
        );
};

export const deleteConversation = async (userId: string, conversationid: string) => {
    return db
        .delete(conversations)
        .where(
            and(
                eq(conversations.userId, userId),
                eq(conversations.id, conversationid)
            )
        );
}

export const getFoldersWithEmailCount = async () => {
    return {
        specialFolders: [{
            name: 'Inbox',
            email_count: 1
        }],
        otherFolders: [{
            name: 'Inbox',
            email_count: 1
        }]
    }
}