import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient, Client } from "graphql-ws";
import config from "@/config.env";
import { getAuth, onIdTokenChanged, User } from "firebase/auth";

const GRAPHQL_SOCKET_SERVER = config.GRAPHQL_SOCKET_SERVER;

const GraphqlClientContext = createContext<Client | null>(null);

interface Props {
  children: React.ReactNode;
}
export const GraphqlClientProvider = ({ children }: Props) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const createNewClient = async () => {
      const user = auth.currentUser;

      let idToken = user ? await user.getIdToken() : undefined;

      setClient(
        createClient({
          url: GRAPHQL_SOCKET_SERVER,
          connectionParams: async () => ({
            authorization: idToken ? `Bearer ${idToken}` : "",
          }),
          shouldRetry: () => true,
          retryAttempts: Infinity,
        })
      );
      setIsLoading(false);
    };

    onIdTokenChanged(auth, () => createNewClient());
    createNewClient();
  }, []);

  if (isLoading) {
    return <span>Loading GQL Sockets...</span>;
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
