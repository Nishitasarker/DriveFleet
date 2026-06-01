import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("DriveFeet");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_SECRET
    }
  },
  // ❌ session.cookieCache.strategy:"jwt" — এটা সরিয়ে দিন
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 24 * 60 * 60
    }
  },
  plugins: [
    jwt({
      jwt: {
      expirationTime: "7d", // ✅ এটা যোগ করুন
    },
      jwks: {
        keyPairConfig: {
          alg: "EdDSA", // ✅ এটা দিলে proper JWT তৈরি হবে
        }
      }
    })
  ]
});