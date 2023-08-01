import { ErrorLine } from "@/api/graphql/error-line";
import {
  AddFriendToChatInput,
  AddFriendToChatResponseSuccess,
  AdminChatSettingsInput,
  AdminChatSettingsResponseSuccess,
  EnterChatRoomInput,
  EnterChatRoomResponseSuccess,
  LeaveChatInput,
  LeaveChatResponseSuccess,
  ListChatRoomsResponseSuccess,
  Mutation,
  PromoteAdminInput,
  PromoteAdminResponseSuccess,
  Query,
  ResignAdminInput,
  ResignAdminResponseSuccess,
  SendFreeChatInput,
  SendFreeChatResponseSuccess,
  UpdateChatSettingsInput,
  UpdateChatSettingsResponseSuccess,
  UpgradePremiumChatInput,
  UpgradePremiumChatResponseSuccess,
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
  const { tokenID } = useUserState((state) => ({
    tokenID: state.idToken,
  }));
  useEffect(() => {
    let unsubscribe: () => void;
    if (selfUser && selfUser.id) {
      unsubscribe = getRealtimeChatRooms(selfUser.id);
    }
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call the unsubscribe function when the component is unmounting
      }
    };
  }, [selfUser?.id]);

  const getRealtimeChatRooms = (userID: UserID) => {
    console.log("selfUser", selfUser);
    console.log("selfUser.id", selfUser?.id);
    console.log("tokenID", tokenID);
    if (!selfUser || !selfUser.id || !tokenID) return () => {};
    const q = query(
      collection(firestore, FirestoreCollection.CHAT_ROOMS),
      where("members", "array-contains", userID),
      limit(100)
    );
    const unsubscribe = onSnapshot(q, (docsSnap) => {
      docsSnap.forEach((doc) => {
        const room = doc.data() as ChatRoom_Firestore;
        console.log("found room:", room);
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
    return unsubscribe; // Return the unsubscribe function
  };

  return {};
};

export const useEnterChatRoom = () => {
  const [data, setData] = useState<EnterChatRoomResponseSuccess>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();
  const existingChatsList = useChatsListState((state) => state.chatsList);
  const selfUser = useUserState((state) => state.user);
  const idToken = useUserState((state) => state.idToken);
  const friendships = useUserState((state) => state.friendships);

  const runQuery = async (args: EnterChatRoomInput) => {
    try {
      setLoading(true);
      const ENTER_CHAT_ROOM = gql`
        query EnterChatRoomQuery($input: EnterChatRoomInput!) {
          enterChatRoom(input: $input) {
            __typename
            ... on EnterChatRoomResponseSuccess {
              chatRoom {
                chatRoomID
                participants
                admins
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
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setErrors(["no chat room found"]);
    }
  };

  return { data, loading, errors, runQuery };
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

export const useRealtimeFreeChat = ({
  chatRoomID,
}: {
  chatRoomID: ChatRoomID;
}) => {
  const selfUser = useUserState((state) => state.user);
  const [freeChatLogs, setFreeChatLogs] = useState<ChatLog_Firestore[]>([]);

  const { tokenID } = useUserState((state) => ({
    tokenID: state.idToken,
  }));

  useEffect(() => {
    const unsub = getRealtimeFreeChatLogs(chatRoomID);
    return unsub;
  }, []);

  const getRealtimeFreeChatLogs = (chatRoomID: ChatRoomID) => {
    if (!selfUser || !selfUser.id || !tokenID) return () => {};
    const q = query(
      collection(firestore, FirestoreCollection.CHAT_LOGS),
      where("chatRoomID", "==", chatRoomID),
      orderBy("createdAt", "desc"), // This will sort in descending order
      limit(100)
    );
    const unsub = onSnapshot(q, (docsSnap) => {
      docsSnap.forEach((doc) => {
        const log = doc.data() as ChatLog_Firestore;

        setFreeChatLogs((logs) => [
          ...logs.filter((l) => l.id !== log.id),
          log,
        ]);
      });
    });
    return unsub;
  };

  return {
    getRealtimeFreeChatLogs,
    freeChatLogs,
  };
};

export const useGiftPremiumChat = () => {
  const [data, setData] = useState<UpgradePremiumChatResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: UpgradePremiumChatInput) => {
    setLoading(true);
    try {
      const UPGRADE_PREMIUM_CHAT = gql`
        mutation UpgradePremiumChat($input: UpgradePremiumChatInput!) {
          upgradePremiumChat(input: $input) {
            __typename
            ... on UpgradePremiumChatResponseSuccess {
              referenceIDs
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<UpgradePremiumChatResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "upgradePremiumChat">>({
              mutation: UPGRADE_PREMIUM_CHAT,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.upgradePremiumChat.__typename ===
                "UpgradePremiumChatResponseSuccess"
              ) {
                resolve(data.upgradePremiumChat);
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

export const useAddFriendToChat = () => {
  const [data, setData] = useState<AddFriendToChatResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: AddFriendToChatInput) => {
    setLoading(true);
    try {
      const ADD_FRIEND_TO_CHAT = gql`
        mutation AddFriendToChat($input: AddFriendToChatInput!) {
          addFriendToChat(input: $input) {
            __typename
            ... on AddFriendToChatResponseSuccess {
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
      const result = await new Promise<AddFriendToChatResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "addFriendToChat">>({
              mutation: ADD_FRIEND_TO_CHAT,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.addFriendToChat.__typename ===
                "AddFriendToChatResponseSuccess"
              ) {
                resolve(data.addFriendToChat);
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

export const useLeaveChat = () => {
  const [data, setData] = useState<LeaveChatResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: LeaveChatInput) => {
    setLoading(true);
    try {
      const LEAVE_CHAT = gql`
        mutation LeaveChat($input: LeaveChatInput!) {
          leaveChat(input: $input) {
            __typename
            ... on LeaveChatResponseSuccess {
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
      const result = await new Promise<LeaveChatResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "leaveChat">>({
              mutation: LEAVE_CHAT,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (data?.leaveChat.__typename === "LeaveChatResponseSuccess") {
                resolve(data.leaveChat);
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

export const useResignAdmin = () => {
  const [data, setData] = useState<ResignAdminResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: ResignAdminInput) => {
    setLoading(true);
    try {
      const RESIGN_ADMIN = gql`
        mutation ResignAdmin($input: ResignAdminInput!) {
          resignAdmin(input: $input) {
            __typename
            ... on ResignAdminResponseSuccess {
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
      const result = await new Promise<ResignAdminResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "resignAdmin">>({
              mutation: RESIGN_ADMIN,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.resignAdmin.__typename === "ResignAdminResponseSuccess"
              ) {
                resolve(data.resignAdmin);
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

export const usePromoteAdmin = () => {
  const [data, setData] = useState<PromoteAdminResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: PromoteAdminInput) => {
    setLoading(true);
    try {
      const PROMOTE_ADMIN = gql`
        mutation PromoteAdmin($input: PromoteAdminInput!) {
          promoteAdmin(input: $input) {
            __typename
            ... on PromoteAdminResponseSuccess {
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
      const result = await new Promise<PromoteAdminResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "promoteAdmin">>({
              mutation: PROMOTE_ADMIN,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.promoteAdmin.__typename === "PromoteAdminResponseSuccess"
              ) {
                resolve(data.promoteAdmin);
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

export const useAdminChatSettings = () => {
  const [data, setData] = useState<AdminChatSettingsResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();

  const runMutation = async (args: AdminChatSettingsInput) => {
    setLoading(true);
    try {
      const ADMIN_CHAT_SETTINGS = gql`
        mutation AdminChatSettings($input: AdminChatSettingsInput!) {
          adminChatSettings(input: $input) {
            __typename
            ... on AdminChatSettingsResponseSuccess {
              chatRoom {
                chatRoomID
                participants
                admins
                sendBirdChannelURL
                title
                thumbnail
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
      const result = await new Promise<AdminChatSettingsResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "adminChatSettings">>({
              mutation: ADMIN_CHAT_SETTINGS,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.adminChatSettings.__typename ===
                "AdminChatSettingsResponseSuccess"
              ) {
                resolve(data.adminChatSettings);
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
