import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createClient, Client, ClientOptions } from "graphql-ws";
import config from "@/config.env";
import { print } from "graphql";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
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
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

const GRAPHQL_SOCKET_SERVER = config.GRAPHQL_SOCKET_SERVER;
const GRAPHQL_SERVER = config.GRAPHQL_SERVER;

const GraphqlClientContext =
  createContext<ApolloClient<NormalizedCacheObject> | null>(null);

interface Props {
  children: React.ReactNode;
}
class WebSocketLink extends ApolloLink {
  public client: Client;

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
  const client = useRef<ApolloClient<NormalizedCacheObject> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketLink = useRef<WebSocketLink | null>(null);

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
    if (socketLink.current) {
      await socketLink.current.client.dispose();
      socketLink.current = null;
    }
    socketLink.current = new WebSocketLink({
      url: GRAPHQL_SOCKET_SERVER,
      lazy: true,
      connectionParams: async () => ({
        authorization: idToken ? `Bearer ${idToken}` : "",
      }),
      shouldRetry: () => true,
      retryAttempts: Infinity,
    });
    const cache = new InMemoryCache();
    await persistCache({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
    });
    const _client = new ApolloClient({
      link: ApolloLink.from([httpLink, socketLink.current]),
      cache,
    });
    client.current = _client;
    setIsLoading(false);
  };

  useEffect(() => {
    onIdTokenChanged(auth, async (user) => {
      console.log("onIdTokenChanged...", user);
      // if (user) {
      createNewClient();
      // } else {
      //   if (
      //     window.location.pathname.includes("/app") &&
      //     window.location.pathname !== "/app/logout" &&
      //     window.location.pathname !== "/app/login" &&
      //     !window.location.pathname.includes("/app/signup/")
      //   ) {
      //     window.location.href = "/app/logout";
      //   }
      // }
    });

    return () => {
      if (socketLink.current) {
        socketLink.current.client.dispose();
      }
    };
  }, []);

  if (isLoading) {
    return <LoadingAnimation width="100vw" height="100vh" type="text" />;
  }

  return (
    <GraphqlClientContext.Provider value={client.current}>
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
