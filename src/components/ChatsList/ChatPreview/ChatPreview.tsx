import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Avatar, Badge, List, theme } from "antd";
import React from "react";
import { UserID, placeholderImageThumbnail } from "@milkshakechat/helpers";
import { ChatRoomFE } from "@/state/chats.state";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { UserOutlined } from "@ant-design/icons";

export interface ChatPreviewProps {
  preview: ChatRoomFE;
}

const ChatPreview = ({ preview }: ChatPreviewProps) => {
  const { title, aliasTitle, previewText, thumbnail } = preview;
  const intl = useIntl();
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
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
          <Avatar
            src={thumbnail}
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
              !thumbnail || thumbnail === placeholderImageThumbnail ? (
                <UserOutlined style={{ color: token.colorPrimaryActive }} />
              ) : undefined
            }
            style={{ backgroundColor: token.colorPrimaryBg }}
          />
        }
        title={title || aliasTitle || "Chat loading..."}
        description={previewText}
      />

      {preview.unreadCount && preview.unreadCount !== 0 ? (
        <Badge count={preview.unreadCount} />
      ) : null}
    </List.Item>
  );
};

export default ChatPreview;
