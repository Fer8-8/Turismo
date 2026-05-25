import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { admin } from 'better-auth/plugins/admin';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { bearer } from 'better-auth/plugins';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",

  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.1.66:8081',
    'exp://192.168.1.66:8081',
    "http://192.168.1.89:3000",

    
    ...(process.env.NODE_ENV === "development" ? [
      "exp://",                      // Trust all Expo URLs (prefix matching)
      "exp://**",                    // Trust all Expo URLs (wildcard matching)
      "exp://192.168.*.*:*/**",      // Trust 192.168.x.x IP range with any port and path
    ] : [])
  ],

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Enable email/password sign up & sign in
  // Require email verification before allowing sign-in, and avoid auto-login after sign-up.
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  // This controls how Better Auth sends email verification tokens.
  // We log it in console for local/dev testing.
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log("Email verification token (use this to verify email):", token);
    },
  },

  plugins: [
    admin({
      defaultRole: 'user',
    }),
    bearer(),

    // Email OTP plugin (supports /email-otp/* routes)
    emailOTP({
      // For local development, just log the OTP rather than sending an email.
      sendVerificationOTP: async ({ email, otp, type }) => {
        console.log(`OTP for ${email} (type=${type}): ${otp}`);
      },
    }),
  ],
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});

export { prisma };