
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
   providers: [
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            identifier: { label: "Email or Phone", type: "text" },
            password: { label: "Password", type: "password" },
            otp: { label: "OTP", type: "text" } // For OTP login
         },
         async authorize(credentials) {
            // 1. Logic to find user in DB by email or phone
            // 2. If OTP is provided, verify OTP
            // 3. If Password is provided, verify Hash
            const user = { id: "1", name: "John Doe", role: "ADMIN", userType: "DONOR" };
            return user;
         }
      })
   ],
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.role = user.role;
            token.userType = user.userType;
         }
         return token;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.role = token.role;
            session.user.userType = token.userType;
         }
         return session;
      }
   },
   pages: {
      signIn: '/login',
   }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };