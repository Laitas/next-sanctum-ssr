import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Your Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("req", req);
        console.log("credentials", credentials);
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL! + "/sanctum/csrf-cookie",
          {
            method: "GET",
          }
        );

        const setCookieHeader = res.headers.get("set-cookie");
        // console.log("setCookieHeader", setCookieHeader)
        // you'll find your_site_session key in this console log

        const cookies = setCookieHeader?.split(", ");
        // console.log(cookies)
        let sessionKey = null;
        let xsrfToken = null;

        for (const cookie of cookies!) {
          if (cookie.startsWith("laravel_session=")) {
            sessionKey = cookie.split("=")[1];
          } else if (cookie.startsWith("XSRF-TOKEN=")) {
            xsrfToken = cookie.split("=")[1];
          }

          if (sessionKey && xsrfToken) {
            break;
          }
        }
        const data = {
          email: credentials?.email,
          password: credentials?.password,
        };
        const headers = new Headers({
          Cookie: `laravel_session=${sessionKey}`,
          "Content-Type": "application/json",
        });

        if (xsrfToken) {
          headers.append("X-XSRF-TOKEN", xsrfToken);
        }

        const options = {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        };
        try {
          // console.log(options)
          const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL! + "/api/login",
            options
          );

          if (response.ok) {
            const res = await response.json();
            console.log("response", res);
            return res;
          } else {
            console.log("HTTP error! Status:", response.status);
            // Handle non-successful response here, return an appropriate JSON response.
            return { error: "Authentication failed" };
          }
        } catch (error) {
          console.log("Error", error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.user = user;
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.access_token;
      session.user = token.user;
      return session;
    },
  },
  //   pages: {
  //     signIn: "/signin",
  //   },
});
