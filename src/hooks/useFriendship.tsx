import { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import {
  DemoMutationMutation,
  DemoMutationMutationVariables,
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
  ManageFriendshipResponseSuccess,
  ManageFriendshipInput,
  EnterChatRoomResponseSuccess,
  EnterChatRoomInput,
  SocialPokeResponseSuccess,
  SocialPokeInput,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { GraphQLError } from "graphql";
import { ErrorLine } from "@/api/graphql/error-line";
import { ObservableSubscription } from "@apollo/client/core";
import { useUserState } from "@/state/user.state";
import { shallow } from "zustand/shallow";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { firestore } from "@/api/firebase";
import {
  FirestoreCollection,
  MirrorPublicUser_Firestore,
  Username,
} from "@milkshakechat/helpers";

export const useSendFriendRequest = () => {
  const [data, setData] = useState<SendFriendRequestResponse>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const { triggerRefetch } = useUserState(
    (state) => ({
      triggerRefetch: state.triggerRefetch,
    }),
    shallow
  );

  const runMutation = async (args: SendFriendRequestInput) => {
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
      setTimeout(() => {
        triggerRefetch();
      }, 1000);
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
              displayName
              bio
              privacyMode
              stories {
                id
                userID
                caption
                pinned
                showcase
                thumbnail
                showcaseThumbnail
                outboundLink
                createdAt
                expiresAt
                attachments {
                  id
                  userID
                  thumbnail
                  stream
                  altText
                  url
                  type
                }
                author {
                  id
                  username
                  avatar
                  displayName
                }
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

export const useManageFriendship = () => {
  const [data, setData] = useState<ManageFriendshipResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const { triggerRefetch } = useUserState(
    (state) => ({
      triggerRefetch: state.triggerRefetch,
    }),
    shallow
  );

  const runMutation = async (args: ManageFriendshipInput) => {
    let resp: ManageFriendshipResponseSuccess | undefined;
    try {
      const MANAGE_FRIENDSHIP = gql`
        mutation ManageFriendship($input: ManageFriendshipInput!) {
          manageFriendship(input: $input) {
            __typename
            ... on ManageFriendshipResponseSuccess {
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
      const result = await new Promise<ManageFriendshipResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "manageFriendship">>({
              mutation: MANAGE_FRIENDSHIP,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.manageFriendship.__typename ===
                "ManageFriendshipResponseSuccess"
              ) {
                resolve(data.manageFriendship);
                resp = data.manageFriendship;
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
      setTimeout(() => {
        triggerRefetch();
      }, 1000);
      return resp;
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};

export const useSocialPoke = () => {
  const [data, setData] = useState<SocialPokeResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: SocialPokeInput) => {
    setLoading(true);
    try {
      const SOCIAL_POKE = gql`
        mutation SocialPoke($input: SocialPokeInput!) {
          socialPoke(input: $input) {
            __typename
            ... on SocialPokeResponseSuccess {
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
      const result = await new Promise<SocialPokeResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "socialPoke">>({
              mutation: SOCIAL_POKE,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (data?.socialPoke.__typename === "SocialPokeResponseSuccess") {
                resolve(data.socialPoke);
              }
              setLoading(false);
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
              setLoading(false);
            });
        }
      );
      setData(result);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runMutation };
};

export const useSearchByUsername = () => {
  const selfUser = useUserState((state) => state.user);
  const [foundUser, setFoundUser] = useState<MirrorPublicUser_Firestore | null>(
    null
  );

  const { tokenID } = useUserState((state) => ({
    tokenID: state.idToken,
  }));

  const searchByExactUsername = async (username: Username) => {
    if (!selfUser || !selfUser.id || !tokenID) return () => {};
    const q = query(
      collection(firestore, FirestoreCollection.MIRROR_USER),
      where("username", "==", username),
      limit(1)
    );
    const innerDocsSnap = await getDocs(q);
    innerDocsSnap.forEach((doc) => {
      const mirror = doc.data() as MirrorPublicUser_Firestore;
      setFoundUser(mirror);
    });
    if (innerDocsSnap.empty) {
      setFoundUser(null);
    }
  };

  const clearSearchResult = () => {
    setFoundUser(null);
  };

  return {
    searchByExactUsername,
    foundUser,
    clearSearchResult,
  };
};

// export const useFriendship = () => {

//   const {} = useSendFriendRequest()

//   return {
//     sendFriendRequest,
//     // acceptFriendRequest,
//     // updateFriendship,
//   };
// };
