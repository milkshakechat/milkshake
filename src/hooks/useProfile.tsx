import { ErrorLine } from "@/api/graphql/error-line";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import gql from "graphql-tag";
import { useState } from "react";
import { print } from "graphql/language/printer";
import { GraphQLError } from "graphql";
import {
  CheckUsernameAvailableInput,
  CheckUsernameAvailableResponseSuccess,
  Contact,
  FetchRecentNotificationsResponse,
  FetchRecentNotificationsResponseSuccess,
  GetMyProfileQuery,
  GetMyProfileResponse,
  GetMyProfileResponseSuccess,
  ListContactsResponseSuccess,
  MarkNotificationsAsReadInput,
  MarkNotificationsAsReadResponseSuccess,
  ModifyProfileInput,
  ModifyProfileResponseSuccess,
  Mutation,
  Query,
} from "@/api/graphql/types";
import { useUserState } from "@/state/user.state";
import { Observable, FetchResult } from "@apollo/client/core";
import { shallow } from "zustand/shallow";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import { UserID, localeEnum } from "@milkshakechat/helpers";
import { useListChatRooms } from "./useChat";
import { useNotificationsState } from "@/state/notifications.state";
import { usePreloadImages } from "./usePreloadImages";

export const useProfile = () => {
  const [data, setData] = useState<GetMyProfileResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const { preloadImages, PRELOAD_IMAGE_SET } = usePreloadImages();
  const setGQLUser = useUserState((state) => state.setGQLUser);
  const { switchLocale, switchTheme, switchColor } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      locale: state.locale,
      themeColor: state.themeColor,
      switchLocale: state.switchLocale,
      switchTheme: state.switchTheme,
      switchColor: state.switchColor,
    }),
    shallow
  );

  const runQuery = async () => {
    try {
      const result = await new Promise<GetMyProfileResponseSuccess>(
        (resolve, reject) => {
          const GET_MY_PROFILE = gql`
            query GetMyProfile {
              getMyProfile {
                __typename
                ... on GetMyProfileResponseSuccess {
                  user {
                    id
                    email
                    username
                    phone
                    displayName
                    bio
                    avatar
                    link
                    disabled
                    isPaidChat
                    isCreator
                    createdAt
                    privacyMode
                    themeColor
                    language
                    gender
                    interestedIn
                    sendBirdAccessToken
                    tradingWallet
                    escrowWallet
                    defaultPaymentMethodID
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
                }
              }
            }
          `;
          client
            .query<GetMyProfileQuery>({
              query: GET_MY_PROFILE,
            })
            .then(({ data }) => {
              if (
                data.getMyProfile.__typename === "GetMyProfileResponseSuccess"
              ) {
                resolve(data.getMyProfile);
                preloadImages([
                  data.getMyProfile.user.avatar,
                  ...data.getMyProfile.user.stories.map(
                    (story) => story.author.avatar || ""
                  ),
                  ...data.getMyProfile.user.stories.map(
                    (story) => story.attachments[0]?.url || ""
                  ),
                  ...data.getMyProfile.user.stories.map(
                    (story) => story.thumbnail || ""
                  ),
                  ...data.getMyProfile.user.stories.map(
                    (story) => story.showcaseThumbnail || ""
                  ),
                ]);
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
      setGQLUser(result.user);
      const { language, themeColor } = result.user;

      switchLocale(language as unknown as localeEnum);
      switchColor(themeColor);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useCheckUsernameAvailable = () => {
  const [data, setData] = useState<CheckUsernameAvailableResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runQuery = async (args: CheckUsernameAvailableInput) => {
    try {
      const CHECK_USERNAME_AVAILABLE = gql`
        query CheckUsernameAvailable($input: CheckUsernameAvailableInput!) {
          checkUsernameAvailable(input: $input) {
            __typename
            ... on CheckUsernameAvailableResponseSuccess {
              isAvailable
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<CheckUsernameAvailableResponseSuccess>(
        async (resolve, reject) => {
          client
            .query({
              query: CHECK_USERNAME_AVAILABLE,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data.checkUsernameAvailable.__typename ===
                "CheckUsernameAvailableResponseSuccess"
              ) {
                resolve(data.checkUsernameAvailable);
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

export const useUpdateProfile = () => {
  const [data, setData] = useState<ModifyProfileResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const { triggerRefetch } = useUserState(
    (state) => ({
      triggerRefetch: state.triggerRefetch,
    }),
    shallow
  );

  const runMutation = async (args: ModifyProfileInput) => {
    try {
      const MODIFY_PROFILE = gql`
        mutation ModifyProfile($input: ModifyProfileInput!) {
          modifyProfile(input: $input) {
            __typename
            ... on ModifyProfileResponseSuccess {
              user {
                id
                avatar
                username
                displayName
                bio
                link
                language
                themeColor
                privacyMode
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
      const result = await new Promise<ModifyProfileResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "modifyProfile">>({
              mutation: MODIFY_PROFILE,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.modifyProfile.__typename ===
                "ModifyProfileResponseSuccess"
              ) {
                resolve(data.modifyProfile);
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
      triggerRefetch();
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};

export const useListContacts = () => {
  const [data, setData] = useState<ListContactsResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const setContacts = useUserState((state) => state.setContacts);
  const { preloadImages, PRELOAD_IMAGE_SET } = usePreloadImages();
  const setGlobalDirectory = useUserState((state) => state.setGlobalDirectory);
  const [lastRequestTimestamp, setLastRequestTimestamp] = useState<string>(
    new Date().toISOString()
  );
  const selfUser = useUserState((state) => state.user);

  const { runQuery: runListChatRoomsQuery } = useListChatRooms();

  const runQuery = async ({ refresh }: { refresh: boolean }) => {
    const now = new Date().toISOString();
    const nonce = refresh ? now : lastRequestTimestamp;
    if (refresh) {
      setLastRequestTimestamp(now);
    }
    try {
      const LIST_CONTACTS = gql`
        query ListContacts($input: ListContactsInput!) {
          listContacts(input: $input) {
            __typename
            ... on ListContactsResponseSuccess {
              contacts {
                friendID
                username
                displayName
                avatar
                status
              }
              globalDirectory {
                friendID
                username
                displayName
                avatar
                status
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
      const result = await new Promise<ListContactsResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<Pick<Query, "listContacts">>({
              query: LIST_CONTACTS,
              variables: { input: { nonce } },
              // WARNING! The apollo refresh isnt working for some reason. seems to be common issue online
              // fetchPolicy: refresh ? "network-only" : "cache-first",
              fetchPolicy: "cache-first",
            })
            .then(({ data }) => {
              if (
                data.listContacts.__typename === "ListContactsResponseSuccess"
              ) {
                resolve(data.listContacts);
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
      setContacts(result.contacts);
      setGlobalDirectory(result.globalDirectory);
      preloadImages([
        ...result.contacts.map((contact) => contact.avatar || ""),
        ...result.globalDirectory.map((contact) => contact.avatar || ""),
      ]);
      if (selfUser) {
        fetchChatRooms({
          contacts: result.contacts,
          selfUserID: selfUser.id,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchChatRooms = async ({
    contacts,
    selfUserID,
  }: {
    contacts: Contact[];
    selfUserID: UserID;
  }) => {
    runListChatRoomsQuery({
      contacts,
      selfUserID: selfUserID,
    });
  };

  return { data, errors, runQuery };
};

export const useFetchRecentNotifications = () => {
  const [data, setData] = useState<FetchRecentNotificationsResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const { preloadImages, PRELOAD_IMAGE_SET } = usePreloadImages();
  const [lastRequestTimestamp, setLastRequestTimestamp] = useState<string>(
    new Date().toISOString()
  );
  const setInitialNotifications = useNotificationsState(
    (state) => state.setInitialNotifications
  );

  const runQuery = async ({ refresh }: { refresh: boolean }) => {
    const now = new Date().toISOString();
    const nonce = refresh ? now : lastRequestTimestamp;
    if (refresh) {
      setLastRequestTimestamp(now);
    }
    try {
      const FETCH_RECENT_NOTIFICATIONS = gql`
        query FetchRecentNotifications($input: FetchRecentNotificationsInput!) {
          fetchRecentNotifications(input: $input) {
            __typename
            ... on FetchRecentNotificationsResponseSuccess {
              notifications {
                id
                title
                description
                route
                thumbnail
                relatedChatRoomID
                createdAt
                markedRead
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
      const result = await new Promise<FetchRecentNotificationsResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<{
              fetchRecentNotifications: FetchRecentNotificationsResponse;
            }>({
              query: FETCH_RECENT_NOTIFICATIONS,
              variables: { input: { nonce } },
              // WARNING! The apollo refresh isnt working for some reason. seems to be common issue online
              // fetchPolicy: refresh ? "network-only" : "cache-first",
              fetchPolicy: "cache-first",
            })
            .then(({ data }) => {
              console.log(`resulting data`, data);
              if (
                data.fetchRecentNotifications.__typename ===
                "FetchRecentNotificationsResponseSuccess"
              ) {
                resolve(data.fetchRecentNotifications);
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
      console.log(`result.notifications`, result.notifications);
      setInitialNotifications(result.notifications);
      preloadImages([
        ...result.notifications.map(
          (notification) => notification.thumbnail || ""
        ),
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useMarkNotificationsAsRead = () => {
  const [data, setData] = useState<MarkNotificationsAsReadResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const addNotifications = useNotificationsState(
    (state) => state.addNotifications
  );

  const runMutation = async (args: MarkNotificationsAsReadInput) => {
    try {
      const MARK_NOTIFICATIONS_AS_READ = gql`
        mutation MarkNotificationsAsRead(
          $input: MarkNotificationsAsReadInput!
        ) {
          markNotificationsAsRead(input: $input) {
            __typename
            ... on MarkNotificationsAsReadResponseSuccess {
              notifications {
                id
                title
                description
                route
                thumbnail
                relatedChatRoomID
                createdAt
                markedRead
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
      const result = await new Promise<MarkNotificationsAsReadResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "markNotificationsAsRead">>({
              mutation: MARK_NOTIFICATIONS_AS_READ,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.markNotificationsAsRead.__typename ===
                "MarkNotificationsAsReadResponseSuccess"
              ) {
                resolve(data.markNotificationsAsRead);
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
      addNotifications(result.notifications);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};
