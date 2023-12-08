import { NextRequest, NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { SignJWT } from "jose";
import { z } from 'zod';
import { getJwtSecretKey } from '@/lib/auth';
const workOsApiKey = process.env.WORKOS_API_KEY;

if (!workOsApiKey) {
    throw new Error('WORKOS_API_KEY environment variable not set');
}

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
