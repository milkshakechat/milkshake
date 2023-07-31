import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import AppLayout, {
  AppLayoutPadding,
  LayoutLogoHeader,
} from "@/components/AppLayout/AppLayout";
import {
  useSendFriendRequest,
  useViewPublicProfile,
} from "@/hooks/useFriendship";
import PP from "@/i18n/PlaceholderPrint";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/pages/UserFriendPage/useTemplate.graphql";
import { useUserState } from "@/state/user.state";
import {
  Space,
  Button,
  Dropdown,
  Input,
  Spin,
  Tabs,
  message,
  theme,
  notification,
} from "antd";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { WalletOutlined, SearchOutlined } from "@ant-design/icons";
import {
  FirestoreCollection,
  Friendship_Firestore,
  Tx_MirrorFireLedger,
  UserID,
  User_Firestore,
  Username,
  FriendshipStatus,
} from "@milkshakechat/helpers";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import TimelineGallery from "@/components/UserPageSkeleton/TimelineGallery/TimelineGallery";
import AboutSection from "@/components/UserPageSkeleton/AboutSection/AboutSection";
import WishlistGallery from "@/components/WishlistGallery/WishlistGallery";
import { useListWishlist } from "@/hooks/useWish";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import QuickChat from "@/components/QuickChat/QuickChat";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/api/firebase";
import JankyCurtain from "@/components/JankyCurtain/JankyCurtain";
import { useIntl } from "react-intl";

