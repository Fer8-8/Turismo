import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://turismobackend-production.up.railway.app/graphql",
  documents: [
    "app/**/*.{ts,tsx}",
    "features/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
  ],
  generates: {
    "./gql/": {
      preset: "client",
    },
  },
};

export default config;
