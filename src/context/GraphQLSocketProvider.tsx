import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient, Client, ClientOptions } from "graphql-ws";
import config from "@/config.env";
import { print } from "graphql";
import { getAuth, onIdTokenChanged, User } from "firebase/auth";
import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
} from "@apollo/client/core";

const GRAPHQL_SOCKET_SERVER = config.GRAPHQL_SOCKET_SERVER;
const GRAPHQL_SERVER = config.GRAPHQL_SERVER;

const GraphqlClientContext =
  createContext<ApolloClient<NormalizedCacheObject> | null>(null);

interface Props {
  children: React.ReactNode;
}
class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        }
      );
    });
  }
}
export const GraphqlClientProvider = ({ children }: Props) => {
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const createNewClient = async () => {
      const user = auth.currentUser;

      let idToken = user ? await user.getIdToken() : undefined;

      const httpLink = new HttpLink({
        uri: GRAPHQL_SERVER,
        headers: {
          authorization: idToken ? `Bearer ${idToken}` : "",
        },
      });
      const socketLink = new WebSocketLink({
        url: GRAPHQL_SOCKET_SERVER,
        lazy: false,
        connectionParams: async () => ({
          authorization: idToken ? `Bearer ${idToken}` : "",
        }),
        shouldRetry: () => true,
        retryAttempts: Infinity,
      });

      const client = new ApolloClient({
        link: ApolloLink.from([httpLink, socketLink]),
        cache: new InMemoryCache(),
      });

      setClient(client);
      setIsLoading(false);
    };

    onIdTokenChanged(auth, () => createNewClient());
    createNewClient();
  }, []);

  if (isLoading) {
    return <span>Loading GraphQL...</span>;
  }

  return (
    <GraphqlClientContext.Provider value={client}>
      {children}
    </GraphqlClientContext.Provider>
  );
};

export const useGraphqlClient = () => {
  const client = useContext(GraphqlClientContext);
  if (!client) {
    throw new Error(
      "useGraphqlClient must be used within a GraphqlClientProvider"
    );
  }
  return client;
};
