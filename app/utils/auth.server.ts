import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";

import { queries, initializeDatabase } from "./db.server";
import { sessionStorage } from "./session.server";

export interface User {
  id: string;
  email: string;
  name: string;
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
    // Ensure database is initialized
    if (!queries) {
      initializeDatabase();
    }

    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0].value,
    };

    // Save or update user in database
    if (queries) {
      try {
        queries.insertOrUpdateUser.run(
          user.id,
          user.email,
          user.name,
          user.avatar
        );
        console.log(`✅ User ${user.email} saved to database`);
      } catch (error) {
        console.error("Error saving user to database:", error);
      }
    }

    return user;
  }
);

authenticator.use(googleStrategy);
