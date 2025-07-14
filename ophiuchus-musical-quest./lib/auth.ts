import { NextAuthOptions } from "next-auth"
import type { JWT } from 'next-auth/jwt';
import SpotifyProvider from "next-auth/providers/spotify"
import { REFRESH_ACCESS_TOKEN_ERROR } from "@/lib/constant";
import spotifyApi from "@/lib/spotify";

export interface AccessTokenContext {
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  accessTokenExpires?: number;
  error?: string;
}

const scopes = [
  "streaming",
  "playlist-read-collaborative", 
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
].join(',');

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.accessToken) {
        const thisuser = {
          ...session.user,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          username: token.username as string,
        };
        session.user = thisuser;
        return session;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : 0,
        };
      }

      // Return previous token if the access token has not expired yet
      const now = Date.now();
      if (token.accessTokenExpires && now < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

async function refreshAccessToken(
  token: JWT
): Promise<JWT & AccessTokenContext> {
  try {
    if (!token.accessToken || !token.refreshToken) {
      throw new Error("Token can not be undefined");
    }

    spotifyApi.setAccessToken(token.accessToken as string);
    spotifyApi.setRefreshToken(token.refreshToken as string);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken:
        refreshedToken.refresh_token ?? (token.refreshToken as string),
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: REFRESH_ACCESS_TOKEN_ERROR,
    };
  }
} 