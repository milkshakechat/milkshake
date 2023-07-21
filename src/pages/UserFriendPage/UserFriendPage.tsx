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
  Friendship_Firestore,
  UserID,
  User_Firestore,
  Username,
} from "@milkshakechat/helpers";
import { FriendshipStatus, WishAuthor } from "@/api/graphql/types";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import TimelineGallery from "@/components/UserPageSkeleton/TimelineGallery/TimelineGallery";
import AboutSection from "@/components/UserPageSkeleton/AboutSection/AboutSection";
import WishlistGallery from "@/components/WishlistGallery/WishlistGallery";
import { useListWishlist } from "@/hooks/useWish";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import QuickChat from "@/components/QuickChat/QuickChat";

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
  const contacts = useUserState((state) => state.contacts);

  const [api, contextHolder] = notification.useNotification();
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const viewMode =
    viewModes[view as keyof typeof viewModes] || viewModes.timeline;
  const user = useUserState((state) => state.user);
  const [friendRequestNote, setFriendRequestNote] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [recentlySentRequest, setRecentlySentRequest] = useState(false);
  const {
    data: spotlightUser,
    errors: spotlightUserErrors,
    runQuery: getSpotlightUser,
  } = useViewPublicProfile();
  const isAcceptedFriend = spotlightUser
    ? contacts.find(
        (contact) =>
          spotlightUser &&
          contact.status === FriendshipStatus.Accepted &&
          contact.friendID === spotlightUser.id
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

  useEffect(() => {
    if (spotlightUser) {
      runListWishlistQuery({
        userID: spotlightUser.id,
      });
    }
  }, [spotlightUser]);

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

  const handleSendFriendRequest = async () => {
    console.log(`handleSendFriendRequest...`);
    if (spotlightUser) {
      setIsPending(true);
      const resp = await sendFriendRequestMutation({
        note: friendRequestNote,
        recipientID: spotlightUser.id as UserID, // spotlightUser.id,
        // skip utmAttribution for now
      });
      if (resp) {
        if (resp.status === FriendshipStatus.SentRequest) {
          message.success(<PP>Friend Request Sent!</PP>);
          setRecentlySentRequest(true);
        }
      }
      setIsPending(false);
      message.success(`Friend Request Sent`);
    }
  };
  console.log(`spotlightUser`, spotlightUser);

  if (!spotlightUser) {
    return (
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoadingAnimation width="100vw" height="100vh" type="cookie" />
      </div>
    );
  }

  const TabFolders = [
    {
      key: "timeline",
      title: "Timeline",
      children: <TimelineGallery stories={spotlightUser.stories} />,
    },
    {
      key: "wishlist",
      title: "Wishlist",
      children: <WishlistGallery wishlist={listWishlistData?.wishlist || []} />,
    },
  ];

  const mainActionButton = () => {
    return (
      <div>
        <Dropdown.Button
          loading={isPending}
          onClick={
            isAcceptedFriend
              ? () => setChatDrawerOpen(true)
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
                    Chat
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
                    Share
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
                    Remove
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
                    Block
                  </Button>
                ),
              },
            ],
          }}
        >
          {isAcceptedFriend ? "Message" : "Add Friend"}
        </Dropdown.Button>
      </div>
    );
  };

  const openNotification = () => {
    console.log("opening notification...");
    const key = `open${Date.now()}-1`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          Okay
        </Button>
      </Space>
    );
    api.open({
      message: "Transaction Sent",
      description:
        "Check your notifications in a minute to see confirmation of your transaction.",
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
                <h1>No User Found</h1>
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
                ? ({
                    displayName: spotlightUser?.displayName,
                    username: spotlightUser?.username,
                    avatar: spotlightUser?.avatar,
                    id: spotlightUser?.id,
                  } as WishAuthor)
                : null
            }
          />
        </>
      </AppLayout>
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
