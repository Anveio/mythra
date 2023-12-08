import { NextRequest, NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { SignJWT } from "jose";
import { z } from 'zod';
import { getJwtSecretKey } from '@/lib/auth';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
const workOsApiKey = process.env.WORKOS_API_KEY;

if (!workOsApiKey) {
    throw new Error('WORKOS_API_KEY environment variable not set');
}

const generateNanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

const workos = new WorkOS(workOsApiKey);

const searchParamsSchema = z.string()

export async function GET(req: NextRequest) {
    // The authorization code returned by AuthKit
    const codeUnsafe = req.nextUrl.searchParams.get('code');

    const parseResult = searchParamsSchema.safeParse(codeUnsafe);

    if (!parseResult.success) {
        return NextResponse.json({
            status: 400,
            error: "No authorization code was received from AuthKit",
        });
    }

    const code = parseResult.data

    const clientId = process.env.WORKOS_CLIENT_ID;


    if (!clientId) {
        throw new Error('WORKOS_CLIENT_ID environment variable not set');
    }

    const { user } = await workos.userManagement.authenticateWithCode({
        code: code,
        clientId,
    });


    const userInDb = await getUserByEmail(user.email);

    console.log(user.id)

    if (!userInDb) {
        await createUser({
            email: user.email,
            privateId: user.id,
            publicId: generateNanoid(),
        });
    }

    // Create a JWT token with the user's information
    const token = await new SignJWT({
        // Here you might lookup and retrieve user details from your database
        user,
    })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(getJwtSecretKey());

    // Use the information in `user` for further business logic.

    // Cleanup params and redirect to homepage
    const url = req.nextUrl.clone();
    url.searchParams.delete('code');
    url.pathname = '/';

    const response = NextResponse.redirect(url);

    response.cookies.set({
        name: "token",
        value: token,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });

    return response;
};

const insertUserSchema = z.object({
    email: z.string().email(),
    privateId: z.string(),
    publicId: z.string(),
});

const createUser = (
    row: z.infer<typeof insertUserSchema>,
) => {
    const validatedRow = insertUserSchema.parse(row);
    return db.transaction(async (tx) => {
        return tx.insert(users).values(validatedRow).execute();
    });
};

const getUserByEmail = async (email: string): Promise<{} | undefined> => {
    const validatedEmail = z.string().email().parse(email);

    const queryResult = await db.select({
        email: users.email,
    }).from(users).where(eq(users.email, validatedEmail)).limit(1)

    return queryResult[0];
}