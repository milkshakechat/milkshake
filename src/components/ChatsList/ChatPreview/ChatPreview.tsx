import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Avatar, List } from "antd";
import React from "react";
import { UserID } from "@milkshakechat/helpers";

export interface ChatPreviewData {
  id: UserID;
  displayName: string;
  previewText?: string;
  avatar?: string;
}
export interface ChatPreviewProps {
  chat: ChatPreviewData;
}

const ChatPreview = ({ chat }: ChatPreviewProps) => {
  const { displayName, previewText, avatar } = chat;
  const intl = useIntl();

  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <Avatar
            src={
              avatar || `https://xsgames.co/randomusers/avatar.php?g=pixel&key=`
            }
          />
        }
        title={displayName}
        description={previewText}
      />
    </List.Item>
  );
};

export default ChatPreview;
