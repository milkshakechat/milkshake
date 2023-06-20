import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Affix, Avatar, Button, Input, List } from "antd";
import ChatPreview, {
  ChatPreviewData,
  ChatPreviewProps,
} from "../ChatPreview/ChatPreview";
import { UserID } from "@milkshakechat/helpers";
import { useState } from "react";
import { SearchOutlined, PlusSquareFilled } from "@ant-design/icons";
import { Spacer } from "@/components/AppLayout/AppLayout";
import { useWindowSize } from "@/api/utils/screen";

const ChatsList = () => {
  const intl = useIntl();

  const [searchString, setSearchString] = useState("");
  const { screen, isMobile } = useWindowSize();

  const chats: ChatPreviewData[] = [
    {
      id: "1" as UserID,
      displayName: "Ant Design Title 1",
      previewText: "Lorem ipsum solar descartes",
    },
    {
      id: "2" as UserID,
      displayName: "Ant Design Title 2",
      previewText: "Lorem ipsum solar descartes",
    },
    {
      id: "3" as UserID,
      displayName: "Ant Design Title 3",
      previewText: "Lorem ipsum solar descartes",
    },
    {
      id: "4" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },
    {
      id: "5" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "6" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "7" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "8" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "9" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "10" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "11" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "12" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },

    {
      id: "13" as UserID,
      displayName: "Ant Design Title 4",
      previewText: "Lorem ipsum solar descartes",
    },
  ];

  return (
    <$Vertical>
      <Affix offsetTop={isMobile ? 100 : 100}>
        <$Horizontal>
          <Input
            placeholder={"Search Friend"}
            allowClear
            onChange={(e) => setSearchString(e.target.value)}
            style={{ width: "100%" }}
            prefix={<SearchOutlined />}
            suffix={<></>}
          />
          <Button
            icon={<PlusSquareFilled />}
            type="primary"
            style={{ marginLeft: "5px" }}
          >
            New Chat
          </Button>
        </$Horizontal>
      </Affix>
      <Spacer height="10px" />
      <div style={{ overflowY: "scroll" }}>
        <List
          itemLayout="horizontal"
          dataSource={chats.filter((chat) => {
            return (
              chat.displayName
                .toLowerCase()
                .indexOf(searchString.toLowerCase()) > -1
            );
          })}
          renderItem={(item, index) => <ChatPreview chat={item} />}
        />
      </div>
    </$Vertical>
  );
};

export default ChatsList;
