import { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import { print } from "graphql/language/printer";
import { client } from "@/api/graphql";
import {
  DemoMutationMutation,
  DemoMutationMutationVariables,
  DemoQueryQuery,
  DemoSubscriptionEvent,
  DemoSubscriptionSubscription,
  Ping,
  QueryDemoQueryArgs,
  Query,
} from "@/api/graphql/types";

export const useDemoQuery = () => {
  const [data, setData] = useState<DemoQueryQuery>();
  const [error, setError] = useState<Error>();

  const runQuery = async (args: QueryDemoQueryArgs) => {
    try {
      const DEMO_QUERY = gql`
        query DemoQuery($input: String!) {
          demoQuery(input: $input)
        }
      `;
      const result = await new Promise<DemoQueryQuery>((resolve, reject) => {
        client.subscribe(
          {
            query: print(DEMO_QUERY),
            variables: args,
          },
          {
            next: ({ data }: { data: DemoQueryQuery }) => resolve(data),
            error: reject,
            complete: () => {},
          }
        );
      });
      setData(result);
    } catch (e) {
      setError(e as unknown as Error);
    }
  };

  return { data, error, runQuery };
};

export const useDemoMutation = () => {
  const [data, setData] = useState<DemoMutationMutation>();
  const [error, setError] = useState<Error>();

  const runMutation = async (args: DemoMutationMutationVariables) => {
    try {
      const DEMO_MUTATION = gql`
        mutation DemoMutation($title: String!) {
          demoMutation(title: $title) {
            id
            title
          }
        }
      `;
      const result = await new Promise<DemoMutationMutation>(
        (resolve, reject) => {
          client.subscribe(
            {
              query: print(DEMO_MUTATION),
              variables: args,
            },
            {
              next: ({ data }: { data: DemoMutationMutation }) => resolve(data),
              error: reject,
              complete: () => {},
            }
          );
        }
      );
      setData(result);
    } catch (e) {
      setError(e as unknown as Error);
    }
  };

  return { data, error, runMutation };
};

export const useDemoSubscription = () => {
  const [events, setEvents] = useState<DemoSubscriptionEvent[]>([]);
  const eventsRef = useRef(events); // create a reference
  const [error, setError] = useState<Error>();

  useEffect(() => {
    eventsRef.current = events; // update the reference whenever events change
  }, [events]);

  const runSubscription = async () => {
    let unsubscribe = null;

    try {
      const DEMO_SUBSCRIPTION = gql`
        subscription DemoSubscription {
          demoSubscription {
            message
          }
        }
      `;
      unsubscribe = await client.subscribe(
        { query: print(DEMO_SUBSCRIPTION) },
        {
          next: ({ data }: { data: DemoSubscriptionSubscription }) => {
            console.log(`Incoming event: `, data.demoSubscription);
            console.log(`Current Events: `, eventsRef.current); // access the latest events
            setEvents((prevEvents) => [...prevEvents, data.demoSubscription]);
          },
          error: setError,
          complete: () => {},
        }
      );
    } catch (e) {
      setError(e as unknown as Error);
    }

    return unsubscribe;
  };

  return { data: events, error, runSubscription };
};

export const useDemoPing = () => {
  const [data, setData] = useState<Ping>();
  const [error, setError] = useState<Error>();

  const runQuery = async () => {
    try {
      const DEMO_PING = gql`
        query DemoPing {
          demoPing {
            timestamp
          }
        }
      `;
      const result = await new Promise<Ping>((resolve, reject) => {
        client.subscribe(
          {
            query: print(DEMO_PING),
          },
          {
            next: ({ data }: { data: Pick<Query, "demoPing"> }) => {
              resolve(data.demoPing);
            },
            error: reject,
            complete: () => {},
          }
        );
      });
      setData(result);
    } catch (e) {
      setError(e as unknown as Error);
    }
  };

  return { data, error, runQuery };
};
