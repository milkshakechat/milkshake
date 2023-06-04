import { createClient } from "graphql-ws";
import config from "@/api/config.env";

const GRAPHQL_SOCKET_SERVER = config.GRAPHQL_SOCKET_SERVER;

export const client = createClient({
  url: GRAPHQL_SOCKET_SERVER,
  shouldRetry: () => true,
  retryAttempts: Infinity,
});
