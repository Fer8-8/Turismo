import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient, Role } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { admin } from "better-auth/plugins/admin";
import { bearer } from "better-auth/plugins/bearer";
import { expo } from "@better-auth/expo";
import { anonymous } from "better-auth/plugins";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
  trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://192.168.1.144:5173",
        "https://turismo-ochre.vercel.app",
        "https://turismo-lemon.vercel.app",
        "https://dashboard-tanstack.vercel.app",
        "https://dashboard-sigma-ten-16.vercel.app",
        "https://foliatti.seanalytics.solutions",
        "exploremexico://",
        "exploremexico-prev://",
        "exploremexico-dev://",
        "exp://",
        "exp://**",

        
        // Development mode - Expo's exp:// scheme with local IP ranges
        ...(process.env.NODE_ENV === "development" ? [
            "exp://",                      // Trust all Expo URLs (prefix matching)
            "exp://**",                    // Trust all Expo URLs (wildcard matching)
            "exp://192.168.*.*:*/**",      // Trust 192.168.x.x IP range with any port and path
        ] : [])
    ],
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  advanced:{
    database:{ 
      generateId: () => {
        return crypto.randomUUID();
      }
    }
  },
  
  // Extender el esquema de usuario
  user: {
    additionalFields: {
      managedStateId: {
        type: "string",
        required: false,
        input: false, // No se puede establecer directamente en el registro
        defaultValue: null,
      },
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "user",
      }
    }
  },
  
  plugins: [expo(), 
    admin({
      defaultRole: Role.user as any,
      roles: [Role.admin, Role.adminState, Role.user] as any,
    }),
    bearer(),
    anonymous({ 
    onLinkAccount: async ({ anonymousUser, newUser}) => {},
    generateRandomEmail: () => {
      const id = crypto.randomUUID();
      return `guest-${id}@example.com`
    },

  }),
  ]
});

// Exportar prisma para usarlo en otras partes de tu app
export { prisma };