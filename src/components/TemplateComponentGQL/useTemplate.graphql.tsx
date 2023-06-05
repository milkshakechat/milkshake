import { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import { print } from "graphql/language/printer";
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
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { GraphQLError } from "graphql";
import { ErrorLine } from "@/api/graphql/error-line";

export const useDemoQuery = () => {
  const [data, setData] = useState<DemoQueryQuery>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runQuery = async (args: QueryDemoQueryArgs) => {
    console.log(`RUNNING QYERY`);
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
            next: ({
              data,
              errors,
            }: {
              data: DemoQueryQuery;
              errors: readonly GraphQLError[];
            }) => {
              if (errors && errors.length > 0) {
                setErrors(errors.map((e) => e.message));
              }
              resolve(data);
            },
            error: reject,
            complete: () => {},
          }
        );
      });
      setData(result);
    } catch (e) {
      setErrors([...errors, (e as any).message]);
    }
  };

  return { data, errors, runQuery };
};

export const useDemoMutation = () => {
  const [data, setData] = useState<DemoMutationMutation>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

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
              next: ({
                data,
                errors,
              }: {
                data: DemoMutationMutation;
                errors: readonly GraphQLError[];
              }) => {
                if (errors && errors.length > 0) {
                  setErrors(errors.map((e) => e.message));
                }
                resolve(data);
              },
              error: reject,
              complete: () => {},
            }
          );
        }
      );
      setData(result);
    } catch (e) {
      setErrors([...errors, (e as any).message]);
    }
  };

  return { data, errors, runMutation };
};

export const useDemoSubscription = () => {
  const [events, setEvents] = useState<DemoSubscriptionEvent[]>([]);
  const eventsRef = useRef(events); // create a reference
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

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
          next: ({
            data,
            errors,
          }: {
            data: DemoSubscriptionSubscription;
            errors: readonly GraphQLError[];
          }) => {
            if (errors && errors.length > 0) {
              setErrors(errors.map((e) => e.message));
            }
            console.log(`Incoming event: `, data.demoSubscription);
            console.log(`Current Events: `, eventsRef.current); // access the latest events
            setEvents((prevEvents) => [...prevEvents, data.demoSubscription]);
          },
          error: setErrors,
          complete: () => {},
        }
      );
    } catch (e) {
      setErrors([...errors, (e as any).message]);
    }

    return unsubscribe;
  };

  return { data: events, errors, runSubscription };
};

export const useDemoPing = () => {
  const [data, setData] = useState<Ping>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

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
            next: ({
              data,
              errors,
            }: {
              data: Pick<Query, "demoPing">;
              errors: readonly GraphQLError[];
            }) => {
              if (errors && errors.length > 0) {
                setErrors(errors.map((e) => e.message));
              }
              resolve(data.demoPing);
            },
            error: reject,
            complete: () => {},
          }
        );
      });
      setData(result);
    } catch (e) {
      setErrors([...errors, (e as any).message]);
    }
  };

  return { data, errors, runQuery };
};
