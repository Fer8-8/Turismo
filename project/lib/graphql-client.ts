import { GraphQLClient } from "graphql-request";
import { authClient } from "./auth-client";

export const gqlClient = new GraphQLClient(
  `${process.env.EXPO_PUBLIC_API_URL}/graphql`,
  {
    headers: () => {
      const cookies = authClient.getCookie();
      return {
        ...(cookies ? { Cookie: cookies } : {}),
        credentials: "omit",
      };
    },
  }
);
