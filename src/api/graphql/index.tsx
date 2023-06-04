import { createClient } from "graphql-ws";

export const client = createClient({
  url: "ws://localhost:8888/graphql",
  shouldRetry: () => true,
});
