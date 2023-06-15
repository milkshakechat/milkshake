import { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import {
  DemoMutationMutation,
  DemoMutationMutationVariables,
  DemoQueryQuery,
  DemoSubscriptionEvent,
  DemoSubscriptionSubscription,
  Ping,
  QueryDemoQueryArgs,
  Query,
  DemoQueryResponseSuccess,
  MutationDemoMutationArgs,
  DemoMutationResponseSuccess,
  DemoMutationInput,
  DemoQueryInput,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { GraphQLError } from "graphql";
import { ErrorLine } from "@/api/graphql/error-line";
import { ObservableSubscription } from "@apollo/client/core";

export const useDemoQuery = () => {
  const [data, setData] = useState<DemoQueryResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runQuery = async (args: DemoQueryInput) => {
    try {
      const DEMO_QUERY = gql`
        query DemoQuery($input: DemoQueryInput!) {
          demoQuery(input: $input) {
            __typename
            ... on DemoQueryResponseSuccess {
              message
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<DemoQueryResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<DemoQueryQuery>({
              query: DEMO_QUERY,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (data.demoQuery.__typename === "DemoQueryResponseSuccess") {
                resolve(data.demoQuery);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useDemoMutation = () => {
  const [data, setData] = useState<DemoMutationResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runMutation = async (args: DemoMutationInput) => {
    try {
      const DEMO_MUTATION = gql`
        mutation DemoMutation($input: DemoMutationInput!) {
          demoMutation(input: $input) {
            __typename
            ... on DemoMutationResponseSuccess {
              item {
                id
                title
              }
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<DemoMutationResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<DemoMutationMutation>({
              mutation: DEMO_MUTATION,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.demoMutation.__typename === "DemoMutationResponseSuccess"
              ) {
                resolve(data.demoMutation);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
    } catch (e) {
      console.log(e);
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
      let subscription: ObservableSubscription;
      const DEMO_SUBSCRIPTION = gql`
        subscription DemoSubscription {
          demoSubscription {
            message
          }
        }
      `;
      const observable = await client.subscribe({
        query: DEMO_SUBSCRIPTION,
      });
      subscription = observable.subscribe({
        next: ({
          data,
          errors,
        }: {
          data: DemoSubscriptionSubscription;
          errors: readonly GraphQLError[];
        }) => {
          if (errors && errors.length > 0) {
            setErrors(errors.map((e) => e.message));
            subscription.unsubscribe();
          }
          // console.log(`Incoming event: `, data.demoSubscription);
          // console.log(`Current Events: `, eventsRef.current); // access the latest events
          setEvents((prevEvents) => [...prevEvents, data.demoSubscription]);
        },
        error: setErrors,
        complete: () => {},
      });
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
      let subscription: ObservableSubscription;
      const DEMO_PING = gql`
        query DemoPing {
          demoPing {
            timestamp
          }
        }
      `;
      const result = await new Promise<Ping>((resolve, reject) => {
        const observeable = client.subscribe({
          query: DEMO_PING,
        });
        subscription = observeable.subscribe({
          next: ({
            data,
            errors,
          }: {
            data: Pick<Query, "demoPing">;
            errors: readonly GraphQLError[];
          }) => {
            if (errors && errors.length > 0) {
              setErrors(errors.map((e) => e.message));
              subscription.unsubscribe();
            }
            resolve(data.demoPing);
          },
          error: reject,
          complete: () => {},
        });
      });
      setData(result);
    } catch (e) {
      setErrors([...errors, (e as any).message]);
    }
  };

  return { data, errors, runQuery };
};
