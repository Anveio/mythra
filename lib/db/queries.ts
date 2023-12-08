import { and, eq } from "drizzle-orm";
import { conversations, db } from ".";

export const getConversationsByUserPrivateId = async (privateId: string) => {
    return db
        .select({
            publicId: conversations.publicId,
            userPrivateId: conversations.userPrivateId,
            title: conversations.title,
            createdAt: conversations.createdAt,
        })
        .from(conversations)
        .where(eq(conversations.userPrivateId, privateId));
};

export const getMessagesInConversation = async (
    userPrivateId: string,
    conversationPublicId: string
) => {
    return db
        .select({
            publicId: conversations.publicId,
            userPrivateId: conversations.userPrivateId,
            title: conversations.title,
            createdAt: conversations.createdAt,
        })
        .from(conversations)
        .where(
            and(
                eq(conversations.userPrivateId, userPrivateId),
                eq(conversations.publicId, conversationPublicId)
            )
        );
};

export const deleteConversation = async (userPrivateId: string, conversationPublicId: string) => {
    return db
        .delete(conversations)
        .where(
            and(
                eq(conversations.userPrivateId, userPrivateId),
                eq(conversations.publicId, conversationPublicId)
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