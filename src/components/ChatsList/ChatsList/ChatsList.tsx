import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Affix, Avatar, Button, Input, List } from "antd";
import ChatPreview, { ChatPreviewProps } from "../ChatPreview/ChatPreview";
import { UserID } from "@milkshakechat/helpers";
import { useState } from "react";
import { SearchOutlined, PlusSquareFilled } from "@ant-design/icons";
import { Spacer } from "@/components/AppLayout/AppLayout";
import { useWindowSize } from "@/api/utils/screen";
import { ChatRoomFE } from "@/state/chats.state";
import { NavLink } from "react-router-dom";

interface ChatsListProps {
  chatPreviews: ChatRoomFE[];
}
const ChatsList = ({ chatPreviews }: ChatsListProps) => {
  const intl = useIntl();

  const [searchString, setSearchString] = useState("");
  const { screen, isMobile } = useWindowSize();

  return (
    <$Vertical>
      <Affix offsetTop={isMobile ? 100 : 100}>
        <$Horizontal>
          <Input
            placeholder={"Search Chats"}
            allowClear
            onChange={(e) => setSearchString(e.target.value)}
            style={{ width: "100%" }}
            prefix={<SearchOutlined />}
            suffix={<></>}
          />
          <NavLink to="/app/friends">
            <Button
              icon={<PlusSquareFilled />}
              type="primary"
              style={{ marginLeft: "5px" }}
            >
              New Chat
            </Button>
          </NavLink>
        </$Horizontal>
      </Affix>
      <Spacer height="10px" />
      <div style={{ overflowY: "scroll" }}>
        <List
          itemLayout="horizontal"
          dataSource={chatPreviews.filter((chat) => {
            return (
              chat.title.toLowerCase().indexOf(searchString.toLowerCase()) > -1
            );
          })}
          renderItem={(item, index) => <ChatPreview preview={item} />}
        />
      </div>
    </$Vertical>
  );
};

export default ChatsList;
