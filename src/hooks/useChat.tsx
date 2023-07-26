import { ErrorLine } from "@/api/graphql/error-line";
import {
  EnterChatRoomInput,
  EnterChatRoomResponseSuccess,
  ListChatRoomsResponseSuccess,
  Mutation,
  Query,
  SendFreeChatInput,
  SendFreeChatResponseSuccess,
  UpdateChatSettingsInput,
  UpdateChatSettingsResponseSuccess,
} from "@/api/graphql/types";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import {
  NOT_FOUND_USER_MIRROR_NAME,
  convertChatRoomFirestoreToGQL,
  useChatsListState,
} from "@/state/chats.state";
import { useUserState } from "@/state/user.state";
import {
  ChatLog_Firestore,
  ChatRoomID,
  ChatRoom_Firestore,
  FirestoreCollection,
  Friendship_Firestore,
  UserID,
} from "@milkshakechat/helpers";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { firestore } from "../api/firebase";
import shallow from "zustand/shallow";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy,
  getDocs,
} from "firebase/firestore";

// export const useListChatRooms = () => {
//   const [data, setData] = useState<ListChatRoomsResponseSuccess>();
//   const [errors, setErrors] = useState<ErrorLine[]>([]);
//   const client = useGraphqlClient();

//   const updateChatsList = useChatsListState((state) => state.updateChatsList);

//   const runQuery = async ({
//     friendships,
//     selfUserID,
//   }: {
//     friendships: Friendship_Firestore[];
//     selfUserID: UserID;
//   }) => {
//     try {
//       const LIST_CHAT_ROOMS = gql`
//         query ListChatRooms {
//           listChatRooms {
//             __typename
//             ... on ListChatRoomsResponseSuccess {
//               chatRooms {
//                 chatRoomID
//                 participants
//                 sendBirdParticipants
//                 sendBirdChannelURL
//                 pushConfig {
//                   snoozeUntil
//                   allowPush
//                 }
//               }
//             }
//             ... on ResponseError {
//               error {
//                 message
//               }
//             }
//           }
//         }
//       `;
//       const result = await new Promise<ListChatRoomsResponseSuccess>(
//         async (resolve, reject) => {
//           client
//             .query<Pick<Query, "listChatRooms">>({
//               query: LIST_CHAT_ROOMS,
//             })
//             .then(({ data }) => {
//               if (
//                 data.listChatRooms.__typename === "ListChatRoomsResponseSuccess"
//               ) {
//                 resolve(data.listChatRooms);
//               }
//             })
//             .catch((graphQLError: Error) => {
//               if (graphQLError) {
//                 setErrors((errors) => [...errors, graphQLError.message]);
//                 reject();
//               }
//             });
//         }
//       );
//       setData(result);
//       if (result.chatRooms) {
//         updateChatsList({
//           rooms: result.chatRooms,
//           friendships,
//           userID: selfUserID,
//         });
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   return { data, errors, runQuery };
// };

export const useRealtimeChatRooms = () => {
  const selfUser = useUserState((state) => state.user);
  const friendships = useUserState((state) => state.friendships);
  const { upsertChat, globalUserMirror, upsertUserMirror, getUserMirror } =
    useChatsListState(
      (state) => ({
        upsertChat: state.upsertChat,
        globalUserMirror: state.globalUserMirror,
        upsertUserMirror: state.upsertUserMirror,
        getUserMirror: state.getUserMirror,
      }),
      shallow
    );

  useEffect(() => {
    if (selfUser && selfUser.id) {
      getRealtimeChatRooms(selfUser.id);
    }
  }, [selfUser?.id]);

  const getRealtimeChatRooms = async (userID: UserID) => {
    const q = query(
      collection(firestore, FirestoreCollection.CHAT_ROOMS),
      where("members", "array-contains", userID),
      limit(100)
    );
    onSnapshot(q, (docsSnap) => {
      docsSnap.forEach((doc) => {
        const room = doc.data() as ChatRoom_Firestore;
        upsertChat(room, friendships, (selfUser?.id || "") as UserID);

        room.members.forEach(async (pid) => {
          const userMirror = getUserMirror(pid, globalUserMirror);

          if (userMirror.username === NOT_FOUND_USER_MIRROR_NAME) {
            // get firestore doc
            const q = query(
              collection(firestore, FirestoreCollection.MIRROR_USER),
              where("id", "==", pid),
              limit(1)
            );
            const innerDocsSnap = await getDocs(q);
            innerDocsSnap.forEach((doc) => {
              const mirror = doc.data() as any;
              upsertUserMirror(mirror);
            });
          }
        });
      });
    });
  };

  return {};
};

export const useEnterChatRoom = () => {
  const [data, setData] = useState<EnterChatRoomResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const existingChatsList = useChatsListState((state) => state.chatsList);
  const selfUser = useUserState((state) => state.user);
  const friendships = useUserState((state) => state.friendships);

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
                title
                thumbnail
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
        // updateChatInList(result.chatRoom);
        // updateChatsList({
        //   rooms: [...existingChatsList, result.chatRoom],
        //   friendships,
        //   userID: selfUser.id,
        // });
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
                title
                thumbnail
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
      // updateChatInList(result.chatRoom);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};

export const useSendFreeChat = () => {
  const [data, setData] = useState<SendFreeChatResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: SendFreeChatInput) => {
    setLoading(true);
    try {
      const SEND_FREE_CHAT = gql`
        mutation SendFreeChat($input: SendFreeChatInput!) {
          sendFreeChat(input: $input) {
            __typename
            ... on SendFreeChatResponseSuccess {
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
      const result = await new Promise<SendFreeChatResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "sendFreeChat">>({
              mutation: SEND_FREE_CHAT,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.sendFreeChat.__typename === "SendFreeChatResponseSuccess"
              ) {
                resolve(data.sendFreeChat);
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

export const useRealtimeFreeChat = () => {
  const selfUser = useUserState((state) => state.user);
  const [freeChatLogs, setFreeChatLogs] = useState<ChatLog_Firestore[]>([]);

  const getRealtimeFreeChatLogs = async (chatRoomID: ChatRoomID) => {
    console.log(
      `getRealtimeFreeChatLogs... chatRoomID=${chatRoomID} & userID=${selfUser?.id}`
    );
    const q = query(
      collection(firestore, FirestoreCollection.CHAT_LOGS),
      where("chatRoomID", "==", chatRoomID),
      orderBy("createdAt", "desc"), // This will sort in descending order
      limit(100)
    );
    onSnapshot(q, (docsSnap) => {
      docsSnap.forEach((doc) => {
        const log = doc.data() as ChatLog_Firestore;

        setFreeChatLogs((logs) => [
          ...logs.filter((l) => l.id !== log.id),
          log,
        ]);
      });
    });
  };

  return {
    getRealtimeFreeChatLogs,
    freeChatLogs,
  };
};
