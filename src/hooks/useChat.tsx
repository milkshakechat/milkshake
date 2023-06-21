import { ErrorLine } from "@/api/graphql/error-line";
import {
  EnterChatRoomInput,
  EnterChatRoomResponseSuccess,
  ListChatRoomsResponseSuccess,
  Query,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { useChatsListState } from "@/state/chats.state";
import gql from "graphql-tag";
import { useState } from "react";

export const useListChatRooms = () => {
  const [data, setData] = useState<ListChatRoomsResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const updateChatsList = useChatsListState((state) => state.updateChatsList);

  const runQuery = async () => {
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
      updateChatsList(result.chatRooms);
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
      if (result.isNew) {
        console.log(`result.isNew `, result.isNew);
        updateChatsList([...existingChatsList, result.chatRoom]);
      }
    } catch (e) {
      console.log(e);
      setErrors(["no chat room found"]);
    }
  };

  return { data, errors, runQuery };
};
