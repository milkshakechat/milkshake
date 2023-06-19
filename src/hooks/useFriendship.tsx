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
  ViewPublicProfileResponseSuccess,
  MutationDemoMutationArgs,
  SendFriendRequestResponse,
  SendFriendRequestInput,
  ViewPublicProfileInput,
  Mutation,
  SendFriendRequestResponseSuccess,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { GraphQLError } from "graphql";
import { ErrorLine } from "@/api/graphql/error-line";
import { ObservableSubscription } from "@apollo/client/core";

export const useSendFriendRequest = () => {
  const [data, setData] = useState<SendFriendRequestResponse>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runMutation = async (args: SendFriendRequestInput) => {
    console.log(`runMutation...`);
    let resp: SendFriendRequestResponseSuccess | undefined;
    try {
      const SEND_FRIEND_REQUEST = gql`
        mutation SendFriendRequest($input: SendFriendRequestInput!) {
          sendFriendRequest(input: $input) {
            __typename
            ... on SendFriendRequestResponseSuccess {
              status
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<SendFriendRequestResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "sendFriendRequest">>({
              mutation: SEND_FRIEND_REQUEST,
              variables: { input: args },
            })
            .then(({ data }) => {
              console.log(`data`, data);
              if (
                data?.sendFriendRequest.__typename ===
                "SendFriendRequestResponseSuccess"
              ) {
                resolve(data.sendFriendRequest);
              }
            })
            .catch((graphQLError: Error) => {
              console.log(graphQLError);
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
      resp = result;
    } catch (e) {
      console.log(e);
    }
    return resp;
  };

  return { data, errors, runMutation };
};

export const useViewPublicProfile = (): {
  data: ViewPublicProfileResponseSuccess | undefined;
  errors: ErrorLine[];
  runQuery: (
    args: ViewPublicProfileInput
  ) => Promise<ViewPublicProfileResponseSuccess | undefined>;
} => {
  const [data, setData] = useState<ViewPublicProfileResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runQuery = async (args: ViewPublicProfileInput) => {
    let resp: ViewPublicProfileResponseSuccess | undefined;
    try {
      const VIEW_PUBLIC_PROFILE = gql`
        query ViewPublicProfile($input: ViewPublicProfileInput!) {
          viewPublicProfile(input: $input) {
            __typename
            ... on ViewPublicProfileResponseSuccess {
              id
              username
              avatar
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<ViewPublicProfileResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<Pick<Query, "viewPublicProfile">>({
              query: VIEW_PUBLIC_PROFILE,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data.viewPublicProfile.__typename ===
                "ViewPublicProfileResponseSuccess"
              ) {
                resolve(data.viewPublicProfile);
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
    return resp;
  };

  return { data, errors, runQuery };
};

// export const useFriendship = () => {

//   const {} = useSendFriendRequest()

//   return {
//     sendFriendRequest,
//     // acceptFriendRequest,
//     // updateFriendship,
//   };
// };