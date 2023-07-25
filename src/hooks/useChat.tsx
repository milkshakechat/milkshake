import { ErrorLine } from "@/api/graphql/error-line";
import {
  EnterChatRoomInput,
  EnterChatRoomResponseSuccess,
  ListChatRoomsResponseSuccess,
  Mutation,
  Query,
  UpdateChatSettingsInput,
  UpdateChatSettingsResponseSuccess,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { useChatsListState } from "@/state/chats.state";
import { useUserState } from "@/state/user.state";
import { Friendship_Firestore, UserID } from "@milkshakechat/helpers";
import gql from "graphql-tag";
import { useState } from "react";

export const useListChatRooms = () => {
  const [data, setData] = useState<ListChatRoomsResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const updateChatsList = useChatsListState((state) => state.updateChatsList);

  const runQuery = async ({
    friendships,
    selfUserID,
  }: {
    friendships: Friendship_Firestore[];
    selfUserID: UserID;
  }) => {
    try {
      const LIST_CHAT_ROOMS = gql`
        query ListChatRooms {
          listChatRooms {
            __typename
            ... on ListChatRoomsResponseSuccess {
              chatRooms {
                chatRoomID
                participants
                sendBirdParticipants
                sendBirdChannelURL
                pushConfig {
                  snoozeUntil
                  allowPush
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
      const result = await new Promise<ListChatRoomsResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<Pick<Query, "listChatRooms">>({
              query: LIST_CHAT_ROOMS,
            })
            .then(({ data }) => {
              if (
                data.listChatRooms.__typename === "ListChatRoomsResponseSuccess"
              ) {
                resolve(data.listChatRooms);
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
      if (result.chatRooms) {
        updateChatsList({
          rooms: result.chatRooms,
          friendships,
          userID: selfUserID,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runQuery };
};

export const useEnterChatRoom = () => {
  const [data, setData] = useState<EnterChatRoomResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const existingChatsList = useChatsListState((state) => state.chatsList);
  const updateChatsList = useChatsListState((state) => state.updateChatsList);
  const selfUser = useUserState((state) => state.user);
  const friendships = useUserState((state) => state.friendships);
  const updateChatInList = useChatsListState((state) => state.updateChatInList);

  const runQuery = async (args: EnterChatRoomInput) => {
    try {
      const ENTER_CHAT_ROOM = gql`
        query EnterChatRoomQuery($input: EnterChatRoomInput!) {
          enterChatRoom(input: $input) {
            __typename
            ... on EnterChatRoomResponseSuccess {
              chatRoom {
                chatRoomID
                participants
                sendBirdParticipants
                sendBirdChannelURL
                pushConfig {
                  snoozeUntil
                  allowPush
                }
              }
              isNew
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<EnterChatRoomResponseSuccess>(
        async (resolve, reject) => {
          client
            .query<Pick<Query, "enterChatRoom">>({
              query: ENTER_CHAT_ROOM,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data.enterChatRoom.__typename === "EnterChatRoomResponseSuccess"
              ) {
                resolve(data.enterChatRoom);
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
      // if its a new room, then we should refetch the list of chat rooms
      if (result.isNew && selfUser) {
        updateChatInList(result.chatRoom);
        updateChatsList({
          rooms: [...existingChatsList, result.chatRoom],
          friendships,
          userID: selfUser.id,
        });
      }
    } catch (e) {
      console.log(e);
      setErrors(["no chat room found"]);
    }
  };

  return { data, errors, runQuery };
};

export const useUpdateChatSettings = () => {
  const [data, setData] = useState<UpdateChatSettingsResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const updateChatInList = useChatsListState((state) => state.updateChatInList);

  const runMutation = async (args: UpdateChatSettingsInput) => {
    try {
      const UPDATE_CHAT_SETTINGS = gql`
        mutation UpdateChatSettings($input: UpdateChatSettingsInput!) {
          updateChatSettings(input: $input) {
            __typename
            ... on UpdateChatSettingsResponseSuccess {
              chatRoom {
                chatRoomID
                participants
                sendBirdParticipants
                sendBirdChannelURL
                pushConfig {
                  snoozeUntil
                  allowPush
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
      const result = await new Promise<UpdateChatSettingsResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "updateChatSettings">>({
              mutation: UPDATE_CHAT_SETTINGS,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.updateChatSettings.__typename ===
                "UpdateChatSettingsResponseSuccess"
              ) {
                resolve(data.updateChatSettings);
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
      updateChatInList(result.chatRoom);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};
