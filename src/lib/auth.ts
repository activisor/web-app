import NextAuth, { Account, DefaultSession, NextAuthOptions, Profile, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';

const scope = 'openid https://www.googleapis.com/auth/drive.file';

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            authorization: {
                params: {
                    scope: scope,
                    response_type: 'code',
                    prompt: 'consent',
                    access_type: 'offline'
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        async jwt(params: {
            token: JWT,
            account: Account | null,
            profile?: Profile
        }): Promise<JWT> {
            if (params.account) {
                // pass tokens to JWT session
                params.token.accessToken = params.account?.access_token;
                params.token.refreshToken = params.account?.refresh_token;
            }

            return params.token;
        }
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);