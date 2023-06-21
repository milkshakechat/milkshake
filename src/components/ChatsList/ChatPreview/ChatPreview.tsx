import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Avatar, List } from "antd";
import React from "react";
import { UserID } from "@milkshakechat/helpers";
import { ChatRoomFE } from "@/state/chats.state";
import { createSearchParams, useNavigate } from "react-router-dom";

export interface ChatPreviewProps {
  preview: ChatRoomFE;
}

const ChatPreview = ({ preview }: ChatPreviewProps) => {
  const { title, previewText, thumbnail } = preview;
  const intl = useIntl();
  const navigate = useNavigate();

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
        avatar={<Avatar src={thumbnail} />}
        title={title}
        description={previewText}
      />
    </List.Item>
  );
};

export default ChatPreview;
