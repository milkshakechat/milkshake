import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Avatar, List } from "antd";
import React from "react";
import { UserID } from "@milkshakechat/helpers";
import { ChatRoomFE } from "@/state/chats.state";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useUserState } from "@/state/user.state";

export interface ChatPreviewProps {
  preview: ChatRoomFE;
}

const ChatPreview = ({ preview }: ChatPreviewProps) => {
  const { title, previewText, thumbnail } = preview;
  const intl = useIntl();
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);

  return (
    <List.Item
      onClick={() => {
        navigate({
          pathname: "/app/chat",
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
          />
        }
        title={title}
        description={previewText}
      />
    </List.Item>
  );
};

export default ChatPreview;
