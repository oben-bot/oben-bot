import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // drive.file: la app SOLO puede ver/editar archivos que ella
          // misma cree - nunca el resto del Drive del usuario. Por eso
          // no requiere el proceso de verificación estricta de Google
          // que sí pide el scope completo de Drive.
          scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
          access_type: 'offline', // necesario para obtener refresh_token
          prompt: 'consent',      // fuerza a que Google siempre entregue el refresh_token
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // La primera vez que el usuario inicia sesión, 'account' trae los tokens.
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Exponemos el access token en la sesión para que las rutas de
      // API puedan usarlo al hablar con Google Drive.
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  session: { strategy: 'jwt' },
};
