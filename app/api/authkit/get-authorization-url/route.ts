import { NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';

const workOsApiKey = process.env.WORKOS_API_KEY;

if (!workOsApiKey) {
    throw new Error('WORKOS_API_KEY environment variable not set');
}

const workos = new WorkOS(workOsApiKey);

const CALLBACK_PATH = 'api/authkit/callback';

const redirectUri = process.env.NODE_ENV === 'production' ? `http://mythra.vercel.app${CALLBACK_PATH}` : `http://localhost:3000${CALLBACK_PATH}`;

export function GET() {
    const clientId = process.env.WORKOS_CLIENT_ID;

    if (!clientId) {
        throw new Error('WORKOS_CLIENT_ID environment variable not set');
    }

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
        // Specify that we'd like AuthKit to handle the authentication flow
        provider: 'authkit',

        // The callback URI AuthKit will redirect to after authentication
        redirectUri,
        clientId,
    });

    // Redirect the user to the AuthKit sign-in page
    return NextResponse.redirect(authorizationUrl);
}
