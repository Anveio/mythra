import { getUser } from "@/lib/auth";
import { conversations, db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createConversationSchema = z.object({
    conversationPublicId: z.string().length(6),
    userPrivateId: z.string(),
})

export const POST = async (req: Request) => {
    const { isAuthenticated, user } = await getUser()

    if (!isAuthenticated || !user) {
        return new Response(undefined, { status: 401 });
    }

    const unsafeBody = await req.json()

    const parseResult = createConversationSchema.safeParse(unsafeBody)

    if (!parseResult.success) {
        return new Response(undefined, { status: 400 });
    }

    await createConversation(parseResult.data.conversationPublicId, user.id)

    return new Response(undefined, { status: 200 });
}

const createConversation = (conversationPublicId: string, userPrivateId: string) => {
    const parseResult = createConversationSchema.parse({
        conversationPublicId,
        userPrivateId,
    })

    return db.transaction(async (tx) => {
        const { userId } = (await tx.select({
            userId: users.id,
        }).from(users).where(eq(users.privateId, userPrivateId)).limit(1))[0]

        if (!userId) {
            throw new Error("User not found")
        }

        await tx.insert(conversations).values({
            publicId: parseResult.conversationPublicId,
            userId: userId,
            userPrivateId: userPrivateId,
        })
    })


}