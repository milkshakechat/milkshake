import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import AppLayout, { AppLayoutPadding } from "@/components/AppLayout/AppLayout";
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
import { Avatar, Button, Input, Spin, message, theme } from "antd";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Friendship_Firestore,
  UserID,
  User_Firestore,
} from "@milkshakechat/helpers";
import { FriendshipStatus } from "@/api/graphql/types";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";

export const UserFriendPage = () => {
  const { username: usernameFromUrl } = useParams();
  const [searchParams] = useSearchParams();
  const userID = searchParams.get("userID");
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);
  const [friendRequestNote, setFriendRequestNote] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [recentlySentRequest, setRecentlySentRequest] = useState(false);
  const {
    data: spotlightUser,
    errors: spotlightUserErrors,
    runQuery: getSpotlightUser,
  } = useViewPublicProfile();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { screen } = useWindowSize();
  const {
    data: sendFriendRequestMutationData,
    errors: sendFriendRequestErrors,
    runMutation: sendFriendRequestMutation,
  } = useSendFriendRequest();

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
    }
  };

  return (
    <AppLayout>
      <AppLayoutPadding align="center">
        {isInitialLoading ? (
          <Spin />
        ) : spotlightUser ? (
          <div>
            <$Horizontal spacing={3}>
              <Avatar
                src={spotlightUser.avatar}
                style={{ backgroundColor: token.colorPrimaryText }}
                size="large"
              />
              <$Vertical
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <PP>
                  <b>{spotlightUser.displayName || spotlightUser.username}</b>
                </PP>
                <PP>
                  <i>{`@${spotlightUser.username}`}</i>
                </PP>
              </$Vertical>
            </$Horizontal>
            <br />
            <Input.TextArea
              value={friendRequestNote}
              onChange={(e) => setFriendRequestNote(e.target.value)}
            />
            <Button
              type="primary"
              loading={isPending}
              onClick={handleSendFriendRequest}
              disabled={recentlySentRequest}
            >
              <PP>Add Friend</PP>
            </Button>
            <br />
            <PP>{`You are ${user?.username}`}</PP>
          </div>
        ) : (
          <div>
            <h1>No User Found</h1>
            <span>{`@${usernameFromUrl}`}</span>
          </div>
        )}
      </AppLayoutPadding>
    </AppLayout>
  );
};
export default UserFriendPage;
