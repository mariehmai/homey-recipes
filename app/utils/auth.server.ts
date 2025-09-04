import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";

import { db } from "./db.server";
import { sessionStorage } from "./session.server";

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar: string;
}

export const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `${process.env.APP_URL}/auth/google/callback`,
  },
  async ({ profile }) => {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0].value,
    };

    // Save or update user in database
    try {
      await db.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          username: null,
        },
        update: {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      });
      console.log(`✅ User ${user.email} saved to database`);
    } catch (error) {
      console.error("Error saving user to database:", error);
    }

    return user;
  }
);

authenticator.use(googleStrategy);
