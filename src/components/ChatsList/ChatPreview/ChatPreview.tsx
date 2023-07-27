import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Avatar, Badge, List, theme } from "antd";
import React from "react";
import { UserID, placeholderImageThumbnail } from "@milkshakechat/helpers";
import { ChatRoomFE, useChatsListState } from "@/state/chats.state";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { UserOutlined } from "@ant-design/icons";
import shallow from "zustand/shallow";

export interface ChatPreviewProps {
  preview: ChatRoomFE;
}

const ChatPreview = ({ preview }: ChatPreviewProps) => {
  const { title, previewText, thumbnail } = preview;
  const intl = useIntl();
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const { getUserMirror, globalUserMirror } = useChatsListState(
    (state) => ({
      getUserMirror: state.getUserMirror,
      globalUserMirror: state.globalUserMirror,
    }),
    shallow
  );
  const otherParticipants = preview.participants.filter((p) => p !== user?.id);
  const aliasTitle =
    otherParticipants.length > 1
      ? `${getUserMirror(otherParticipants[0], globalUserMirror).username}, ${
          getUserMirror(otherParticipants[1], globalUserMirror).username
        }${
          otherParticipants.length > 2
            ? ` & ${otherParticipants.length - 2} others`
            : ""
        }`
      : getUserMirror(otherParticipants[0], globalUserMirror).username;
  return (
    <List.Item
      onClick={() => {
        navigate({
          pathname: "/app/chats/chat",
          search: createSearchParams({
            chat: preview.chatRoomID,
          }).toString(),
        });
      }}
    >
      <List.Item.Meta
        avatar={
          <$Horizontal justifyContent="center" style={{ width: "50px" }}>
            {thumbnail ? (
              <Avatar
                src={thumbnail}
                style={{
                  backgroundColor: token.colorPrimary,
                }}
              />
            ) : otherParticipants.length > 1 ? (
              <Avatar.Group>
                <Avatar
                  src={
                    getUserMirror(otherParticipants[0], globalUserMirror)
                      ?.avatar || ""
                  }
                  style={{ backgroundColor: token.colorPrimary }}
                />
                <Avatar
                  src={
                    getUserMirror(otherParticipants[1], globalUserMirror)
                      ?.avatar || ""
                  }
                  style={{ backgroundColor: token.colorPrimary }}
                />
              </Avatar.Group>
            ) : (
              <Avatar
                src={
                  thumbnail ||
                  getUserMirror(otherParticipants[0], globalUserMirror).avatar
                }
                onClick={(e) => {
                  if (e) {
                    e.stopPropagation();
                  }
                  const friendID: UserID = preview.participants.filter(
                    (pid) => pid !== user?.id
                  )[0];
                  if (friendID) {
                    navigate({
                      pathname: `/user`,
                      search: createSearchParams({
                        userID: friendID,
                      }).toString(),
                    });
                  }
                }}
                icon={
                  <UserOutlined style={{ color: token.colorPrimaryActive }} />
                }
                style={{ backgroundColor: token.colorPrimaryBg }}
              />
            )}
          </$Horizontal>
        }
        title={title || aliasTitle}
        description={previewText}
      />

      {preview.unreadCount && preview.unreadCount !== 0 ? (
        <Badge count={preview.unreadCount} />
      ) : null}
    </List.Item>
  );
};

export default ChatPreview;