enum viewModes {
  timeline = "timeline",
  wishlist = "wishlist",
}
export const UserFriendPage = () => {
  const { username: usernameFromUrl } = useParams();
  const [searchParams] = useSearchParams();
  const userID = searchParams.get("userID");
  const view = searchParams.get("view");
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useWindowSize();
  const friendships = useUserState((state) => state.friendships);
  const intl = useIntl();
  const [api, contextHolder] = notification.useNotification();
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const viewMode =
    viewModes[view as keyof typeof viewModes] || viewModes.timeline;
  const selfUser = useUserState((state) => state.user);
  const [friendRequestNote, setFriendRequestNote] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [recentlySentRequest, setRecentlySentRequest] = useState(false);
  const {
    data: spotlightUser,
    errors: spotlightUserErrors,
    runQuery: getSpotlightUser,
  } = useViewPublicProfile();
  const isAcceptedFriend = spotlightUser
    ? friendships.find(
        (fr) =>
          spotlightUser &&
          fr.status === FriendshipStatus.ACCEPTED &&
          fr.friendID === spotlightUser.id
      )
    : false;
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { screen } = useWindowSize();
  const {
    data: listWishlistData,
    errors: listWishlistErrors,
    runQuery: runListWishlistQuery,
  } = useListWishlist();
  const {
    data: sendFriendRequestMutationData,
    errors: sendFriendRequestErrors,
    runMutation: sendFriendRequestMutation,
  } = useSendFriendRequest();

  const [shinyLoading, setShinyLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShinyLoading(false);
    }, 400);
  }, []);
  // const getRelatedTxs = async () => {
  //   if (selfUser && spotlightUser) {
  //     const q1 = query(
  //       collection(firestore, FirestoreCollection.MIRROR_TX),
  //       where("ownerID", "==", selfUser.id),
  //       where("recieverUserID", "==", spotlightUser.id),
  //       orderBy("createdAt", "desc"), // This will sort in descending order
  //       limit(100)
  //     );
  //     onSnapshot(q1, (docsSnap) => {
  //       docsSnap.forEach((doc) => {
  //         const tx = doc.data() as Tx_MirrorFireLedger;
  //         console.log(`tx`, tx);
  //       });
  //     });
  //     const q2 = query(
  //       collection(firestore, FirestoreCollection.MIRROR_TX),
  //       where("ownerID", "==", selfUser.id),
  //       where("senderUserID", "==", spotlightUser.id),
  //       orderBy("createdAt", "desc"), // This will sort in descending order
  //       limit(100)
  //     );
  //     onSnapshot(q2, (docsSnap) => {
  //       docsSnap.forEach((doc) => {
  //         const tx = doc.data() as Tx_MirrorFireLedger;
  //         console.log(`tx`, tx);
  //       });
  //     });
  //   }
  // };

  useEffect(() => {
    if (spotlightUser && selfUser) {
      runListWishlistQuery({
        userID: spotlightUser.id,
      });
      // getRelatedTxs();
    }
  }, [spotlightUser, selfUser]);

  useEffect(() => {
    if (usernameFromUrl) {
      const run = async () => {
        // query for the user
        await getSpotlightUser({ username: usernameFromUrl, userID });
        setIsInitialLoading(false);
      };
      run();
      // query for the friendship
    }
  }, [usernameFromUrl, userID]);
  const { token } = theme.useToken();

  const _txt_friendRequestSent_762 = intl.formatMessage({
    id: "_txt_friendRequestSent_762.___UserFriendPage",
    defaultMessage: "Friend Request Sent",
  });
  const _txt_timeline_88f = intl.formatMessage({
    id: "_txt_timeline_88f.___UserFriendPage",
    defaultMessage: "Timeline",
  });
  const _txt_wishlist_981 = intl.formatMessage({
    id: "_txt_wishlist_981.___UserFriendPage",
    defaultMessage: "Wishlist",
  });
  const _txt_message_d4f = intl.formatMessage({
    id: "_txt_message_d4f.___UserFriendPage",
    defaultMessage: "Message",
  });
  const _txt_share_e80 = intl.formatMessage({
    id: "_txt_share_e80.___UserFriendPage",
    defaultMessage: "Share",
  });
  const _txt_remove_952 = intl.formatMessage({
    id: "_txt_remove_952.___UserFriendPage",
    defaultMessage: "Remove",
  });
  const _txt_block_c07 = intl.formatMessage({
    id: "_txt_block_c07.___UserFriendPage",
    defaultMessage: "Block",
  });
  const _txt_chat_dd1 = intl.formatMessage({
    id: "_txt_chat_dd1.___UserFriendPage",
    defaultMessage: "Chat",
  });
  const _txt_addFriend_52c = intl.formatMessage({
    id: "_txt_addFriend_52c.___UserFriendPage",
    defaultMessage: "Add Friend",
  });
  const _txt_okay_917 = intl.formatMessage({
    id: "_txt_okay_917.___UserFriendPage",
    defaultMessage: "Okay",
  });
  const _txt_transactionPending_87d = intl.formatMessage({
    id: "_txt_transactionPending_87d.___UserFriendPage",
    defaultMessage: "Transaction Pending",
  });
  const _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_9cb =
    intl.formatMessage({
      id: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_9cb.___UserFriendPage",
      defaultMessage:
        "Check your notifications in a minute to see confirmation of your transaction.",
    });
  const _txt_noUserFound_b32 = intl.formatMessage({
    id: "_txt_noUserFound_b32.___UserFriendPage",
    defaultMessage: "No User Found",
  });

  const handleSendFriendRequest = async () => {
    if (spotlightUser) {
      setIsPending(true);
      const resp = await sendFriendRequestMutation({
        note: friendRequestNote,
        recipientID: spotlightUser.id as UserID, // spotlightUser.id,
        // skip utmAttribution for now
      });
      if (resp) {
        setRecentlySentRequest(true);
      }
      setIsPending(false);
      message.success(_txt_friendRequestSent_762);
    }
  };

  if (!spotlightUser || !selfUser) {
    return (
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoadingAnimation width="100vw" height="100vh" type="cookie" />
      </div>
    );
  }

  const TabFolders = [
    {
      key: "timeline",
      title: _txt_timeline_88f,
      children: (
        <TimelineGallery
          stories={spotlightUser.stories}
          userID={spotlightUser.id}
          handleSendFriendRequest={
            recentlySentRequest ? undefined : handleSendFriendRequest
          }
        />
      ),
    },
    {
      key: "wishlist",
      title: _txt_wishlist_981,
      children: <WishlistGallery wishlist={listWishlistData?.wishlist || []} />,
    },
    // {
    //   key: "cookies",
    //   title: "Cookies",
    //   children: (
    //     <TransactionHistory walletAliasID={selfUser.tradingWallet} txs={[]} />
    //   ),
    // },
  ];

  const mainActionButton = () => {
    return (
      <div>
        <Dropdown.Button
          loading={isPending}
          onClick={
            isAcceptedFriend
              ? () => {
                  const searchString = createSearchParams({
                    participants: encodeURIComponent(
                      [spotlightUser.id, selfUser.id].join(",")
                    ),
                  }).toString();

                  navigate({
                    pathname: "/app/chats/chat",
                    search: searchString,
                  });
                }
              : handleSendFriendRequest
          }
          disabled={recentlySentRequest}
          size={isMobile ? "small" : "middle"}
          type="primary"
          menu={{
            items: [
              {
                key: "send-message",
                label: (
                  <Button onClick={() => setChatDrawerOpen(true)} type="ghost">
                    {_txt_message_d4f}
                  </Button>
                ),
              },
              {
                key: "share-friend",
                label: (
                  <Button
                    onClick={() => console.log(`Share friend`)}
                    type="ghost"
                  >
                    {_txt_share_e80}
                  </Button>
                ),
              },
              {
                key: "remove-friend",
                label: (
                  <Button
                    onClick={() => console.log(`Remove friend`)}
                    type="ghost"
                  >
                    {_txt_remove_952}
                  </Button>
                ),
              },
              {
                key: "block-friend",
                label: (
                  <Button
                    onClick={() => console.log(`Block friend`)}
                    type="ghost"
                  >
                    {_txt_block_c07}
                  </Button>
                ),
              },
            ],
          }}
        >
          {isAcceptedFriend ? _txt_chat_dd1 : _txt_addFriend_52c}
        </Dropdown.Button>
      </div>
    );
  };

  const openNotification = () => {
    const key = `open${Date.now()}-1`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {_txt_okay_917}
        </Button>
      </Space>
    );
    api.open({
      message: _txt_transactionPending_87d,
      description:
        _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_9cb,
      btn,
      key,
      icon: <WalletOutlined style={{ color: token.colorPrimaryActive }} />,
      duration: null,
    });
  };

  return (
    <div style={{ backgroundColor: token.colorBgContainer }}>
      <AppLayout>
        <>
          {isMobile && (
            <LayoutLogoHeader
              rightAction={
                <NavLink to="/app/friends">
                  <SearchOutlined
                    style={{
                      color: token.colorBgSpotlight,
                      fontSize: "1.3rem",
                    }}
                  />
                </NavLink>
              }
            />
          )}
          <AppLayoutPadding
            paddings={{
              mobile: "15px 15px",
              desktop: "50px 15px",
            }}
            align="center"
          >
            {isInitialLoading ? (
              <LoadingAnimation width="100vw" height="100vh" type="cookie" />
            ) : spotlightUser ? (
              <div>
                <AboutSection
                  user={{
                    id: spotlightUser.id,
                    avatar: spotlightUser.avatar || "",
                    displayName:
                      spotlightUser.displayName || spotlightUser.username,
                    username: spotlightUser.username as Username,
                    bio: spotlightUser.bio || "",
                  }}
                  glowColor={token.colorPrimaryText}
                  actionButton={mainActionButton()}
                />
                <Tabs
                  defaultActiveKey={
                    viewMode && viewMode === viewModes.timeline
                      ? viewModes.timeline
                      : viewMode === viewModes.wishlist
                      ? viewModes.wishlist
                      : viewModes.timeline
                  }
                  items={TabFolders.map(({ title, key, children }) => {
                    return {
                      label: (
                        <PP>
                          {" "}
                          <span style={{ fontSize: "1rem" }}>{title}</span>
                        </PP>
                      ),
                      key,
                      children,
                    };
                  })}
                  onChange={(view) => {
                    if (userID) {
                      navigate({
                        pathname: location.pathname,
                        search: createSearchParams({
                          view,
                          userID,
                        }).toString(),
                      });
                    }
                  }}
                />
              </div>
            ) : (
              <div>
                <h1>{_txt_noUserFound_b32}</h1>
                <span>{`@${usernameFromUrl}`}</span>
              </div>
            )}
          </AppLayoutPadding>
          <QuickChat
            isOpen={chatDrawerOpen}
            toggleOpen={setChatDrawerOpen}
            onClose={() => setChatDrawerOpen(false)}
            openNotification={openNotification}
            user={
              spotlightUser
                ? {
                    displayName: spotlightUser.displayName || "",
                    username: spotlightUser.username as Username,
                    avatar: spotlightUser.avatar || "",
                    id: spotlightUser.id as UserID,
                  }
                : null
            }
          />
        </>
      </AppLayout>
      <JankyCurtain loading={shinyLoading} />
      {contextHolder}
    </div>
  );
};
export default UserFriendPage;

// actionButton={
//   <NavLink to={`/app/wish/${quickChatUser?.wishID}`}>
//     <Button>View Event</Button>
//   </NavLink>
// }
